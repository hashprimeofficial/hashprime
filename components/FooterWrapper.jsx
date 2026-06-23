'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function FooterWrapper() {
    const pathname = usePathname();

    // Check if the current route is a dashboard or admin route
    const isDashboardOrAdmin = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');

    // If it is, do not render the Footer
    if (isDashboardOrAdmin) {
        return null;
    }

    // Otherwise, render the Footer normally
    return <Footer />;
}
