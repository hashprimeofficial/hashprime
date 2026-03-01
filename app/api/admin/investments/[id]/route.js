import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Investment from '@/models/Investment';
import { verifyToken } from '@/lib/auth';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
export async function PATCH(req, { params }) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        await connectToDatabase();
        const { id } = await params;
        const body = await req.json();

        // Allow-list only safe fields to prevent mass-assignment vulnerability
        const ALLOWED_FIELDS = ['status', 'adminNote', 'maturesAt'];
        const safeUpdate = {};
        for (const key of ALLOWED_FIELDS) {
            if (key in body) safeUpdate[key] = body[key];
        }

        if (Object.keys(safeUpdate).length === 0) {
            return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
        }

        // Validate status if being set
        if (safeUpdate.status && !['pending', 'active', 'completed', 'cancelled'].includes(safeUpdate.status)) {
            return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
        }

        // Fetch the current investment to check its previous status
        const currentInvestment = await Investment.findById(id).populate('userId');
        if (!currentInvestment) {
            return NextResponse.json({ error: 'Investment not found' }, { status: 404 });
        }

        // --- NEW LOGIC: Approving a Pending Investment ---
        if (safeUpdate.status === 'active' && currentInvestment.status === 'pending') {
            const user = await User.findById(currentInvestment.userId._id);
            const amountNeeded = currentInvestment.amount;

            if ((user.walletBalance || 0) < amountNeeded) {
                return NextResponse.json({ error: `User has insufficient INR balance (₹${user.walletBalance || 0}) to cover this ₹${amountNeeded} investment.` }, { status: 400 });
            }

            // Deduct from wallet
            user.walletBalance -= amountNeeded;
            await user.save();

            // Create Transaction Record for the initial deduction
            await Transaction.create({
                userId: user._id,
                type: 'investment',
                amount: -amountNeeded,
                currency: 'INR',
                description: `Invested in ${currentInvestment.schemeType} scheme (Admin Approved)`,
            });
        }

        const updatedInvestment = await Investment.findByIdAndUpdate(id, safeUpdate, { new: true }).populate('userId', 'name email');

        // --- EXISTING LOGIC: Completing/Maturing an Active Investment ---
        if (safeUpdate.status === 'completed' && currentInvestment.status !== 'completed') {
            const reward = currentInvestment.usdtReward;

            // 1. Credit the User's USDT Balance
            await User.findByIdAndUpdate(currentInvestment.userId._id, {
                $inc: { usdtBalance: reward }
            });

            // 2. Create a Transaction Record for transparency
            await Transaction.create({
                userId: currentInvestment.userId._id,
                type: 'investment',
                amount: reward,
                currency: 'USDT',
                description: `Investment matured/completed. Credited ${reward} USDT to Trading Balance.`,
            });
        }

        return NextResponse.json({ investment: updatedInvestment }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        await connectToDatabase();
        const { id } = await params;

        const deletedInvestment = await Investment.findByIdAndDelete(id);

        if (!deletedInvestment) {
            return NextResponse.json({ error: 'Investment not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Investment deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
