import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { uploadToCloudinary } from '@/lib/cloudinary';
import Ticket from '@/models/Ticket';
import { verifyToken } from '@/lib/auth';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectToDatabase();

        // If admin, return all tickets. If user, return only their tickets.
        let tickets;
        if (payload.role === 'admin') {
            tickets = await Ticket.find().populate('user', 'name email').sort({ createdAt: -1 });
        } else {
            tickets = await Ticket.find({ user: payload.userId }).sort({ createdAt: -1 });
        }

        return NextResponse.json({ tickets }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectToDatabase();

        const { subject, description, category, subCategory, screenshotBase64 } = await req.json();

        if (!subject || !description || !category) {
            return NextResponse.json({ error: 'Subject, description, and category are required' }, { status: 400 });
        }

        let screenshotUrl = '';
        if (screenshotBase64) {
            try {
                screenshotUrl = await uploadToCloudinary(screenshotBase64, `hashprime_tickets/${payload.userId}`);
            } catch (err) {
                console.error('Ticket upload err:', err);
                return NextResponse.json({ error: 'Failed to upload screenshot' }, { status: 500 });
            }
        }

        const newTicket = await Ticket.create({
            user: payload.userId,
            subject,
            category,
            subCategory,
            screenshotUrl,
            description
        });

        return NextResponse.json({ message: 'Ticket created successfully', ticket: newTicket }, { status: 201 });
    } catch (error) {
        console.error('Create Ticket Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
