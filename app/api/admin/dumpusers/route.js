import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import mongoose from 'mongoose';

export async function GET() {
    try {
        await connectToDatabase();
        const collection = mongoose.connection.collection('users');
        const users = await collection.find({ role: 'user' }).toArray();
        return NextResponse.json({
            users: users.map(u => ({
                email: u.email,
                usdWallet: u.usdWallet,
                inrWallet: u.inrWallet,
                referralWallet: u.referralWallet,
                rawKeys: Object.keys(u)
            }))
        });
    } catch (e) {
        return NextResponse.json({ error: e.message });
    }
}
