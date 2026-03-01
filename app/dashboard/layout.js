'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard, Wallet, Users, LogOut, Loader2,
    UserCircle, Menu, X, ShieldCheck, Landmark, Headphones, TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import useSWR from 'swr';

const NAV_ITEMS = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Invest', href: '/dashboard/invest', icon: TrendingUp },
    { name: 'Deposits', href: '/dashboard/deposit', icon: Wallet },
    { name: 'Referrals', href: '/dashboard/referrals', icon: Users },
    { name: 'Bank Accounts', href: '/dashboard/bank', icon: Landmark },
    { name: 'Support', href: '/dashboard/tickets', icon: Headphones },
    { name: 'Profile', href: '/dashboard/profile', icon: UserCircle },
    { name: 'Nominee', href: '/dashboard/nominee', icon: Users },
    { name: 'Security', href: '/dashboard/security', icon: ShieldCheck },
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
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-white text-navy flex flex-col md:flex-row font-sans">

            {/* ── Desktop Sidebar ─────────────────────────────────────────── */}
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

            {/* ── Main content ─────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto w-full relative min-h-screen bg-white">
                <main className="p-4 md:p-8 max-w-6xl mx-auto relative z-10 w-full">

                    {/* ── Mobile Floating Navbar (homepage style) ─────────── */}
                    <div className="md:hidden mb-8">
                        {/* Pill topbar */}
                        <div className="fixed top-6 left-4 right-4 z-50">
                            <header className="w-full bg-white/60 backdrop-blur-xl backdrop-saturate-150 border border-white/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] rounded-full px-5 flex items-center justify-between h-14">
                                {/* Logo */}
                                <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
                                    <div className="w-6 h-6 rounded-md bg-navy flex items-center justify-center">
                                        <span className="text-neon font-black text-xs">H</span>
                                    </div>
                                    <span className="font-black text-navy text-base tracking-tight">HashPrime</span>
                                </Link>

                                {/* Current page label */}
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    {NAV_ITEMS.find(i => i.href === pathname)?.name || 'Dashboard'}
                                </span>

                                {/* Menu toggle */}
                                <button
                                    onClick={() => setMobileOpen(true)}
                                    className="p-2 text-navy rounded-full hover:bg-slate-100 transition-colors"
                                >
                                    <Menu className="w-5 h-5" />
                                </button>
                            </header>
                        </div>

                        {/* Spacer so content isn't hidden under the pill */}
                        <div className="h-20" />
                    </div>

                    {/* Page content */}
                    {children}
                </main>
            </div>

            {/* ── Mobile Offcanvas (matches homepage style) ───────────────── */}
            <div
                className={`fixed inset-0 bg-white z-[60] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col md:hidden ${mobileOpen ? 'translate-y-0' : '-translate-y-full'}`}
            >
                {/* Offcanvas header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-navy flex items-center justify-center">
                            <span className="text-neon font-black text-xs">H</span>
                        </div>
                        <span className="font-black text-navy text-lg tracking-tight">HashPrime</span>
                    </div>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="p-2 text-slate-500 hover:text-navy transition-colors bg-slate-50 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav links — big, like homepage offcanvas */}
                <div className="flex-grow overflow-y-auto px-8 py-10 space-y-2">
                    {NAV_ITEMS.map(({ name, href, icon: Icon }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMobileOpen(false)}
                                className={`offcanvas-link flex items-center gap-4 text-2xl font-black border-b pb-5 pt-3 transition-colors duration-200 ${isActive
                                        ? 'text-neon border-neon/20'
                                        : 'text-navy border-slate-100 hover:text-neon'
                                    }`}
                            >
                                <Icon className={`w-6 h-6 shrink-0 ${isActive ? 'text-neon' : 'text-slate-400'}`} />
                                {name}
                                {isActive && (
                                    <span className="ml-auto text-xs font-black bg-neon/10 text-neon px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Logout at bottom */}
                <div className="px-8 pb-10 pt-4 border-t border-slate-100">
                    <button
                        onClick={() => { setMobileOpen(false); handleLogout(); }}
                        disabled={loggingOut}
                        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-lg font-bold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition-all"
                    >
                        {loggingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
