'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
    LayoutDashboard, Wallet, Users, LogOut, Loader2,
    Settings2, Menu, X, Headphones, TrendingUp, RefreshCw, ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import useSWR from 'swr';

const NAV_ITEMS = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Invest', href: '/dashboard/invest', icon: TrendingUp },
    { name: 'Deposits', href: '/dashboard/deposit', icon: Wallet },
    { name: 'Withdraw', href: '/dashboard/withdraw', icon: ArrowUpRight },
    { name: 'Conversion', href: '/dashboard/convert', icon: RefreshCw },
    { name: 'Referrals', href: '/dashboard/referrals', icon: Users },
    { name: 'Support', href: '/dashboard/tickets', icon: Headphones },
    { name: 'Nominee', href: '/dashboard/nominee', icon: Users },
    { name: 'Settings', href: '/dashboard/profile', icon: Settings2 },
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
        <div className="flex items-center gap-3 bg-[#0A0A0A] border border-[#d4af35]/20 rounded-xl px-3 py-2.5 shadow-sm mb-2 hover:border-[#d4af35]/40 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-[#d4af35]/10 flex items-center justify-center text-[#d4af35] font-black text-sm shrink-0 shadow-inner border border-[#d4af35]/20">
                {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
                <div className="text-white font-bold text-sm truncate">{user.name}</div>
                <div className="text-[#d4af35] text-xs font-medium truncate capitalize">{user.role}</div>
            </div>
        </div>
    );
}

