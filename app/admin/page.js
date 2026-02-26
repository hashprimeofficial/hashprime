'use client';

import useSWR from 'swr';
import { Users, Wallet, Gift } from 'lucide-react';
import Link from 'next/link';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AdminOverview() {
    const { data, error, isLoading } = useSWR('/api/admin/stats', fetcher);

    if (isLoading) return <div className="text-neutral-400 animate-pulse">Loading admin data...</div>;
    if (error) return <div className="text-red-500">Failed to load admin data</div>;

    const { totalUsers = 0, totalCapital = 0, totalReferralsPaid = 0, recentInvestments = [] } = data || {};

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-navy mb-2 tracking-tight">Master Dashboard</h1>
                <p className="text-slate-500 font-medium">Overview of HashPrime operations and capital flow.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4 text-navy"><Wallet className="w-5 h-5 text-blue-500" /> <h3 className="font-bold">Total Capital Locked</h3></div>
                    <div className="text-4xl font-black text-navy mb-1">₹{(totalCapital || 0).toLocaleString()}</div>
                    <p className="text-sm text-slate-500 mt-2 font-medium">Active investments</p>
                </div>

                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4 text-navy"><Users className="w-5 h-5 text-purple-600" /> <h3 className="font-bold">Total Investors</h3></div>
                    <div className="text-4xl font-black text-navy mb-1">{(totalUsers || 0).toLocaleString()}</div>
                    <p className="text-sm text-slate-500 mt-2 font-medium">Registered platform users</p>
                </div>

                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4 text-navy"><Gift className="w-5 h-5 text-neon" /> <h3 className="font-bold">Referrals Paid</h3></div>
                    <div className="text-4xl font-black text-navy mb-1">{(totalReferralsPaid || 0).toFixed(2)} <span className="text-lg text-slate-400">USDT</span></div>
                    <p className="text-sm text-slate-500 mt-2 font-medium">Total network rewards distributed</p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mt-8 shadow-sm">
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
