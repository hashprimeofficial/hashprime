import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import mongoose from 'mongoose';

export async function GET() {
    try {
        await connectToDatabase();
        const collection = mongoose.connection.collection('deposits');
        const deposits = await collection.find({}).toArray();
        return NextResponse.json({ deposits });
    } catch (e) {
        return NextResponse.json({ error: e.message });
    }
}
