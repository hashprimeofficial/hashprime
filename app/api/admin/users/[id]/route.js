import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Investment from '@/models/Investment';
import Transaction from '@/models/Transaction';
import { verifyToken } from '@/lib/auth';

export async function PATCH(req, { params }) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        await connectToDatabase();
        const { id } = await params;
        const body = await req.json();

        // ── Whitelist of fields that admin can update ─────────────────────────
        // Explicitly excluding: role, _id, createdAt, totp*, referralCode, etc.
        const ALLOWED_FIELDS = ['name', 'email', 'phone', 'password', 'kycStatus',
            'usdWallet', 'inrWallet', 'referralWallet'];
        const updates = {};
        for (const key of ALLOWED_FIELDS) {
            if (body[key] !== undefined) updates[key] = body[key];
        }

        // Handle Email Uniqueness
        if (updates.email) {
            const existingUser = await User.findOne({ email: updates.email, _id: { $ne: id } });
            if (existingUser) {
                return NextResponse.json({ error: 'Email is already in use by another account' }, { status: 400 });
            }
        }

        // Handle Password Hashing
        if (updates.password && updates.password.trim() !== '') {
            const bcrypt = require('bcryptjs');
            updates.password = await bcrypt.hash(updates.password, 10);
        } else {
            delete updates.password;
        }

        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user: updatedUser }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        await connectToDatabase();
        const { id } = await params;

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Optional: Clean up related records (be careful with this in production, but good for testing)
        await Investment.deleteMany({ userId: id });
        await Transaction.deleteMany({ userId: id });

        return NextResponse.json({ message: 'User and related data deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error("Delete user error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
