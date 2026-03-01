import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectToDatabase();

        const user = await User.findById(payload.userId).select('referralCode');
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // Find all users who were referred by this user's referral code
        const referredUsers = await User.find({ referredBy: user.referralCode })
            .select('name email createdAt')
            .sort({ createdAt: -1 });

        // Find all referral bonus transactions for this user (no limit)
        const referralTxs = await Transaction.find({
            userId: payload.userId,
            type: 'referral_bonus'
        }).sort({ createdAt: -1 });

        const totalEarned = referralTxs.reduce((acc, t) => acc + t.amount, 0);

        return NextResponse.json({
            referralCode: user.referralCode,
            referredUsers,
            referralTxs,
            totalEarned
        }, { status: 200 });

    } catch (error) {
        console.error('Referrals API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
