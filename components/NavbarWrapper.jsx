'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function NavbarWrapper() {
    const pathname = usePathname();

    // Conditionally render Navbar based on the current path
    const isDashboardOrAdmin = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');

    if (isDashboardOrAdmin) {
        return null; // Hide navbar on these routes
    }

    return <Navbar />;
}
