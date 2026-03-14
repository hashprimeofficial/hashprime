import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Withdrawal from '@/models/Withdrawal';
import BankAccount from '@/models/BankAccount';
import { verifyToken } from '@/lib/auth';

export async function POST(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);

        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        const { amount, walletAddress, sourceWallet, payoutMethod, bankAccountId } = await req.json();

        // Validate Input
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return NextResponse.json({ error: 'Invalid withdrawal amount' }, { status: 400 });
        }

        if (!walletAddress || walletAddress.trim() === '') {
            return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
        }

        if (!['USD', 'INR', 'Referral'].includes(sourceWallet)) {
            return NextResponse.json({ error: 'Invalid source wallet' }, { status: 400 });
        }
        if (!['USDT', 'Bank'].includes(payoutMethod)) {
            return NextResponse.json({ error: 'Invalid payout method' }, { status: 400 });
        }

        // Fetch User with full balance
        const user = await User.findById(payload.userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Validate sufficient balance
        const currentBalance = sourceWallet === 'USD' ? (user.usdWallet || 0) :
            sourceWallet === 'INR' ? (user.inrWallet || 0) :
                sourceWallet === 'Referral' ? (user.referralWallet || 0) : 0;

        if (currentBalance < numericAmount) {
            return NextResponse.json({ error: 'Insufficient Balance in selected wallet' }, { status: 400 });
        }

        const updateField = sourceWallet === 'USD' ? 'usdWallet' :
            sourceWallet === 'INR' ? 'inrWallet' : 'referralWallet';

        // 1. Escrow Logic: Deduct the amount immediately
        await User.findByIdAndUpdate(user._id, {
            $inc: { [updateField]: -numericAmount }
        });

        // 2. Resolve bank account for Bank payouts
        let resolvedBankId = null;
        if (payoutMethod === 'Bank') {
            if (!bankAccountId) {
                return NextResponse.json({ error: 'Bank account ID is required for Bank withdrawals' }, { status: 400 });
            }
            const bank = await BankAccount.findOne({ _id: bankAccountId, user: user._id });
            if (!bank) {
                return NextResponse.json({ error: 'Bank account not found or does not belong to this user' }, { status: 400 });
            }
            resolvedBankId = bank._id;
        }

        // 3. Create Pending Withdrawal Record
        const withdrawal = await Withdrawal.create({
            userId: user._id,
            amount: numericAmount,
            sourceWallet,
            payoutMethod,
            walletAddress: walletAddress.trim(),
            bankAccountId: resolvedBankId,
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
