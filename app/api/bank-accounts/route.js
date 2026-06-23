import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import BankAccount from '@/models/BankAccount';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectToDatabase();

        const bankAccounts = await BankAccount.find({ user: payload.userId }).sort({ createdAt: -1 });

        return NextResponse.json({ bankAccounts }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectToDatabase();

        const { accountHolderName, accountNumber, ifsc, bankName, branch, accountType } = await req.json();

        if (!accountHolderName || !accountNumber || !ifsc || !bankName || !branch || !accountType) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const newAccount = await BankAccount.create({
            user: payload.userId,
            accountHolderName,
            accountNumber,
            ifsc,
            bankName,
            branch,
            accountType
        });

        return NextResponse.json({ message: 'Bank account added successfully', bankAccount: newAccount }, { status: 201 });
    } catch (error) {
        console.error('Add Bank Account Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
