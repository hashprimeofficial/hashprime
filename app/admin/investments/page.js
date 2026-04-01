'use client';

import useSWR from 'swr';
import { ShieldAlert, Trash2, Edit2, Loader2, X, PlusCircle, TrendingUp, CheckCircle2, Clock, XCircle, RefreshCw, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fetcher = (url) => fetch(url).then((res) => res.json());

const SCHEME_OPTIONS = [
    { value: '3m_inr', label: '3 Months INR (18%)' },
    { value: '6m_inr', label: '6 Months INR (38%)' },
    { value: '1y_inr', label: '1 Year INR (80%)' },
    { value: '5y_inr', label: '5 Years INR (500%)' },
    { value: '3m_usd', label: '3 Months USD (18%)' },
    { value: '6m_usd', label: '6 Months USD (38%)' },
    { value: '1y_usd', label: '1 Year USD (80%)' },
    { value: '5y_usd', label: '5 Years USD (500%)' },
];

const inputCls = "w-full bg-[#0A0A0A] border border-[#d4af35]/20 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#d4af35]/50 focus:border-[#d4af35] transition-all shadow-inner placeholder:text-white/20 text-sm";
const lblCls = "block text-[10px] font-black uppercase tracking-widest text-[#d4af35]/80 mb-2";

function StatusBadge({ status }) {
    const map = {
        active: <span className="inline-flex items-center gap-1.5 bg-[#d4af35]/10 text-[#d4af35] border border-[#d4af35]/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider"><CheckCircle2 className="w-3 h-3" />Active</span>,
        pending: <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider"><Clock className="w-3 h-3" />Requested</span>,
        completed: <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider"><TrendingUp className="w-3 h-3" />Completed</span>,
        cancelled: <span className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider"><XCircle className="w-3 h-3" />Cancelled</span>,
    };
    return map[status] || <span className="text-white/30 text-xs">{status}</span>;
}

export default function AdminInvestmentsPage() {
    const { data, error, isLoading, mutate } = useSWR('/api/admin/investments', fetcher);

    const [editingInvestment, setEditingInvestment] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [createForm, setCreateForm] = useState({ userEmail: '', amount: '', schemeType: '3m_inr', currency: 'INR' });
    const [createMessage, setCreateMessage] = useState({ type: '', text: '' });
    const [isCreatingSubmitting, setIsCreatingSubmitting] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [apiMsg, setApiMsg] = useState({ type: '', text: '' });

    if (isLoading) return (
        <div className="space-y-4 animate-pulse">
            <div className="h-12 bg-[#121212] border border-[#d4af35]/10 rounded-2xl w-1/3" />
            <div className="h-[500px] bg-[#0A0A0A] border border-[#d4af35]/10 rounded-3xl" />
        </div>
    );
    if (error) return <div className="text-red-400 font-bold p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">Failed to load investments data.</div>;

    const { investments = [] } = data || {};

    const filteredInvestments = investments.filter(inv => {
        if (filterStatus === 'all') return true;
        return inv.status === filterStatus;
    });

    const showMsg = (type, text) => {
        setApiMsg({ type, text });
        setTimeout(() => setApiMsg({ type: '', text: '' }), 4000);
    };

    const handleDelete = async (id) => {
        if (!confirm('Permanently delete this investment record?')) return;
        setIsDeleting(id);
        try {
            const res = await fetch(`/api/admin/investments/${id}`, { method: 'DELETE' });
            if (res.ok) { mutate(); showMsg('success', 'Investment deleted.'); }
            else showMsg('error', 'Failed to delete');
        } catch { showMsg('error', 'An error occurred'); }
        finally { setIsDeleting(null); }
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const form = new FormData(e.target);
        const updates = { status: form.get('status') };
        try {
            const res = await fetch(`/api/admin/investments/${editingInvestment._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            const result = await res.json();
            if (res.ok) {
                setEditingInvestment(null);
                mutate();
                showMsg('success', updates.status === 'active' ? 'Investment approved. Funds deducted from wallet.' : 'Status updated successfully.');
            } else {
                showMsg('error', result.error || result.details || 'Failed to update');
            }
        } catch { showMsg('error', 'An error occurred'); }
        finally { setIsSaving(false); }
    };

    const handleQuickApprove = async (inv) => {
        const curSymbol = inv.currency === 'USD' ? '$' : '₹';
        if (!confirm(`Approve ${curSymbol}${inv.amount.toLocaleString()} investment? Funds will be deducted from user's wallet.`)) return;
        try {
            const res = await fetch(`/api/admin/investments/${inv._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'active' })
            });
            const result = await res.json();
            if (res.ok) { mutate(); showMsg('success', 'Investment approved.'); }
            else showMsg('error', result.error || result.details || 'Failed. Ensure user has sufficient balance.');
        } catch { showMsg('error', 'An unexpected error occurred.'); }
    };

    const handleCreateInvestment = async (e) => {
        e.preventDefault();
        setIsCreatingSubmitting(true);
        setCreateMessage({ type: '', text: '' });
        try {
            const res = await fetch('/api/admin/investments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createForm)
            });
            const result = await res.json();
            if (res.ok) {
                setCreateMessage({ type: 'success', text: result.message || 'Investment created!' });
                mutate();
                setTimeout(() => {
                    setIsCreating(false);
                    setCreateForm({ userEmail: '', amount: '', schemeType: '3m_inr', currency: 'INR' });
                    setCreateMessage({ type: '', text: '' });
                }, 2000);
            } else {
                setCreateMessage({ type: 'error', text: result.error || 'Failed to create investment' });
            }
        } catch { setCreateMessage({ type: 'error', text: 'An unexpected error occurred' }); }
        finally { setIsCreatingSubmitting(false); }
    };

    const handleProcessMatured = async () => {
        setIsProcessing(true);
        try {
            const res = await fetch('/api/admin/investments/process', { method: 'POST' });
            const result = await res.json();
            if (res.ok) { mutate(); showMsg('success', result.message); }
            else showMsg('error', result.error || 'Failed to process');
        } catch { showMsg('error', 'An unexpected error occurred'); }
        finally { setIsProcessing(false); }
    };

    const handleExport = () => {
        if (!filteredInvestments || filteredInvestments.length === 0) return;

        const exportData = filteredInvestments.map(inv => ({
            Investor: inv.userId?.name || 'Unknown',
            Email: inv.userId?.email || String(inv.userId),
            Amount: inv.amount,
            Currency: inv.currency,
            Yield: inv.usdtReward || 0,
            Scheme: inv.schemeType,
            Maturity: inv.maturesAt ? new Date(inv.maturesAt).toLocaleString() : 'N/A',
            Status: inv.status,
            Date: new Date(inv.createdAt).toLocaleString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Investments');
        XLSX.writeFile(workbook, 'Investments_Export.xlsx');
    };

    const counts = {
        all: investments.length,
        pending: investments.filter(i => i.status === 'pending').length,
        active: investments.filter(i => i.status === 'active').length,
        completed: investments.filter(i => i.status === 'completed').length,
        cancelled: investments.filter(i => i.status === 'cancelled').length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white mb-1 tracking-tight flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#d4af35]/10 rounded-xl flex items-center justify-center border border-[#d4af35]/20">
                            <TrendingUp className="w-5 h-5 text-[#d4af35]" />
                        </div>
                        Investments Ledger
                    </h1>
                    <p className="text-[#d4af35]/60 font-medium ml-13 text-sm mt-1">
                        {investments.length} total · {counts.pending} pending · {counts.active} active
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button
                        onClick={handleExport}
                        className="bg-[#0A0A0A] hover:bg-[#121212] text-[#d4af35] font-bold py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition-colors border border-[#d4af35]/30 hover:border-[#d4af35]/60 text-sm"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <button
                        onClick={handleProcessMatured}
                        disabled={isProcessing}
                        className="bg-[#0A0A0A] hover:bg-[#121212] text-[#d4af35] font-bold py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition-colors border border-[#d4af35]/30 hover:border-[#d4af35]/60 disabled:opacity-50 text-sm"
                    >
                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                        Process Matured
                    </button>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-[#d4af35] hover:bg-[#f8d76d] text-[#0A0A0A] font-black py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(212,175,53,0.3)] text-sm uppercase tracking-wide"
                    >
                        <PlusCircle className="w-4 h-4" />
                        Create Investment
                    </button>
                </div>
            </div>

            {/* API Feedback Message */}
            <AnimatePresence>
                {apiMsg.text && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className={`flex items-center gap-3 px-5 py-4 rounded-2xl border text-sm font-bold ${apiMsg.type === 'success' ? 'bg-[#32e512]/10 border-[#32e512]/30 text-[#32e512]' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                        {apiMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
                        {apiMsg.text}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {[
                    { key: 'all', label: 'All' },
                    { key: 'pending', label: 'Requested' },
                    { key: 'active', label: 'Active' },
                    { key: 'completed', label: 'Completed' },
                    { key: 'cancelled', label: 'Cancelled' },
                ].map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setFilterStatus(key)}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all border ${filterStatus === key
                            ? 'bg-[#d4af35]/10 text-[#d4af35] border-[#d4af35]/40 shadow-[0_0_10px_rgba(212,175,53,0.1)]'
                            : 'bg-[#0A0A0A] text-white/40 border-white/10 hover:text-[#d4af35] hover:border-[#d4af35]/30'
                            }`}
                    >
                        {label} <span className="opacity-60 ml-1">({counts[key]})</span>
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-[#0A0A0A] border border-[#d4af35]/20 rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <div className="overflow-x-auto min-h-[50vh]">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-[#d4af35]/5 border-b border-[#d4af35]/20">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/70">Investor</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/70">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/70">Yield</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/70">Scheme</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/70">Maturity</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/70">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/70 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#d4af35]/5">
                            {filteredInvestments.map((inv) => {
                                const curSymbol = inv.currency === 'USD' ? '$' : '₹';
                                const locale = inv.currency === 'USD' ? 'en-US' : 'en-IN';
                                return (
                                    <tr key={inv._id} className="hover:bg-[#d4af35]/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-white text-sm">{inv.userId?.name || 'Unknown'}</div>
                                            <div className="text-xs font-medium text-[#d4af35]/50">{inv.userId?.email || String(inv.userId)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-black text-white text-base">{curSymbol}{inv.amount.toLocaleString(locale)}</div>
                                            <div className="text-[10px] text-[#d4af35]/50 font-black uppercase tracking-widest">{inv.currency}</div>
                                        </td>
                                        <td className="px-6 py-4 font-black text-[#32e512]">
                                            +{curSymbol}{(inv.usdtReward || 0).toLocaleString(locale, { maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-[#d4af35]/10 text-[#d4af35] border border-[#d4af35]/20 px-2.5 py-1 rounded-lg text-[10px] uppercase font-black tracking-wider shadow-inner">{inv.schemeType}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-white/40">
                                            {inv.maturesAt ? new Date(inv.maturesAt).toLocaleDateString('en-GB') : '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={inv.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {inv.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleQuickApprove(inv)}
                                                        className="px-3 py-1.5 bg-[#32e512]/10 text-[#32e512] font-black text-[10px] uppercase tracking-wider rounded-lg hover:bg-[#32e512]/20 transition-colors border border-[#32e512]/20"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setEditingInvestment(inv)}
                                                    className="p-2 bg-[#d4af35]/10 text-[#d4af35] rounded-lg hover:bg-[#d4af35]/20 transition-colors border border-[#d4af35]/10"
                                                    title="Edit Status"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(inv._id)}
                                                    disabled={isDeleting === inv._id}
                                                    className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50 border border-red-500/10"
                                                    title="Delete Record"
                                                >
                                                    {isDeleting === inv._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredInvestments.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-16 text-center">
                                        <ShieldAlert className="w-10 h-10 text-[#d4af35]/20 mb-3 mx-auto" />
                                        <p className="text-[#d4af35]/40 font-bold text-sm">No investments found for this filter.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingInvestment && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
                            className="bg-[#0A0A0A] border border-[#d4af35]/20 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] w-full max-w-md overflow-hidden">
                            <div className="flex justify-between items-center px-6 py-5 border-b border-[#d4af35]/10 bg-[#d4af35]/5">
                                <div>
                                    <h3 className="text-lg font-black text-white">Edit Investment</h3>
                                    <p className="text-xs text-[#d4af35]/70 font-medium mt-1">
                                        {editingInvestment.userId?.name} · {editingInvestment.currency === 'USD' ? '$' : '₹'}{editingInvestment.amount.toLocaleString()}
                                    </p>
                                </div>
                                <button onClick={() => setEditingInvestment(null)} className="text-white/40 hover:text-white transition-colors bg-white/5 p-1.5 rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSaveEdit} className="p-6 space-y-5">
                                <div>
                                    <label className={lblCls}>Change Status</label>
                                    <select name="status" defaultValue={editingInvestment.status} className={inputCls}>
                                        <option value="pending" className="bg-[#0A0A0A]">Pending (Requested)</option>
                                        <option value="active" className="bg-[#0A0A0A]">Active (Approved)</option>
                                        <option value="completed" className="bg-[#0A0A0A]">Completed (Matured)</option>
                                        <option value="cancelled" className="bg-[#0A0A0A]">Cancelled</option>
                                    </select>
                                    <p className="text-[10px] text-[#d4af35]/50 font-bold uppercase tracking-widest mt-2">
                                        ⚠ Setting to &quot;Active&quot; will deduct funds from user&apos;s wallet. &quot;Completed&quot; will credit principal + yield.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setEditingInvestment(null)}
                                        className="flex-1 py-3.5 text-white/40 font-bold hover:bg-white/5 rounded-xl transition-colors border border-white/10 text-sm">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={isSaving}
                                        className="flex-1 py-3.5 bg-[#d4af35] hover:bg-[#f8d76d] text-[#0A0A0A] font-black rounded-xl shadow-[0_4px_15px_rgba(212,175,53,0.3)] transition-all flex justify-center items-center gap-2 disabled:opacity-50 uppercase tracking-wide text-sm">
                                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create Modal */}
            <AnimatePresence>
                {isCreating && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
                            className="bg-[#0A0A0A] border border-[#d4af35]/20 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] w-full max-w-md overflow-hidden">
                            <div className="flex justify-between items-center px-6 py-5 border-b border-[#d4af35]/10 bg-[#d4af35]/5">
                                <div>
                                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#d4af35] animate-pulse" />
                                        Create Investment
                                    </h3>
                                    <p className="text-xs text-[#d4af35]/60 font-medium mt-1">Deduct from wallet and activate a scheme.</p>
                                </div>
                                <button onClick={() => setIsCreating(false)} className="text-white/40 hover:text-white transition-colors bg-white/5 p-1.5 rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateInvestment} className="p-6 space-y-5">
                                {createMessage.text && (
                                    <div className={`p-3 rounded-xl text-sm font-bold text-center ${createMessage.type === 'success' ? 'bg-[#32e512]/10 text-[#32e512] border border-[#32e512]/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                        {createMessage.text}
                                    </div>
                                )}

                                <div>
                                    <label className={lblCls}>User Email</label>
                                    <input type="email" required value={createForm.userEmail}
                                        onChange={(e) => setCreateForm({ ...createForm, userEmail: e.target.value })}
                                        className={inputCls} placeholder="user@example.com" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={lblCls}>Currency</label>
                                        <select value={createForm.currency}
                                            onChange={(e) => {
                                                const cur = e.target.value;
                                                setCreateForm({ ...createForm, currency: cur, schemeType: cur === 'USD' ? '3m_usd' : '3m_inr' });
                                            }}
                                            className={inputCls}>
                                            <option value="INR" className="bg-[#0A0A0A]">INR (₹)</option>
                                            <option value="USD" className="bg-[#0A0A0A]">USD ($)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={lblCls}>Amount</label>
                                        <input type="number" min="1" required value={createForm.amount}
                                            onChange={(e) => setCreateForm({ ...createForm, amount: e.target.value })}
                                            className={inputCls} placeholder={createForm.currency === 'INR' ? '50000' : '500'} />
                                    </div>
                                </div>

                                <div>
                                    <label className={lblCls}>Scheme Type</label>
                                    <select value={createForm.schemeType}
                                        onChange={(e) => setCreateForm({ ...createForm, schemeType: e.target.value })}
                                        className={inputCls}>
                                        {SCHEME_OPTIONS.filter(s => createForm.currency === 'USD' ? s.value.endsWith('_usd') : s.value.endsWith('_inr')).map(s => (
                                            <option key={s.value} value={s.value} className="bg-[#0A0A0A]">{s.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setIsCreating(false)}
                                        className="flex-1 py-3.5 text-white/40 font-bold hover:bg-white/5 rounded-xl transition-colors border border-white/10 text-sm">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={isCreatingSubmitting}
                                        className="flex-1 py-3.5 bg-[#d4af35] hover:bg-[#f8d76d] text-[#0A0A0A] font-black rounded-xl shadow-[0_4px_15px_rgba(212,175,53,0.3)] transition-all flex justify-center items-center gap-2 disabled:opacity-50 uppercase tracking-wide text-sm">
                                        {isCreatingSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create & Activate'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
