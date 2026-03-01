import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';
import * as jose from 'jose';

export async function POST(req) {
    try {
        await connectToDatabase();
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
        }

        // Retrieve the registration token from cookies
        const registrationToken = req.cookies.get('registration_token')?.value;

        if (!registrationToken) {
            return NextResponse.json({ error: 'Registration session expired. Please register again.' }, { status: 400 });
        }

        let pendingUser;
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_keep_it_safe');
            const { payload } = await jose.jwtVerify(registrationToken, secret);
            pendingUser = payload;
        } catch (err) {
            return NextResponse.json({ error: 'Invalid or expired registration session. Please register again.' }, { status: 400 });
        }

        // Check if user already exists (just in case)
        const existingUser = await User.findOne({ email: pendingUser.email });
        if (existingUser) {
            return NextResponse.json({ error: 'Email is already registered. Please log in.' }, { status: 400 });
        }

        // Check expiry of OTP payload
        if (new Date() > new Date(pendingUser.otpExpiry)) {
            return NextResponse.json({ error: 'OTP has expired. Please register again to get a new code.' }, { status: 400 });
        }

        // Compare logic
        if (String(pendingUser.otpCode).trim() !== String(otp).trim()) {
            return NextResponse.json({ error: 'Invalid verification code. Please try again.' }, { status: 400 });
        }

        // OTP is valid! Create the real user in the database.
        const newReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const user = await User.create({
            name: pendingUser.name,
            email: pendingUser.email,
            password: pendingUser.password,
            referredBy: pendingUser.referredBy,
            isEmailVerified: true,
            referralCode: newReferralCode
        });

        // Automatically log them in after verification
        const token = await signToken({ userId: user._id.toString(), email: user.email, role: user.role });

        const response = NextResponse.json({ message: 'Email verified successfully! Logging in...' }, { status: 200 });

        // Set auth token
        response.cookies.set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        // Clear the registration token
        response.cookies.delete('registration_token');

        return response;

    } catch (error) {
        console.error('Email verification error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
