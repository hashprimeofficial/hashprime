'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard, Users, Wallet, LogOut, Loader2,
    Menu, X, ShieldCheck, Ticket, TrendingUp, ChevronRight, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((r) => r.json());

// ── Nav items (icon + route only) ───────────────────────────────────
const NAV_ITEMS = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Investments', href: '/admin/investments', icon: TrendingUp },
    { name: 'Deposits', href: '/admin/deposits', icon: Wallet },
    { name: 'Withdrawals', href: '/admin/withdrawals', icon: ArrowUpRight },
    { name: 'KYC Approvals', href: '/admin/kyc', icon: ShieldCheck },
    { name: 'Support', href: '/admin/tickets', icon: Ticket },
];

// ── Notification badge fetcher — polls every 15 s ──────────────────
function useAdminBadges() {
    const [badges, setBadges] = useState({
        '/admin/deposits': 0,
        '/admin/kyc': 0,
        '/admin/tickets': 0,
        '/admin/investments': 0,
        '/admin/withdrawals': 0,
    });

    useEffect(() => {
        const load = async () => {
            try {
                const [deposits, kyc, tickets, investments, withdrawals] = await Promise.all([
                    fetch('/api/admin/deposits').then(r => r.json()).catch(() => ({})),
                    fetch('/api/kyc').then(r => r.json()).catch(() => ({})),
                    fetch('/api/tickets').then(r => r.json()).catch(() => ({})),
                    fetch('/api/admin/investments').then(r => r.json()).catch(() => ({})),
                    fetch('/api/admin/withdrawals').then(r => r.json()).catch(() => ({})),
                ]);
                setBadges({
                    '/admin/deposits': (deposits.deposits || []).filter(d => d.status === 'pending').length,
                    '/admin/kyc': (kyc.users || []).length,
                    '/admin/tickets': (tickets.tickets || []).filter(t => t.status === 'open').length,
                    '/admin/investments': (investments.investments || []).filter(i => i.status === 'pending').length,
                    '/admin/withdrawals': (withdrawals.withdrawals || []).filter(w => w.status === 'pending').length,
                });
            } catch { /* silently fail */ }
        };

        load();
        const id = setInterval(load, 15_000);
        return () => clearInterval(id);
    }, []);

    return badges;
}

