import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(req, { params }) {
    try {
        await connectToDatabase();
        const { code } = await params;

        if (!code) {
            return NextResponse.json({ error: 'No code provided' }, { status: 400 });
        }

        let referrer = null;

        // The code might be an ObjectId (old system) or a referralCode string
        if (mongoose.isValidObjectId(code)) {
            referrer = await User.findById(code).select('email referralCode');
        }

        if (!referrer) {
            referrer = await User.findOne({ referralCode: code }).select('email referralCode');
        }

        if (referrer) {
            return NextResponse.json({ email: referrer.email, referralCode: referrer.referralCode }, { status: 200 });
        } else {
            return NextResponse.json({ error: 'Referrer not found' }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
