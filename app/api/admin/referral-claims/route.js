import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import ReferralClaim from '@/models/ReferralClaim';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();
        const claims = await ReferralClaim.find({})
            .populate('userId', 'name email')
            .populate('bankAccountId')
            .sort({ createdAt: -1 });

        return NextResponse.json({ claims }, { status: 200 });
    } catch (error) {
        console.error('Fetch all claims error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
