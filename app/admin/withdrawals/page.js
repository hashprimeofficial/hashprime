'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { ArrowUpRight, Copy, CheckCircle2, XCircle, Loader2, AlertCircle, Search, DollarSign, IndianRupee, Gift, Wallet, Eye, X, Landmark, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';

const fetcher = (url) => fetch(url).then((res) => res.json());

const STATUS_PILL = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const WALLET_ICON = {
    USD: <DollarSign className="w-3.5 h-3.5 text-blue-400" />,
    INR: <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />,
    Referral: <Gift className="w-3.5 h-3.5 text-purple-400" />,
};
const WALLET_COLOR = {
    USD: 'text-blue-400',
    INR: 'text-emerald-400',
    Referral: 'text-purple-400',
};

export default function AdminWithdrawalsPage() {
    const { data, error, isLoading, mutate } = useSWR('/api/admin/withdrawals', fetcher);
    const [processingId, setProcessingId] = useState(null);
    const [rejectionNote, setRejectionNote] = useState('');
    const [rejectingId, setRejectingId] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [search, setSearch] = useState('');
    const [copied, setCopied] = useState(null);
    const [detailsItem, setDetailsItem] = useState(null);  // withdrawal to show in modal

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#d4af35]" />
            <p className="text-[#d4af35]/50 text-sm font-black uppercase tracking-widest">Loading withdrawals…</p>
        </div>
    );
    if (error) return <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl font-bold">Failed to load withdrawal data.</div>;

    const { withdrawals = [] } = data || {};

    const filtered = withdrawals.filter(w => {
        const matchStatus = filterStatus === 'all' || w.status === filterStatus;
        const matchSearch = !search || w.userId?.name?.toLowerCase().includes(search.toLowerCase()) || w.userId?.email?.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    const counts = {
        all: withdrawals.length,
        pending: withdrawals.filter(w => w.status === 'pending').length,
        approved: withdrawals.filter(w => w.status === 'approved').length,
        rejected: withdrawals.filter(w => w.status === 'rejected').length,
    };

    const handleAction = async (id, status, note = '') => {
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
                if (status === 'rejected') { setRejectingId(null); setRejectionNote(''); }
            } else {
                alert(result.error || `Failed to ${status} withdrawal`);
            }
        } catch { alert('An unexpected error occurred'); }
        finally { setProcessingId(null); }
    };

    const handleExport = () => {
        if (!filtered || filtered.length === 0) return;

        const exportData = filtered.map(w => ({
            User: w.userId?.name || 'Unknown',
            Email: w.userId?.email || 'N/A',
            Amount: w.amount,
            SourceWallet: w.sourceWallet || 'N/A',
            PayoutMethod: w.payoutMethod || 'N/A',
            Destination: w.payoutMethod === 'Bank' || w.walletAddress?.startsWith('Bank:') ? (w.bankAccountId ? w.bankAccountId.accountNumber : w.walletAddress) : w.walletAddress,
            Status: w.status,
            AdminNote: w.adminNote || '',
            Date: new Date(w.createdAt).toLocaleString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Withdrawals');
        XLSX.writeFile(workbook, 'Withdrawals_Export.xlsx');
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const FILTER_PILLS = ['all', 'pending', 'approved', 'rejected'];

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-white flex items-center gap-3">
                            <div className="w-9 h-9 bg-[#d4af35]/10 rounded-xl border border-[#d4af35]/20 flex items-center justify-center">
                                <ArrowUpRight className="w-5 h-5 text-[#d4af35]" />
                            </div>
                            Withdrawals
                        </h1>
                        <p className="text-[#d4af35]/40 text-sm font-medium mt-1 ml-12">
                            <span className="text-amber-400 font-black">{counts.pending}</span> pending · {counts.approved} approved · {counts.rejected} rejected
                        </p>
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d4af35]/40" />
                        <input type="text" placeholder="Search user…" value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full bg-[#080808] border border-[#d4af35]/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#d4af35]/40 transition-all" />
                    </div>
                </div>

                {/* Filter pills */}
                <div className="flex gap-2 flex-wrap">
                    {FILTER_PILLS.map(f => (
                        <button key={f} onClick={() => setFilterStatus(f)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-black capitalize border transition-all ${filterStatus === f ? 'bg-[#d4af35] text-black border-[#d4af35]' : 'bg-[#080808] border-[#d4af35]/15 text-[#d4af35]/50 hover:border-[#d4af35]/40 hover:text-[#d4af35]'}`}>
                            {f} <span className="opacity-60">({counts[f]})</span>
                        </button>
                    ))}
                    <button onClick={handleExport} className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-black capitalize border transition-all bg-[#080808] border-[#d4af35]/15 text-[#d4af35] hover:border-[#d4af35]/40 hover:bg-[#d4af35]/10">
                        <Download className="w-3.5 h-3.5" /> Export
                    </button>
                </div>

                {/* Table */}
                <div className="bg-[#080808] border border-[#d4af35]/15 rounded-3xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="bg-[#d4af35]/5 border-b border-[#d4af35]/10">
                                <tr>
                                    {['User', 'Amount', 'Source Wallet', 'Payout Method', 'Destination', 'Status', 'Date', 'Actions'].map((h, i) => (
                                        <th key={h} className={`px-5 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/50 ${i === 7 ? 'text-center' : ''}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#d4af35]/5">
                                {filtered.map(w => (
                                    <motion.tr key={w._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="hover:bg-[#d4af35]/3 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-xl bg-[#d4af35]/10 border border-[#d4af35]/20 flex items-center justify-center font-black text-[#d4af35] text-xs shrink-0">
                                                    {(w.userId?.name?.[0] || '?').toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-sm">{w.userId?.name || 'Unknown'}</div>
                                                    <div className="text-[10px] text-[#d4af35]/40">{w.userId?.email || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className={`font-black text-base ${WALLET_COLOR[w.sourceWallet] || 'text-white'}`}>
                                                {w.sourceWallet === 'INR' ? '₹' : '$'}{w.amount?.toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1.5">
                                                {WALLET_ICON[w.sourceWallet] || <Wallet className="w-3.5 h-3.5 text-[#d4af35]/40" />}
                                                <span className={`text-xs font-black ${WALLET_COLOR[w.sourceWallet] || 'text-white/40'}`}>{w.sourceWallet || '—'}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-xs font-black text-[#d4af35]/60 uppercase tracking-widest">{w.payoutMethod || '—'}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <button onClick={() => setDetailsItem(w)}
                                                className="flex items-center gap-1.5 text-[#d4af35]/50 hover:text-[#d4af35] transition-colors group">
                                                <Eye className="w-4 h-4" />
                                                <span className="text-xs font-black">View</span>
                                            </button>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${STATUS_PILL[w.status]}`}>
                                                {w.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-[#d4af35]/40 font-medium">
                                            {new Date(w.createdAt).toLocaleDateString('en-GB')}
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            {w.status === 'pending' ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => handleAction(w._id, 'approved', 'Approved by admin')}
                                                        disabled={processingId === w._id}
                                                        className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 border border-emerald-500/20 transition-all disabled:opacity-50"
                                                        title="Approve">
                                                        {processingId === w._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                                    </button>
                                                    <button onClick={() => setRejectingId(w._id)}
                                                        disabled={processingId === w._id}
                                                        className="p-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 border border-red-500/20 transition-all disabled:opacity-50"
                                                        title="Reject">
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                                                    {w.status === 'approved' ? 'Settled' : 'Refunded'}
                                                </span>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr><td colSpan="8" className="px-6 py-16 text-center">
                                        <AlertCircle className="w-10 h-10 text-[#d4af35]/20 mx-auto mb-3" />
                                        <p className="text-[#d4af35]/40 font-medium text-sm">No withdrawals match the current filter.</p>
                                    </td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── Details Modal ── */}
            <AnimatePresence>
                {detailsItem && (() => {
                    const w = detailsItem;
                    const isBank = w.payoutMethod === 'Bank' || w.walletAddress?.startsWith('Bank:');

                    // Prefer the populated DB bank document; fall back to parsing the legacy string
                    const bank = w.bankAccountId;
                    let parsedBankName = '', parsedAccount = '', parsedHolder = '';
                    if (isBank && !bank) {
                        const m = w.walletAddress?.match(/^Bank:\s*(.+?)\s*—\s*(.+?)\s*\((.+?)\)$/);
                        if (m) { parsedBankName = m[1]; parsedAccount = m[2]; parsedHolder = m[3]; }
                        else { parsedBankName = w.walletAddress; }
                    }
                    const Row = ({ label, value, mono }) => (
                        <div className="flex items-start justify-between gap-4 py-3 border-b border-[#d4af35]/5 last:border-0">
                            <span className="text-xs font-black uppercase tracking-widest text-[#d4af35]/40 shrink-0">{label}</span>
                            <span className={`text-sm text-white font-bold text-right break-all ${mono ? 'font-mono' : ''}`}>{value || '—'}</span>
                        </div>
                    );
                    return (
                        <>
                            <motion.div key="det-bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={() => setDetailsItem(null)} />
                            <motion.div key="det-panel" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }}
                                className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col">
                                <div className="flex-1 bg-[#080808] border-l border-[#d4af35]/20 shadow-2xl overflow-y-auto">
                                    {/* Header */}
                                    <div className="p-6 border-b border-[#d4af35]/10 bg-[#d4af35]/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {isBank
                                                ? <Landmark className="w-5 h-5 text-[#d4af35]" />
                                                : <ArrowUpRight className="w-5 h-5 text-[#d4af35]" />}
                                            <div>
                                                <h3 className="font-black text-white text-base">Withdrawal Details</h3>
                                                <p className="text-[10px] font-black text-[#d4af35]/40 uppercase tracking-widest">
                                                    {isBank ? 'Bank Transfer' : 'USDT (BEP20)'} · {w.sourceWallet} Wallet
                                                </p>
                                            </div>
                                        </div>
                                        <button onClick={() => setDetailsItem(null)}
                                            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* User Info */}
                                    <div className="p-6 border-b border-[#d4af35]/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#d4af35]/10 border border-[#d4af35]/20 flex items-center justify-center font-black text-[#d4af35]">
                                                {(w.userId?.name?.[0] || '?').toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-black text-white">{w.userId?.name || 'Unknown'}</div>
                                                <div className="text-xs text-[#d4af35]/50">{w.userId?.email || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Amount & Status */}
                                    <div className="p-6 border-b border-[#d4af35]/10 flex items-center justify-between">
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-[#d4af35]/40 mb-1">Amount</div>
                                            <div className={`text-3xl font-black ${WALLET_COLOR[w.sourceWallet] || 'text-white'}`}>
                                                {w.sourceWallet === 'INR' ? '₹' : '$'}{w.amount?.toFixed(2)}
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1.5 rounded-xl border text-xs font-black uppercase tracking-wider ${STATUS_PILL[w.status]}`}>{w.status}</span>
                                    </div>

                                    {/* Payout Details */}
                                    <div className="p-6">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-[#d4af35]/40 mb-3">
                                            {isBank ? 'Bank Account Details' : 'Payout Address'}
                                        </div>
                                        <div className="bg-[#040404] border border-[#d4af35]/10 rounded-2xl px-4">
                                            {isBank ? (
                                                <>
                                                    {bank ? (
                                                        // Full details from DB
                                                        <>
                                                            <Row label="Account Holder" value={bank.accountHolderName} />
                                                            <Row label="Bank Name" value={bank.bankName} />
                                                            <Row label="Account No." value={bank.accountNumber} mono />
                                                            <Row label="IFSC Code" value={bank.ifsc} mono />
                                                            <Row label="Branch" value={bank.branch} />
                                                            <Row label="Account Type" value={bank.accountType} />
                                                        </>
                                                    ) : (
                                                        // Legacy: parsed from the stored string
                                                        <>
                                                            <Row label="Bank" value={parsedBankName} />
                                                            <Row label="Account No." value={parsedAccount} mono />
                                                            <Row label="Account Holder" value={parsedHolder} />
                                                            <div className="py-2 text-[10px] text-amber-400/50 font-bold italic">Full bank details not available for this record (submitted before the update).</div>
                                                        </>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="py-3">
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-xs font-mono text-white/70 break-all flex-1">{w.walletAddress}</span>
                                                        <button onClick={() => copyToClipboard(w.walletAddress, 'detail')}
                                                            className="shrink-0 p-1.5 rounded-lg bg-[#d4af35]/10 text-[#d4af35]/60 hover:text-[#d4af35] transition-all border border-[#d4af35]/15">
                                                            {copied === 'detail' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Meta */}
                                        <div className="mt-5 bg-[#040404] border border-[#d4af35]/10 rounded-2xl px-4">
                                            <Row label="Source" value={`${w.sourceWallet} Wallet`} />
                                            <Row label="Method" value={w.payoutMethod || '—'} />
                                            <Row label="Submitted" value={new Date(w.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })} />
                                            {w.adminNote && <Row label="Admin Note" value={w.adminNote} />}
                                        </div>

                                        {/* Quick Actions */}
                                        {w.status === 'pending' && (
                                            <div className="flex gap-3 mt-6">
                                                <button onClick={() => { handleAction(w._id, 'approved', 'Approved by admin'); setDetailsItem(null); }}
                                                    disabled={processingId === w._id}
                                                    className="flex-1 py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl font-black text-sm hover:bg-emerald-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4" /> Approve
                                                </button>
                                                <button onClick={() => { setDetailsItem(null); setRejectingId(w._id); }}
                                                    className="flex-1 py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl font-black text-sm hover:bg-red-500/20 transition-all flex items-center justify-center gap-2">
                                                    <XCircle className="w-4 h-4" /> Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    );
                })()}
            </AnimatePresence>

            {/* Rejection Modal */}
            <AnimatePresence>
                {rejectingId && (
                    <>
                        <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setRejectingId(null)} />
                        <motion.div key="modal" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div className="bg-[#080808] border border-red-500/20 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                                <div className="p-6 border-b border-red-500/10">
                                    <h3 className="text-lg font-black text-red-400 flex items-center gap-2"><XCircle className="w-5 h-5" /> Reject Withdrawal</h3>
                                    <p className="text-sm text-white/30 font-medium mt-1">Funds will be refunded to the user's wallet.</p>
                                </div>
                                <div className="p-6 space-y-4">
                                    <textarea rows="3" placeholder="Reason (e.g. Invalid wallet network, please re-submit)."
                                        value={rejectionNote} onChange={e => setRejectionNote(e.target.value)}
                                        className="w-full bg-[#0A0A0A] border border-red-500/20 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-red-500/40 resize-none" />
                                    <div className="flex gap-3">
                                        <button onClick={() => { setRejectingId(null); setRejectionNote(''); }}
                                            className="flex-1 py-3 text-white/40 font-bold hover:bg-white/5 rounded-xl border border-white/10 transition-all">
                                            Cancel
                                        </button>
                                        <button onClick={() => handleAction(rejectingId, 'rejected', rejectionNote)}
                                            disabled={processingId === rejectingId || !rejectionNote.trim()}
                                            className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-black rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                                            {processingId === rejectingId ? <Loader2 className="w-4 h-4 animate-spin" /> : <><XCircle className="w-4 h-4" /> Confirm Reject</>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
