import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Nominee from '@/models/Nominee';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectToDatabase();
        const nominee = await Nominee.findOne({ user: payload.userId });

        return NextResponse.json({ nominee }, { status: 200 });
    } catch (error) {
        console.error('Error fetching nominee:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { fullName, dob, relationship, mobileNumber } = await req.json();

        if (!fullName || !dob || !relationship || !mobileNumber) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        await connectToDatabase();

        const existingNominee = await Nominee.findOne({ user: payload.userId });
        if (existingNominee) {
            return NextResponse.json({ error: 'Nominee already exists. Use PUT to update.' }, { status: 400 });
        }

        const nominee = new Nominee({
            user: payload.userId,
            fullName,
            dob,
            relationship,
            mobileNumber
        });

        await nominee.save();

        return NextResponse.json({ message: 'Nominee added successfully', nominee }, { status: 201 });
    } catch (error) {
        console.error('Error adding nominee:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { fullName, dob, relationship, mobileNumber } = await req.json();

        await connectToDatabase();

        const updatedNominee = await Nominee.findOneAndUpdate(
            { user: payload.userId },
            { fullName, dob, relationship, mobileNumber },
            { new: true, runValidators: true }
        );

        if (!updatedNominee) {
            return NextResponse.json({ error: 'Nominee not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Nominee updated successfully', nominee: updatedNominee }, { status: 200 });
    } catch (error) {
        console.error('Error updating nominee:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
