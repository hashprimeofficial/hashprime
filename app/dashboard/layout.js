'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Wallet, Users, LogOut, Loader2, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import useSWR from 'swr';

const NAV_ITEMS = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Invest', href: '/dashboard/invest', icon: Wallet },
    { name: 'Referrals', href: '/dashboard/referrals', icon: Users },
    { name: 'Profile', href: '/dashboard/profile', icon: UserCircle },
];

const fetcher = (url) => fetch(url).then((r) => r.json());

function UserAvatarBlock() {
    const { data } = useSWR('/api/auth/me', fetcher);
    const user = data?.user;
    if (!user) return (
        <div className="flex items-center gap-3 px-1 mb-2 animate-pulse">
            <div className="w-9 h-9 rounded-xl bg-slate-200 shrink-0" />
            <div className="space-y-1.5 flex-1">
                <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
        </div>
    );
    return (
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-3 py-2.5 shadow-sm mb-2">
            <div className="w-9 h-9 rounded-xl bg-navy flex items-center justify-center text-neon font-black text-sm shrink-0 shadow-inner">
                {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
                <div className="text-navy font-bold text-sm truncate">{user.name}</div>
                <div className="text-slate-400 text-xs font-medium truncate capitalize">{user.role}</div>
            </div>
        </div>
    );
}

export default function DashboardLayout({ children }) {
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
                    <div className="text-xl font-black text-navy tracking-tight mb-5">HashPrime</div>
                    <UserAvatarBlock />
                    <nav className="space-y-1 relative mt-4">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative z-10 ${isActive ? 'bg-neon/10 text-navy font-bold' : 'text-slate-500 font-medium hover:text-navy hover:bg-slate-200/50'}`}
                                >
                                    <Icon className="w-5 h-5 shrink-0" />
                                    <span>{item.name}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebar-active"
                                            className="absolute left-0 w-1 h-8 bg-neon rounded-r-full"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all font-medium mt-auto"
                >
                    {loggingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
                    <span>Sign Out</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto w-full relative min-h-screen bg-white">
                <main className="p-4 md:p-8 max-w-6xl mx-auto relative z-10 w-full">
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
            <div className="text-xl font-black text-navy">HashPrime</div>
            <nav className="flex items-center gap-4 text-sm font-medium overflow-x-auto no-scrollbar">
                {NAV_ITEMS.map(i => (
                    <Link key={i.href} href={i.href} className={pathname === i.href ? "text-navy font-bold pb-1 border-b-2 border-neon whitespace-nowrap shrink-0" : "text-slate-500 whitespace-nowrap hover:text-navy transition-colors shrink-0"}>{i.name}</Link>
                ))}
                <button onClick={handleLogout} className="text-red-500 ml-2 hover:bg-red-50 p-2 rounded-lg transition-colors shrink-0"><LogOut className="w-5 h-5" /></button>
            </nav>
        </div>
    )
}
