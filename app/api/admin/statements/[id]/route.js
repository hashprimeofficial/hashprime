import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Statement from '@/models/Statement';
import { verifyToken } from '@/lib/auth';

export async function DELETE(req, { params }) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();
        const { id } = await params;

        const deletedStatement = await Statement.findByIdAndDelete(id);
        if (!deletedStatement) {
            return NextResponse.json({ error: 'Statement not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Statement deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
