import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(req) {
    try {
        await connectToDatabase();
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.isEmailVerified) {
            return NextResponse.json({ error: 'Email is already verified' }, { status: 400 });
        }

        // Check expiry first (better UX)
        if (!user.otpCode || !user.otpExpiry) {
            return NextResponse.json({ error: 'No OTP found. Please request a new verification code.' }, { status: 400 });
        }

        if (new Date() > new Date(user.otpExpiry)) {
            return NextResponse.json({ error: 'OTP has expired. Please register again to get a new code.' }, { status: 400 });
        }

        // Compare as trimmed strings to avoid type/whitespace mismatch
        if (String(user.otpCode).trim() !== String(otp).trim()) {
            return NextResponse.json({ error: 'Invalid verification code. Please try again.' }, { status: 400 });
        }

        await User.findByIdAndUpdate(user._id, {
            isEmailVerified: true,
            otpCode: null,
            otpExpiry: null,
        });

        // Automatically log them in after verification
        const token = await signToken({ userId: user._id.toString(), email: user.email, role: user.role });

        const response = NextResponse.json({ message: 'Email verified successfully! Logging in...' }, { status: 200 });

        response.cookies.set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Email verification error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
