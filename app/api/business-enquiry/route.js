import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import BusinessEnquiry from '@/models/BusinessEnquiry';

const REQUIRED_FIELDS = ['name', 'phone', 'email', 'fieldOfInquiry', 'contactDateTime'];

export async function POST(request) {
    try {
        await connectToDatabase();

        let body;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { success: false, message: 'Invalid JSON payload.' },
                { status: 400 }
            );
        }

        // Validate required fields
        const missing = REQUIRED_FIELDS.filter(f => !body[f] || String(body[f]).trim() === '');
        if (missing.length > 0) {
            return NextResponse.json(
                { success: false, message: `Missing required fields: ${missing.join(', ')}` },
                { status: 400 }
            );
        }

        // Basic email format check
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
            return NextResponse.json(
                { success: false, message: 'Invalid email address.' },
                { status: 400 }
            );
        }

        // Basic phone check (at least 7 digits)
        if (!/\d{7}/.test(body.phone.replace(/\D/g, ''))) {
            return NextResponse.json(
                { success: false, message: 'Invalid phone number.' },
                { status: 400 }
            );
        }

        const newEnquiry = await BusinessEnquiry.create({
            name:            String(body.name).trim().slice(0, 200),
            phone:           String(body.phone).trim().slice(0, 30),
            email:           String(body.email).trim().toLowerCase().slice(0, 200),
            fieldOfInquiry:  String(body.fieldOfInquiry).trim().slice(0, 1000),
            source:          String(body.source || 'general').trim().slice(0, 100),
            details:         String(body.details || '').trim().slice(0, 2000),
            contactDateTime: String(body.contactDateTime).trim().slice(0, 100),
        });

        return NextResponse.json({ success: true, data: newEnquiry }, { status: 201 });

    } catch (error) {
        console.error('[BusinessEnquiry] Error saving enquiry:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error. Please try again later.' },
            { status: 500 }
        );
    }
}
