'use client';

import useSWR from 'swr';
import { Users, Wallet, ArrowDownCircle, ArrowUpCircle, ScrollText, AlertTriangle, PiggyBank, Coins, IndianRupee, Clock, CheckCircle2, XCircle, DollarSign, BadgeDollarSign, Gift } from 'lucide-react';
import Link from 'next/link';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AdminOverview() {
    const { data, error, isLoading } = useSWR('/api/admin/stats', fetcher);
    const { data: depositsResp } = useSWR('/api/admin/deposits', fetcher);

    if (isLoading) return <div className="text-neutral-400 animate-pulse">Loading admin data...</div>;
    if (error) return <div className="text-red-500">Failed to load admin data</div>;

    const {
        totalUsers = 0,
        totalCapitalLocked = 0,
        totalUsdWallet = 0,
        totalInrWallet = 0,
        totalReferralWallet = 0,
        totalWithdrawalsPaid = 0,
        totalDepositsINR = 0,
        usdtRate = 85,
        recentInvestments = [],
        topInvestors = [],
        topReferrals = []
    } = data || {};

    const SCHEME_RATES = {
        '3m_inr': 0.18, '6m_inr': 0.38, '1y_inr': 0.80, '5y_inr': 5.00,
        '3m_usd': 0.18, '6m_usd': 0.38, '1y_usd': 0.80, '5y_usd': 5.00,
    };
    const getInrYield = (inv) => {
        if (inv.inrReward !== undefined && inv.inrReward !== null) return inv.inrReward;
        return Math.round(inv.amount * (SCHEME_RATES[inv.schemeType] || 0));
    };

    const recentDeposits = (depositsResp?.deposits || []).slice(0, 5);


    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2 tracking-tight flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#d4af35]/10 rounded-xl flex items-center justify-center border border-[#d4af35]/20">
                            <ScrollText className="w-5 h-5 text-[#d4af35]" />
                        </div>
                        Master Dashboard
                    </h1>
                    <p className="text-[#d4af35]/60 font-medium ml-13 text-sm">Overview of HashPrime operations, liabilities, and capital flow.</p>
                </div>
                <div className="bg-[#0A0A0A] border border-[#d4af35]/20 px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-[0_4px_20px_rgba(212,175,53,0.15)]">
                    <Users className="w-4 h-4 text-[#d4af35]" />
                    <span className="text-sm font-bold text-white">Users: <span className="text-[#d4af35]">{(totalUsers || 0).toLocaleString()}</span></span>
                </div>
            </div>

            {/* ── Stat Cards Row 1: Inflow / Capital / Withdrawals ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Inflow */}
                <div className="bg-[#0A0A0A] border border-[#d4af35]/20 p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-[#d4af35]/40 transition-colors">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform blur-xl" />
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <ArrowDownCircle className="w-4 h-4 text-amber-400" />
                        </div>
                        <h3 className="font-bold text-sm text-white">Total Inflow</h3>
                    </div>
                    <div className="text-3xl font-black text-white flex items-baseline gap-1"><span className="text-lg text-[#d4af35]/60">₹</span>{(totalDepositsINR || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                    <p className="text-[10px] text-[#d4af35]/40 mt-2 font-black uppercase tracking-widest">All approved fiat deposits</p>
                </div>

                {/* Capital Locked */}
                <div className="bg-[#0A0A0A] border border-[#d4af35]/20 p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-[#d4af35]/40 transition-colors">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform blur-xl" />
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                            <Wallet className="w-4 h-4 text-blue-400" />
                        </div>
                        <h3 className="font-bold text-sm text-white">Capital Locked</h3>
                    </div>
                    <div className="text-3xl font-black text-white flex items-baseline gap-1"><span className="text-lg text-[#d4af35]/60">₹</span>{(totalCapitalLocked || 0).toLocaleString('en-IN')}</div>
                    <p className="text-[10px] text-[#d4af35]/40 mt-2 font-black uppercase tracking-widest">Funds locked in schemes</p>
                </div>

                {/* Withdrawals Paid */}
                <div className="bg-[#0A0A0A] border border-[#d4af35]/20 p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-[#d4af35]/40 transition-colors">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af35]/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform blur-xl" />
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-xl bg-[#d4af35]/10 border border-[#d4af35]/20 flex items-center justify-center">
                            <ArrowUpCircle className="w-4 h-4 text-[#d4af35]" />
                        </div>
                        <h3 className="font-bold text-sm text-white">Withdrawals Paid</h3>
                    </div>
                    <div className="text-3xl font-black text-white flex items-baseline gap-1"><span className="text-lg text-[#d4af35]/60">$</span>{(totalWithdrawalsPaid || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                    <p className="text-[10px] text-[#d4af35]/40 mt-2 font-black uppercase tracking-widest">Total approved payouts</p>
                </div>
            </div>

            {/* ── Stat Cards Row 2: Platform Wallet Liabilities (Split) ── */}
            <div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d4af35]/40 mb-3 ml-1">Platform Wallet Holdings</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* USD Wallet Total */}
                    <div className="bg-[#0A0A0A] border border-blue-500/20 p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-blue-500/40 transition-colors">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform blur-xl" />
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                <DollarSign className="w-4 h-4 text-blue-400" />
                            </div>
                            <h3 className="font-bold text-sm text-white">USD Wallet</h3>
                        </div>
                        <div className="text-3xl font-black text-blue-400 flex items-baseline gap-1"><span className="text-lg text-blue-400/60">$</span>{(totalUsdWallet || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                        <p className="text-[10px] text-blue-400/40 mt-2 font-black uppercase tracking-widest">Total user USD holdings</p>
                    </div>

                    {/* INR Wallet Total */}
                    <div className="bg-[#0A0A0A] border border-emerald-500/20 p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform blur-xl" />
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <IndianRupee className="w-4 h-4 text-emerald-400" />
                            </div>
                            <h3 className="font-bold text-sm text-white">INR Wallet</h3>
                        </div>
                        <div className="text-3xl font-black text-emerald-400 flex items-baseline gap-1"><span className="text-lg text-emerald-400/60">₹</span>{(totalInrWallet || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                        <p className="text-[10px] text-emerald-400/40 mt-2 font-black uppercase tracking-widest">Total user INR holdings</p>
                    </div>

                    {/* Referral Wallet Total */}
                    <div className="bg-[#0A0A0A] border border-purple-500/20 p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-purple-500/40 transition-colors">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform blur-xl" />
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                <Gift className="w-4 h-4 text-purple-400" />
                            </div>
                            <h3 className="font-bold text-sm text-white">Referral Wallet</h3>
                        </div>
                        <div className="text-3xl font-black text-purple-400 flex items-baseline gap-1"><span className="text-lg text-purple-400/60">$</span>{(totalReferralWallet || 0).toLocaleString('en-US', { maximumFractionDigits: 4 })}</div>
                        <p className="text-[10px] text-purple-400/40 mt-2 font-black uppercase tracking-widest">Total referral bonuses held</p>
                    </div>
                </div>
            </div>

            {/* Top Leaderboards Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
                <div className="bg-[#0A0A0A] border border-[#d4af35]/20 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] overflow-hidden">
                    <div className="p-5 border-b border-[#d4af35]/10 bg-[#d4af35]/5 flex items-center gap-3">
                        <div className="w-7 h-7 bg-[#d4af35]/10 rounded-lg border border-[#d4af35]/20 flex items-center justify-center">
                            <Wallet className="w-4 h-4 text-[#d4af35]" />
                        </div>
                        <h2 className="text-lg font-black text-white">Top Investors</h2>
                    </div>
                    <ul className="divide-y divide-[#d4af35]/5 p-2">
                        {topInvestors.length === 0 ? (
                            <li className="p-6 text-center text-sm font-medium text-[#d4af35]/40">No active investors found.</li>
                        ) : (
                            topInvestors.map((inv, idx) => (
                                <li key={`investor-${idx}`} className="p-4 flex justify-between items-center hover:bg-[#d4af35]/5 rounded-xl transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#d4af35]/10 text-[#d4af35] font-black flex items-center justify-center border border-[#d4af35]/20 text-sm shadow-inner">
                                            #{idx + 1}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">{inv.user?.name || 'Unknown User'}</p>
                                            <p className="text-xs font-medium text-[#d4af35]/50">{inv.user?.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="font-black text-[#d4af35] text-lg drop-shadow-[0_0_6px_rgba(212,175,53,0.3)]">
                                        ₹{(inv.totalInvested || 0).toLocaleString()}
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                <div className="bg-[#0A0A0A] border border-[#d4af35]/20 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] overflow-hidden">
                    <div className="p-5 border-b border-[#d4af35]/10 bg-[#d4af35]/5 flex items-center gap-3">
                        <div className="w-7 h-7 bg-[#d4af35]/10 rounded-lg border border-[#d4af35]/20 flex items-center justify-center">
                            <Users className="w-4 h-4 text-[#d4af35]" />
                        </div>
                        <h2 className="text-lg font-black text-white">Top Referrers</h2>
                    </div>
                    <ul className="divide-y divide-[#d4af35]/5 p-2">
                        {topReferrals.length === 0 ? (
                            <li className="p-6 text-center text-sm font-medium text-[#d4af35]/40">No referrers found.</li>
                        ) : (
                            topReferrals.map((ref, idx) => (
                                <li key={`referrer-${idx}`} className="p-4 flex justify-between items-center hover:bg-[#d4af35]/5 rounded-xl transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#d4af35]/10 text-[#d4af35] font-black flex items-center justify-center border border-[#d4af35]/20 text-sm shadow-inner">
                                            #{idx + 1}
                                        </div>
                                        <div>
                                            {ref.user ? (
                                                <>
                                                    <p className="font-bold text-white">{ref.user.name}</p>
                                                    <p className="text-xs font-medium text-[#d4af35]/50">{ref.user.email}</p>
                                                </>
                                            ) : (
                                                <p className="font-bold text-white">{ref.referrerCode}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-[#d4af35]/50">Invites:</span>
                                        <span className="font-black text-[#d4af35] text-lg">{ref.count}</span>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>

            {/* Recent Deposits */}
            <div className="bg-[#0A0A0A] border border-[#d4af35]/20 rounded-3xl overflow-hidden mt-8 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                <div className="p-6 border-b border-[#d4af35]/10 bg-[#d4af35]/5 flex justify-between items-center">
                    <h2 className="text-xl font-black text-white flex items-center gap-3">
                        <div className="w-7 h-7 bg-[#d4af35]/10 rounded-lg border border-[#d4af35]/20 flex items-center justify-center">
                            <PiggyBank className="w-4 h-4 text-[#d4af35]" />
                        </div>
                        Recent Deposits
                    </h2>
                    <Link href="/admin/deposits" className="text-sm font-bold text-[#d4af35] hover:text-[#f8d76d] transition-colors">View All →</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-[#d4af35]/5 border-b border-[#d4af35]/10">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">User</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Method</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#d4af35]/5">
                            {recentDeposits.map((dep) => (
                                <tr key={dep._id} className="hover:bg-[#d4af35]/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-white text-sm">{dep.userId?.name || 'Unknown'}</div>
                                        <div className="text-xs font-medium text-[#d4af35]/50">{dep.userId?.email || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 font-black text-white">
                                        {dep.paymentMethod === 'usdt' ? '$' : '₹'}{dep.amount.toLocaleString(dep.paymentMethod === 'usdt' ? 'en-US' : 'en-IN')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {dep.paymentMethod === 'usdt' ? <Coins className="w-4 h-4 text-[#d4af35]" /> : <IndianRupee className="w-4 h-4 text-[#d4af35]/60" />}
                                            <span className="text-xs font-black uppercase text-[#d4af35]/70 tracking-wider">{dep.paymentMethod === 'usdt' ? 'USDT' : 'Bank Transfer'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {dep.status === 'pending' && <span className="inline-flex items-center gap-1 text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg"><Clock className="w-3 h-3" /> Pending</span>}
                                        {dep.status === 'approved' && <span className="inline-flex items-center gap-1 text-xs font-black text-[#32e512] bg-[#32e512]/10 border border-[#32e512]/20 px-2.5 py-1 rounded-lg"><CheckCircle2 className="w-3 h-3" /> Approved</span>}
                                        {dep.status === 'rejected' && <span className="inline-flex items-center gap-1 text-xs font-black text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-lg"><XCircle className="w-3 h-3" /> Rejected</span>}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-[#d4af35]/40">{new Date(dep.createdAt).toLocaleDateString('en-GB')}</td>
                                </tr>
                            ))}
                            {recentDeposits.length === 0 && (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-[#d4af35]/40 font-medium">No deposits found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Investments */}
            <div className="bg-[#0A0A0A] border border-[#d4af35]/20 rounded-3xl overflow-hidden mt-8 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                <div className="p-6 border-b border-[#d4af35]/10 bg-[#d4af35]/5 flex justify-between items-center">
                    <h2 className="text-xl font-black text-white flex items-center gap-3">
                        <div className="w-7 h-7 bg-[#d4af35]/10 rounded-lg border border-[#d4af35]/20 flex items-center justify-center">
                            <PiggyBank className="w-4 h-4 text-[#d4af35]" />
                        </div>
                        Recent Investments
                    </h2>
                    <Link href="/admin/investments" className="text-sm font-bold text-[#d4af35] hover:text-[#f8d76d] transition-colors">View All →</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-[#d4af35]/5 border-b border-[#d4af35]/10">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">User</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Yield</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Scheme</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#d4af35]/5">
                            {recentInvestments.map((inv) => {
                                const curSymbol = inv.currency === 'USD' ? '$' : '₹';
                                const locale = inv.currency === 'USD' ? 'en-US' : 'en-IN';
                                return (
                                    <tr key={inv._id} className="hover:bg-[#d4af35]/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-white text-sm">{inv.userId?.name || 'Unknown'}</div>
                                            <div className="text-xs font-medium text-[#d4af35]/50">{inv.userId?.email || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-black text-white">{curSymbol}{inv.amount.toLocaleString(locale)}</div>
                                            <div className="text-[10px] text-[#d4af35]/40 font-black uppercase tracking-widest">{inv.currency}</div>
                                        </td>
                                        <td className="px-6 py-4 font-black flex items-center justify-start h-full pt-[22px] text-[#32e512]">
                                            +{curSymbol}{(inv.currency === 'USD' ? (inv.usdtReward || 0) : getInrYield(inv)).toLocaleString(locale, { maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-[#d4af35]/10 text-[#d4af35] border border-[#d4af35]/20 px-2.5 py-1 rounded-lg text-[10px] uppercase font-black tracking-wider">{inv.schemeType}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border uppercase tracking-wider ${inv.status === 'active' ? 'bg-[#d4af35]/10 text-[#d4af35] border-[#d4af35]/20' : inv.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-white/5 text-white/30 border-white/10'}`}>
                                                {inv.status === 'pending' ? 'Requested' : inv.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-[#d4af35]/40">
                                            {new Date(inv.createdAt).toLocaleDateString('en-GB')}
                                        </td>
                                    </tr>
                                );
                            })}
                            {recentInvestments.length === 0 && (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-[#d4af35]/40 font-medium">No investments found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
