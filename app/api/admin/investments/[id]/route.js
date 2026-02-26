import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Investment from '@/models/Investment';
import { verifyToken } from '@/lib/auth';

export async function PATCH(req, { params }) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        await connectToDatabase();
        const { id } = await params;
        const body = await req.json();

        const updatedInvestment = await Investment.findByIdAndUpdate(id, body, { new: true }).populate('userId', 'name email');

        if (!updatedInvestment) {
            return NextResponse.json({ error: 'Investment not found' }, { status: 404 });
        }

        return NextResponse.json({ investment: updatedInvestment }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        await connectToDatabase();
        const { id } = await params;

        const deletedInvestment = await Investment.findByIdAndDelete(id);

        if (!deletedInvestment) {
            return NextResponse.json({ error: 'Investment not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Investment deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
