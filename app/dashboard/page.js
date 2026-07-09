'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { DollarSign, Clock, ArrowUpRight, Copy, CheckCircle2, Wallet, IndianRupee, Coins, ShieldCheck, Fingerprint, Landmark, AlertCircle, PiggyBank, Users, X, ArrowRight, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function DashboardOverview() {
    const { data, error, isLoading } = useSWR('/api/dashboard/stats', fetcher);
    const { data: depositsData } = useSWR('/api/deposits', fetcher);
    const { data: rateData } = useSWR('/api/exchange-rate', fetcher);
    const [copied, setCopied] = useState(false);
    const [isProfileDismissed, setIsProfileDismissed] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsProfileDismissed(localStorage.getItem('dismiss_profile_complete') === 'true');
        }
    }, []);

    if (isLoading) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-[#121212]/10 rounded w-3/4"></div><div className="space-y-2"><div className="h-4 bg-[#121212]/10 rounded"></div><div className="h-4 bg-[#121212]/10 rounded w-5/6"></div></div></div></div>;
    if (error || !data) return <div className="text-red-500">Failed to load dashboard</div>;
    if (data.error) return <div className="text-red-500">{data.error}</div>;

    const { user, investments = [], transactions = [], bankAccounts = [], referralCount = 0, referralCommissionEarnedInr = 0, referralCommissionEarnedUsd = 0 } = data;

    // Live exchange rate (INR per USDT), fallback to 85
    const usdtToInr = rateData?.rate || 85;

    const isKycComplete = user.kycStatus === 'approved';
    const is2FaComplete = user.isTwoFactorEnabled;
    const isBankComplete = bankAccounts.length > 0;
    const isProfileFullyComplete = isKycComplete && is2FaComplete && isBankComplete;

    const completionItems = [
        { title: 'Identity Verification (KYC)', check: isKycComplete, icon: ShieldCheck, link: '/dashboard/profile' },
        { title: '2FA Authenticator', check: is2FaComplete, icon: Fingerprint, link: '/dashboard/security' },
        { title: 'Link Bank Account', check: isBankComplete, icon: Landmark, link: '/dashboard/bank' }
    ];

    const totalInvestedUSD = investments.filter(i => i.currency === 'USD' && i.status === 'active').reduce((acc, inv) => acc + inv.amount, 0);
    const totalInvestedINR = investments.filter(i => i.currency === 'INR' && i.status === 'active').reduce((acc, inv) => acc + inv.amount, 0);

    const SCHEME_RATES = {
        '3m_inr': 0.18,
        '6m_inr': 0.38,
        '1y_inr': 0.80,
        '5y_inr': 5.00,
        'limited_inr': 0.24,
        '3m_usd': 0.18,
        '6m_usd': 0.38,
        '1y_usd': 0.80,
        '5y_usd': 5.00,
    };

    const SCHEME_NAMES = {
        '3m_inr': '3-Month INR FD',
        '6m_inr': '6-Month INR FD',
        '1y_inr': '1-Year INR FD',
        '5y_inr': '5-Year INR FD',
        'limited_inr': 'Limited Offer INR',
        '3m_usd': '3-Month USD FD',
        '6m_usd': '6-Month USD FD',
        '1y_usd': '1-Year USD FD',
        '5y_usd': '5-Year USD FD',
    };

    const getInrYield = (inv) => {
        if (inv.inrReward !== undefined && inv.inrReward !== null) return inv.inrReward;
        return Math.round(inv.amount * (SCHEME_RATES[inv.schemeType] || 0));
    };

    const expectedUSD = investments.filter(i => i.currency === 'USD' && i.status === 'active')
        .reduce((acc, inv) => acc + (inv.usdtReward || 0), 0);
    const expectedINR = investments.filter(i => i.currency === 'INR' && i.status === 'active')
        .reduce((acc, inv) => acc + getInrYield(inv), 0);

    const usdWallet = user.usdWallet || 0;
    const inrWallet = user.inrWallet || 0;
    const refWallet = user.referralWallet || 0;

    const totalPortfolioValueINR = inrWallet + (usdWallet * usdtToInr) + totalInvestedINR + (totalInvestedUSD * usdtToInr);

    const copyRefLink = () => {
        let origin = '';
        if (typeof window !== 'undefined') origin = window.location.origin;
        navigator.clipboard.writeText(`${origin}/register?ref=${user.email}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const recentDeposits = depositsData?.deposits?.slice(0, 5) || [];

    
    const formatTxAmount = (tx) => {
        if (tx.currency === 'USDT' || tx.currency === 'USDC') {
            const inr = tx.amount * usdtToInr;
            return `₹${inr.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
        }
        return `₹${tx.amount.toLocaleString('en-IN')}`;
    };

    const recentActivities = [
        ...investments.map(inv => ({
            _id: inv._id,
            date: new Date(inv.createdAt),
            type: 'Investment',
            amount: inv.amount,
            currency: inv.currency,
            status: inv.status === 'pending' ? 'Processing' : (inv.status === 'active' ? 'Active' : 'Completed'),
            rawType: 'investment'
        })),
        ...(depositsData?.deposits || []).map(dep => ({
            _id: dep._id,
            date: new Date(dep.createdAt),
            type: 'Deposit',
            amount: dep.amount,
            currency: dep.paymentMethod === 'usdt' ? 'USDT' : 'INR',
            status: dep.status === 'pending' ? 'Processing' : 'Completed',
            rawType: 'deposit'
        }))
    ].sort((a, b) => b.date - a.date).slice(0, 5);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <span className="text-xl font-medium text-slate-400">Welcome,</span>
                <h1 className="text-4xl md:text-5xl font-serif text-[#d4af35] font-semibold mt-1 tracking-wide">{user.name}</h1>
                <p className="text-slate-500 text-sm font-medium mt-1">Here&apos;s an overview of your wealth generation.</p>
            </div>

            {/* Profile Warning */}
            {!isProfileFullyComplete && !isProfileDismissed && (
                <div className="bg-[#0A0A0A] border border-[#d4af35]/30 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                    <button
                        onClick={() => {
                            localStorage.setItem('dismiss_profile_complete', 'true');
                            setIsProfileDismissed(true);
                        }}
                        className="absolute top-4 right-4 text-white/40 hover:text-white p-1 rounded-lg bg-white/5 transition-all z-20"
                        title="Dismiss notice"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af35]/5 rounded-full blur-2xl flex items-center justify-center -mr-10 -mt-10 pointer-events-none" />
                    <div className="flex items-start gap-4 z-10 relative">
                        <div className="pt-1">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-bold text-white mb-1">Complete Your Profile.</h2>
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                Essential security and verification steps are missing. Completing these unlocks full access to deposits, investments, and fast withdrawals.
                            </p>
                            <div className="flex flex-wrap gap-2.5">
                                {completionItems.map((item, idx) => (
                                    <Link
                                        key={idx}
                                        href={item.link}
                                        className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-all ${item.check
                                            ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-500 opacity-60'
                                            : 'border-[#d4af35]/40 bg-transparent text-[#d4af35] hover:bg-[#d4af35]/10'
                                        }`}
                                    >
                                        {item.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* main overview grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Column 1: Wallets */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    {/* USDT WALLET */}
                    <div className="bg-[#0A0A0A] border border-[#d4af35]/30 p-5 rounded-2xl relative overflow-hidden group">
                        <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-2">USDT WALLET</div>
                        <div className="text-3xl font-black text-white mb-1">${usdWallet.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                        <p className="text-xs text-slate-500 font-medium">Available Capital</p>
                    </div>

                    {/* INR WALLET */}
                    <div className="bg-[#0A0A0A] border border-[#d4af35]/30 p-5 rounded-2xl relative overflow-hidden group">
                        <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-2">INR WALLET</div>
                        <div className="text-3xl font-black text-white mb-1">₹{inrWallet.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                        <p className="text-xs text-slate-500 font-medium">Available Capital</p>
                    </div>
                </div>

                {/* Column 2: Active Investments (Wide Table Card) */}
                <div className="lg:col-span-2 bg-[#0A0A0A] border border-[#d4af35]/30 p-5 rounded-2xl flex flex-col">
                    <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-4">ACTIVE INVESTMENTS</div>
                    <div className="flex-grow overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#d4af35] text-[#0A0A0A] text-[10px] font-black uppercase tracking-wider">
                                    <th className="px-4 py-2.5 rounded-l-lg">Scheme</th>
                                    <th className="px-4 py-2.5">Amount</th>
                                    <th className="px-4 py-2.5">Status</th>
                                    <th className="px-4 py-2.5 rounded-r-lg">Returns</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs">
                                {investments.filter(i => i.status === 'active').length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-slate-500 font-medium">No active investments yet.</td>
                                    </tr>
                                ) : (
                                    investments.filter(i => i.status === 'active').map((inv, idx) => {
                                        const yieldVal = inv.currency === 'USD' ? (inv.usdtReward || 0) : getInrYield(inv);
                                        const displayYield = inv.currency === 'USD' ? `$${yieldVal.toLocaleString('en-US')}` : `₹${yieldVal.toLocaleString('en-IN')}`;
                                        return (
                                            <tr key={inv._id || idx} className="hover:bg-[#d4af35]/5 transition-colors">
                                                <td className="px-4 py-3 font-bold text-white uppercase tracking-wider text-[10px]">{SCHEME_NAMES[inv.schemeType] || inv.schemeType}</td>
                                                <td className="px-4 py-3 text-slate-300 font-semibold">{inv.currency === 'USD' ? '$' : '₹'}{inv.amount.toLocaleString(inv.currency === 'USD' ? 'en-US' : 'en-IN')}</td>
                                                <td className="px-4 py-3"><span className="text-emerald-500 font-bold uppercase text-[9px] tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Active</span></td>
                                                <td className="px-4 py-3 text-emerald-500 font-extrabold font-mono">+{displayYield} ↑</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Column 3: Expected Returns & Referral Stats */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    {/* EXPECTED RETURNS */}
                    <Link href="/dashboard/statements" className="bg-[#0A0A0A] border border-[#d4af35]/30 p-5 rounded-2xl block relative overflow-hidden group hover:border-[#d4af35]/60 transition-colors">
                        <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-2">EXPECTED RETURNS</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TOTAL</div>
                        <div className="flex justify-between items-end mt-1">
                            <div className="text-3xl font-black text-white leading-none">
                                ₹{(expectedINR + (expectedUSD * usdtToInr)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                            </div>
                            <ArrowRight className="w-5 h-5 text-[#d4af35] transition-transform group-hover:translate-x-1" />
                        </div>
                    </Link>

                    {/* REFERRAL STATS */}
                    <div className="bg-[#0A0A0A] border border-[#d4af35]/30 p-5 rounded-2xl">
                        <div className="text-[#d4af35] font-bold uppercase tracking-wider text-[10px] mb-3">REFERRAL STATS</div>
                        <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-medium">Invites:</span>
                                <span className="font-bold text-white">{referralCount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-medium">Earned (INR):</span>
                                <span className="font-bold text-[#d4af35]">₹{referralCommissionEarnedInr.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activities Section */}
            <div className="bg-[#0A0A0A] border border-[#d4af35]/30 p-5 rounded-2xl flex flex-col">
                <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-4">RECENT ACTIVITIES</div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#d4af35] text-[#0A0A0A] text-[10px] font-black uppercase tracking-wider">
                                <th className="px-4 py-2.5 rounded-l-lg">Date</th>
                                <th className="px-4 py-2.5">Type</th>
                                <th className="px-4 py-2.5">Amount</th>
                                <th className="px-4 py-2.5">Status</th>
                                <th className="px-4 py-2.5 rounded-r-lg text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-xs">
                            {recentActivities.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500 font-medium">No recent activities.</td>
                                </tr>
                            ) : (
                                recentActivities.map((act, idx) => (
                                    <tr key={act._id || idx} className="hover:bg-[#d4af35]/5 transition-colors">
                                        <td className="px-4 py-4 text-slate-400 font-bold whitespace-nowrap">
                                            {act.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-4 py-4 text-white font-bold whitespace-nowrap">{act.type}</td>
                                        <td className="px-4 py-4 text-slate-200 font-black text-sm whitespace-nowrap">
                                            {act.currency === 'USD' || act.currency === 'USDT' ? '$' : '₹'}{act.amount.toLocaleString(act.currency === 'USD' || act.currency === 'USDT' ? 'en-US' : 'en-IN')}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            {act.status === 'Completed' && (
                                                <span className="flex items-center gap-1.5 text-emerald-500 font-bold">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Completed
                                                </span>
                                            )}
                                            {act.status === 'Active' && (
                                                <span className="flex items-center gap-1.5 text-emerald-500 font-bold">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Completed
                                                </span>
                                            )}
                                            {act.status === 'Processing' && (
                                                <span className="flex items-center gap-1.5 text-amber-500 font-bold">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Processing
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-right whitespace-nowrap text-slate-500 space-x-2">
                                            <button className="hover:text-white transition-colors" title="View details">
                                                {act.status === 'Processing' ? <Clock className="w-4 h-4 inline" /> : <Edit2 className="w-4 h-4 inline" />}
                                            </button>
                                            <button className="hover:text-red-500 transition-colors" title="Cancel/Delete">
                                                <Trash2 className="w-4 h-4 inline" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
