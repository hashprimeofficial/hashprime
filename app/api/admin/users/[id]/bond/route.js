import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(req, { params }) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();
        const { id } = await params;

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { bondDocumentBase64, bondDocumentUrl } = await req.json();

        let finalUrl = bondDocumentUrl || '';

        if (bondDocumentBase64) {
            try {
                finalUrl = await uploadToCloudinary(bondDocumentBase64, `hashprime_bonds/${user._id}`);
            } catch (err) {
                console.error('Cloudinary Bond Upload Error:', err);
                return NextResponse.json({ error: 'Failed to upload bond document to Cloudinary' }, { status: 500 });
            }
        }

        if (!finalUrl) {
            return NextResponse.json({ error: 'No bond document file or URL provided' }, { status: 400 });
        }

        user.bondDocumentUrl = finalUrl;
        user.bondDocumentUploadedAt = new Date();
        await user.save();

        return NextResponse.json({
            message: 'Bond document uploaded successfully',
            bondDocumentUrl: user.bondDocumentUrl,
            bondDocumentUploadedAt: user.bondDocumentUploadedAt
        }, { status: 200 });
    } catch (error) {
        console.error('Bond Upload API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();
        const { id } = await params;

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        user.bondDocumentUrl = '';
        user.bondDocumentUploadedAt = null;
        await user.save();

        return NextResponse.json({ message: 'Bond document removed successfully' }, { status: 200 });
    } catch (error) {
        console.error('Bond Delete API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
