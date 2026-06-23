import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Deposit from '@/models/Deposit';

import Transaction from '@/models/Transaction';
import { getExchangeRate } from '@/lib/exchangeRate';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        await connectToDatabase();

        // Populate user name and email
        const deposits = await Deposit.find().sort({ createdAt: -1 }).populate('userId', 'name email');

        return NextResponse.json({ deposits }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const { depositId, status, adminNote } = await req.json();

        if (!depositId || !['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: 'Invalid data provided' }, { status: 400 });
        }

        await connectToDatabase();

        const deposit = await Deposit.findById(depositId).populate('userId');

        if (!deposit) {
            return NextResponse.json({ error: 'Deposit not found' }, { status: 404 });
        }

        if (deposit.status !== 'pending') {
            return NextResponse.json({ error: `Deposit is already ${deposit.status}` }, { status: 400 });
        }

        deposit.status = status;
        if (adminNote) deposit.adminNote = adminNote;

        await deposit.save();

        if (status === 'approved') {
            const user = deposit.userId;
            let txCurrency;
            let description;

            if (deposit.paymentMethod === 'usdt') {
                user.usdWallet += deposit.amount;
                txCurrency = 'USDT';
                description = `Admin approved USDT (BEP20) deposit.`;
            } else {
                user.inrWallet += deposit.amount;
                txCurrency = 'INR';
                description = `Admin approved Bank Transfer deposit.`;
            }

            // Update user's wallets
            await User.findByIdAndUpdate(user._id, {
                usdWallet: user.usdWallet,
                inrWallet: user.inrWallet
            });

            // Record a transaction
            await Transaction.create({
                userId: user._id,
                type: 'deposit',
                amount: Math.round(deposit.amount * 100) / 100,
                currency: txCurrency,
                description: description
            });
        }

        return NextResponse.json({ message: `Deposit successfully ${status}`, deposit }, { status: 200 });

    } catch (error) {
        console.error('Admin Deposit Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
