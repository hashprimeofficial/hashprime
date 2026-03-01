import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { verifyToken } from '@/lib/auth';

export async function POST(req, { params }) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();
        const { id } = await params;
        const { account, action, amount, description } = await req.json();

        // Validation
        if (!['walletBalance', 'usdtBalance'].includes(account)) {
            return NextResponse.json({ error: 'Invalid account type' }, { status: 400 });
        }
        if (!['add', 'subtract'].includes(action)) {
            return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
        }

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return NextResponse.json({ error: 'Amount must be greater than zero' }, { status: 400 });
        }

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Logic
        const multiplier = action === 'add' ? 1 : -1;
        const changeAmount = numericAmount * multiplier;

        // Ensure we don't drop below 0 if subtracting
        if (action === 'subtract') {
            const currentBalance = user[account] || 0;
            if (currentBalance < numericAmount) {
                return NextResponse.json({ error: 'Insufficient funds for this withdrawal' }, { status: 400 });
            }
        }

        // 1. Update User Balance
        await User.findByIdAndUpdate(id, {
            $inc: { [account]: changeAmount }
        });

        // 2. Create Transaction Record
        const currency = account === 'usdtBalance' ? 'USDT' : 'INR';
        const type = action === 'add' ? 'deposit' : 'withdrawal';
        const adminDescription = description?.trim()
            ? `Admin Manual ${action === 'add' ? 'Deposit' : 'Withdrawal'}: ${description}`
            : `Admin Manual ${action === 'add' ? 'Deposit' : 'Withdrawal'}`;

        await Transaction.create({
            userId: id,
            type: type,
            amount: changeAmount, // Negative for withdrawals, Positive for deposits
            currency: currency,
            description: adminDescription,
        });

        return NextResponse.json({ message: 'Balance updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Admin Manual Transaction Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
