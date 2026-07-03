import cron from 'node-cron';
import connectToDatabase from './db';
import User from '../models/User';
import Investment from '../models/Investment';
import Transaction from '../models/Transaction';

const monthNames = [
    'First month returns',
    'Second month returns',
    'Third month returns',
    'Fourth month returns',
    'Fifth month returns',
    'Sixth month returns'
];

export async function processInterestPayments() {
    try {
        await connectToDatabase();
        const activeInvestments = await Investment.find({
            status: 'active',
            schemeType: 'limited_inr'
        });

        const today = new Date();

        for (const inv of activeInvestments) {
            const user = await User.findById(inv.userId);
            if (!user) continue;

            // Calculate investment start date (maturesAt - 6 months)
            const startDate = new Date(inv.maturesAt);
            startDate.setMonth(startDate.getMonth() - 6);

            // Get monthly rate (override or default 4%)
            const rate = user.limitedRateOverride !== null && user.limitedRateOverride !== undefined
                ? user.limitedRateOverride
                : 0.04;
            const monthlyRate = rate > 1 ? rate / 100 : rate; // handle percentages like 5 vs 0.05
            const monthlyYield = Math.round(inv.amount * monthlyRate);

            let updatedPaidMonths = [...(inv.paidMonths || [])];
            let isUpdated = false;

            // Check each month from 1 to 6
            for (let m = 1; m <= 6; m++) {
                if (updatedPaidMonths.includes(m)) continue;

                // Calculate exact payout anniversary date for month m
                const payoutDate = new Date(startDate);
                payoutDate.setMonth(payoutDate.getMonth() + m);

                // If today is on or after the payout date, credit it!
                if (today >= payoutDate) {
                    // 1. Increment User's INR Wallet
                    user.inrWallet = (user.inrWallet || 0) + monthlyYield;
                    await user.save();

                    // 2. Create transaction record
                    await Transaction.create({
                        userId: user._id,
                        type: 'investment',
                        amount: monthlyYield,
                        currency: 'INR',
                        description: monthNames[m - 1]
                    });

                    // 3. Mark month as paid
                    updatedPaidMonths.push(m);
                    isUpdated = true;
                    console.log(`[Cron] Credited ${monthNames[m - 1]} of ₹${monthlyYield} to user ${user.email} for investment ${inv._id}`);
                }
            }

            if (isUpdated) {
                inv.paidMonths = updatedPaidMonths;
                await inv.save();
            }
        }
    } catch (error) {
        console.error('[Cron] Error processing interest payments:', error);
    }
}

export function initCron() {
    if (global.interestCronInitialized) {
        return;
    }

    // Run every hour to ensure anniversary dates are processed reliably
    cron.schedule('0 * * * *', async () => {
        console.log('[Cron] Running daily interest check job...');
        await processInterestPayments();
    });

    global.interestCronInitialized = true;
    console.log('[Cron] Automated Interest Crediting job initialized successfully (hourly check).');

    // Run once on initialization to handle any missed payouts immediately
    processInterestPayments().catch(err => {
        console.error('[Cron] Error during initial interest payment check on boot:', err);
    });
}
