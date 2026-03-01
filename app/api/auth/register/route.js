import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { sendEmail } from '@/lib/email';
import mongoose from 'mongoose';
import * as jose from 'jose';

// Helper to generate a 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
    try {
        await connectToDatabase();
        const { name, email, password, referredBy } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Please provide all required fields' }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }

        let validReferrer = '';
        if (referredBy) {
            let referrer = null;
            if (referredBy.includes('@')) {
                referrer = await User.findOne({ email: referredBy });
            } else if (mongoose.isValidObjectId(referredBy)) {
                referrer = await User.findById(referredBy);
            } else {
                referrer = await User.findOne({ referralCode: referredBy });
            }

            if (referrer) {
                validReferrer = referrer.referralCode || referrer._id.toString();
            } else {
                return NextResponse.json({ error: 'Invalid referral code or email provided.' }, { status: 400 });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP
        const otpCode = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Serialize the pending user data into a JWT
        const pendingUserData = {
            name,
            email,
            password: hashedPassword,
            referredBy: validReferrer,
            otpCode,
            otpExpiry: otpExpiry.toISOString()
        };

        const registrationToken = await new jose.SignJWT(pendingUserData)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('15m')
            .sign(new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_keep_it_safe'));

        // Send OTP via Email
        const emailHtml = `
            <h2>Welcome to HashPrime, ${name}!</h2>
            <p>Please verify your email address to activate your account.</p>
            <p>Your verification code is: <strong style="font-size: 24px;">${otpCode}</strong></p>
            <p>This code will expire in 10 minutes.</p>
        `;

        try {
            await sendEmail({
                to: email,
                subject: 'Verify your HashPrime Account',
                html: emailHtml
            });
        } catch (emailError) {
            console.error('Failed to send registration email, but user was created:', emailError);
            // Optionally, handle this by returning a warning or letting the user request a new OTP later
        }

        const response = NextResponse.json({
            message: 'Registration initiated. Please verify your email.',
            requiresEmailVerification: true
        }, { status: 201 });

        // Set the registration token as an HTTP-only cookie
        response.cookies.set({
            name: 'registration_token',
            value: registrationToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 15, // 15 minutes
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
