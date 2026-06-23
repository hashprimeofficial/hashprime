import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Investment from '@/models/Investment';
import { verifyToken } from '@/lib/auth';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { getExchangeRate } from '@/lib/exchangeRate';

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

            const activeWalletBalance = currentInvestment.currency === 'USD' ? (user.usdWallet || 0) : (user.inrWallet || 0);
            if (activeWalletBalance < amountNeeded) {
                return NextResponse.json({ error: `User has insufficient balance (${activeWalletBalance}) to cover this investment.` }, { status: 400 });
            }

            // Deduct from wallet
            if (currentInvestment.currency === 'USD') {
                user.usdWallet -= amountNeeded;
            } else {
                user.inrWallet -= amountNeeded;
            }
            await user.save();

            // Create Transaction Record for the initial deduction
            await Transaction.create({
                userId: user._id,
                type: 'investment',
                amount: -amountNeeded,
                currency: currentInvestment.currency,
                description: `Invested in ${currentInvestment.schemeType} scheme (Admin Approved)`,
            });

            // 5% Referral Bonus Logic for Referrer
            if (user.referredBy) {
                const referrer = await User.findOne({ referralCode: user.referredBy });
                if (referrer) {
                    const liveRate = await getExchangeRate();
                    const bonusUsd = currentInvestment.currency === 'USD'
                        ? Math.round((amountNeeded * 0.05) * 100) / 100
                        : Math.round(((amountNeeded * 0.05) / liveRate) * 100) / 100;

                    await User.findByIdAndUpdate(referrer._id, {
                        $inc: { referralWallet: bonusUsd }
                    });

                    await Transaction.create({
                        userId: referrer._id,
                        type: 'referral_bonus',
                        amount: bonusUsd,
                        currency: 'USD',
                        description: `5% Referral bonus from ${user.name}'s investment approval`
                    });
                }
            }
        }

        const updatedInvestment = await Investment.findByIdAndUpdate(id, safeUpdate, { new: true }).populate('userId', 'name email');

        // --- EXISTING LOGIC: Completing/Maturing an Active Investment ---
        if (safeUpdate.status === 'completed' && currentInvestment.status !== 'completed') {
            const principal = currentInvestment.amount;

            // Re-calculate the specific reward in exactly the currency they invested in
            // If they invested in USD, they get USD back. If INR, they get INR.
            // Wait, usdtReward in the schema stores the expected return, but maybe we should just calculate it here to be safe and clear.
            // Actually, we can just use the scheme data, or we could just credit `principal + usdtReward` to USD if it was a USD investment.
            // If it was an INR investment, we credit `principal + (usdtReward * liveRate)`. Wait, we should just read from `usdtReward` if USD, or calculate back down.
            // Let's just use `getExchangeRate` if we need to convert back, but ideally we credit `principal + yield`.

            const totalToCredit = currentInvestment.currency === 'USD'
                ? principal + currentInvestment.usdtReward
                : principal + Math.round(currentInvestment.usdtReward * await getExchangeRate());

            const updateField = currentInvestment.currency === 'USD' ? 'usdWallet' : 'inrWallet';

            // 1. Credit the User's specific Balance
            await User.findByIdAndUpdate(currentInvestment.userId._id, {
                $inc: { [updateField]: totalToCredit }
            });

            // 2. Create a Transaction Record for transparency
            await Transaction.create({
                userId: currentInvestment.userId._id,
                type: 'investment',
                amount: totalToCredit,
                currency: currentInvestment.currency,
                description: `Investment matured/completed. Credited Capital + Return to Wallet.`,
            });
        }

        return NextResponse.json({ investment: updatedInvestment }, { status: 200 });
    } catch (error) {
        console.error('PATCH Admin Investment Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message, stack: error.stack }, { status: 500 });
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
