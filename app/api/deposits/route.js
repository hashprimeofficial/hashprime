import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Deposit from '@/models/Deposit';
import { verifyToken } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

// Increase limits for image payload
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectToDatabase();

        const user = await User.findById(payload.userId);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // User must be KYC approved to deposit.
        if (user.kycStatus !== 'approved') {
            return NextResponse.json({ error: 'Your KYC is not approved yet. You cannot deposit funds.' }, { status: 403 });
        }

        const data = await req.json();
        const { amount, paymentMethod, screenshotBase64 } = data;

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return NextResponse.json({ error: 'Invalid deposit amount' }, { status: 400 });
        }

        if (!['usdt', 'bank'].includes(paymentMethod)) {
            return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
        }

        if (!screenshotBase64) {
            return NextResponse.json({ error: 'Payment screenshot is required' }, { status: 400 });
        }

        // Upload screenshot to Cloudinary
        let screenshotUrl = '';
        try {
            screenshotUrl = await uploadToCloudinary(screenshotBase64, `hashprime_deposit_screenshots/${user._id}`);

        } catch (uploadError) {
            console.error("Deposit screenshot upload failed:", uploadError);
            return NextResponse.json({ error: 'Failed to upload screenshot. Please try again.' }, { status: 500 });
        }

        const deposit = await Deposit.create({
            userId: user._id,
            amount: Number(amount),
            paymentMethod,
            screenshotUrl
        });

        return NextResponse.json({ message: 'Deposit request submitted successfully! Pending admin verification.', deposit }, { status: 201 });

    } catch (error) {
        console.error('Deposit Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectToDatabase();

        const deposits = await Deposit.find({ userId: payload.userId }).sort({ createdAt: -1 });

        return NextResponse.json({ deposits }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
