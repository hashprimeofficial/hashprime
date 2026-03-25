import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import JobApplication from '@/models/JobApplication';
import { uploadToCloudinary } from '@/lib/cloudinary';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        await connectToDatabase();

        const data = await req.json();
        const { name, email, phone, position, experience, linkedIn, coverLetter, resumeBase64 } = data;

        if (!name || !email || !position || !resumeBase64) {
            return NextResponse.json({ error: 'Name, email, position, and resume are required.' }, { status: 400 });
        }

        // Upload resume to Cloudinary
        let resumeUrl = '';
        try {
            resumeUrl = await uploadToCloudinary(resumeBase64, 'hashprime_careers');
        } catch (uploadError) {
            console.error('Resume upload failed:', uploadError);
            return NextResponse.json({ error: 'Failed to upload resume. Please try again.' }, { status: 500 });
        }

        const application = await JobApplication.create({
            name,
            email,
            phone,
            position,
            experience,
            linkedIn,
            coverLetter,
            resumeUrl,
        });

        return NextResponse.json({ message: 'Application submitted successfully! We will be in touch.', application }, { status: 201 });

    } catch (error) {
        console.error('Careers API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectToDatabase();
        const applications = await JobApplication.find().sort({ createdAt: -1 });
        return NextResponse.json({ applications }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
