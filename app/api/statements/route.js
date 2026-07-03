import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Statement from '@/models/Statement';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectToDatabase();
        const statements = await Statement.find({ userId: payload.userId }).sort({ createdAt: -1 });

        return NextResponse.json({ statements }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
