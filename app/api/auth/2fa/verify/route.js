import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import * as OTPAuth from 'otpauth';
import * as jose from 'jose';

export async function POST(req) {
    try {
        // Read the temp token from cookies (set as HttpOnly by login route)
        const tempToken = req.cookies.get('temp_auth_token')?.value;
        const { code } = await req.json();

        if (!tempToken || !code) {
            return NextResponse.json({ error: 'Token and code are required' }, { status: 400 });
        }

        const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_keep_it_safe');

        // Verify the temporary token
        const { payload } = await jose.jwtVerify(tempToken, secretKey);

        if (!payload || !payload.userId || !payload.isTempAuth) {
            return NextResponse.json({ error: 'Invalid or expired temporary token' }, { status: 401 });
        }

        await connectToDatabase();
        const user = await User.findById(payload.userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // --- Case 1: Google Authenticator (TOTP) ---
        if (user.isTwoFactorEnabled && user.twoFactorSecret) {
            const totp = new OTPAuth.TOTP({
                issuer: 'HashPrime',
                algorithm: 'SHA1',
                digits: 6,
                period: 30,
                secret: OTPAuth.Secret.fromBase32(user.twoFactorSecret),
            });

            const delta = totp.validate({ token: code, window: 1 });
            if (delta === null) {
                return NextResponse.json({ error: 'Invalid authentication code' }, { status: 400 });
            }
        }
        // --- Case 2: Email OTP Fallback ---
        else if (user.otpCode) {
            if (!user.otpExpiry || new Date() > new Date(user.otpExpiry)) {
                return NextResponse.json({ error: 'OTP has expired. Please log in again.' }, { status: 400 });
            }
            if (user.otpCode !== code.trim()) {
                return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
            }
            // Clear the used OTP
            await User.findByIdAndUpdate(user._id, { otpCode: null, otpExpiry: null });
        }
        else {
            return NextResponse.json({ error: 'Verification session invalid. Please log in again.' }, { status: 400 });
        }

        // Issue the real auth token — always use .toString() on ObjectId
        const finalToken = await new jose.SignJWT({ userId: user._id.toString(), role: user.role })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(secretKey);

        const response = NextResponse.json({ message: 'Login successful', role: user.role }, { status: 200 });

        response.cookies.set({
            name: 'auth_token',
            value: finalToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        });

        // Clear the temp token
        response.cookies.delete('temp_auth_token');

        return response;

    } catch (error) {
        console.error('Error verifying 2FA for login:', error);
        return NextResponse.json({ error: 'Session expired or invalid token. Please login again.' }, { status: 401 });
    }
}