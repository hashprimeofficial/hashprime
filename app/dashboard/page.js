'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { DollarSign, Clock, ArrowUpRight, Copy, CheckCircle2, Wallet, IndianRupee, Coins, ShieldCheck, Fingerprint, Landmark, AlertCircle, PiggyBank, Users } from 'lucide-react';
import Link from 'next/link';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function DashboardOverview() {
    const { data, error, isLoading } = useSWR('/api/dashboard/stats', fetcher);
    const { data: depositsData } = useSWR('/api/deposits', fetcher);
    const { data: rateData } = useSWR('/api/exchange-rate', fetcher);
    const [copied, setCopied] = useState(false);

    if (isLoading) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-[#121212]/10 rounded w-3/4"></div><div className="space-y-2"><div className="h-4 bg-[#121212]/10 rounded"></div><div className="h-4 bg-[#121212]/10 rounded w-5/6"></div></div></div></div>;
    if (error || !data) return <div className="text-red-500">Failed to load dashboard</div>;
    if (data.error) return <div className="text-red-500">{data.error}</div>;

    const { user, investments = [], transactions = [], bankAccounts = [] } = data;

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

    const totalInvestedUSD = investments.filter(i => i.currency === 'USD').reduce((acc, inv) => acc + inv.amount, 0);
    const totalInvestedINR = investments.filter(i => i.currency === 'INR').reduce((acc, inv) => acc + inv.amount, 0);

    const expectedUSD = investments.filter(i => i.currency === 'USD' && (i.status === 'active' || i.status === 'completed'))
        .reduce((acc, inv) => acc + (inv.usdtReward || 0), 0);
    const expectedINR = investments.filter(i => i.currency === 'INR' && (i.status === 'active' || i.status === 'completed'))
        .reduce((acc, inv) => acc + (inv.usdtReward || 0), 0);

    const usdWallet = user.usdWallet || 0;
    const inrWallet = user.inrWallet || 0;
    const refWallet = user.referralWallet || 0;

    const totalPortfolioValueINR = inrWallet + (usdWallet * usdtToInr) + totalInvestedINR + (totalInvestedUSD * usdtToInr);

    const copyRefLink = () => {
        let origin = '';
        if (typeof window !== 'undefined') origin = window.location.origin;
        navigator.clipboard.writeText(`${origin}/register?ref=${user.referralCode || user._id}`);
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

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome, {user.name}</h1>
                <p className="text-slate-500 font-medium">Here's an overview of your wealth generation.</p>
            </div>

            {!isProfileFullyComplete && (
                <div className="bg-[#0A0A0A] border border-amber-500/30 rounded-2xl p-6 shadow-lg overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl flex items-center justify-center -mr-10 -mt-10 pointer-events-none" />
                    <div className="flex items-start gap-4 z-10 relative">
                        <div className="pt-1">
                            <AlertCircle className="w-8 h-8 text-amber-500" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-black text-white mb-2 tracking-tight">Complete Your Profile</h2>
                            <p className="text-sm font-medium text-amber-500/70 mb-5">
                                Essential security and verification steps are missing. Completing these unlocks full access to deposits, investments, and fast withdrawals.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {completionItems.map((item, idx) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link href={item.link} key={idx} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${item.check ? 'bg-[#121212]/50 border-[#32e512]/20 opacity-60' : 'bg-[#121212] border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/5 cursor-pointer shadow-inner'}`}>
                                            <div className={`p-2 rounded-lg ${item.check ? 'bg-[#32e512]/10 text-[#32e512]' : 'bg-[#d4af35]/10 text-[#d4af35]'}`}>
                                                {item.check ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                            </div>
                                            <span className={`text-sm font-bold tracking-wide ${item.check ? 'text-slate-500 line-through decoration-slate-600' : 'text-white'}`}>{item.title}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Wallets & Portfolio */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-[#0A0A0A] border border-[#d4af35]/30 hover:border-[#d4af35]/60 transition-colors p-5 rounded-2xl shadow-[0_4px_20px_rgba(212,175,53,0.05)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#d4af35]/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
                    <div className="flex items-center gap-2 mb-3 text-[#d4af35]"><Wallet className="w-5 h-5 text-[#d4af35]" /> <h3 className="font-bold text-sm tracking-wide uppercase">USD Wallet</h3></div>
                    <div className="text-4xl font-black text-white mb-1 leading-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">${usdWallet.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    <p className="text-xs text-[#d4af35]/60 font-medium mt-1">Available Capital</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="bg-[#0A0A0A] border border-[#d4af35]/20 hover:border-[#d4af35]/50 transition-colors p-5 rounded-2xl shadow-[0_4px_20px_rgba(212,175,53,0.05)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#d4af35]/5 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
                    <div className="flex items-center gap-2 mb-3 text-white"><IndianRupee className="w-5 h-5 text-amber-500" /> <h3 className="font-bold text-sm tracking-wide uppercase text-amber-500/80">INR Wallet</h3></div>
                    <div className="text-4xl font-black text-white mb-1 leading-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">₹{inrWallet.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    <p className="text-xs text-slate-400 font-medium mt-1">Available Capital</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }} className="bg-[#0A0A0A] border border-[#d4af35]/20 hover:border-[#d4af35]/50 transition-colors p-5 rounded-2xl shadow-[0_4px_20px_rgba(212,175,53,0.05)] relative overflow-hidden group">
                    <div className="flex items-center gap-2 mb-3 text-[#d4af35]"><Clock className="w-5 h-5 text-[#d4af35]" /> <h3 className="font-bold text-sm tracking-wide uppercase">Active Investments</h3></div>
                    <div className="flex flex-col gap-2 mt-4">
                        <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                            <span className="text-slate-400 font-medium">USDT Schemes:</span>
                            <span className="font-black text-white drop-shadow-[0_0_5px_rgba(212,175,53,0.3)]">${totalInvestedUSD.toLocaleString('en-US')}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm pt-1">
                            <span className="text-slate-400 font-medium">INR Schemes:</span>
                            <span className="font-black text-white">₹{totalInvestedINR.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }} className="bg-[#0A0A0A] border border-[#d4af35]/20 hover:border-[#d4af35]/50 transition-all duration-300 p-5 rounded-2xl shadow-[0_4px_20px_rgba(212,175,53,0.05)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#32e512]/5 rounded-full blur-2xl flex items-center justify-center -mr-8 -mt-8 pointer-events-none group-hover:bg-[#32e512]/10 transition-colors" />
                    <div className="flex items-center gap-2 mb-3 z-10 relative">
                        <div className="p-1.5 bg-[#32e512]/10 rounded-lg"><ArrowUpRight className="w-4 h-4 text-[#32e512]" /></div>
                        <h3 className="font-bold text-sm tracking-wide uppercase text-[#32e512]/90">Expected Returns</h3>
                    </div>
                    <div className="flex flex-col gap-2 mt-4 z-10 relative">
                        <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                            <span className="text-white/60 font-bold uppercase tracking-widest text-[10px]">USDT Yield</span>
                            <span className="font-black text-[#32e512] drop-shadow-[0_0_5px_rgba(50,229,18,0.3)] text-lg">+${expectedUSD.toLocaleString('en-US')}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm pt-1">
                            <span className="text-white/60 font-bold uppercase tracking-widest text-[10px]">INR Yield</span>
                            <span className="font-black text-[#32e512] drop-shadow-[0_0_5px_rgba(50,229,18,0.3)] text-lg">+₹{expectedINR.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {/* Recent Investments */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-black text-white">Recent Investments</h2>
                        <Link href="/dashboard/invest" className="text-sm font-bold text-white underline decoration-neon decoration-2 hover:text-white transition-colors">New Investment &rarr;</Link>
                    </div>
                    <div className="bg-[#0A0A0A] border border-[#d4af35]/20 rounded-2xl shadow-lg overflow-hidden">
                        {investments.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 font-medium border-t border-[#d4af35]/10">No active investments yet. Start generating wealth today.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[600px]">
                                    <thead className="bg-[#d4af35]/5 text-[#d4af35]/80 text-xs uppercase tracking-wider border-b border-[#d4af35]/20">
                                        <tr>
                                            <th className="px-6 py-4 font-black text-[#d4af35]">Scheme</th>
                                            <th className="px-6 py-4 font-black text-[#d4af35]">Amount</th>
                                            <th className="px-6 py-4 font-black text-[#d4af35]">Yield</th>
                                            <th className="px-6 py-4 font-black text-[#d4af35]">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {investments.slice(0, 5).map(inv => (
                                            <tr key={inv._id} className="hover:bg-[#d4af35]/5 transition-colors">
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <span className="bg-[#d4af35]/10 text-[#d4af35] border border-[#d4af35]/20 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-inner">{inv.schemeType} Plan</span>
                                                </td>
                                                <td className="px-6 py-5 font-black text-white text-lg drop-shadow-[0_0_5px_rgba(255,255,255,0.2)] whitespace-nowrap">
                                                    {inv.currency === 'USD' ? '$' : '₹'}{inv.amount.toLocaleString(inv.currency === 'USD' ? 'en-US' : 'en-IN')}
                                                </td>
                                                <td className="px-6 py-5 text-[#32e512] font-extrabold drop-shadow-[0_0_8px_rgba(50,229,18,0.2)] whitespace-nowrap">
                                                    +{inv.currency === 'USD' ? '$' : '₹'}{(inv.usdtReward || 0).toLocaleString(inv.currency === 'USD' ? 'en-US' : 'en-IN', { maximumFractionDigits: 0 })}
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    {inv.status === 'pending' && (
                                                        <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">
                                                            <Clock className="w-3.5 h-3.5" /> Requested
                                                        </span>
                                                    )}
                                                    {inv.status === 'active' && (
                                                        <span className="inline-flex items-center gap-1.5 bg-[#d4af35]/10 text-[#d4af35] border border-[#d4af35]/20 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">
                                                            <ShieldCheck className="w-3.5 h-3.5" /> Active
                                                        </span>
                                                    )}
                                                    {inv.status === 'completed' && (
                                                        <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-300 border border-slate-500/20 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">
                                                            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right column: Referral + Transactions + Deposits */}
                <div className="space-y-6">
                    {/* Referral Link Card */}
                    <div>
                        <h2 className="text-xl font-black text-white mb-4">Invite &amp; Earn 5% Instant</h2>
                        <div className="bg-gradient-to-br from-[#0A0A0A] to-[#121212] border border-[#d4af35]/40 p-6 rounded-2xl shadow-[0_8px_32px_rgba(212,175,53,0.1)] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af35]/10 blur-[40px] rounded-full group-hover:bg-[#d4af35]/20 transition-colors"></div>
                            <h3 className="text-lg font-bold text-white mb-2 relative z-10 flex items-center gap-2">
                                Your Referral Link <div className="p-1 bg-[#d4af35]/20 rounded"><Users className="w-4 h-4 text-[#d4af35]" /></div>
                            </h3>
                            <p className="text-sm text-white/60 mb-4 font-medium relative z-10">Earn 5% of capital invested by your referrals, paid into your Referral Wallet.</p>
                            <div className="mb-4 bg-[#0A0A0A]/50 p-4 rounded-xl border border-[#d4af35]/20 flex justify-between items-center relative z-10 shadow-inner">
                                <div>
                                    <p className="text-[10px] text-[#d4af35]/80 font-bold uppercase tracking-widest mb-1">Referral Balance</p>
                                    <p className="text-3xl font-black text-white drop-shadow-[0_0_5px_rgba(212,175,53,0.2)]">₹{refWallet.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                                </div>
                                <Link href="/dashboard/withdraw" className="bg-[#121212] border border-[#d4af35]/50 text-[#d4af35] text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-[#d4af35] hover:text-[#0A0A0A] transition-colors shadow-lg">
                                    Withdraw
                                </Link>
                            </div>
                            <div className="flex bg-[#0A0A0A] border border-[#d4af35]/30 rounded-lg overflow-hidden shadow-inner relative z-10 focus-within:border-[#d4af35] focus-within:ring-1 focus-within:ring-[#d4af35] transition-all">
                                <input readOnly value={typeof window !== 'undefined' ? `${window.location.origin}/register?ref=${user.referralCode || user._id}` : ''} className="flex-1 bg-transparent text-white px-4 py-3 text-sm font-medium outline-none" />
                                <button onClick={copyRefLink} className="bg-[#d4af35]/10 hover:bg-[#d4af35]/20 px-5 py-3 text-[#d4af35] font-bold transition-colors flex items-center gap-2 border-l border-[#d4af35]/30">
                                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recent Deposits */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-black text-white">Recent Deposits</h2>
                            <Link href="/dashboard/deposit" className="text-sm font-bold text-[#d4af35] underline decoration-[#d4af35]/50 decoration-2 hover:text-white transition-colors">+ New Deposit</Link>
                        </div>
                        <div className="bg-[#0A0A0A] border border-[#d4af35]/20 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden p-3">
                            {recentDeposits.length === 0 ? (
                                <div className="p-6 text-center text-xs font-bold uppercase tracking-widest text-[#d4af35]/60 m-2 border border-dashed border-[#d4af35]/20 rounded-xl">No deposits yet.</div>
                            ) : (
                                <ul className="divide-y divide-[#d4af35]/10">
                                    {recentDeposits.map(dep => {
                                        const isUsdt = dep.paymentMethod === 'usdt';
                                        const displayAmount = isUsdt
                                            ? `₹${(dep.amount * usdtToInr).toLocaleString('en-IN', { maximumFractionDigits: 0 })} (≈$${dep.amount})`
                                            : `₹${dep.amount.toLocaleString('en-IN')}`;
                                        return (
                                            <li key={dep._id} className="p-4 flex justify-between items-center hover:bg-[#d4af35]/5 rounded-xl transition-colors group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-[#121212] flex items-center justify-center border border-[#d4af35]/30 shadow-inner group-hover:scale-110 transition-transform">
                                                        {isUsdt ? <Coins className="w-5 h-5 text-[#d4af35]" /> : <IndianRupee className="w-5 h-5 text-[#d4af35]" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-black tracking-wide group-hover:text-[#d4af35] transition-colors">{displayAmount}</p>
                                                        <p className="text-[#d4af35]/60 text-[10px] mt-0.5 font-bold uppercase tracking-wider">{new Date(dep.createdAt).toLocaleDateString()} · <span className="text-white/40">{isUsdt ? 'USDT Crypto' : 'Bank Transfer'}</span></p>
                                                    </div>
                                                </div>
                                                <div>
                                                    {dep.status === 'approved' && <span className="text-[10px] font-black text-[#32e512] bg-[#32e512]/10 px-3 py-1.5 rounded-lg border border-[#32e512]/20 uppercase tracking-widest shadow-inner">Approved</span>}
                                                    {dep.status === 'pending' && <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 uppercase tracking-widest shadow-inner">Pending</span>}
                                                    {dep.status === 'rejected' && <span className="text-[10px] font-black text-red-500 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 uppercase tracking-widest shadow-inner">Rejected</span>}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div>
                        <h2 className="text-xl font-black text-white mb-4">Recent Transactions</h2>
                        <div className="bg-[#0A0A0A] border border-[#d4af35]/20 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden p-3 mb-10">
                            {transactions.length === 0 ? (
                                <div className="p-6 text-center text-xs font-bold uppercase tracking-widest text-[#d4af35]/60 m-2 border border-dashed border-[#d4af35]/20 rounded-xl">No transactions recorded.</div>
                            ) : (
                                <ul className="divide-y divide-[#d4af35]/10">
                                    {transactions.slice(0, 5).map(tx => (
                                        <li key={tx._id} className="p-4 flex justify-between items-center hover:bg-[#d4af35]/5 rounded-xl transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-[#121212] flex items-center justify-center border border-[#d4af35]/30 shadow-inner group-hover:scale-110 transition-transform">
                                                    {tx.currency === 'USDT' || tx.currency === 'USD' ? (
                                                        <Coins className="w-5 h-5 text-[#d4af35]" />
                                                    ) : (
                                                        <IndianRupee className="w-5 h-5 text-[#d4af35]" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold capitalize flex items-center gap-2 group-hover:text-[#d4af35] transition-colors">
                                                        {tx.type.replace('_', ' ')}
                                                        {(tx.type === 'referral_bonus' || tx.type === 'deposit') && <span className="bg-[#32e512]/10 text-[#32e512] border border-[#32e512]/20 text-[10px] px-2 py-0.5 rounded font-black tracking-widest uppercase ml-2">Credit</span>}
                                                    </p>
                                                    <p className="text-[#d4af35]/60 text-[10px] mt-0.5 font-bold uppercase tracking-wider">{new Date(tx.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className={`font-black text-right ${(tx.type === 'referral_bonus' || tx.type === 'deposit') ? 'text-[#32e512]' : 'text-white'}`}>
                                                {(tx.type === 'referral_bonus' || tx.type === 'deposit') ? '+' : ''}{formatTxAmount(tx)}
                                                {(tx.currency === 'USDT' || tx.currency === 'USD') && (
                                                    <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider">{tx.amount.toFixed(2)} USD{tx.currency === 'USDT' ? 'T' : ''}</div>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
