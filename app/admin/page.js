'use client';

import useSWR from 'swr';
import { Users, Wallet, ArrowDownCircle, ArrowUpCircle, ScrollText, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AdminOverview() {
    const { data, error, isLoading } = useSWR('/api/admin/stats', fetcher);

    if (isLoading) return <div className="text-neutral-400 animate-pulse">Loading admin data...</div>;
    if (error) return <div className="text-red-500">Failed to load admin data</div>;

    const {
        totalUsers = 0,
        totalCapitalLocked = 0,
        totalUsdtLiability = 0,
        totalWithdrawalsPaid = 0,
        totalDepositsINR = 0,
        recentInvestments = [],
        topInvestors = [],
        topReferrals = []
    } = data || {};

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-navy mb-2 tracking-tight flex items-center gap-3">
                        <ScrollText className="w-8 h-8 text-neon" />
                        Master Dashboard
                    </h1>
                    <p className="text-slate-500 font-medium">Overview of HashPrime operations, liabilities, and capital flow.</p>
                </div>
                <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-sm">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-bold text-navy">Investors: <span className="text-purple-600">{(totalUsers || 0).toLocaleString()}</span></span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* INR Assets */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2 text-navy">
                            <ArrowDownCircle className="w-5 h-5 text-green-500" />
                            <h3 className="font-bold">Total Inflow (Deposits)</h3>
                        </div>
                    </div>
                    <div className="text-3xl font-black text-navy mb-1 flex items-baseline gap-1">
                        <span className="text-lg text-slate-400 font-bold">₹</span>
                        {(totalDepositsINR || 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-500 mt-2 font-medium">All approved fiat capital infused</p>
                </div>

                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2 text-navy">
                            <Wallet className="w-5 h-5 text-blue-500" />
                            <h3 className="font-bold">Active Capital Locked</h3>
                        </div>
                    </div>
                    <div className="text-3xl font-black text-navy mb-1 flex items-baseline gap-1">
                        <span className="text-lg text-slate-400 font-bold">₹</span>
                        {(totalCapitalLocked || 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-500 mt-2 font-medium">Funds currently locked in schemes</p>
                </div>

                {/* USDT Liabilities */}
                <div className="bg-navy border border-navy p-6 rounded-2xl shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2 text-slate-200">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                            <h3 className="font-bold">Total Platform Liability</h3>
                        </div>
                    </div>
                    <div className="text-3xl font-black text-white mb-1 flex items-baseline gap-1.5">
                        <span className="text-lg text-slate-400 font-bold">$</span>
                        {(totalUsdtLiability || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p className="text-xs text-slate-400 mt-2 font-medium mb-1">Total USDT owed in user wallets</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2 text-navy">
                            <ArrowUpCircle className="w-5 h-5 text-amber-500" />
                            <h3 className="font-bold">Total Withdrawals Paid</h3>
                        </div>
                    </div>
                    <div className="text-3xl font-black text-navy mb-1 flex items-baseline gap-1.5">
                        <span className="text-lg text-slate-400 font-bold">$</span>
                        {(totalWithdrawalsPaid || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p className="text-xs text-slate-500 mt-2 font-medium">Capital successfully exited</p>
                </div>
            </div>

            {/* Top Leaderboards Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
                {/* Top Investors */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-indigo-500" />
                        <h2 className="text-lg font-black text-navy">Top Investors</h2>
                    </div>
                    <ul className="divide-y divide-slate-100 p-2">
                        {topInvestors.length === 0 ? (
                            <li className="p-6 text-center text-sm font-medium text-slate-500">No active investors found.</li>
                        ) : (
                            topInvestors.map((inv, idx) => (
                                <li key={`investor-${idx}`} className="p-4 flex justify-between items-center hover:bg-slate-50 rounded-xl transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-black flex items-center justify-center border border-indigo-200 shadow-sm shadow-indigo-100">
                                            #{idx + 1}
                                        </div>
                                        <div>
                                            <p className="font-bold text-navy">{inv.user?.name || 'Unknown User'}</p>
                                            <p className="text-xs font-medium text-slate-500">{inv.user?.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="font-black text-indigo-700 text-lg">
                                        ₹{(inv.totalInvested || 0).toLocaleString()}
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                {/* Top Referrals */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                        <Users className="w-5 h-5 text-fuchsia-500" />
                        <h2 className="text-lg font-black text-navy">Top Referrers</h2>
                    </div>
                    <ul className="divide-y divide-slate-100 p-2">
                        {topReferrals.length === 0 ? (
                            <li className="p-6 text-center text-sm font-medium text-slate-500">No referrers found.</li>
                        ) : (
                            topReferrals.map((ref, idx) => (
                                <li key={`referrer-${idx}`} className="p-4 flex justify-between items-center hover:bg-slate-50 rounded-xl transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-fuchsia-100 text-fuchsia-700 font-black flex items-center justify-center border border-fuchsia-200 shadow-sm shadow-fuchsia-100">
                                            #{idx + 1}
                                        </div>
                                        <div>
                                            {ref.user ? (
                                                <>
                                                    <p className="font-bold text-navy">{ref.user.name}</p>
                                                    <p className="text-xs font-medium text-slate-500">{ref.user.email}</p>
                                                </>
                                            ) : (
                                                <p className="font-bold text-navy">{ref.referrerCode}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-slate-500">Invites:</span>
                                        <span className="font-black text-fuchsia-700 text-lg">{ref.count}</span>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mt-10 shadow-sm relative">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-xl font-black text-navy">Recent Investments</h2>
                    <Link href="/admin/investments" className="text-sm font-bold text-navy hover:text-black underline decoration-neon decoration-2 transition-colors">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-bold">User</th>
                                <th className="px-6 py-4 font-bold">Amount</th>
                                <th className="px-6 py-4 font-bold">Scheme</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentInvestments.map((inv) => (
                                <tr key={inv._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-navy">{inv.userId?.name || 'Unknown'}</div>
                                        <div className="text-xs font-medium text-slate-500">{inv.userId?.email || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 font-black text-navy">₹{inv.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-navy text-white px-2.5 py-1 rounded text-xs uppercase font-bold shadow-sm">{inv.schemeType} Plan</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded text-xs font-bold border shadow-sm ${inv.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-500">
                                        {new Date(inv.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {recentInvestments.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500 font-medium bg-slate-50">No investments found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
