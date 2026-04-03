import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Investment from '@/models/Investment';
import Transaction from '@/models/Transaction';
import { verifyToken } from '@/lib/auth';
import { getExchangeRate } from '@/lib/exchangeRate';
import speakeasy from 'speakeasy';

const INR_SCHEMES = {
    '3m_inr': { minAmounts: [50000, 100000, 300000, 500000], returnRate: 0.18, durationMonths: 3 },
    '6m_inr': { minAmounts: [100000, 300000, 500000], returnRate: 0.38, durationMonths: 6 },
    '1y_inr': { minAmount: 500000, maxAmount: Infinity, returnRate: 0.80, durationMonths: 12 },
    '5y_inr': { minAmount: 1000000, maxAmount: 1500000, returnRate: 5.00, durationMonths: 60 },
};
const USD_SCHEMES = {
    '3m_usd': { minAmounts: [500, 1000, 1500, 2000], returnRate: 0.18, durationMonths: 3 },
    '6m_usd': { minAmounts: [1000, 1500, 2000], returnRate: 0.38, durationMonths: 6 },
    '1y_usd': { minAmount: 2000, maxAmount: Infinity, returnRate: 0.80, durationMonths: 12 },
    '5y_usd': { minAmount: 5000, maxAmount: Infinity, returnRate: 5.00, durationMonths: 60 },
};

export async function POST(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectToDatabase();

        // Fetch user first to check KYC
        const user = await User.findById(payload.userId);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        if (user.kycStatus !== 'approved') {
            return NextResponse.json({ error: 'KYC not approved. Please complete KYC verification first.' }, { status: 403 });
        }

        const { amount, schemeType, currency, otpToken } = await req.json();

        const activeSchemes = currency === 'USD' ? USD_SCHEMES : INR_SCHEMES;
        if (!amount || !schemeType || !currency || !activeSchemes[schemeType]) {
            return NextResponse.json({ error: 'Invalid investment data' }, { status: 400 });
        }

        if (!otpToken) {
            return NextResponse.json({ error: 'Verification code is required.' }, { status: 400 });
        }

        // --- Verification Logic ---
        if (user.isTwoFactorEnabled && user.twoFactorSecret) {
            // Verify Google Authenticator
            const isTokenValid = speakeasy.totp.verify({
                secret: user.twoFactorSecret,
                encoding: 'base32',
                token: otpToken.trim(),
                window: 1 // Allow 30 seconds clock skew
            });

            if (!isTokenValid) {
                return NextResponse.json({ error: 'Invalid or expired 2FA code.' }, { status: 400 });
            }
        } else {
            // Verify Email OTP Flag
            // Currently, if 2FA is not enabled, we expect the frontend to handle an email OTP similar to login.
            // (Assuming email OTP was sent and saved in user.otpCode prior to this request, or verified locally)
            // For this implementation, if they don't have 2FA, we will verify the OTP token against `user.otpCode`.
            if (user.otpCode !== otpToken.trim() || !user.otpExpiry || new Date() > user.otpExpiry) {
                return NextResponse.json({ error: 'Invalid or expired Email OTP code.' }, { status: 400 });
            }
            // Clear the OTP after successful use
            user.otpCode = null;
            user.otpExpiry = null;
            await user.save();
        }

        const scheme = activeSchemes[schemeType];

        // Validate amount
        if (schemeType.startsWith('3m') || schemeType.startsWith('6m')) {
            if (!scheme.minAmounts.includes(amount)) {
                return NextResponse.json({ error: `Invalid amount for ${schemeType} scheme. Allowed: ${scheme.minAmounts.join(', ')}` }, { status: 400 });
            }
        } else {
            if (amount < scheme.minAmount || amount > scheme.maxAmount) {
                return NextResponse.json({ error: `Amount restricted for ${schemeType}. Min: ${scheme.minAmount}, Max: ${scheme.maxAmount === Infinity ? 'None' : scheme.maxAmount}` }, { status: 400 });
            }
        }

        // Check wallet balance (ensure they have funds NOW, but DO NOT deduct yet)
        const walletBalance = currency === 'USD' ? (user.usdWallet || 0) : (user.inrWallet || 0);
        if (walletBalance < amount) {
            return NextResponse.json({ error: 'Insufficient wallet balance to cover this investment request.' }, { status: 400 });
        }

        // Calculate Maturity date & USDT rewards
        const maturesAt = new Date();
        maturesAt.setMonth(maturesAt.getMonth() + scheme.durationMonths);

        const liveRate = await getExchangeRate();
        let usdtReward = 0;
        let inrReward = 0;
        if (currency === 'USD') {
            usdtReward = Math.round((amount * scheme.returnRate) * 100) / 100;
        } else {
            inrReward = Math.round(amount * scheme.returnRate);
            usdtReward = Math.round((inrReward / liveRate) * 100) / 100; // Keep roughly accurate usdtReward for legacy purposes if needed
        }

        // **CRITICAL CHANGE: Do NOT deduct walletBalance here.**
        // **CRITICAL CHANGE: Do NOT create a Transaction ledger yet.**

        // Create Pending Investment
        const investment = await Investment.create({
            userId: user._id,
            amount,
            schemeType,
            currency,
            usdtReward,
            inrReward,
            maturesAt,
            status: 'pending' // User investments start as pending, requiring admin approval/activation
        });

        return NextResponse.json({
            message: 'Investment request submitted successfully! Pending Admin Approval.',
            investment
        }, { status: 201 });
    } catch (error) {
        console.error('Investment Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
