import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Withdrawal from '@/models/Withdrawal';
import { verifyToken } from '@/lib/auth';

export async function POST(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);

        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        const { amount, walletAddress } = await req.json();

        // Validate Input
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return NextResponse.json({ error: 'Invalid withdrawal amount' }, { status: 400 });
        }

        if (!walletAddress || walletAddress.trim() === '') {
            return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
        }

        // Fetch User with full balance
        const user = await User.findById(payload.userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Validate sufficient USDT balance
        const currentBalance = user.usdtBalance || 0;
        if (currentBalance < numericAmount) {
            return NextResponse.json({ error: 'Insufficient USDT Trading Balance' }, { status: 400 });
        }

        // 1. Escrow Logic: Deduct the amount immediately
        await User.findByIdAndUpdate(user._id, {
            $inc: { usdtBalance: -numericAmount }
        });

        // 2. Create Pending Withdrawal Record
        const withdrawal = await Withdrawal.create({
            userId: user._id,
            amount: numericAmount,
            currency: 'USDT',
            walletAddress: walletAddress.trim(),
            status: 'pending'
        });

        return NextResponse.json({
            message: 'Withdrawal request submitted successfully',
            withdrawal
        }, { status: 201 });

    } catch (error) {
        console.error('Withdrawal Request Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);

        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        // Fetch users own withdrawals
        const withdrawals = await Withdrawal.find({ userId: payload.userId }).sort({ createdAt: -1 });

        return NextResponse.json({ withdrawals }, { status: 200 });
    } catch (error) {
        console.error('Withdrawal Fetch Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
