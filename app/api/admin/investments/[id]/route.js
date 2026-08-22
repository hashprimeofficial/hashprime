import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/db';
import Investment from '@/models/Investment';
import { verifyToken } from '@/lib/auth';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { getExchangeRate } from '@/lib/exchangeRate';
import { calculateReferralCommission } from '@/lib/referralUtils';

export async function PATCH(req, { params }) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        await connectToDatabase();
        const { id } = await params;
        const body = await req.json();

        // Allow-list only safe fields to prevent mass-assignment vulnerability
        const ALLOWED_FIELDS = ['status', 'adminNote', 'maturesAt', 'investmentDate'];
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
            // Capture L1 guard BEFORE the update sets directReferralPaid = true
            const alreadyPaidL1 = !!currentInvestment.directReferralPaid;

            const transitioning = await Investment.findOneAndUpdate(
                { _id: id, status: 'pending' },
                { status: 'active', directReferralPaid: true },
                { new: true }
            );
            if (!transitioning) {
                return NextResponse.json({ error: 'Investment is already approved or not pending.' }, { status: 400 });
            }

            const user = await User.findById(currentInvestment.userId._id);
            const amountNeeded = currentInvestment.amount;

            const activeWalletBalance = currentInvestment.currency === 'USD' ? (user.usdWallet || 0) : (user.inrWallet || 0);
            if (activeWalletBalance < amountNeeded) {
                await Investment.findByIdAndUpdate(id, { status: 'pending', directReferralPaid: false });
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

            // L1: 5% Direct Referral Bonus — guarded by pre-captured alreadyPaidL1
            if (user.referredBy && !alreadyPaidL1) {
                let referrer = await User.findOne({ email: user.referredBy });
                if (!referrer) referrer = await User.findOne({ referralCode: user.referredBy });
                if (!referrer && mongoose.Types.ObjectId.isValid(user.referredBy)) {
                    referrer = await User.findById(user.referredBy);
                }
                if (referrer && referrer._id.toString() !== user._id.toString()) {
                    const referrerRate = referrer.limitedRateOverride !== undefined && referrer.limitedRateOverride !== null
                        ? referrer.limitedRateOverride
                        : 0.05;
                    const commissionAmount = referrer.limitedRateOverride !== undefined && referrer.limitedRateOverride !== null
                        ? Math.round(amountNeeded * referrerRate)
                        : calculateReferralCommission(amountNeeded);

                    const commCurrency = currentInvestment.currency || 'INR';
                    const updateField = commCurrency === 'USD' ? 'referralWallet' : 'referralWalletInr';

                    if (commissionAmount > 0) {
                        await User.findByIdAndUpdate(referrer._id, {
                            $inc: { [updateField]: commissionAmount }
                        });
                        await Transaction.create({
                            userId: referrer._id,
                            type: 'referral_bonus',
                            amount: commissionAmount,
                            currency: commCurrency,
                            description: `Direct Referral Bonus — ${user.name}`
                        });
                    }
                }
            }
        }

        const updatedInvestment = await Investment.findByIdAndUpdate(id, safeUpdate, { new: true }).populate('userId', 'name email');

        // --- EXISTING LOGIC: Completing/Maturing an Active/Pending Investment ---
        if (safeUpdate.status === 'completed' && currentInvestment.status !== 'completed') {
            const transitioning = await Investment.findOneAndUpdate(
                { _id: id, status: { $ne: 'completed' } },
                { status: 'completed' },
                { new: true }
            );
            if (!transitioning) {
                return NextResponse.json({ error: 'Investment is already completed' }, { status: 400 });
            }

            const principal = currentInvestment.amount;

            // Re-calculate the specific reward in exactly the currency they invested in
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
