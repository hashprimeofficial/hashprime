import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { sendEmail } from '@/lib/email';

// Helper to generate a 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
    try {
        await connectToDatabase();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const user = await User.findOne({ email });

        // IMPORTANT: We silently return success even if the email doesn't exist
        // to prevent email enumeration attacks. We only actually send the email
        // if the user exists.
        if (user) {
            const otpCode = generateOTP();
            await User.findByIdAndUpdate(user._id, {
                otpCode,
                otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
            });

            const emailHtml = `
                <h2>HashPrime Password Reset</h2>
                <p>We received a request to reset your password.</p>
                <p>Your password reset code is: <strong style="font-size: 24px;">${otpCode}</strong></p>
                <p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
            `;

            try {
                await sendEmail({
                    to: email,
                    subject: 'HashPrime Password Reset Request',
                    html: emailHtml
                });
            } catch (emailError) {
                console.error('Failed to send password reset email:', emailError);
            }
        }

        return NextResponse.json({
            message: 'If that email exists in our system, we have sent a password reset OTP.'
        }, { status: 200 });

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
