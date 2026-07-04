'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { Gift, Search, User, CheckCircle2, AlertCircle, Loader2, Landmark, Check } from 'lucide-react';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AdminReferralClaimsPage() {
    const { data, error, isLoading, mutate } = useSWR('/api/admin/referral-claims', fetcher);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [processingId, setProcessingId] = useState(null);

    const claims = data?.claims || [];

    const handleApprove = async (id) => {
        if (!confirm('Are you sure you want to approve and settle this referral payout claim?')) return;

        setProcessingId(id);
        try {
            const res = await fetch(`/api/admin/referral-claims/${id}/approve`, {
                method: 'POST'
            });
            if (res.ok) {
                mutate();
            } else {
                const errResult = await res.json();
                alert(errResult.error || 'Failed to approve claim.');
            }
        } catch (err) {
            console.error('Approve claim error:', err);
            alert('An error occurred during approval.');
        } finally {
            setProcessingId(null);
        }
    };

    const filteredClaims = claims.filter(cl => {
        const query = searchTerm.toLowerCase();
        const userName = cl.userId?.name?.toLowerCase() || '';
        const userEmail = cl.userId?.email?.toLowerCase() || '';
        
        const matchesSearch = userName.includes(query) || userEmail.includes(query);
        const matchesStatus = statusFilter === 'All' || cl.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    if (isLoading) return <div className="text-neutral-400 animate-pulse">Loading referral claims...</div>;
    if (error) return <div className="text-red-500 font-bold">Failed to load claims</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-white mb-2 tracking-tight flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#d4af35]/10 rounded-xl flex items-center justify-center border border-[#d4af35]/20">
                        <Gift className="w-5 h-5 text-[#d4af35]" />
                    </div>
                    Referral Claims Payouts
                </h1>
                <p className="text-[#d4af35]/60 font-medium ml-13 text-sm">Review, verify, and approve offline referral commission payouts.</p>
            </div>

            <div className="bg-[#0A0A0A] border border-[#d4af35]/20 p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="bg-[#080808] border border-[#d4af35]/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af35]/40"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                        </select>
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d4af35]/40" />
                        <input
                            type="text"
                            placeholder="Search investor email or name..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-[#080808] border border-[#d4af35]/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#d4af35]/40 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-[#d4af35]/5 border-b border-[#d4af35]/10">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Investor</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Payout Bank Details</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Requested Amount</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Requested Date</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Status / Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#d4af35]/5">
                            {filteredClaims.map((cl) => (
                                <tr key={cl._id} className="hover:bg-[#d4af35]/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-white text-sm flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5 text-[#d4af35]" />
                                            {cl.userId?.name || 'Deleted User'}
                                        </div>
                                        <div className="text-xs font-medium text-[#d4af35]/50 ml-5">{cl.userId?.email || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {cl.bankAccountId ? (
                                            <div className="text-xs space-y-0.5">
                                                <div className="font-bold text-white flex items-center gap-1">
                                                    <Landmark className="w-3 h-3 text-[#d4af35]" />
                                                    {cl.bankAccountId.bankName}
                                                </div>
                                                <div className="text-slate-400 font-semibold">Holder: {cl.bankAccountId.accountHolderName}</div>
                                                <div className="text-slate-400 font-semibold font-mono">Account: {cl.bankAccountId.accountNumber} · IFSC: {cl.bankAccountId.ifsc}</div>
                                            </div>
                                        ) : (
                                            <div className="text-xs text-red-400 font-bold">Bank details unavailable</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-black text-white text-sm">₹{cl.amountInr?.toLocaleString('en-IN') || '0'}</div>
                                        <div className="text-[10px] text-white/40 font-bold">~ ${cl.amount?.toFixed(2)} USD</div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-semibold text-[#d4af35]/50">
                                        {new Date(cl.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {cl.status === 'Approved' ? (
                                            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-inner">
                                                <Check className="w-3.5 h-3.5" /> Approved
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handleApprove(cl._id)}
                                                disabled={processingId === cl._id}
                                                className="px-4 py-2 bg-[#d4af35] hover:bg-[#f8d76d] text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_2px_10px_rgba(212,175,53,0.2)] disabled:opacity-50"
                                            >
                                                {processingId === cl._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Approve'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredClaims.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-[#d4af35]/40 font-medium">No claims found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
