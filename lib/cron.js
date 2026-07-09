import cron from 'node-cron';
import connectToDatabase from './db';
import User from '../models/User';
import Investment from '../models/Investment';
import Transaction from '../models/Transaction';
import { getExchangeRate } from './exchangeRate';

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

            // Calculate investment start date (use createdAt, fallback to maturesAt - 6 months)
            const startDate = inv.createdAt ? new Date(inv.createdAt) : (() => {
                const d = new Date(inv.maturesAt);
                d.setMonth(d.getMonth() - 6);
                return d;
            })();

            // Get monthly rate (override or default 4%)
            const rate = user.limitedRateOverride !== null && user.limitedRateOverride !== undefined
                ? user.limitedRateOverride
                : 0.04;
            const monthlyRate = rate > 1 ? rate / 100 : rate; // handle percentages like 5 vs 0.05
            const monthlyYield = Math.round(inv.amount * monthlyRate);

            let updatedPaidMonths = [...(inv.paidMonths || [])];

            // Check each month from 1 to 6
            for (let m = 1; m <= 6; m++) {
                if (updatedPaidMonths.includes(m)) continue;

                // Calculate exact payout anniversary date for month m
                const payoutDate = new Date(startDate);
                payoutDate.setMonth(payoutDate.getMonth() + m);

                // If today is on or after the payout date, credit it!
                if (today >= payoutDate) {
                    // Try to atomically mark month as paid first to prevent duplicate payouts from race conditions
                    const transitioning = await Investment.findOneAndUpdate(
                        { _id: inv._id, paidMonths: { $ne: m } },
                        { $push: { paidMonths: m } },
                        { new: true }
                    );

                    if (!transitioning) {
                        continue; // Already processed by a concurrent run
                    }

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

                    // 3. Mark month as paid locally
                    updatedPaidMonths.push(m);
                    console.log(`[Cron] Credited ${monthNames[m - 1]} of ₹${monthlyYield} to user ${user.email} for investment ${inv._id}`);
                }
            }
        }
    } catch (error) {
        console.error('[Cron] Error processing interest payments:', error);
    }
}

export async function processMaturedInvestments() {
    try {
        await connectToDatabase();
        // Find all active investments that have passed their maturity date
        const maturedInvestments = await Investment.find({
            status: 'active',
            maturesAt: { $lte: new Date() }
        });

        if (maturedInvestments.length === 0) {
            return;
        }

        console.log(`[Cron] Found ${maturedInvestments.length} matured investments to process.`);

        const liveRate = await getExchangeRate();

        for (const investment of maturedInvestments) {
            // Try to transition status from active to completed atomically first to prevent race conditions
            const transitioning = await Investment.findOneAndUpdate(
                { _id: investment._id, status: 'active' },
                { status: 'completed' },
                { new: true }
            );

            if (!transitioning) {
                continue; // Already processed by a concurrent run
            }

            const user = await User.findById(investment.userId);
            if (!user) continue;

            const principal = investment.amount;

            // Calculate final payout
            // For monthly limited_inr: force payout any remaining unpaid months, then pay back principal.
            // For other schemes (like 3m_inr, 6m_inr, 1y_inr, etc.): pay principal + inrReward/usdtReward.
            let rewardToPay = 0;

            if (investment.schemeType === 'limited_inr') {
                // Ensure all 6 months are paid
                const startDate = investment.createdAt ? new Date(investment.createdAt) : (() => {
                    const d = new Date(investment.maturesAt);
                    d.setMonth(d.getMonth() - 6);
                    return d;
                })();
                const rate = user.limitedRateOverride !== null && user.limitedRateOverride !== undefined
                    ? user.limitedRateOverride
                    : 0.04;
                const monthlyRate = rate > 1 ? rate / 100 : rate;
                const monthlyYield = Math.round(investment.amount * monthlyRate);

                let updatedPaidMonths = [...(investment.paidMonths || [])];

                for (let m = 1; m <= 6; m++) {
                    if (updatedPaidMonths.includes(m)) continue;
                    // Force pay this month
                    user.inrWallet = (user.inrWallet || 0) + monthlyYield;
                    await Transaction.create({
                        userId: user._id,
                        type: 'investment',
                        amount: monthlyYield,
                        currency: 'INR',
                        description: monthNames[m - 1]
                    });
                    updatedPaidMonths.push(m);
                    console.log(`[Cron] Force paid ${monthNames[m - 1]} of ₹${monthlyYield} during maturity process for user ${user.email}.`);
                }

                // Update paidMonths atomically on the investment
                await Investment.findByIdAndUpdate(investment._id, { paidMonths: updatedPaidMonths });
                rewardToPay = 0; // monthly rewards already added to user's wallet
            } else {
                if (investment.currency === 'USD') {
                    rewardToPay = investment.usdtReward || 0;
                } else {
                    rewardToPay = investment.inrReward !== undefined && investment.inrReward !== null
                        ? investment.inrReward
                        : Math.round((investment.usdtReward || 0) * liveRate);
                }
            }

            const totalToCredit = principal + rewardToPay;
            const updateField = investment.currency === 'USD' ? 'usdWallet' : 'inrWallet';

            // 1. Credit the User's specific Wallet Balance
            user[updateField] = (user[updateField] || 0) + totalToCredit;
            await user.save();

            // 2. Create a Transaction Record
            await Transaction.create({
                userId: user._id,
                type: 'investment',
                amount: totalToCredit,
                currency: investment.currency,
                description: `Investment matured automatically. Credited Principal${rewardToPay > 0 ? ' + Yield' : ''} to Wallet.`,
            });

            console.log(`[Cron] Matured investment ${investment._id} processed. Credited ${totalToCredit} to user ${user.email}`);
        }
    } catch (error) {
        console.error('[Cron] Error processing matured investments:', error);
    }
}

export function initCron() {
    if (global.interestCronInitialized) {
        return;
    }

    // Run every hour to ensure anniversary and maturity dates are processed reliably
    cron.schedule('0 * * * *', async () => {
        console.log('[Cron] Running daily checks (interest payments & matured investments)...');
        await processInterestPayments();
        await processMaturedInvestments();
    });

    global.interestCronInitialized = true;
    console.log('[Cron] Automated Interest & Maturity scheduler initialized successfully (hourly check).');

    // Run once on initialization to handle any missed payouts immediately
    (async () => {
        await processInterestPayments();
        await processMaturedInvestments();
    })().catch(err => {
        console.error('[Cron] Error during initial checks on boot:', err);
    });
}
