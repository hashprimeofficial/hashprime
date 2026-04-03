import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Investment from '@/models/Investment';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '50', 10);
        const skip = (page - 1) * limit;

        const users = await User.find({ role: 'user' })
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const userIds = users.map(u => u._id);
        const userInvestments = await Investment.find({ userId: { $in: userIds }, status: { $in: ['active', 'completed', 'pending'] } });

        const enrichedUsers = users.map(user => {
            const myInvs = userInvestments.filter(i => i.userId.toString() === user._id.toString());
            const totalInvestedUSD = myInvs.filter(i => i.currency === 'USD').reduce((a, b) => a + b.amount, 0);
            const totalInvestedINR = myInvs.filter(i => i.currency === 'INR').reduce((a, b) => a + b.amount, 0);
            return { ...user, totalInvestedUSD, totalInvestedINR };
        });

        const totalUsers = await User.countDocuments({ role: 'user' });

        return NextResponse.json({ users: enrichedUsers, totalUsers, page, limit }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
