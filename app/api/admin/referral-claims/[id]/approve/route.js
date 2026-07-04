import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import ReferralClaim from '@/models/ReferralClaim';
import Transaction from '@/models/Transaction';
import { verifyToken } from '@/lib/auth';

export async function POST(req, { params }) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();
        const { id } = await params;

        const claim = await ReferralClaim.findById(id);
        if (!claim) {
            return NextResponse.json({ error: 'Referral claim not found' }, { status: 404 });
        }

        if (claim.status === 'Approved') {
            return NextResponse.json({ error: 'Claim is already approved' }, { status: 400 });
        }

        claim.status = 'Approved';
        await claim.save();

        // Log transaction for the referrer payout
        await Transaction.create({
            userId: claim.userId,
            type: 'payout',
            amount: claim.amount,
            currency: 'USD',
            description: `Referral income payout approved & settled offline: ₹${claim.amountInr.toLocaleString('en-IN')}`
        });

        return NextResponse.json({ message: 'Referral claim approved successfully', claim }, { status: 200 });
    } catch (error) {
        console.error('Approve claim error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
