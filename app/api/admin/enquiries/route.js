import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import BusinessEnquiry from '@/models/BusinessEnquiry';

export async function GET() {
    try {
        await connectToDatabase();
        const enquiries = await BusinessEnquiry.find().sort({ createdAt: -1 }).lean();

        // Ensure legacy records without status act as 'pending'
        const normalized = enquiries.map(e => ({
            ...e,
            status: e.status || 'pending'
        }));

        return NextResponse.json({ success: true, enquiries: normalized });
    } catch (error) {
        console.error('Error fetching enquiries:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
