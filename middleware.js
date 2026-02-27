import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET;
if (!secretKey && process.env.NODE_ENV === 'production') {
    console.error('CRITICAL: JWT_SECRET environment variable is missing. Security risk!');
}
const key = new TextEncoder().encode(secretKey || 'thisismysupersecretkeyforhashprimeapp');

export async function middleware(req) {
    const token = req.cookies.get('auth_token')?.value;
    const { pathname } = req.nextUrl;

    const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');
    const isAdminRoute = pathname.startsWith('/admin');
    const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');

    if (isProtectedRoute) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        try {
            const { payload } = await jwtVerify(token, key);

            if (isAdminRoute && payload.role !== 'admin') {
                return NextResponse.redirect(new URL('/dashboard', req.url));
            }
        } catch (error) {
            // Token is invalid or expired
            const response = NextResponse.redirect(new URL('/login', req.url));
            response.cookies.delete('auth_token');
            return response;
        }
    }

    if (isAuthRoute) {
        if (token) {
            try {
                const { payload } = await jwtVerify(token, key);
                if (payload.role === 'admin') {
                    return NextResponse.redirect(new URL('/admin', req.url));
                } else {
                    return NextResponse.redirect(new URL('/dashboard', req.url));
                }
            } catch (error) {
                // Token invalid, let them proceed to auth routes
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register'],
};
