'use client';

import useSWR from 'swr';
import { Copy, CheckCircle2, Users, Gift, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

const fetcher = (url) => fetch(url).then((res) => res.json());

function ReferralsSkeleton() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
            <div>
                <div className="h-9 bg-slate-100 rounded-lg w-52 mb-2" />
                <div className="h-5 bg-slate-100 rounded-lg w-80" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-200 rounded-3xl h-44" />
                <div className="bg-slate-100 border border-slate-200 rounded-3xl h-44" />
            </div>
            <div className="bg-white border border-slate-200 rounded-3xl h-48" />
        </div>
    );
}

export default function ReferralsPage() {
    const { data, error, isLoading } = useSWR('/api/dashboard/stats', fetcher);
    const [copied, setCopied] = useState(false);

    if (isLoading) return <ReferralsSkeleton />;
    if (error) return <div className="text-red-500">Failed to load data</div>;

    const { user, transactions } = data;
    const referralTxs = transactions.filter(t => t.type === 'referral_bonus');
    const totalEarned = referralTxs.reduce((acc, t) => acc + t.amount, 0);

    const copyRefLink = () => {
        let origin = '';
        if (typeof window !== 'undefined') origin = window.location.origin;
        navigator.clipboard.writeText(`${origin}/register?ref=${user._id}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-black text-navy mb-2 tracking-tight">Referral Program</h1>
                <p className="text-slate-500 font-medium">Invite investors and earn a 5% instant USDT bonus on every investment they make.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-navy border border-slate-800 p-8 rounded-3xl backdrop-blur-md relative overflow-hidden shadow-xl">
                    <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-neon/20 blur-[60px] rounded-full"></div>
                    <Users className="w-8 h-8 text-white mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Your Referral Link</h2>
                    <p className="text-slate-300 mb-6 text-sm font-medium">Share this unique link with friends and partners. When they register and invest, you get paid instantly.</p>

                    <div className="flex bg-white/10 border border-white/20 rounded-xl overflow-hidden shadow-inner backdrop-blur-sm">
                        <input readOnly value={typeof window !== 'undefined' ? `${window.location.origin}/register?ref=${user._id}` : ''} className="flex-1 bg-transparent px-4 py-4 text-sm text-white font-medium outline-none" />
                        <button onClick={copyRefLink} className="bg-neon hover:bg-[#32e512] px-6 py-4 text-navy font-bold transition-colors flex items-center gap-2">
                            {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Share via:</span>
                        <a
                            href={typeof window !== 'undefined' ? `https://wa.me/?text=Join+HashPrime+and+start+earning+USDT!+${encodeURIComponent(window.location.origin + '/register?ref=' + user._id)}` : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border border-green-500/30"
                        >WhatsApp</a>
                        <a
                            href={typeof window !== 'undefined' ? `https://t.me/share/url?url=${encodeURIComponent(window.location.origin + '/register?ref=' + user._id)}&text=Join+HashPrime+and+earn+USDT!` : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border border-blue-500/30"
                        >Telegram</a>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl shadow-sm relative overflow-hidden flex flex-col justify-center items-center text-center">
                    <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-neon/10 blur-[60px] rounded-full"></div>
                    <Gift className="w-10 h-10 text-neon mb-4" />
                    <p className="text-slate-500 text-lg font-bold mb-1">Total Referral Earnings</p>
                    <h2 className="text-5xl font-black text-navy relative z-10">{totalEarned.toFixed(2)} <span className="text-2xl text-slate-400 font-bold">USDT</span></h2>
                </div>
            </div>

            <div className="mt-8 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-200">
                    <h3 className="text-xl font-black text-navy">Referral History</h3>
                </div>

                {referralTxs.length === 0 ? (
                    <div className="p-10 text-center font-bold text-slate-400 bg-slate-50/50">
                        You haven't earned any referral bonuses yet.<br />Share your link to get started!
                    </div>
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {referralTxs.map((tx) => (
                            <li key={tx._id} className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-green-600 shadow-sm">
                                        <ArrowUpRight className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-navy font-bold">{tx.description}</p>
                                        <p className="text-slate-400 font-medium text-sm mt-1">{new Date(tx.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-black text-green-600 text-xl hidden sm:block">+{tx.amount.toFixed(2)} USDT</div>
                                    <div className="font-black text-green-600 block sm:hidden">+{tx.amount.toFixed(2)} USDT</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
