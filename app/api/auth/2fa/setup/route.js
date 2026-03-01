import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import * as OTPAuth from 'otpauth';
import QRCode from 'qrcode';

export async function GET(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectToDatabase();
        const user = await User.findById(payload.userId);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        if (user.isTwoFactorEnabled) {
            return NextResponse.json({ error: '2FA is already enabled' }, { status: 400 });
        }

        // Generate a random base32 secret
        const secret = new OTPAuth.Secret({ size: 20 });
        const secretBase32 = secret.base32;

        // Build the TOTP object
        const totp = new OTPAuth.TOTP({
            issuer: 'HashPrime',
            label: user.email,
            algorithm: 'SHA1',
            digits: 6,
            period: 30,
            secret: OTPAuth.Secret.fromBase32(secretBase32),
        });

        // Generate the otpauth URI and QR code
        const otpauthUri = totp.toString();
        const qrCodeDataUrl = await QRCode.toDataURL(otpauthUri);

        return NextResponse.json({ secret: secretBase32, qrCodeDataUrl }, { status: 200 });

    } catch (error) {
        console.error('Error initiating 2FA setup:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { secret, token: totpToken } = await req.json();

        if (!secret || !totpToken) {
            return NextResponse.json({ error: 'Secret and token are required' }, { status: 400 });
        }

        // Validate the TOTP code (±1 window for clock drift)
        const totp = new OTPAuth.TOTP({
            issuer: 'HashPrime',
            algorithm: 'SHA1',
            digits: 6,
            period: 30,
            secret: OTPAuth.Secret.fromBase32(secret),
        });

        const delta = totp.validate({ token: totpToken, window: 1 });
        if (delta === null) {
            return NextResponse.json({ error: 'Invalid authenticator code' }, { status: 400 });
        }

        await connectToDatabase();
        const user = await User.findById(payload.userId);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        await User.findByIdAndUpdate(payload.userId, {
            twoFactorSecret: secret,
            isTwoFactorEnabled: true,
        });

        return NextResponse.json({ message: '2FA enabled successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error verifying 2FA setup:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
