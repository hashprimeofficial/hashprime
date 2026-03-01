'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { ArrowUpRight, Copy, CheckCircle2, XCircle, Loader2, AlertCircle, Search, Filter } from 'lucide-react';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AdminWithdrawalsPage() {
    const { data, error, isLoading, mutate } = useSWR('/api/admin/withdrawals', fetcher);
    const [processingId, setProcessingId] = useState(null);
    const [rejectionNote, setRejectionNote] = useState('');
    const [rejectingId, setRejectingId] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    if (isLoading) return <div className="text-slate-400 animate-pulse font-medium">Loading withdrawal requests...</div>;
    if (error) return <div className="text-red-500 font-bold">Failed to load withdrawals data</div>;

    const { withdrawals = [] } = data || {};

    const filteredWithdrawals = withdrawals.filter(w => {
        if (filterStatus === 'all') return true;
        return w.status === filterStatus;
    });

    const handleAction = async (id, status, note = '') => {
        if (!confirm(`Are you sure you want to ${status} this withdrawal?`)) return;

        setProcessingId(id);
        try {
            const res = await fetch(`/api/admin/withdrawals/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, adminNote: note })
            });

            const result = await res.json();
            if (res.ok) {
                mutate();
                if (status === 'rejected') setRejectingId(null);
            } else {
                alert(result.error || `Failed to ${status} withdrawal`);
            }
        } catch (error) {
            alert('An unexpected error occurred');
        } finally {
            setProcessingId(null);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Address copied to clipboard');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-navy mb-2 tracking-tight flex items-center gap-3">
                        <ArrowUpRight className="text-neon w-8 h-8" />
                        Withdrawals
                    </h1>
                    <p className="text-slate-500 font-medium">Manage user payout requests and process USDT distributions.</p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button onClick={() => setFilterStatus('all')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterStatus === 'all' ? 'bg-white shadow-sm text-navy' : 'text-slate-500 hover:text-navy'}`}>All</button>
                    <button onClick={() => setFilterStatus('pending')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterStatus === 'pending' ? 'bg-white shadow-sm text-amber-600' : 'text-slate-500 hover:text-navy'}`}>Pending</button>
                    <button onClick={() => setFilterStatus('approved')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterStatus === 'approved' ? 'bg-white shadow-sm text-green-600' : 'text-slate-500 hover:text-navy'}`}>Approved</button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto min-h-[50vh]">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-bold">User</th>
                                <th className="px-6 py-4 font-bold">Amount (USDT)</th>
                                <th className="px-6 py-4 font-bold">Destination Wallet</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold">Requested Date</th>
                                <th className="px-6 py-4 font-bold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredWithdrawals.map((withdraw) => (
                                <tr key={withdraw._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-navy flex items-center gap-2">
                                            {withdraw.userId?.name || 'Unknown User'}
                                            {withdraw.status === 'pending' && <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>}
                                        </div>
                                        <div className="text-xs font-medium text-slate-500">{withdraw.userId?.email || 'No email'}</div>
                                    </td>
                                    <td className="px-6 py-4 font-black text-navy text-lg">
                                        ${withdraw.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 group">
                                            <span className="text-sm font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                                {withdraw.walletAddress}
                                            </span>
                                            <button
                                                onClick={() => copyToClipboard(withdraw.walletAddress)}
                                                className="text-slate-400 hover:text-navy transition-colors opacity-0 group-hover:opacity-100"
                                                title="Copy full address"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded text-xs uppercase tracking-wider font-black shadow-sm ${withdraw.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                withdraw.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-amber-100 text-amber-700'
                                            }`}>
                                            {withdraw.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-500">
                                        {new Date(withdraw.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {withdraw.status === 'pending' ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleAction(withdraw._id, 'approved', 'Approved by admin')}
                                                    disabled={processingId === withdraw._id}
                                                    className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                                                    title="Approve Withdrawal"
                                                >
                                                    {processingId === withdraw._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                                                </button>
                                                <button
                                                    onClick={() => setRejectingId(withdraw._id)}
                                                    disabled={processingId === withdraw._id}
                                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                                                    title="Reject Withdrawal"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs font-bold text-slate-400 italic">
                                                {withdraw.status === 'approved' ? 'Settled' : 'Refunded'}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredWithdrawals.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 font-medium bg-slate-50 flex flex-col items-center justify-center">
                                        <AlertCircle className="w-10 h-10 text-slate-300 mb-3" />
                                        No withdrawals match the current filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Rejection Modal */}
            {rejectingId && (
                <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
                        <div className="p-6 border-b border-slate-100 text-center">
                            <h3 className="text-xl font-black text-red-600">Reject Withdrawal</h3>
                            <p className="text-sm text-slate-500 font-medium mt-1">Provide a reason for rejecting this payout request. Funds will be returned to the user's trading balance.</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <textarea
                                rows="3"
                                placeholder="E.g., Invalid wallet network, please read instructions..."
                                value={rejectionNote}
                                onChange={(e) => setRejectionNote(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy font-medium focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                            ></textarea>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setRejectingId(null)}
                                    className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleAction(rejectingId, 'rejected', rejectionNote)}
                                    disabled={processingId === rejectingId || !rejectionNote.trim()}
                                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-lg shadow-sm transition-all flex justify-center items-center disabled:opacity-50"
                                >
                                    {processingId === rejectingId ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Rejection'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
