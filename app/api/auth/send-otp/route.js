import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectToDatabase();

        const user = await User.findById(payload.userId);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // Generate OTP
        const otpCode = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save to DB
        user.otpCode = otpCode;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Send Email
        const emailTemplate = `
            <h2>Action Verification Required</h2>
            <p>Hello ${user.name},</p>
            <p>You have requested an action that requires verification (e.g., an investment or withdrawal).</p>
            <p>Your OTP code is: <strong style="font-size: 24px;">${otpCode}</strong></p>
            <p>This code will expire in 10 minutes. If you did not request this, please secure your account immediately.</p>
            <br/>
            <p>Best Regards,<br/>The HashPrime Team</p>
        `;

        await sendEmail({
            to: user.email,
            subject: 'Your HashPrime Verification OTP',
            html: emailTemplate
        });

        return NextResponse.json({ message: 'OTP sent to your registered email address.' }, { status: 200 });

    } catch (error) {
        console.error('Send Auth OTP Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
