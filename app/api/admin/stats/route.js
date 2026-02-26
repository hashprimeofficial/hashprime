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
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();

        // Total users excluding admins
        const totalUsers = await User.countDocuments({ role: 'user' });

        // Total capital in INR
        const investments = await Investment.find({ status: 'active' });
        const totalCapital = investments.reduce((acc, inv) => acc + inv.amount, 0);

        // Total referrals paid out in USDT
        const referralTxs = await Transaction.find({ type: 'referral_bonus' });
        const totalReferralsPaid = referralTxs.reduce((acc, tx) => acc + tx.amount, 0);

        // Recent 5 investments with user details
        const recentInvestments = await Investment.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name email');

        return NextResponse.json({
            totalUsers,
            totalCapital,
            totalReferralsPaid,
            recentInvestments
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
