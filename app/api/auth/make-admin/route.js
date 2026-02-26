import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
    try {
        await connectToDatabase();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Please provide an email' }, { status: 400 });
        }

        const user = await User.findOneAndUpdate(
            { email },
            { role: 'admin' },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: `Success! User ${email} is now an admin. Please log out and back in to apply changes.` }, { status: 200 });
    } catch (error) {
        console.error('Make admin error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
