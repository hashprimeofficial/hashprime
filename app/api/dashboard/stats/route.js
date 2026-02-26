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

        const user = await User.findById(payload.userId).select('-password');
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const investments = await Investment.find({ userId: user._id }).sort({ createdAt: -1 });
        const transactions = await Transaction.find({ userId: user._id }).sort({ createdAt: -1 }).limit(10);

        return NextResponse.json({ user, investments, transactions }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
