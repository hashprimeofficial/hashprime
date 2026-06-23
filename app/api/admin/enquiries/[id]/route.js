import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import BusinessEnquiry from '@/models/BusinessEnquiry';

export async function PATCH(request, { params }) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const { status } = await request.json();

        if (!status || !['pending', 'contacted', 'closed'].includes(status)) {
            return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
        }

        const updated = await BusinessEnquiry.findByIdAndUpdate(
            id,
            { status },
            { returnDocument: 'after', runValidators: true }
        );

        if (!updated) {
            return NextResponse.json({ success: false, message: 'Enquiry not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        console.error('Error updating enquiry:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
