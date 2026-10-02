import { NextResponse } from 'next/server';

const MAINTENANCE_MESSAGE = "Our website is currently undergoing scheduled updates and enhancements. We’ll be back online on 21 October 2026. Thank you for your patience and understanding.";

export function middleware(req) {
    const { pathname } = req.nextUrl;

    // Block all API routes with 503 Service Unavailable
    if (pathname.startsWith('/api')) {
        return NextResponse.json(
            {
                status: 503,
                error: 'Service Unavailable',
                message: MAINTENANCE_MESSAGE,
                backOnlineDate: '2026-10-21T00:00:00+05:30',
            },
            {
                status: 503,
                headers: {
                    'Retry-After': 'Wed, 21 Oct 2026 00:00:00 GMT',
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    'Content-Type': 'application/json',
                },
            }
        );
    }

    // If requesting any page other than root '/', redirect strictly to '/'
    if (pathname !== '/') {
        const url = req.nextUrl.clone();
        url.pathname = '/';
        url.search = '';
        return NextResponse.redirect(url, 307);
    }

    // For root '/', pass through to render the maintenance countdown page
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static (static JS/CSS)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - static images and assets (png, jpg, svg, webp, fonts)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|css|js)$).*)',
    ],
};
