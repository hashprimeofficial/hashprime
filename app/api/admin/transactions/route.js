import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Transaction from '@/models/Transaction';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();

        // Fetch all transactions, sorted by newest, with user data populated
        const transactions = await Transaction.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'name email');

        return NextResponse.json({ transactions }, { status: 200 });
    } catch (error) {
        console.error('Fetch Admin Transactions Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