function SettingsSubmenu() {
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab') || 'profile';

    return (
        <div className="ml-11 mt-1 space-y-1">
            {[
                { id: 'profile', name: 'Personal Information' },
                { id: 'kyc', name: 'KYC Verification' },
                { id: 'bank', name: 'Bank Accounts' },
                { id: 'security', name: 'Security' },
            ].map(sub => {
                const subIsActive = currentTab === sub.id;
                return (
                    <Link
                        key={sub.id}
                        href={`/dashboard/profile?tab=${sub.id}`}
                        className={`block px-3 py-2 text-sm rounded-lg transition-colors ${subIsActive ? 'text-[#d4af35] font-bold bg-[#d4af35]/10 border border-[#d4af35]/20' : 'text-slate-400 hover:text-[#d4af35] hover:bg-[#d4af35]/5'}`}
                    >
                        {sub.name}
                    </Link>
                );
            })}
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
        <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col md:flex-row font-sans">

            {/* ── Desktop Sidebar ─────────────────────────────────────────── */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#d4af35]/20 bg-[#0A0A0A] p-6 flex-col justify-between hidden md:flex h-screen sticky top-0 relative overflow-y-auto overflow-x-hidden custom-scrollbar pb-10">
                {/* Background glow effect */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#d4af35]/10 to-transparent pointer-events-none" />

                <div className="relative z-10">
                    <Link href="/" className="block mb-8 mt-2">
                        <Image src="/textonly.png" alt="HashPrime" width={140} height={32} className="w-auto h-6 object-contain" />
                    </Link>
                    <UserAvatarBlock />
                    <nav className="space-y-1.5 relative mt-6">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            if (item.name === 'Settings') {
                                return (
                                    <div key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative z-10 ${isActive ? 'bg-[#d4af35]/10 text-[#d4af35] font-bold border border-[#d4af35]/20 shadow-[0_0_15px_rgba(212,175,53,0.1)]' : 'text-slate-400 font-medium hover:text-[#d4af35] hover:bg-[#d4af35]/5'}`}
                                        >
                                            <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#d4af35]' : 'text-slate-500'}`} />
                                            <span>{item.name}</span>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="sidebar-active"
                                                    className="absolute left-0 w-1 h-8 bg-[#d4af35] rounded-r-full shadow-[0_0_10px_rgba(212,175,53,0.8)]"
                                                />
                                            )}
                                        </Link>
                                        {isActive && (
                                            <Suspense fallback={<div className="ml-11 mt-1 text-slate-500 text-sm">Loading...</div>}>
                                                <SettingsSubmenu />
                                            </Suspense>
                                        )}
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative z-10 ${isActive ? 'bg-[#d4af35]/10 text-[#d4af35] font-bold border border-[#d4af35]/20 shadow-[0_0_15px_rgba(212,175,53,0.1)]' : 'text-slate-400 font-medium hover:text-[#d4af35] hover:bg-[#d4af35]/5'}`}
                                >
                                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#d4af35]' : 'text-slate-500'}`} />
                                    <span>{item.name}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebar-active"
                                            className="absolute left-0 w-1 h-8 bg-[#d4af35] rounded-r-full shadow-[0_0_10px_rgba(212,175,53,0.8)]"
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
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all font-medium mt-auto relative z-10"
                >
                    {loggingOut ? <Loader2 className="w-5 h-5 animate-spin text-[#d4af35]" /> : <LogOut className="w-5 h-5" />}
                    <span>Sign Out</span>
                </button>
            </div>

            {/* ── Main content ─────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto custom-scrollbar w-full relative min-h-screen bg-[#0A0A0A]">
                {/* Subtle global gradient background to match homepage */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#d4af35]/5 via-[#0A0A0A] to-[#0A0A0A] pointer-events-none" />

                <main className="p-4 md:p-8 max-w-6xl mx-auto relative z-10 w-full min-h-screen">

                    {/* ── Mobile Floating Navbar (homepage style) ─────────── */}
                    <div className="md:hidden mb-8">
                        {/* Pill topbar */}
                        <div className="fixed top-6 left-4 right-4 z-50">
                            <header className="w-full bg-[#0A0A0A]/80 backdrop-blur-xl border border-[#d4af35]/20 shadow-[0_8px_32px_0_rgba(212,175,53,0.1)] rounded-full px-5 flex items-center justify-between h-14">
                                {/* Logo */}
                                <Link href="/dashboard" className="flex items-center pt-1 shrink-0">
                                    <Image src="/textonly.png" alt="HashPrime" width={110} height={24} className="h-5 w-auto object-contain" />
                                </Link>

                                {/* Menu toggle */}
                                <button
                                    onClick={() => setMobileOpen(true)}
                                    className="p-2 text-[#d4af35] rounded-full hover:bg-[#d4af35]/10 transition-colors"
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
                className={`fixed inset-0 bg-[#0A0A0A] z-[60] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col md:hidden ${mobileOpen ? 'translate-y-0' : '-translate-y-full'}`}
            >
                {/* Offcanvas header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-[#d4af35]/20">
                    <div className="flex items-center gap-2 pt-1">
                        <Image src="/textonly.png" alt="HashPrime" width={130} height={28} className="h-6 w-auto object-contain" />
                    </div>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="p-2 text-[#d4af35] hover:text-white transition-colors bg-[#d4af35]/10 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav links — big, like homepage offcanvas */}
                <div className="flex-grow overflow-y-auto custom-scrollbar px-8 py-10 space-y-2">
                    {NAV_ITEMS.map(({ name, href, icon: Icon }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMobileOpen(false)}
                                className={`offcanvas-link flex items-center gap-4 text-2xl font-black border-b pb-5 pt-3 transition-colors duration-200 ${isActive
                                    ? 'text-[#d4af35] border-[#d4af35]/30'
                                    : 'text-slate-300 border-white/5 hover:text-[#d4af35]'
                                    }`}
                            >
                                <Icon className={`w-6 h-6 shrink-0 ${isActive ? 'text-[#d4af35]' : 'text-slate-500'}`} />
                                {name}
                                {isActive && (
                                    <span className="ml-auto text-xs font-black bg-[#d4af35]/10 border border-[#d4af35]/20 text-[#d4af35] px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Logout at bottom */}
                <div className="px-8 pb-10 pt-4 border-t border-[#d4af35]/20">
                    <button
                        onClick={() => { setMobileOpen(false); handleLogout(); }}
                        disabled={loggingOut}
                        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-lg font-bold text-red-500 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all"
                    >
                        {loggingOut ? <Loader2 className="w-5 h-5 animate-spin text-red-500" /> : <LogOut className="w-5 h-5" />}
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
