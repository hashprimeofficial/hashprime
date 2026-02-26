'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { DollarSign, Clock, ArrowUpRight, Copy, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function DashboardOverview() {
    const { data, error, isLoading } = useSWR('/api/dashboard/stats', fetcher);
    const [copied, setCopied] = useState(false);

    if (isLoading) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-white/10 rounded w-3/4"></div><div className="space-y-2"><div className="h-4 bg-white/10 rounded"></div><div className="h-4 bg-white/10 rounded w-5/6"></div></div></div></div>;
    if (error) return <div className="text-red-500">Failed to load dashboard</div>;

    const { user, investments, transactions } = data;

    const totalInvested = investments.reduce((acc, inv) => acc + inv.amount, 0);
    const totalExpectedReturn = investments.reduce((acc, inv) => acc + inv.usdtReward, 0);

    const copyRefLink = () => {
        let origin = '';
        if (typeof window !== 'undefined') origin = window.location.origin;
        navigator.clipboard.writeText(`${origin}/register?ref=${user.email}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-navy mb-2 tracking-tight">Welcome, {user.name}</h1>
                <p className="text-slate-500 font-medium">Here's an overview of your wealth generation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0 }} className="bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4 text-navy"><DollarSign className="w-5 h-5 text-neon" /> <h3 className="font-bold">Current Balance</h3></div>
                    <div className="text-4xl font-black text-navy mb-1">{user.usdtBalance.toFixed(2)} <span className="text-lg text-slate-400 font-bold">USDT</span></div>
                    <p className="text-sm text-slate-500 mt-4 flex justify-between items-center font-medium">
                        Available to withdraw
                        <button disabled className="bg-white border border-slate-200 px-3 py-1 rounded text-xs opacity-50 cursor-not-allowed shadow-sm font-bold text-navy">Withdraw</button>
                    </p>
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
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {investments.slice(0, 5).map(inv => (
                                        <tr key={inv._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="bg-navy text-white px-2.5 py-1 rounded text-xs font-bold uppercase shadow-sm">{inv.schemeType} Plan</span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-navy">₹{inv.amount.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-green-600 font-bold">+{inv.usdtReward.toFixed(2)} USDT</td>
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
                            <input readOnly value={typeof window !== 'undefined' ? `${window.location.origin}/register?ref=${user.email}` : ''} className="flex-1 bg-transparent px-4 py-3 text-sm text-white font-medium outline-none" />
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
                                    {transactions.slice(0, 3).map(tx => (
                                        <li key={tx._id} className="p-4 flex justify-between items-center hover:bg-slate-50 rounded-xl transition-colors">
                                            <div>
                                                <p className="text-navy font-bold capitalize flex items-center gap-2">
                                                    {tx.type.replace('_', ' ')}
                                                    {tx.type === 'referral_bonus' && <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded font-bold border border-green-200">Credit</span>}
                                                </p>
                                                <p className="text-slate-500 text-xs mt-1 font-medium">{new Date(tx.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className={`font-black ${tx.type === 'investment' ? 'text-navy' : 'text-green-600'}`}>
                                                {tx.type === 'referral_bonus' ? '+' : ''}{tx.amount.toLocaleString()} {tx.currency}
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
