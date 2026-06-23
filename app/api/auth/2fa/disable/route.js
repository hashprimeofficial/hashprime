import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import * as OTPAuth from 'otpauth';

export async function POST(req) {
    try {
        const authToken = req.cookies.get('auth_token')?.value;
        if (!authToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(authToken);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { token: totpToken } = await req.json();

        if (!totpToken) {
            return NextResponse.json({ error: 'Authenticator token is required to disable 2FA' }, { status: 400 });
        }

        await connectToDatabase();
        const user = await User.findById(payload.userId);

        if (!user || !user.isTwoFactorEnabled) {
            return NextResponse.json({ error: '2FA is not enabled for this user' }, { status: 400 });
        }

        const totp = new OTPAuth.TOTP({
            issuer: 'HashPrime',
            algorithm: 'SHA1',
            digits: 6,
            period: 30,
            secret: OTPAuth.Secret.fromBase32(user.twoFactorSecret),
        });

        const delta = totp.validate({ token: totpToken, window: 1 });
        if (delta === null) {
            return NextResponse.json({ error: 'Invalid authenticator code' }, { status: 400 });
        }

        await User.findByIdAndUpdate(payload.userId, {
            isTwoFactorEnabled: false,
            twoFactorSecret: '',
        });

        return NextResponse.json({ message: '2FA disabled successfully' }, { status: 200 });

    } catch (error) {
        console.error('Error disabling 2FA:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
