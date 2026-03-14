import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

// 🔐 This route is a one-time bootstrap utility for the first admin setup.
// It is protected by a server-side secret key that must be passed in the request.
// Without BOOTSTRAP_SECRET defined in .env, the route is completely disabled.
export async function POST(req) {
    try {
        // ── Guard 1: Env var must be set and non-empty ─────────────────────────
        const bootstrapSecret = process.env.BOOTSTRAP_SECRET;
        if (!bootstrapSecret || bootstrapSecret.trim().length < 16) {
            return NextResponse.json(
                { error: 'This endpoint is disabled. Set BOOTSTRAP_SECRET in your environment to enable it.' },
                { status: 403 }
            );
        }

        const { email, secret } = await req.json();

        // ── Guard 2: Caller must provide the matching secret ───────────────────
        if (!secret || secret !== bootstrapSecret) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        if (!email) {
            return NextResponse.json({ error: 'Please provide an email' }, { status: 400 });
        }

        await connectToDatabase();

        const user = await User.findOneAndUpdate(
            { email },
            { role: 'admin' },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: `Success! User ${email} is now an admin. Please log out and back in to apply changes.`
        }, { status: 200 });

    } catch (error) {
        console.error('Make admin error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
