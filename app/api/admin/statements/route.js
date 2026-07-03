import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Statement from '@/models/Statement';
import { verifyToken } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();
        const { userId, title, base64File } = await req.json();

        if (!userId || !title || !base64File) {
            return NextResponse.json({ error: 'Please provide all required fields' }, { status: 400 });
        }

        const targetUser = await User.findById(userId);
        if (!targetUser) {
            return NextResponse.json({ error: 'Target user not found' }, { status: 404 });
        }

        // Upload statement file to Cloudinary
        const fileUrl = await uploadToCloudinary(base64File, `hashprime_statements/${userId}`);

        const statement = await Statement.create({
            userId,
            title,
            fileUrl,
            date: new Date()
        });

        return NextResponse.json({ message: 'Statement uploaded successfully', statement }, { status: 201 });
    } catch (error) {
        console.error('Upload statement API error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();
        const statements = await Statement.find({})
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        return NextResponse.json({ statements }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
