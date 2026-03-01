import { NextResponse } from 'next/server';
import { getExchangeRate } from '@/lib/exchangeRate';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const rate = await getExchangeRate();

        return NextResponse.json({
            rate,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Exchange rate API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
