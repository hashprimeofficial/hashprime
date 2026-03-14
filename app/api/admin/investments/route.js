import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Investment from '@/models/Investment';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { verifyToken } from '@/lib/auth';
import { getExchangeRate } from '@/lib/exchangeRate';

const INR_SCHEMES = {
    '3m_inr': { returnRate: 0.18, durationMonths: 3 },
    '6m_inr': { returnRate: 0.38, durationMonths: 6 },
    '1y_inr': { returnRate: 0.80, durationMonths: 12 },
    '5y_inr': { returnRate: 5.00, durationMonths: 60 },
};
const USD_SCHEMES = {
    '3m_usd': { returnRate: 0.18, durationMonths: 3 },
    '6m_usd': { returnRate: 0.38, durationMonths: 6 },
    '1y_usd': { returnRate: 0.80, durationMonths: 12 },
    '5y_usd': { returnRate: 5.00, durationMonths: 60 },
};

export async function GET(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        await connectToDatabase();

        // Populate user details for each investment
        const investments = await Investment.find().sort({ createdAt: -1 }).populate('userId', 'name email');

        return NextResponse.json({ investments }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Handle automatic admin creation of an investment for a user
export async function POST(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        await connectToDatabase();

        const { userEmail, amount, schemeType, currency } = await req.json();

        const activeSchemes = currency === 'USD' ? USD_SCHEMES : INR_SCHEMES;
        if (!userEmail || !amount || Number(amount) <= 0 || !currency || !activeSchemes[schemeType]) {
            return NextResponse.json({ error: 'Invalid data provided' }, { status: 400 });
        }

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.kycStatus !== 'approved') {
            return NextResponse.json({ error: 'User KYC is not approved.' }, { status: 400 });
        }

        // Check if user has enough wallet balance
        const activeWalletBalance = currency === 'USD' ? (user.usdWallet || 0) : (user.inrWallet || 0);
        if (activeWalletBalance < Number(amount)) {
            return NextResponse.json({ error: 'User does not have enough wallet balance' }, { status: 400 });
        }

        const scheme = activeSchemes[schemeType];

        // Calculate Maturity date & USDT rewards
        const maturesAt = new Date();
        maturesAt.setMonth(maturesAt.getMonth() + scheme.durationMonths);

        const liveRate = await getExchangeRate();
        const usdtReward = currency === 'USD'
            ? Math.round((Number(amount) * scheme.returnRate) * 100) / 100
            : Math.round(((Number(amount) * scheme.returnRate) / liveRate) * 100) / 100;

        // Deduct Wallet Balance
        const updateField = currency === 'USD' ? 'usdWallet' : 'inrWallet';
        await User.findByIdAndUpdate(user._id, {
            $inc: { [updateField]: -Number(amount) }
        });

        // 1. Create the Active Investment
        const investment = await Investment.create({
            userId: user._id,
            amount: Number(amount),
            schemeType,
            currency,
            usdtReward,
            maturesAt,
            status: 'active' // Directly active when created by admin
        });

        // 2. Transaction for the investment deduction
        await Transaction.create({
            userId: user._id,
            type: 'investment',
            amount: -Number(amount),
            currency: currency === 'USD' ? 'USD' : 'INR',
            description: `Admin created ${schemeType} investment package`
        });

        // 3. Referral Bonus Logic
        if (user.referredBy) {
            const referrer = await User.findOne({ referralCode: user.referredBy });
            if (referrer) {
                // 5% of investment amount as bonus, traditionally awarded in USDT
                const bonusUsdt = Math.round(((Number(amount) * 0.05) / liveRate) * 100) / 100;

                await User.findByIdAndUpdate(referrer._id, {
                    $inc: { referralWallet: bonusUsdt }
                });

                await Transaction.create({
                    userId: referrer._id,
                    type: 'referral_bonus',
                    amount: bonusUsdt,
                    currency: 'USD',
                    description: `5% Referral bonus from ${user.name}'s investment`
                });
            }
        }

        return NextResponse.json({ message: 'Investment created and activated successfully', investment }, { status: 201 });

    } catch (error) {
        console.error('Admin Create Investment Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
