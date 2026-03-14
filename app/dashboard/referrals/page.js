'use client';

import useSWR from 'swr';
import { Copy, CheckCircle2, Users, Gift, ArrowUpRight, UserCircle2 } from 'lucide-react';
import { useState } from 'react';

const fetcher = (url) => fetch(url).then((res) => res.json());

function ReferralsSkeleton() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
            <div>
                <div className="h-9 bg-[#0A0A0A] border border-[#d4af35]/20 rounded-lg w-52 mb-2" />
                <div className="h-5 bg-[#0A0A0A] border border-[#d4af35]/10 rounded-lg w-80" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0A0A0A] border border-[#d4af35]/20 rounded-3xl h-44" />
                <div className="bg-[#0A0A0A] border border-[#d4af35]/20 rounded-3xl h-44" />
            </div>
            <div className="bg-[#0A0A0A] border border-[#d4af35]/20 rounded-3xl h-48" />
        </div>
    );
}

export default function ReferralsPage() {
    const { data: authData } = useSWR('/api/auth/me', fetcher);
    const { data, error, isLoading } = useSWR('/api/referrals', fetcher);
    const { data: rateData } = useSWR('/api/exchange-rate', fetcher);
    const [copied, setCopied] = useState(false);

    const usdtToInr = rateData?.rate || 85;

    if (isLoading) return <ReferralsSkeleton />;
    if (error || !data) return <div className="text-red-500">Failed to load referral data</div>;

    const { referredUsers = [], referralTxs = [], totalEarned = 0 } = data;

    const userId = authData?.user?._id || '';

    const copyRefLink = () => {
        let origin = '';
        if (typeof window !== 'undefined') origin = window.location.origin;
        navigator.clipboard.writeText(`${origin}/register?ref=${data.referralCode || userId}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const refLink = typeof window !== 'undefined'
        ? `${window.location.origin}/register?ref=${data.referralCode || userId}`
        : '';

    return (
        <div className="max-w-4xl mx-auto space-y-8 relative pb-20">
            <div className="relative z-10">
                <h1 className="text-3xl font-black text-white mb-2 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">Referral Program</h1>
                <p className="text-[#d4af35]/70 font-medium">Invite investors and earn an instant bonus on every investment they make.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {/* Referral Link Card */}
                <div className="bg-gradient-to-br from-[#1f1805] to-[#0a0a0a] border border-[#d4af35]/30 p-8 rounded-3xl relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] group hover:border-[#d4af35]/50 transition-colors">
                    <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-[#d4af35]/10 blur-[60px] rounded-full pointer-events-none"></div>
                    <Users className="w-8 h-8 text-[#d4af35] mb-4 drop-shadow-[0_0_8px_rgba(212,175,53,0.4)]" />
                    <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Your Referral Link</h2>
                    <p className="text-[#d4af35]/60 mb-6 text-sm font-bold">Share this unique link with friends and partners. When they register and invest, you get paid instantly to your Referral Wallet.</p>

                    <div className="flex bg-[#0A0A0A] border border-[#d4af35]/30 rounded-xl overflow-hidden shadow-inner w-full group-hover:border-[#d4af35]/60 transition-colors">
                        <input readOnly value={refLink} className="flex-1 bg-transparent text-[#d4af35] px-4 py-4 text-sm font-bold outline-none font-mono selection:bg-[#d4af35]/30 w-full min-w-0 break-all" />
                        <button onClick={copyRefLink} className="bg-[#d4af35]/20 hover:bg-[#d4af35] text-[#d4af35] hover:text-[#0A0A0A] px-6 py-4 font-black transition-colors flex items-center justify-center gap-2 border-l border-[#d4af35]/30 shrink-0">
                            {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Share via:</span>
                        <a
                            href={refLink ? `https://wa.me/?text=Join+HashPrime+and+start+earning!+${encodeURIComponent(refLink)}` : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#d4af35]/10 hover:bg-[#d4af35]/20 text-[#d4af35] text-[10px] font-black px-3 py-1.5 rounded-lg transition-colors border border-[#d4af35]/20 hover:border-[#d4af35]/40 uppercase tracking-widest"
                        >WhatsApp</a>
                        <a
                            href={refLink ? `https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=Join+HashPrime+and+earn!` : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[10px] font-black px-3 py-1.5 rounded-lg transition-colors border border-blue-500/20 hover:border-blue-500/40 uppercase tracking-widest"
                        >Telegram</a>
                    </div>
                </div>

                {/* Stats Card */}
                <div className="bg-[#0A0A0A] border border-[#d4af35]/20 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col justify-center items-center text-center group hover:border-[#d4af35]/40 transition-colors">
                    <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-[#d4af35]/5 blur-[60px] rounded-full pointer-events-none"></div>
                    <Gift className="w-10 h-10 text-[#d4af35] mb-4 drop-shadow-[0_0_8px_rgba(212,175,53,0.4)] group-hover:scale-110 transition-transform" />
                    <p className="text-[#d4af35]/60 text-[10px] font-black uppercase tracking-widest mb-1">Available Referral Balance</p>
                    <h2 className="text-4xl md:text-5xl font-black text-white relative z-10 tracking-tight">₹{authData?.user?.referralWallet?.toLocaleString('en-IN') || '0.00'}</h2>
                    <p className="text-[#d4af35] bg-[#d4af35]/10 px-3 py-1 rounded-lg border border-[#d4af35]/20 text-[10px] mt-4 font-black uppercase tracking-widest shadow-sm">
                        Total Historical Earnings: ₹{(totalEarned * usdtToInr).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-white/40 text-xs mt-3 font-bold">{referredUsers.length} user{referredUsers.length !== 1 ? 's' : ''} referred</p>
                </div>
            </div>

            {/* Referred Users List */}
            <div className="bg-[#0A0A0A] border border-[#d4af35]/20 rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-10">
                <div className="p-6 border-b border-[#d4af35]/10 flex items-center gap-3 bg-[#d4af35]/5">
                    <UserCircle2 className="w-5 h-5 text-[#d4af35]" />
                    <h3 className="text-xl font-black text-white tracking-tight">Referred Users</h3>
                    <span className="ml-auto bg-[#d4af35]/10 text-[#d4af35] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-[#d4af35]/30 shadow-inner">{referredUsers.length} total</span>
                </div>
                {referredUsers.length === 0 ? (
                    <div className="p-10 text-center font-bold text-[#d4af35]/40 text-sm tracking-wide">
                        No referred users yet.<br />Share your link to get started!
                    </div>
                ) : (
                    <ul className="divide-y divide-[#d4af35]/10">
                        {referredUsers.map((u) => (
                            <li key={u._id} className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-[#d4af35]/5 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#d4af35]/10 flex items-center justify-center text-[#d4af35] font-black text-lg border border-[#d4af35]/20 shadow-inner group-hover:scale-110 transition-transform">
                                        {u.name?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <p className="text-white font-black text-lg tracking-tight">{u.name}</p>
                                        <p className="text-[#d4af35]/60 text-xs font-bold">{u.email}</p>
                                    </div>
                                </div>
                                <div className="text-left sm:text-right text-[10px] text-white/40 font-black uppercase tracking-widest">
                                    Joined {new Date(u.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Referral Bonus History */}
            <div className="bg-[#0A0A0A] border border-[#d4af35]/20 rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-10">
                <div className="p-6 border-b border-[#d4af35]/10 bg-[#d4af35]/5">
                    <h3 className="text-xl font-black text-white tracking-tight">Referral Bonus History</h3>
                </div>

                {referralTxs.length === 0 ? (
                    <div className="p-10 text-center font-bold text-[#d4af35]/40 text-sm tracking-wide">
                        You haven't earned any referral bonuses yet.<br />Share your link to get started!
                    </div>
                ) : (
                    <ul className="divide-y divide-[#d4af35]/10">
                        {referralTxs.map((tx) => (
                            <li key={tx._id} className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-[#d4af35]/5 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#32e512]/10 border border-[#32e512]/30 flex items-center justify-center text-[#32e512] shadow-inner shrink-0 group-hover:scale-110 transition-transform">
                                        <ArrowUpRight className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-white font-black tracking-tight">{tx.description}</p>
                                        <p className="text-[#d4af35]/60 font-bold text-[10px] uppercase tracking-widest mt-1.5">{new Date(tx.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="text-left sm:text-right bg-[#0A0A0A] sm:bg-transparent p-4 sm:p-0 rounded-xl sm:rounded-none border border-white/5 sm:border-transparent mt-2 sm:mt-0">
                                    <div className="font-black text-[#32e512] text-xl drop-shadow-[0_0_8px_rgba(50,229,18,0.2)]">+₹{(tx.amount * usdtToInr).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                                    <div className="text-[10px] text-white/50 font-black uppercase tracking-widest mt-1">~ {tx.amount.toFixed(2)} USDT</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
