'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Wallet, LogOut, Loader2 } from 'lucide-react';

const NAV_ITEMS = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Investments', href: '/admin/investments', icon: Wallet },
    { name: 'Deposits', href: '/admin/deposits', icon: Wallet },
    { name: 'KYC Approvals', href: '/admin/kyc', icon: Users },
    { name: 'Support Tickets', href: '/admin/tickets', icon: LayoutDashboard },
];

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-white text-navy flex flex-col md:flex-row font-sans">
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50 p-6 flex-col justify-between hidden md:flex h-screen sticky top-0">
                <div>
                    <div className="mb-10 flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-navy flex items-center justify-center font-black text-white text-sm">A</div>
                        <span className="text-xl font-black tracking-tight text-navy">Admin Panel</span>
                    </div>
                    <nav className="space-y-1">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-bold ${isActive ? 'bg-navy text-white shadow-md' : 'text-slate-500 hover:text-navy hover:bg-slate-200/60'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm font-bold mt-auto w-full text-left"
                >
                    {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                    Sign Out
                </button>
            </div>

            <div className="flex-1 overflow-y-auto w-full bg-slate-50 min-h-screen">
                <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
                    <MobileNav pathname={pathname} handleLogout={handleLogout} />
                    {children}
                </main>
            </div>
        </div>
    );
}

function MobileNav({ pathname, handleLogout }) {
    return (
        <div className="md:hidden flex justify-between items-center mb-8 pb-4 border-b border-slate-200">
            <div className="text-lg font-black flex items-center gap-2 text-navy">
                <div className="w-6 h-6 rounded bg-navy flex items-center justify-center font-bold text-white text-xs">A</div>
                Admin
            </div>
            <nav className="flex items-center gap-4 text-sm font-bold overflow-x-auto no-scrollbar">
                {NAV_ITEMS.map(i => (
                    <Link key={i.href} href={i.href} className={pathname === i.href ? "text-navy pb-1 border-b-2 border-neon whitespace-nowrap" : "text-slate-500 whitespace-nowrap hover:text-navy transition-colors"}>{i.name}</Link>
                ))}
                <button onClick={handleLogout} className="text-red-500 ml-2 hover:bg-red-50 p-2 rounded-lg transition-colors"><LogOut className="w-4 h-4" /></button>
            </nav>
        </div>
    )
}
