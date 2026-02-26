import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Investment from '@/models/Investment';
import Transaction from '@/models/Transaction';
import { verifyToken } from '@/lib/auth';

const INR_TO_USDT = 85;

const SCHEMES = {
    '3m': { minAmounts: [50000, 100000, 300000, 500000], returnRate: 0.18, durationMonths: 3 },
    '6m': { minAmounts: [100000, 300000, 500000], returnRate: 0.38, durationMonths: 6 },
    '1y': { minAmount: 500000, maxAmount: Infinity, returnRate: 0.80, durationMonths: 12 },
    '5y': { minAmount: 1000000, maxAmount: 1500000, returnRate: 5.00, durationMonths: 60 },
};

export async function POST(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectToDatabase();

        const { amount, schemeType } = await req.json();

        if (!amount || !schemeType || !SCHEMES[schemeType]) {
            return NextResponse.json({ error: 'Invalid investment data' }, { status: 400 });
        }

        const scheme = SCHEMES[schemeType];

        // Validate amount
        if (schemeType === '3m' || schemeType === '6m') {
            if (!scheme.minAmounts.includes(amount)) {
                return NextResponse.json({ error: `Invalid amount for ${schemeType} scheme. Allowed: ${scheme.minAmounts.join(', ')}` }, { status: 400 });
            }
        } else {
            if (amount < scheme.minAmount || amount > scheme.maxAmount) {
                return NextResponse.json({ error: `Amount restricted for ${schemeType}. Min: ${scheme.minAmount}, Max: ${scheme.maxAmount === Infinity ? 'None' : scheme.maxAmount}` }, { status: 400 });
            }
        }

        // Calculate Maturity date & USDT rewards
        const maturesAt = new Date();
        maturesAt.setMonth(maturesAt.getMonth() + scheme.durationMonths);

        const usdtReward = (amount * scheme.returnRate) / INR_TO_USDT;

        // Fetch user
        const user = await User.findById(payload.userId);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // Create Investment
        const investment = await Investment.create({
            userId: user._id,
            amount,
            schemeType,
            usdtReward,
            maturesAt,
        });

        // Create Transaction for Investment
        await Transaction.create({
            userId: user._id,
            type: 'investment',
            amount: amount,
            currency: 'INR',
            description: `Invested in ${schemeType} scheme`,
        });

        // Referral Logic (5% of INR amount converted to USDT)
        if (user.referredBy) {
            const referrer = await User.findOne({ email: user.referredBy });
            if (referrer) {
                const referralBonusUsdt = (amount * 0.05) / INR_TO_USDT;

                referrer.usdtBalance += referralBonusUsdt;
                await referrer.save();

                await Transaction.create({
                    userId: referrer._id,
                    type: 'referral_bonus',
                    amount: referralBonusUsdt,
                    currency: 'USDT',
                    description: `Referral bonus from ${user.email} investment`,
                });
            }
        }

        return NextResponse.json({ message: 'Investment successful', investment }, { status: 201 });
    } catch (error) {
        console.error('Investment Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
