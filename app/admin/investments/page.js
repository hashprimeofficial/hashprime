'use client';

import useSWR from 'swr';
import { ShieldAlert, Trash2, Edit2, Loader2, X } from 'lucide-react';
import { useState } from 'react';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AdminInvestmentsPage() {
    const { data, error, isLoading, mutate } = useSWR('/api/admin/investments', fetcher);

    const [editingInvestment, setEditingInvestment] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);

    if (isLoading) return <div className="text-slate-400 animate-pulse font-medium">Loading investments...</div>;
    if (error) return <div className="text-red-500 font-bold">Failed to load investments data</div>;

    const { investments = [] } = data || {};

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

            if (res.ok) {
                setEditingInvestment(null);
                mutate();
            } else {
                alert('Failed to update investment status');
            }
        } catch (err) {
            alert('An error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-navy mb-2 tracking-tight">Investments Ledger</h1>
                <p className="text-slate-500 font-medium">View, edit, and manage all protocol capital locked across all schemes.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto min-h-[50vh]">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-bold">Investor</th>
                                <th className="px-6 py-4 font-bold">Amount (INR)</th>
                                <th className="px-6 py-4 font-bold">USDT Reward</th>
                                <th className="px-6 py-4 font-bold">Scheme</th>
                                <th className="px-6 py-4 font-bold">Maturity Date</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {investments.map((inv) => (
                                <tr key={inv._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-navy">{inv.userId?.name || 'Unknown User (Deleted)'}</div>
                                        <div className="text-xs font-medium text-slate-500">{inv.userId?.email || `${inv.userId}`}</div>
                                    </td>
                                    <td className="px-6 py-4 font-black text-navy">₹{inv.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 font-black text-green-600">+{inv.usdtReward?.toFixed(2) || '0.00'}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-navy text-white px-2.5 py-1 rounded text-xs uppercase font-bold shadow-sm">{inv.schemeType} Plan</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-500">
                                        {inv.maturesAt ? new Date(inv.maturesAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded text-xs font-bold border shadow-sm ${inv.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                                            inv.status === 'completed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                'bg-slate-100 text-slate-600 border-slate-200'
                                            }`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
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
                            {investments.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500 font-medium bg-slate-50 flex flex-col items-center justify-center">
                                        <ShieldAlert className="w-8 h-8 text-slate-400 mb-2" />
                                        No investments recorded in the platform yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Investment Modal */}
            {editingInvestment && (
                <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <div>
                                <h3 className="text-xl font-black text-navy">Edit Investment</h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">
                                    {editingInvestment.userId?.name} • ₹{editingInvestment.amount.toLocaleString()}
                                </p>
                            </div>
                            <button onClick={() => setEditingInvestment(null)} className="text-slate-400 hover:text-navy transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-navy mb-1.5">Investment Status</label>
                                <select name="status" defaultValue={editingInvestment.status} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy font-medium focus:outline-none focus:ring-2 focus:ring-neon focus:border-neon transition-all cursor-pointer">
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setEditingInvestment(null)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-lg transition-colors">Cancel</button>
                                <button type="submit" disabled={isSaving} className="flex-1 py-3 bg-neon text-navy font-black rounded-lg shadow-sm shadow-neon/20 hover:shadow-neon/40 transition-all flex justify-center items-center">
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
