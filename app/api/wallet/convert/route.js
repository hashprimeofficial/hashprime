import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { getExchangeRate } from '@/lib/exchangeRate';

export async function POST(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userPayload = await verifyToken(token);
        if (!userPayload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { fromCurrency, toCurrency, amount } = await req.json();

        if (!amount || amount <= 0 || isNaN(amount)) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        if (!['USD', 'INR'].includes(fromCurrency) || !['USD', 'INR'].includes(toCurrency) || fromCurrency === toCurrency) {
            return NextResponse.json({ error: 'Invalid currency selection' }, { status: 400 });
        }

        await connectToDatabase();
        const user = await User.findById(userPayload.userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Use shared rate utility (same as deposits, investments, stats)
        const conversionRate = await getExchangeRate();

        // 1. Convert USD to INR
        if (fromCurrency === 'USD' && toCurrency === 'INR') {
            if (user.usdWallet < amount) {
                return NextResponse.json({ error: 'Insufficient USD balance' }, { status: 400 });
            }
            const convertedAmount = amount * conversionRate;
            user.usdWallet -= amount;
            user.inrWallet += convertedAmount;
            await user.save();

            return NextResponse.json({
                message: 'Conversion successful',
                convertedAmount: convertedAmount,
                rate: conversionRate,
                usdWallet: user.usdWallet,
                inrWallet: user.inrWallet
            });
        }

        // 2. Convert INR to USD
        if (fromCurrency === 'INR' && toCurrency === 'USD') {
            if (user.inrWallet < amount) {
                return NextResponse.json({ error: 'Insufficient INR balance' }, { status: 400 });
            }
            const convertedAmount = amount / conversionRate;
            user.inrWallet -= amount;
            user.usdWallet += convertedAmount;
            await user.save();

            return NextResponse.json({
                message: 'Conversion successful',
                convertedAmount: convertedAmount,
                rate: conversionRate,
                usdWallet: user.usdWallet,
                inrWallet: user.inrWallet
            });
        }

        return NextResponse.json({ error: 'Unsupported conversion request' }, { status: 400 });

    } catch (error) {
        console.error('Conversion error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
