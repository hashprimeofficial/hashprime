import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Investment from '@/models/Investment';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { verifyToken } from '@/lib/auth';

/**
 * POST /api/admin/investments/monthly-payout
 *
 * Credits the monthly installment to all active `limited_inr` investors.
 * The payout per investor = inrReward / 6 (total 6-month yield ÷ 6 months).
 *
 * Idempotency: uses the `paidMonths` array (stored on the investment) to track
 * which month numbers (1–6) have already been paid. Running this endpoint
 * twice in the same calendar month will NOT double-credit.
 *
 * The "current month number" is derived from the investment's start date
 * (investmentDate ?? createdAt) to determine which installment is due.
 */
export async function POST(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();

        // Find all active limited_inr investments
        const investments = await Investment.find({
            status: 'active',
            schemeType: 'limited_inr',
        });

        if (investments.length === 0) {
            return NextResponse.json({
                message: 'No active Limited INR investments found.',
                count: 0,
            }, { status: 200 });
        }

        let processedCount = 0;
        let skippedCount = 0;
        const details = [];

        for (const investment of investments) {
            // Determine canonical start date
            const startDate = investment.investmentDate
                ? new Date(investment.investmentDate)
                : new Date(investment.createdAt);

            const now = new Date();

            // Calculate how many full months have elapsed since start
            const elapsedMonths =
                (now.getFullYear() - startDate.getFullYear()) * 12 +
                (now.getMonth() - startDate.getMonth());

            // Current month number in the scheme (1-indexed, capped at 6)
            const currentMonthNumber = Math.min(Math.max(elapsedMonths, 1), 6);

            // Skip if this month has already been paid (idempotent)
            if (investment.paidMonths && investment.paidMonths.includes(currentMonthNumber)) {
                skippedCount++;
                details.push({
                    investmentId: investment._id,
                    reason: `Month ${currentMonthNumber} already paid`,
                });
                continue;
            }

            // Calculate monthly payout amount
            const totalYield = investment.inrReward || Math.round(investment.amount * 0.24);
            const monthlyPayout = Math.round(totalYield / 6);

            if (monthlyPayout <= 0) {
                skippedCount++;
                continue;
            }

            // Atomically mark this month as paid (prevents race conditions)
            const updated = await Investment.findOneAndUpdate(
                {
                    _id: investment._id,
                    status: 'active',
                    paidMonths: { $ne: currentMonthNumber },
                },
                { $push: { paidMonths: currentMonthNumber } },
                { new: true }
            );

            if (!updated) {
                // Another concurrent process already paid this month
                skippedCount++;
                continue;
            }

            // Credit user's INR wallet
            await User.findByIdAndUpdate(investment.userId, {
                $inc: { inrWallet: monthlyPayout },
            });

            // Create transaction record
            await Transaction.create({
                userId: investment.userId,
                type: 'investment',
                amount: monthlyPayout,
                currency: 'INR',
                description: `Monthly payout (Month ${currentMonthNumber}/6) — Limited INR scheme`,
            });

            processedCount++;
            details.push({
                investmentId: investment._id,
                monthNumber: currentMonthNumber,
                amountCredited: monthlyPayout,
            });
        }

        return NextResponse.json({
            message: `Monthly payout complete. ₹ credited to ${processedCount} investor(s). ${skippedCount} already paid this month.`,
            processed: processedCount,
            skipped: skippedCount,
            details,
        }, { status: 200 });

    } catch (error) {
        console.error('Monthly Payout Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
