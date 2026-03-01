import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

export async function GET(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
        }

        await connectToDatabase();
        const pendingKycUsers = await User.find({ kycStatus: 'pending' }).select('-password').sort({ updatedAt: -1 });
        return NextResponse.json({ users: pendingKycUsers }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
        }

        await connectToDatabase();

        const { userId, status, rejectionMessage } = await req.json();

        if (!userId || !['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: 'Invalid user ID or status' }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        await User.findByIdAndUpdate(userId, { kycStatus: status });

        // Send email notification
        if (status === 'approved') {
            const html = `
                <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;border-radius:12px;border:1px solid #e2e8f0">
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
                        <div style="width:40px;height:40px;background:#39FF14;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;color:#0B1120">H</div>
                        <span style="font-weight:900;font-size:20px;color:#0B1120">HashPrime</span>
                    </div>
                    <h2 style="color:#0B1120;margin-bottom:8px">KYC Approved</h2>
                    <p style="color:#64748b;font-size:14px">Hi ${user.firstName || user.name},</p>
                    <p style="color:#64748b;font-size:14px">Your KYC verification has been <strong style="color:#14a32a">approved</strong>. Your account is now fully verified and you can access all investment features on HashPrime.</p>
                    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin:24px 0">
                        <p style="color:#166534;font-weight:700;margin:0">You can now invest in all available schemes.</p>
                    </div>
                    <p style="color:#94a3b8;font-size:12px">If you have any questions, contact our support team.</p>
                </div>
            `;
            await sendEmail({ to: user.email, subject: 'HashPrime — KYC Approved', html }).catch(console.error);
        }

        if (status === 'rejected') {
            const message = rejectionMessage?.trim() || 'Your submitted documents did not meet our verification requirements.';
            const html = `
                <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;border-radius:12px;border:1px solid #e2e8f0">
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
                        <div style="width:40px;height:40px;background:#39FF14;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;color:#0B1120">H</div>
                        <span style="font-weight:900;font-size:20px;color:#0B1120">HashPrime</span>
                    </div>
                    <h2 style="color:#0B1120;margin-bottom:8px">KYC Application Update</h2>
                    <p style="color:#64748b;font-size:14px">Hi ${user.firstName || user.name},</p>
                    <p style="color:#64748b;font-size:14px">Unfortunately, your KYC verification has been <strong style="color:#dc2626">rejected</strong> by our team.</p>
                    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:20px;margin:24px 0">
                        <p style="color:#991b1b;font-weight:700;margin:0 0 8px 0">Reason from Admin:</p>
                        <p style="color:#7f1d1d;margin:0;font-size:14px">${message}</p>
                    </div>
                    <p style="color:#64748b;font-size:14px">Please update your documents and resubmit your KYC from your dashboard profile page.</p>
                    <p style="color:#94a3b8;font-size:12px;margin-top:24px">If you believe this is a mistake, please contact our support team.</p>
                </div>
            `;
            await sendEmail({ to: user.email, subject: 'HashPrime — KYC Application Update', html }).catch(console.error);
        }

        return NextResponse.json({ message: `KYC status updated to ${status}` }, { status: 200 });

    } catch (error) {
        console.error('Admin KYC Update Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
