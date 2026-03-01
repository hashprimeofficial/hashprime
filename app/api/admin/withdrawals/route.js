import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Withdrawal from '@/models/Withdrawal';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);

        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();

        // Fetch all withdrawals, newest first, with user details populated
        const withdrawals = await Withdrawal.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'name email');

        return NextResponse.json({ withdrawals }, { status: 200 });
    } catch (error) {
        console.error('Fetch Withdrawals Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
