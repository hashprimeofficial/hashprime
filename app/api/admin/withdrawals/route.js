import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Withdrawal from '@/models/Withdrawal';
import BankAccount from '@/models/BankAccount';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);

        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();

        // Fetch all withdrawals, newest first, with user + bank details populated
        const withdrawals = await Withdrawal.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'name email')
            .populate('bankAccountId')
            .lean();

        // For INR/Bank withdrawals that don't yet have a bankAccountId stored
        // (submitted before the schema update), fetch the user's primary bank account
        const enriched = await Promise.all(withdrawals.map(async (w) => {
            if (w.payoutMethod === 'Bank' && !w.bankAccountId && w.userId?._id) {
                const bank = await BankAccount.findOne({ user: w.userId._id })
                    .sort({ createdAt: -1 })
                    .lean();
                return { ...w, bankAccountId: bank || null };
            }
            return w;
        }));

        return NextResponse.json({ withdrawals: enriched }, { status: 200 });
    } catch (error) {
        console.error('Fetch Withdrawals Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
