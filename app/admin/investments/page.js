'use client';

import useSWR from 'swr';
import { ShieldAlert, Trash2, Edit2, Loader2, X, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AdminInvestmentsPage() {
    const { data, error, isLoading, mutate } = useSWR('/api/admin/investments', fetcher);

    const [editingInvestment, setEditingInvestment] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);

    // Create Investment State
    const [isCreating, setIsCreating] = useState(false);
    const [createForm, setCreateForm] = useState({ userEmail: '', amount: '', schemeType: '3m' });
    const [createMessage, setCreateMessage] = useState({ type: '', text: '' });
    const [isCreatingSubmitting, setIsCreatingSubmitting] = useState(false);

    // Process State
    const [isProcessing, setIsProcessing] = useState(false);

    // Filter State
    const [filterStatus, setFilterStatus] = useState('all');

    if (isLoading) return <div className="text-slate-400 animate-pulse font-medium">Loading investments...</div>;
    if (error) return <div className="text-red-500 font-bold">Failed to load investments data</div>;

    const { investments = [] } = data || {};

    const filteredInvestments = investments.filter(inv => {
        if (filterStatus === 'all') return true;
        return inv.status === filterStatus;
    });

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to permanently delete this investment record?')) return;

        setIsDeleting(id);
        try {
            const res = await fetch(`/api/admin/investments/${id}`, { method: 'DELETE' });
            if (res.ok) {
                mutate();
            } else {
                alert('Failed to delete investment');
            }
        } catch (err) {
            alert('An error occurred');
        } finally {
            setIsDeleting(null);
        }
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const form = new FormData(e.target);
        const updates = {
            status: form.get('status')
        };

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
                if (updates.status === 'active' && editingInvestment.status === 'pending') {
                    alert('Investment approved and funds deducted from user wallet.');
                }
            } else {
                alert(result.error || 'Failed to update investment status');
            }
        } catch (err) {
            alert('An error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    const handleQuickApprove = async (inv) => {
        if (!confirm(`Approve this ₹${inv.amount.toLocaleString('en-IN')} investment? This will deduct the funds from the user's wallet.`)) return;

        try {
            const res = await fetch(`/api/admin/investments/${inv._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'active' })
            });

            const result = await res.json();
            if (res.ok) {
                mutate();
                alert('Investment approved successfully.');
            } else {
                alert(result.error || 'Failed to approve. Ensure user has sufficient balance.');
            }
        } catch (err) {
            alert('An unexpected error occurred during approval.');
        }
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
                setCreateMessage({ type: 'success', text: result.message });
                mutate();
                setTimeout(() => {
                    setIsCreating(false);
                    setCreateForm({ userEmail: '', amount: '', schemeType: '3m' });
                    setCreateMessage({ type: '', text: '' });
                }, 2000);
            } else {
                setCreateMessage({ type: 'error', text: result.error || 'Failed to create investment' });
            }
        } catch (error) {
            setCreateMessage({ type: 'error', text: 'An unexpected error occurred' });
        } finally {
            setIsCreatingSubmitting(false);
        }
    };

    const handleProcessMatured = async () => {
        setIsProcessing(true);
        try {
            const res = await fetch('/api/admin/investments/process', { method: 'POST' });
            const result = await res.json();

            if (res.ok) {
                alert(result.message);
                mutate();
            } else {
                alert(result.error || 'Failed to process investments');
            }
        } catch (error) {
            alert('An unexpected error occurred');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-navy mb-2 tracking-tight">Investments Ledger</h1>
                    <p className="text-slate-500 font-medium">View, edit, and manage all protocol capital locked across all schemes.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button
                        onClick={handleProcessMatured}
                        disabled={isProcessing}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-200 disabled:opacity-50"
                    >
                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Process Matured'}
                    </button>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-navy hover:bg-black text-white font-bold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-navy/20"
                    >
                        <PlusCircle className="w-5 h-5 text-neon" />
                        Create Investment
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {['all', 'pending', 'active', 'completed', 'cancelled'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-colors border ${filterStatus === status
                                ? 'bg-navy text-white border-navy'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        {status === 'pending' ? 'requested' : status}
                    </button>
                ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto min-h-[50vh]">
                    <table className="w-full text-left whitespace-nowrap border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-bold">Investor</th>
                                <th className="px-6 py-4 font-bold">Amount (INR)</th>
                                <th className="px-6 py-4 font-bold">USDT Reward</th>
                                <th className="px-6 py-4 font-bold">Scheme</th>
                                <th className="px-6 py-4 font-bold">Maturity Date</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredInvestments.map((inv) => (
                                <tr key={inv._id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-navy">{inv.userId?.name || 'Unknown User (Deleted)'}</div>
                                        <div className="text-xs font-medium text-slate-500">{inv.userId?.email || `${inv.userId}`}</div>
                                    </td>
                                    <td className="px-6 py-4 font-black text-navy">₹{inv.amount.toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4 font-black text-green-600">+{inv.usdtReward?.toFixed(2) || '0.00'}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-navy text-white px-2.5 py-1 rounded text-xs uppercase font-bold shadow-sm">{inv.schemeType} Plan</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-500">
                                        {inv.maturesAt ? new Date(inv.maturesAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded text-xs font-bold shadow-sm capitalize ${inv.status === 'active' ? 'bg-green-100 text-green-700' :
                                                inv.status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                                    inv.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-slate-100 text-slate-600'
                                            }`}>
                                            {inv.status === 'pending' ? 'requested' : inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {inv.status === 'pending' && (
                                                <button
                                                    onClick={() => handleQuickApprove(inv)}
                                                    className="px-2 py-1.5 bg-lime-100 text-lime-700 font-bold text-xs rounded hover:bg-lime-200 transition-colors border border-lime-300"
                                                >
                                                    Approve
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setEditingInvestment(inv)}
                                                className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                                                title="Edit Status"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(inv._id)}
                                                disabled={isDeleting === inv._id}
                                                className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors disabled:opacity-50"
                                                title="Delete Record"
                                            >
                                                {isDeleting === inv._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredInvestments.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500 font-medium bg-slate-50 flex flex-col items-center justify-center">
                                        <ShieldAlert className="w-10 h-10 text-slate-300 mb-3" />
                                        No investments recorded in the platform yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Investment Modal */}
            <AnimatePresence>
                {editingInvestment && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
                            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                                <div>
                                    <h3 className="text-xl font-black text-navy border-b-2 border-neon inline-block pb-1">Edit Investment</h3>
                                    <p className="text-xs text-slate-500 font-medium mt-2">
                                        User: <strong className="text-navy">{editingInvestment.userId?.name}</strong> • Amount: <strong className="text-navy">₹{editingInvestment.amount.toLocaleString('en-IN')}</strong>
                                    </p>
                                </div>
                                <button onClick={() => setEditingInvestment(null)} className="text-slate-400 hover:text-navy transition-colors bg-white p-1 rounded-full shadow-sm">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSaveEdit} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-navy mb-2">Change Status</label>
                                    <select name="status" defaultValue={editingInvestment.status} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-navy font-bold focus:outline-none focus:ring-2 focus:ring-neon focus:border-neon transition-all cursor-pointer shadow-sm">
                                        <option value="pending">Pending</option>
                                        <option value="active">Active</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                                <div className="pt-2 flex gap-3">
                                    <button type="button" onClick={() => setEditingInvestment(null)} className="flex-1 py-3.5 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-200">Cancel</button>
                                    <button type="submit" disabled={isSaving} className="flex-1 py-3.5 bg-neon hover:bg-[#32e512] text-navy font-black rounded-xl shadow-lg transition-all flex justify-center items-center disabled:opacity-50">
                                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create Investment Modal */}
            <AnimatePresence>
                {isCreating && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
                            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                                <div>
                                    <h3 className="text-xl font-black text-navy flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                                        Create Investment
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium mt-1">Deduct from user wallet & activate a scheme.</p>
                                </div>
                                <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-navy transition-colors bg-white p-1 rounded-full shadow-sm">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateInvestment} className="p-6 space-y-5">
                                {createMessage.text && (
                                    <div className={`p-3 rounded-xl text-sm font-bold text-center ${createMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {createMessage.text}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-bold text-navy mb-1.5">User Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={createForm.userEmail}
                                        onChange={(e) => setCreateForm({ ...createForm, userEmail: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neon"
                                        placeholder="user@example.com"
                                    />
                                    <p className="text-xs text-slate-400 mt-1">User must have an approved KYC.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-navy mb-1.5">Amount (INR)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        value={createForm.amount}
                                        onChange={(e) => setCreateForm({ ...createForm, amount: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neon font-bold text-navy"
                                        placeholder="50000"
                                    />
                                    <p className="text-xs text-slate-400 mt-1">Amount will be deducted from Wallet Balance.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-navy mb-1.5">Scheme Type</label>
                                    <select
                                        value={createForm.schemeType}
                                        onChange={(e) => setCreateForm({ ...createForm, schemeType: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-neon cursor-pointer"
                                    >
                                        <option value="3m">3 Months (18% Return)</option>
                                        <option value="6m">6 Months (38% Return)</option>
                                        <option value="1y">1 Year (80% Return)</option>
                                        <option value="5y">5 Years (500% Return)</option>
                                    </select>
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button type="button" onClick={() => setIsCreating(false)} className="flex-1 py-3.5 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-200">Cancel</button>
                                    <button type="submit" disabled={isCreatingSubmitting} className="flex-1 py-3.5 bg-navy hover:bg-black text-white font-black rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50">
                                        {isCreatingSubmitting ? <Loader2 className="w-5 h-5 animate-spin text-neon" /> : 'Create & Activate'}
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
