'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Loader2, CheckCircle2, XCircle, Clock, Search, AlertCircle,
    FileText, IndianRupee, Coins, ArrowDownCircle, Filter, Eye
} from 'lucide-react';

const fetcher = (url) => fetch(url).then((res) => res.json());

// ── Status badge ────────────────────────────────────────────────────
function StatusBadge({ status }) {
    const map = {
        pending: { cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: Clock, label: 'Pending' },
        approved: { cls: 'bg-[#32e512]/10 text-[#32e512] border-[#32e512]/20', icon: CheckCircle2, label: 'Approved' },
        rejected: { cls: 'bg-red-500/10 text-red-400 border-red-500/20', icon: XCircle, label: 'Rejected' },
    };
    const cfg = map[status] || map.pending;
    const Icon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${cfg.cls}`}>
            <Icon className="w-3 h-3" /> {cfg.label}
        </span>
    );
}

export default function AdminDepositsPage() {
    const { data, error, isLoading, mutate } = useSWR('/api/admin/deposits', fetcher);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const [actionDeposit, setActionDeposit] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [adminNote, setAdminNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleActionSubmit = async () => {
        setIsSubmitting(true);
        setMessage('');
        try {
            const res = await fetch('/api/admin/deposits', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ depositId: actionDeposit._id, status: actionType, adminNote })
            });
            const result = await res.json();
            if (res.ok) {
                setMessage(`✓ Deposit ${actionType} successfully.`);
                mutate();
                setTimeout(() => { setActionDeposit(null); setAdminNote(''); setMessage(''); }, 2000);
            } else {
                setMessage(result.error || 'Failed to update deposit.');
            }
        } catch {
            setMessage('An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#d4af35]" />
            <p className="text-[#d4af35]/50 text-sm font-bold uppercase tracking-widest">Loading deposits…</p>
        </div>
    );
    if (error) return <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl font-bold">Failed to load deposits</div>;

    let deposits = data?.deposits || [];
    const pendingCount = deposits.filter(d => d.status === 'pending').length;

    if (filterStatus !== 'all') deposits = deposits.filter(d => d.status === filterStatus);
    if (searchTerm) {
        const t = searchTerm.toLowerCase();
        deposits = deposits.filter(d => d.userId?.name?.toLowerCase().includes(t) || d.userId?.email?.toLowerCase().includes(t));
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#d4af35]/10 rounded-xl border border-[#d4af35]/20 flex items-center justify-center">
                            <ArrowDownCircle className="w-5 h-5 text-[#d4af35]" />
                        </div>
                        Deposit Management
                    </h1>
                    <p className="text-[#d4af35]/40 text-sm font-medium mt-1 ml-12">Review, approve or reject user deposits · <span className="text-amber-400 font-black">{pendingCount} pending</span></p>
                </div>
                {/* Stats pills */}
                <div className="flex gap-2">
                    {['all', 'pending', 'approved', 'rejected'].map(s => {
                        const count = s === 'all' ? (data?.deposits?.length || 0) : (data?.deposits || []).filter(d => d.status === s).length;
                        return (
                            <button key={s}
                                onClick={() => setFilterStatus(s)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterStatus === s
                                        ? 'bg-[#d4af35] text-black shadow-[0_0_12px_rgba(212,175,53,0.3)]'
                                        : 'bg-white/5 text-white/40 hover:bg-white/10 border border-white/10'
                                    }`}
                            >
                                {s} {count > 0 && <span>({count})</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="bg-[#080808] border border-[#d4af35]/15 rounded-3xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                {/* Search bar */}
                <div className="p-4 border-b border-[#d4af35]/10 flex items-center gap-3 bg-[#d4af35]/5">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d4af35]/40" />
                        <input
                            type="text"
                            placeholder="Search by user name or email…"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0A] border border-[#d4af35]/15 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#d4af35]/40 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2 text-[#d4af35]/40 text-xs font-black uppercase tracking-widest">
                        <Filter className="w-3.5 h-3.5" /> {deposits.length} results
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-[#d4af35]/5 border-b border-[#d4af35]/10">
                            <tr>
                                {['User', 'Amount', 'Method / Wallet', 'Receipt', 'Date', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/50">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#d4af35]/5">
                            {deposits.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-5 py-12 text-center text-[#d4af35]/30 font-bold">
                                        No deposits match the current filter.
                                    </td>
                                </tr>
                            ) : deposits.map((deposit) => (
                                <tr key={deposit._id} className="hover:bg-[#d4af35]/3 transition-colors group">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-[#d4af35]/10 border border-[#d4af35]/20 flex items-center justify-center text-[#d4af35] font-black text-xs shrink-0">
                                                {deposit.userId?.name?.charAt(0)?.toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-sm">{deposit.userId?.name || 'Unknown'}</div>
                                                <div className="text-[10px] text-[#d4af35]/40 font-medium">{deposit.userId?.email || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="font-black text-white text-base">
                                            {deposit.paymentMethod === 'usdt' ? '$' : '₹'}{deposit.amount.toLocaleString(deposit.paymentMethod === 'usdt' ? 'en-US' : 'en-IN')}
                                        </div>
                                        {deposit.paymentMethod === 'usdt' && (
                                            <div className="text-[10px] text-[#d4af35]/40 font-medium">≈ ₹{(deposit.amount * (deposit.exchangeRate || 85)).toLocaleString('en-IN')}</div>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${deposit.paymentMethod === 'usdt' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-[#d4af35]/10 border-[#d4af35]/20'}`}>
                                                {deposit.paymentMethod === 'usdt' ? <Coins className="w-3.5 h-3.5 text-blue-400" /> : <IndianRupee className="w-3.5 h-3.5 text-[#d4af35]" />}
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/70">
                                                    {deposit.paymentMethod === 'usdt' ? 'USDT' : 'Bank Transfer'}
                                                </span>
                                                <div className="text-[9px] text-[#d4af35]/30 font-medium">
                                                    → {deposit.paymentMethod === 'usdt' ? 'USD Wallet' : 'INR Wallet'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        {deposit.screenshotUrl ? (
                                            <button onClick={() => setPreviewUrl(deposit.screenshotUrl)}
                                                className="inline-flex items-center gap-1.5 text-[#d4af35] hover:text-[#f8d76d] font-black text-xs border border-[#d4af35]/20 px-2.5 py-1 rounded-lg hover:bg-[#d4af35]/10 transition-all">
                                                <Eye className="w-3.5 h-3.5" /> View
                                            </button>
                                        ) : <span className="text-xs text-white/20">—</span>}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-[#d4af35]/40 font-medium">
                                        {new Date(deposit.createdAt).toLocaleDateString('en-GB')}
                                    </td>
                                    <td className="px-5 py-4"><StatusBadge status={deposit.status} /></td>
                                    <td className="px-5 py-4">
                                        {deposit.status === 'pending' ? (
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => { setActionDeposit(deposit); setActionType('approved'); }}
                                                    className="px-3 py-1.5 bg-[#32e512]/10 border border-[#32e512]/20 text-[#32e512] hover:bg-[#32e512]/20 rounded-lg text-xs font-black transition-all">
                                                    Approve
                                                </button>
                                                <button onClick={() => { setActionDeposit(deposit); setActionType('rejected'); }}
                                                    className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-black transition-all">
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-white/20 font-medium">Resolved</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Screenshot preview */}
            <AnimatePresence>
                {previewUrl && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
                        onClick={() => setPreviewUrl(null)}>
                        <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            src={previewUrl} alt="Deposit receipt"
                            className="max-w-lg max-h-[80vh] rounded-2xl shadow-2xl object-contain border border-[#d4af35]/20"
                            onClick={e => e.stopPropagation()} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action modal */}
            <AnimatePresence>
                {actionDeposit && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-[#080808] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-[#d4af35]/20">
                            <div className={`p-6 border-b ${actionType === 'approved' ? 'bg-[#32e512]/5 border-[#32e512]/15' : 'bg-red-500/5 border-red-500/15'}`}>
                                <h3 className={`text-lg font-black flex items-center gap-2 ${actionType === 'approved' ? 'text-[#32e512]' : 'text-red-400'}`}>
                                    {actionType === 'approved' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    Confirm {actionType === 'approved' ? 'Approval' : 'Rejection'}
                                </h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="bg-[#d4af35]/5 border border-[#d4af35]/15 p-4 rounded-2xl space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-[#d4af35]/60">Amount:</span>
                                        <span className="font-black text-white text-lg">
                                            {actionDeposit.paymentMethod === 'usdt' ? '$' : '₹'}{actionDeposit.amount.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-[#d4af35]/60">User:</span>
                                        <span className="font-bold text-white">{actionDeposit.userId?.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-[#d4af35]/60">Wallet:</span>
                                        <span className="font-bold text-[#d4af35] text-xs uppercase tracking-widest">
                                            {actionDeposit.paymentMethod === 'usdt' ? 'USD Wallet' : 'INR Wallet'}
                                        </span>
                                    </div>
                                </div>

                                {actionType === 'approved' && (
                                    <p className="text-sm text-white/60 font-medium leading-relaxed bg-[#32e512]/5 border border-[#32e512]/10 p-3 rounded-xl">
                                        This will credit <strong className="text-[#32e512]">
                                            {actionDeposit.paymentMethod === 'usdt'
                                                ? `$${actionDeposit.amount.toFixed(2)} USDT`
                                                : `₹${actionDeposit.amount.toLocaleString('en-IN')}`}
                                        </strong> to the user's {actionDeposit.paymentMethod === 'usdt' ? 'USD' : 'INR'} wallet.
                                    </p>
                                )}

                                <div>
                                    <label className="block text-sm font-bold text-white mb-1.5">Note / Reason <span className="text-white/30 font-normal">(optional)</span></label>
                                    <textarea
                                        value={adminNote}
                                        onChange={(e) => setAdminNote(e.target.value)}
                                        className="w-full bg-[#0A0A0A] border border-[#d4af35]/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af35]/40 transition-all resize-none"
                                        rows="2"
                                        placeholder="E.g. Verified via ICICI bank statement..."
                                    />
                                </div>
                                {message && (
                                    <div className={`p-3 rounded-xl text-sm font-bold text-center ${message.includes('✓') ? 'bg-[#32e512]/10 text-[#32e512] border border-[#32e512]/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                        {message}
                                    </div>
                                )}
                            </div>
                            <div className="p-4 border-t border-[#d4af35]/10 flex justify-end gap-3">
                                <button onClick={() => setActionDeposit(null)} disabled={isSubmitting}
                                    className="px-5 py-2.5 rounded-xl font-bold text-white/50 hover:bg-white/5 transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleActionSubmit} disabled={isSubmitting}
                                    className={`px-5 py-2.5 rounded-xl font-black text-white flex items-center gap-2 transition-all shadow-lg disabled:opacity-50 ${actionType === 'approved'
                                            ? 'bg-[#32e512] text-black hover:opacity-90 shadow-[#32e512]/20'
                                            : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                                        }`}>
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