// ── Admin avatar ───────────────────────────────────────────────────
function AdminAvatarBlock() {
    const { data } = useSWR('/api/auth/me', fetcher);
    const user = data?.user;
    if (!user) return (
        <div className="flex items-center gap-3 mb-4 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-[#d4af35]/10 shrink-0 border border-[#d4af35]/20" />
            <div className="space-y-1.5 flex-1">
                <div className="h-3.5 bg-[#d4af35]/10 rounded w-3/4" />
                <div className="h-3 bg-[#d4af35]/5 rounded w-1/2" />
            </div>
        </div>
    );
    return (
        <div className="flex items-center gap-3 bg-[#d4af35]/5 border border-[#d4af35]/20 rounded-2xl px-4 py-3 mb-6 hover:border-[#d4af35]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af35]/30 to-[#d4af35]/5 flex items-center justify-center text-[#d4af35] font-black text-base shrink-0 border border-[#d4af35]/30">
                {user.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
                <div className="text-white font-bold text-sm truncate">{user.name}</div>
                <div className="text-[#d4af35]/50 text-[11px] font-medium uppercase tracking-wider">Administrator</div>
            </div>
        </div>
    );
}

// ── Sidebar NavLink ────────────────────────────────────────────────
function NavLink({ item, pathname, badges, onClick }) {
    const isActive = pathname === item.href;
    const Icon = item.icon;
    const count = badges[item.href] || 0;

    return (
        <Link
            href={item.href}
            onClick={onClick}
            className={`group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 relative overflow-hidden ${isActive
                ? 'bg-gradient-to-r from-[#d4af35]/15 to-[#d4af35]/5 text-[#d4af35] font-bold border border-[#d4af35]/25 shadow-[0_0_20px_rgba(212,175,53,0.08)]'
                : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
        >
            {isActive && (
                <motion.div
                    layoutId="admin-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#d4af35] rounded-full shadow-[0_0_8px_rgba(212,175,53,0.8)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
            )}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${isActive
                ? 'bg-[#d4af35]/15 border border-[#d4af35]/30'
                : 'bg-white/5 border border-white/5 group-hover:border-white/15'
                }`}>
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#d4af35]' : 'text-white/40 group-hover:text-white/80'}`} />
            </div>
            <span className="text-sm flex-1">{item.name}</span>
            {count > 0 && (
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="min-w-[20px] h-5 bg-[#d4af35] text-black text-[10px] font-black rounded-full flex items-center justify-center px-1.5 shadow-[0_0_8px_rgba(212,175,53,0.5)]"
                >
                    {count > 99 ? '99+' : count}
                </motion.span>
            )}
            {!count && isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-[#d4af35]/50" />
            )}
        </Link>
    );
}

// ── Main layout ────────────────────────────────────────────────────
export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const badges = useAdminBadges();

    const handleLogout = async () => {
        setLoggingOut(true);
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    const currentPage = NAV_ITEMS.find(i => i.href === pathname)?.name || 'Admin';

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col md:flex-row font-sans">

            {/* ── Desktop Sidebar ──────────────────────────────────── */}
            <div className="w-64 border-r border-[#d4af35]/10 bg-[#080808] flex-col justify-between hidden md:flex h-screen sticky top-0 overflow-hidden">
                {/* Ambient top glow */}
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#d4af35]/8 to-transparent pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#d4af35]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full p-5">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-8 px-1">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#d4af35] to-[#b8942a] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,53,0.3)]">
                            <span className="text-black font-black text-xs">HP</span>
                        </div>
                        <div>
                            <div className="text-white font-black text-[15px] tracking-tight leading-none">HashPrime</div>
                            <div className="text-[#d4af35]/50 text-[10px] font-bold uppercase tracking-widest mt-0.5">Admin Console</div>
                        </div>
                    </div>

                    <AdminAvatarBlock />

                    <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] px-1 mb-3">Navigation</div>

                    {/* Nav */}
                    <nav className="space-y-1 flex-1 overflow-y-auto scrollbar-thin">
                        {NAV_ITEMS.map(item => (
                            <NavLink key={item.href} item={item} pathname={pathname} badges={badges} />
                        ))}
                    </nav>

                    {/* Sign out */}
                    <div className="border-t border-white/5 pt-4 mt-4">
                        <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400/70 hover:text-red-300 hover:bg-red-500/8 border border-transparent hover:border-red-500/15 transition-all font-medium text-sm"
                        >
                            {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Main content ─────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto w-full relative min-h-screen bg-[#0A0A0A]">
                <main className="p-4 md:p-8 max-w-7xl mx-auto relative z-10 w-full">

                    {/* Mobile pill navbar */}
                    <div className="md:hidden mb-8">
                        <div className="fixed top-4 left-3 right-3 z-50">
                            <header className="w-full bg-[#080808]/90 backdrop-blur-xl border border-[#d4af35]/20 rounded-2xl px-4 flex items-center justify-between h-13 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
                                <Link href="/admin" className="flex items-center gap-2 shrink-0">
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#d4af35] to-[#b8942a] flex items-center justify-center shadow-[0_0_10px_rgba(212,175,53,0.3)]">
                                        <span className="text-black font-black text-[10px]">HP</span>
                                    </div>
                                    <span className="font-black text-white text-sm tracking-tight">Admin</span>
                                </Link>
                                <span className="text-[10px] font-black text-[#d4af35]/50 uppercase tracking-widest hidden sm:block">{currentPage}</span>
                                <div className="flex items-center gap-2">
                                    {/* Total badge on mobile */}
                                    {Object.values(badges).reduce((a, b) => a + b, 0) > 0 && (
                                        <span className="w-5 h-5 bg-[#d4af35] text-black text-[10px] font-black rounded-full flex items-center justify-center">
                                            {Math.min(Object.values(badges).reduce((a, b) => a + b, 0), 99)}
                                        </span>
                                    )}
                                    <button
                                        onClick={() => setMobileOpen(true)}
                                        className="p-2 text-[#d4af35] rounded-xl hover:bg-[#d4af35]/10 transition-colors"
                                    >
                                        <Menu className="w-5 h-5" />
                                    </button>
                                </div>
                            </header>
                        </div>
                        <div className="h-20" />
                    </div>

                    {children}
                </main>
            </div>

            {/* ── Mobile offcanvas ──────────────────────────────────── */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[59] md:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                            className="fixed left-0 top-0 h-full w-72 bg-[#080808] z-[60] flex flex-col shadow-2xl border-r border-[#d4af35]/15 md:hidden overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#d4af35]/8 to-transparent pointer-events-none" />
                            <div className="flex justify-between items-center px-5 py-4 border-b border-[#d4af35]/10 relative z-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#d4af35] to-[#b8942a] flex items-center justify-center">
                                        <span className="text-black font-black text-[10px]">HP</span>
                                    </div>
                                    <span className="font-black text-white text-sm tracking-tight">Admin Console</span>
                                </div>
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="p-1.5 text-[#d4af35]/50 hover:text-[#d4af35] transition-colors bg-[#d4af35]/5 rounded-xl border border-[#d4af35]/15"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex-grow overflow-y-auto px-4 py-5 space-y-1 relative z-10">
                                {NAV_ITEMS.map(item => (
                                    <NavLink key={item.href} item={item} pathname={pathname} badges={badges} onClick={() => setMobileOpen(false)} />
                                ))}
                            </div>

                            <div className="px-4 pb-6 pt-3 border-t border-[#d4af35]/10 relative z-10">
                                <button
                                    onClick={() => { setMobileOpen(false); handleLogout(); }}
                                    disabled={loggingOut}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-red-400 bg-red-500/8 border border-red-500/15 hover:bg-red-500/15 transition-all"
                                >
                                    {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                                    Sign Out
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
