import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import * as jose from 'jose';
import { sendEmail } from '@/lib/email';

const secretKey = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_keep_it_safe'
);

// POST /api/auth/2fa/email-otp
// Two actions: { action: 'send' } or { action: 'verify', code: '123456' }
export async function POST(req) {
    try {
        const tempToken = req.cookies.get('temp_auth_token')?.value;
        if (!tempToken) {
            return NextResponse.json({ error: 'Session expired. Please log in again.' }, { status: 401 });
        }

        // Verify the temp token
        const { payload } = await jose.jwtVerify(tempToken, secretKey);
        if (!payload?.userId || !payload?.isTempAuth) {
            return NextResponse.json({ error: 'Invalid or expired session.' }, { status: 401 });
        }

        await connectToDatabase();
        const user = await User.findById(String(payload.userId));
        if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

        const { action, code } = await req.json();

        // ── SEND EMAIL OTP ──────────────────────────────────────────
        if (action === 'send') {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

            await User.findByIdAndUpdate(user._id, {
                otpCode: otp,
                otpExpiry: expiry,
            });

            const html = `
                <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border-radius:12px;border:1px solid #e2e8f0">
                    <h2 style="color:#0B1120;margin-bottom:8px">HashPrime — Recovery Code</h2>
                    <p style="color:#64748b;font-size:14px">You requested to verify via email because you lost access to your Authenticator app.</p>
                    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;text-align:center;margin:24px 0">
                        <div style="font-size:36px;font-weight:900;letter-spacing:0.5rem;color:#0B1120">${otp}</div>
                        <div style="color:#94a3b8;font-size:12px;margin-top:8px">Expires in 10 minutes</div>
                    </div>
                    <p style="color:#94a3b8;font-size:12px">If you didn't request this, please secure your account immediately.</p>
                </div>
            `;

            await sendEmail({ to: user.email, subject: 'HashPrime — 2FA Recovery Code', html });

            // Mask email for display: a*****@gmail.com
            const [local, domain] = user.email.split('@');
            const maskedEmail = `${local[0]}${'*'.repeat(Math.max(local.length - 1, 3))}@${domain}`;

            return NextResponse.json({ message: 'OTP sent', maskedEmail }, { status: 200 });
        }

        // ── VERIFY EMAIL OTP ────────────────────────────────────────
        if (action === 'verify') {
            if (!code) return NextResponse.json({ error: 'Code is required.' }, { status: 400 });

            if (!user.otpCode || !user.otpExpiry) {
                return NextResponse.json({ error: 'No OTP found. Please request a new one.' }, { status: 400 });
            }
            if (new Date() > new Date(user.otpExpiry)) {
                return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
            }
            if (user.otpCode !== code.trim()) {
                return NextResponse.json({ error: 'Invalid code. Please try again.' }, { status: 400 });
            }

            // Clear the OTP
            await User.findByIdAndUpdate(user._id, { otpCode: null, otpExpiry: null });

            // Issue the real auth token
            const finalToken = await new jose.SignJWT({ userId: user._id.toString(), role: user.role })
                .setProtectedHeader({ alg: 'HS256' })
                .setExpirationTime('24h')
                .sign(secretKey);

            const response = NextResponse.json({ message: 'Login successful', role: user.role }, { status: 200 });

            response.cookies.set({
                name: 'auth_token',
                value: finalToken,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24,
                path: '/',
            });

            response.cookies.delete('temp_auth_token');
            return response;
        }

        return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });

    } catch (error) {
        console.error('2FA email-otp error:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
