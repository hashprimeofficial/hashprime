import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Investment from '@/models/Investment';
import Transaction from '@/models/Transaction';
import { verifyToken } from '@/lib/auth';

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
            const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
            const commissionAmount = Math.round(totalInvested * commissionRate);

            enrichedReferredUsers.push({
                ...ru,
                totalInvested,
                commissionPct,
                commissionAmount
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
