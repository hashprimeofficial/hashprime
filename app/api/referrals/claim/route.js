import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import ReferralClaim from '@/models/ReferralClaim';
import BankAccount from '@/models/BankAccount';
import { verifyToken } from '@/lib/auth';
import { getExchangeRate } from '@/lib/exchangeRate';

export async function POST(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectToDatabase();
        const user = await User.findById(payload.userId);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const { amountInr, bankAccountId } = await req.json();
        const numAmountInr = parseFloat(amountInr);

        if (isNaN(numAmountInr) || numAmountInr <= 0 || !bankAccountId) {
            return NextResponse.json({ error: 'Please provide valid amount and bank account' }, { status: 400 });
        }

        const liveRate = await getExchangeRate();
        const requiredUsd = parseFloat((numAmountInr / liveRate).toFixed(2));

        if ((user.referralWallet || 0) < requiredUsd) {
            return NextResponse.json({ error: 'Insufficient referral wallet balance' }, { status: 400 });
        }

        const bankAccount = await BankAccount.findOne({ _id: bankAccountId, user: user._id });
        if (!bankAccount) {
            return NextResponse.json({ error: 'Bank account not found' }, { status: 404 });
        }

        // Deduct from referral wallet
        user.referralWallet = parseFloat(((user.referralWallet || 0) - requiredUsd).toFixed(2));
        await user.save();

        const claim = await ReferralClaim.create({
            userId: user._id,
            amount: requiredUsd,
            amountInr: numAmountInr,
            bankAccountId,
            status: 'Pending'
        });

        return NextResponse.json({ message: 'Claim requested successfully', claim }, { status: 201 });
    } catch (error) {
        console.error('Referral claim error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectToDatabase();
        const claims = await ReferralClaim.find({ userId: payload.userId })
            .populate('bankAccountId')
            .sort({ createdAt: -1 });

        return NextResponse.json({ claims }, { status: 200 });
    } catch (error) {
        console.error('Fetch referral claims error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
