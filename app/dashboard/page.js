'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { DollarSign, Clock, ArrowUpRight, Copy, CheckCircle2, Wallet, IndianRupee, Coins, ShieldCheck, Fingerprint, Landmark, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function DashboardOverview() {
    const { data, error, isLoading } = useSWR('/api/dashboard/stats', fetcher);
    const [copied, setCopied] = useState(false);

    if (isLoading) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-white/10 rounded w-3/4"></div><div className="space-y-2"><div className="h-4 bg-white/10 rounded"></div><div className="h-4 bg-white/10 rounded w-5/6"></div></div></div></div>;
    if (error || !data) return <div className="text-red-500">Failed to load dashboard</div>;
    if (data.error) return <div className="text-red-500">{data.error}</div>;

    const { user, investments = [], transactions = [], bankAccounts = [] } = data;

    const isKycComplete = user.kycStatus === 'approved';
    const is2FaComplete = user.isTwoFactorEnabled;
    const isBankComplete = bankAccounts.length > 0;
    const isProfileFullyComplete = isKycComplete && is2FaComplete && isBankComplete;

    const completionItems = [
        { title: 'Identity Verification (KYC)', check: isKycComplete, icon: ShieldCheck, link: '/dashboard/profile' },
        { title: '2FA Authenticator', check: is2FaComplete, icon: Fingerprint, link: '/dashboard/settings/security' },
        { title: 'Link Bank Account', check: isBankComplete, icon: Landmark, link: '/dashboard/bank' }
    ];

    const totalInvested = investments.reduce((acc, inv) => acc + inv.amount, 0);
    const totalExpectedReturn = investments
        .filter(inv => inv.status === 'active' || inv.status === 'completed')
        .reduce((acc, inv) => acc + inv.usdtReward, 0);

    const copyRefLink = () => {
        let origin = '';
        if (typeof window !== 'undefined') origin = window.location.origin;
        navigator.clipboard.writeText(`${origin}/register?ref=${user._id}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-navy mb-2 tracking-tight">Welcome, {user.name}</h1>
                <p className="text-slate-500 font-medium">Here's an overview of your wealth generation.</p>
            </div>

            {!isProfileFullyComplete && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl flex items-center justify-center -mr-10 -mt-10 pointer-events-none" />
                    <div className="flex items-start gap-4">
                        <div className="pt-1">
                            <AlertCircle className="w-8 h-8 text-amber-500" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-black text-amber-900 mb-2">Complete Your Profile</h2>
                            <p className="text-sm font-medium text-amber-800/80 mb-5">
                                Essential security and verification steps are missing. Completing these unlocks full access to deposits, investments, and fast withdrawals.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {completionItems.map((item, idx) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link href={item.link} key={idx} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${item.check ? 'bg-white/50 border-amber-100 opacity-60' : 'bg-white border-amber-300 hover:border-amber-400 hover:shadow-md cursor-pointer'}`}>
                                            <div className={`p-2 rounded-lg ${item.check ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                                {item.check ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                            </div>
                                            <span className={`text-sm font-bold ${item.check ? 'text-amber-900 line-through decoration-amber-300' : 'text-navy'}`}>{item.title}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0 }} className="bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4 text-navy"><Wallet className="w-5 h-5 text-neon" /> <h3 className="font-bold">Total Capital</h3></div>
                    <div className="text-4xl font-black text-navy mb-1 leading-tight">₹{(user.walletBalance || 0).toLocaleString()}</div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
                        <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider border border-green-200">Trading Profits</div>
                        <div className="text-lg font-black text-navy">{(user.usdtBalance || 0).toFixed(2)} <span className="text-xs text-slate-400 font-bold">USDT</span></div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4 text-navy"><Clock className="w-5 h-5 text-blue-500" /> <h3 className="font-bold">Total Invested</h3></div>
                    <div className="text-4xl font-black text-navy mb-1">₹{totalInvested.toLocaleString()}</div>
                    <p className="text-sm text-slate-500 mt-4 font-medium">Across {investments.length} active scheme(s)</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }} className="bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4 text-navy"><ArrowUpRight className="w-5 h-5 text-green-500" /> <h3 className="font-bold">Expected Return</h3></div>
                    <div className="text-4xl font-black text-navy mb-1">{totalExpectedReturn.toFixed(2)} <span className="text-lg text-slate-400 font-bold">USDT</span></div>
                    <p className="text-sm text-slate-500 mt-4 font-medium">Total protocol maturity yield</p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-black text-navy">Recent Investments</h2>
                        <Link href="/dashboard/invest" className="text-sm font-bold text-navy underline decoration-neon decoration-2 hover:text-black transition-colors">New Investment &rarr;</Link>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        {investments.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 font-medium bg-slate-50/50">No active investments yet. Start generating wealth today.</div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Scheme</th>
                                        <th className="px-6 py-4 font-bold">Amount</th>
                                        <th className="px-6 py-4 font-bold">Yield</th>
                                        <th className="px-6 py-4 font-bold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {investments.slice(0, 5).map(inv => (
                                        <tr key={inv._id} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                                            <td className="px-6 py-5">
                                                <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider">{inv.schemeType} Plan</span>
                                            </td>
                                            <td className="px-6 py-5 font-black text-navy text-lg">₹{inv.amount.toLocaleString()}</td>
                                            <td className="px-6 py-5 text-green-600 font-extrabold">+{inv.usdtReward.toFixed(2)} <span className="text-[10px] text-slate-400">USDT</span></td>
                                            <td className="px-6 py-5">
                                                {inv.status === 'pending' && (
                                                    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                                                        <Clock className="w-3 h-3" /> Requested
                                                    </span>
                                                )}
                                                {inv.status === 'active' && (
                                                    <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                                                        <ShieldCheck className="w-3 h-3" /> Active
                                                    </span>
                                                )}
                                                {inv.status === 'completed' && (
                                                    <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                                                        <CheckCircle2 className="w-3 h-3" /> Completed
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-black text-navy mb-6">Invite & Earn 5% Instant USDT</h2>
                    <div className="bg-navy border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-neon/20 blur-[50px] rounded-full"></div>
                        <h3 className="text-lg font-bold text-white mb-2">Your Referral Link</h3>
                        <p className="text-sm text-slate-300 mb-6 font-medium">Earn 5% of any capital invested by your referrals instantly in USDT.</p>

                        <div className="flex bg-white/10 border border-white/20 rounded-lg overflow-hidden backdrop-blur-sm shadow-inner">
                            <input readOnly value={typeof window !== 'undefined' ? `${window.location.origin}/register?ref=${user._id}` : ''} className="flex-1 bg-transparent px-4 py-3 text-sm text-white font-medium outline-none" />
                            <button onClick={copyRefLink} className="bg-neon hover:bg-[#32e512] px-4 py-3 text-navy font-bold transition-colors flex items-center gap-2">
                                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-xl font-black text-navy mb-6">Recent Transactions</h2>
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-2">
                            {transactions.length === 0 ? (
                                <div className="p-6 text-center text-sm font-medium text-slate-500 bg-slate-50/50 rounded-xl m-2">No transactions recorded.</div>
                            ) : (
                                <ul className="divide-y divide-slate-100">
                                    {transactions.slice(0, 5).map(tx => (
                                        <li key={tx._id} className="p-4 flex justify-between items-center hover:bg-slate-50 rounded-xl transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                                                    {tx.currency === 'USDC' || tx.currency === 'USDT' ? (
                                                        <Coins className="w-5 h-5 text-blue-500" />
                                                    ) : (
                                                        <IndianRupee className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-navy font-bold capitalize flex items-center gap-2">
                                                        {tx.type.replace('_', ' ')}
                                                        {(tx.type === 'referral_bonus' || tx.type === 'deposit') && <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded font-bold border border-green-200">Credit</span>}
                                                    </p>
                                                    <p className="text-slate-500 text-[10px] mt-0.5 font-medium">{new Date(tx.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className={`font-black ${(tx.type === 'referral_bonus' || tx.type === 'deposit') ? 'text-green-600' : 'text-navy'}`}>
                                                {(tx.type === 'referral_bonus' || tx.type === 'deposit') ? '+' : ''}{tx.amount.toLocaleString(tx.currency === 'INR' ? 'en-IN' : 'en-US')} {tx.currency}
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
