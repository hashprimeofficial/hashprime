import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Withdrawal from '@/models/Withdrawal';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { verifyToken } from '@/lib/auth';

export async function PATCH(req, { params }) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();
        const { id } = await params;
        const { status, adminNote } = await req.json();

        if (!['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status update' }, { status: 400 });
        }

        const withdrawal = await Withdrawal.findById(id).populate('userId', 'email name');
        if (!withdrawal) {
            return NextResponse.json({ error: 'Withdrawal request not found' }, { status: 404 });
        }

        if (withdrawal.status !== 'pending') {
            return NextResponse.json({ error: `Cannot update a withdrawal that is already ${withdrawal.status}` }, { status: 400 });
        }

        // Logic routing based on admin decision
        if (status === 'approved') {
            // Update status
            withdrawal.status = 'approved';
            withdrawal.adminNote = adminNote || '';
            await withdrawal.save();

            // Create Transaction Receipt 
            // Note: The balance was already deducted during the user's initial request (escrow)
            await Transaction.create({
                userId: withdrawal.userId._id,
                type: 'withdrawal',
                amount: -withdrawal.amount,
                currency: 'USDT',
                description: `Withdrawal to ${withdrawal.walletAddress} approved. ${adminNote || ''}`.trim(),
            });

        } else if (status === 'rejected') {
            // Update status
            withdrawal.status = 'rejected';
            withdrawal.adminNote = adminNote || 'Rejected by administration';
            await withdrawal.save();

            // Refund the user's USDT Balance (release from escrow)
            await User.findByIdAndUpdate(withdrawal.userId._id, {
                $inc: { usdtBalance: withdrawal.amount }
            });
            // No transaction receipt created for a rejected withdrawal to keep the ledger clean of failed attempts.
        }

        return NextResponse.json({
            message: `Withdrawal successfully ${status}`,
            withdrawal
        }, { status: 200 });

    } catch (error) {
        console.error('Update Withdrawal Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
