import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Investment from '@/models/Investment';
import Transaction from '@/models/Transaction';
import { verifyToken } from '@/lib/auth';
import { calculateReferralCommission } from '@/lib/referralUtils';

export async function GET(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectToDatabase();

        const user = await User.findById(payload.userId).select('email referralCode limitedRateOverride');
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // Find all users who were referred by this user's email
        const referredUsers = await User.find({ referredBy: user.email })
            .select('name email createdAt')
            .sort({ createdAt: -1 })
            .lean();

        // Calculate commissions & investments dynamically for each referred user
        const enrichedReferredUsers = [];
        const commissionRate = user.limitedRateOverride !== undefined && user.limitedRateOverride !== null
            ? user.limitedRateOverride
            : 0.05;
        const commissionPct = commissionRate * 100;

        for (const ru of referredUsers) {
            const investments = await Investment.find({ userId: ru._id, status: { $in: ['active', 'completed'] } });
            
            let totalInvestedInr = 0;
            let totalInvestedUsd = 0;
            for (const inv of investments) {
                if (inv.currency === 'USD') {
                    totalInvestedUsd += inv.amount;
                } else {
                    totalInvestedInr += inv.amount;
                }
            }

            const commissionAmountInr = user.limitedRateOverride !== undefined && user.limitedRateOverride !== null
                ? Math.round(totalInvestedInr * commissionRate)
                : calculateReferralCommission(totalInvestedInr);

            const commissionAmountUsd = user.limitedRateOverride !== undefined && user.limitedRateOverride !== null
                ? Math.round((totalInvestedUsd * commissionRate) * 100) / 100
                : calculateReferralCommission(totalInvestedUsd);

            enrichedReferredUsers.push({
                ...ru,
                totalInvestedInr,
                totalInvestedUsd,
                commissionPct,
                commissionAmountInr,
                commissionAmountUsd
            });
        }

        // Find all referral bonus transactions for this user (no limit)
        const referralTxs = await Transaction.find({
            userId: payload.userId,
            type: 'referral_bonus'
        }).sort({ createdAt: -1 });

        const totalEarned = referralTxs.reduce((acc, t) => acc + t.amount, 0);

        return NextResponse.json({
            referralCode: user.referralCode,
            referredUsers: enrichedReferredUsers,
            referralTxs,
            totalEarned
        }, { status: 200 });

    } catch (error) {
        console.error('Referrals API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
