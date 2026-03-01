import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Ticket from '@/models/Ticket';
import { verifyToken } from '@/lib/auth';

export async function PUT(req, { params }) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
        }

        await connectToDatabase();

        const { id } = await params;
        const { adminReply, status } = await req.json();

        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        if (adminReply !== undefined) ticket.adminReply = adminReply;
        if (status !== undefined) ticket.status = status;

        await ticket.save();

        return NextResponse.json({ message: 'Ticket updated successfully', ticket }, { status: 200 });

    } catch (error) {
        console.error('Admin Ticket Update Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
