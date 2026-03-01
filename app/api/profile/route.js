import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function GET(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectToDatabase();

        const user = await User.findById(payload.userId).select('-password');
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Increase standard body size limit for base64 images
export const maxDuration = 60; // Set max duration for cloudinary upload if needed
export const dynamic = 'force-dynamic';

export async function PUT(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectToDatabase();

        let data;
        try {
            data = await req.json();
        } catch (e) {
            return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
        }

        const user = await User.findById(payload.userId);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // Handle Image Uploads First
        if (data.panImageBase64) {
            try {
                const url = await uploadToCloudinary(data.panImageBase64, `hashprime_kyc/${user._id}`);
                data.panDocumentUrl = url;
            } catch (err) {
                console.error("PAN Upload Error:", err);
                return NextResponse.json({ error: 'Failed to upload PAN document' }, { status: 500 });
            }
        }

        if (data.aadhaarImageBase64) {
            try {
                const url = await uploadToCloudinary(data.aadhaarImageBase64, `hashprime_kyc/${user._id}`);
                data.aadhaarDocumentUrl = url;
            } catch (err) {
                console.error("Aadhaar Upload Error:", err);
                return NextResponse.json({ error: 'Failed to upload Aadhaar document' }, { status: 500 });
            }
        }

        const allowedFields = [
            'firstName', 'lastName', 'address', 'pincode', 'city', 'state', 'country',
            'panNumber', 'aadhaarNumber', 'occupation', 'sourceOfIncome', 'incomeRange',
            'panDocumentUrl', 'aadhaarDocumentUrl'
        ];
        const kycFields = ['panNumber', 'aadhaarNumber', 'occupation', 'sourceOfIncome', 'incomeRange', 'panDocumentUrl', 'aadhaarDocumentUrl'];

        const updates = {};
        let kycUpdated = false;

        allowedFields.forEach(field => {
            if (data[field] !== undefined) {
                updates[field] = data[field];
                if (kycFields.includes(field) && (user.kycStatus === 'unsubmitted' || user.kycStatus === 'rejected')) {
                    kycUpdated = true;
                }
            }
        });

        if (kycUpdated) updates.kycStatus = 'pending';

        await User.findByIdAndUpdate(user._id, updates);

        const updatedUser = await User.findById(payload.userId).select('-password');
        return NextResponse.json({ message: 'Profile updated successfully', user: updatedUser }, { status: 200 });
    } catch (error) {
        console.error('Profile Update Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
