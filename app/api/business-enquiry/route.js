import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import BusinessEnquiry from '@/models/BusinessEnquiry';

export async function POST(request) {
    try {
        await connectToDatabase();
        const body = await request.json();

        // Basic validation
        if (!body.name || !body.phone || !body.email || !body.fieldOfInquiry || !body.contactDateTime) {
            return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
        }

        const newEnquiry = await BusinessEnquiry.create(body);
        return NextResponse.json({ success: true, data: newEnquiry }, { status: 201 });
    } catch (error) {
        console.error('Error saving business enquiry:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
