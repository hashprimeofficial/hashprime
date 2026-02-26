import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
    try {
        await connectToDatabase();
        const { name, email, password, referredBy } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Please provide all required fields' }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }

        let validReferrer = '';
        if (referredBy) {
            const referrer = await User.findOne({ email: referredBy });
            if (referrer) {
                validReferrer = referredBy;
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            referredBy: validReferrer,
        });

        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
