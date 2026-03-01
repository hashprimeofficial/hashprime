import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Ticket from '@/models/Ticket';
import { verifyToken } from '@/lib/auth';

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

        const { subject, description } = await req.json();

        if (!subject || !description) {
            return NextResponse.json({ error: 'Subject and description are required' }, { status: 400 });
        }

        const newTicket = await Ticket.create({
            user: payload.userId,
            subject,
            description
        });

        return NextResponse.json({ message: 'Ticket created successfully', ticket: newTicket }, { status: 201 });
    } catch (error) {
        console.error('Create Ticket Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
