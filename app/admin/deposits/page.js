'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle, Clock, Search, AlertCircle, FileText, IndianRupee, Coins } from 'lucide-react';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AdminDepositsPage() {
    const { data, error, isLoading, mutate } = useSWR('/api/admin/deposits', fetcher);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Action State
    const [actionDeposit, setActionDeposit] = useState(null);
    const [actionType, setActionType] = useState(null); // 'approved' or 'rejected'
    const [adminNote, setAdminNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleActionSubmit = async () => {
        setIsSubmitting(true);
        setMessage('');

        try {
            const res = await fetch('/api/admin/deposits', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    depositId: actionDeposit._id,
                    status: actionType,
                    adminNote: adminNote
                })
            });

            const result = await res.json();

            if (res.ok) {
                setMessage('Deposit ' + actionType + ' successfully.');
                mutate();
                setTimeout(() => {
                    setActionDeposit(null);
                    setAdminNote('');
                    setMessage('');
                }, 2000);
            } else {
                setMessage(result.error || 'Failed to update deposit.');
            }
        } catch (error) {
            setMessage('An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-neon" /></div>;
    if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-xl font-bold">Failed to load deposits</div>;

    let deposits = data?.deposits || [];

    if (filterStatus !== 'all') {
        deposits = deposits.filter(d => d.status === filterStatus);
    }

    if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        deposits = deposits.filter(d =>
            d.userId?.name?.toLowerCase().includes(lowerTerm) ||
            d.userId?.email?.toLowerCase().includes(lowerTerm)
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-navy">Deposit Management</h1>
                    <p className="text-slate-500 font-medium text-sm">Review, approve, or reject user deposits</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by user name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neon focus:border-neon transition-all"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-neon"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending Review</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                                <th className="p-4">User</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Method</th>
                                <th className="p-4">Receipt</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {deposits.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-slate-500 font-medium">
                                        No deposits found matching criteria.
                                    </td>
                                </tr>
                            ) : deposits.map((deposit) => (
                                <tr key={deposit._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-navy">{deposit.userId?.name || 'Unknown'}</div>
                                        <div className="text-xs text-slate-500">{deposit.userId?.email || 'N/A'}</div>
                                    </td>
                                    <td className="p-4 font-black text-navy whitespace-nowrap">
                                        {deposit.paymentMethod === 'usdt' ? '$' : '₹'}{deposit.amount.toLocaleString(deposit.paymentMethod === 'usdt' ? 'en-US' : 'en-IN')}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                                                {deposit.paymentMethod === 'usdt' ? (
                                                    <Coins className="w-4 h-4 text-blue-500" />
                                                ) : (
                                                    <IndianRupee className="w-4 h-4 text-slate-400" />
                                                )}
                                            </div>
                                            <span className="inline-flex bg-slate-50 text-slate-600 px-2 py-0.5 border border-slate-200 rounded text-[10px] font-black uppercase tracking-wider">
                                                {deposit.paymentMethod === 'usdt' ? 'USDC' : 'BANK'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {deposit.screenshotUrl ? (
                                            <a href={deposit.screenshotUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-bold text-sm inline-flex items-center gap-1">
                                                <FileText className="w-4 h-4" /> View Image
                                            </a>
                                        ) : <span className="text-xs text-slate-400">None</span>}
                                    </td>
                                    <td className="p-4 text-sm text-slate-500 font-medium">
                                        {new Date(deposit.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        {deposit.status === 'pending' && <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full"><Clock className="w-3.5 h-3.5" /> Pending</span>}
                                        {deposit.status === 'approved' && <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full"><CheckCircle2 className="w-3.5 h-3.5" /> Approved</span>}
                                        {deposit.status === 'rejected' && <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-100 px-2.5 py-1 rounded-full"><XCircle className="w-3.5 h-3.5" /> Rejected</span>}
                                    </td>
                                    <td className="p-4 text-right">
                                        {deposit.status === 'pending' ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => { setActionDeposit(deposit); setActionType('approved'); }} className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-bold transition-colors">
                                                    Approve
                                                </button>
                                                <button onClick={() => { setActionDeposit(deposit); setActionType('rejected'); }} className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors">
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <button disabled className="px-3 py-1.5 bg-slate-100 text-slate-400 rounded-lg text-xs font-bold cursor-not-allowed">
                                                Resolved
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Action Modal */}
            <AnimatePresence>
                {actionDeposit && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
                        >
                            <div className={`p-6 border-b ${actionType === 'approved' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                                <h3 className={`text-xl font-black flex items-center gap-2 ${actionType === 'approved' ? 'text-green-800' : 'text-red-800'}`}>
                                    {actionType === 'approved' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                                    Confirm {actionType === 'approved' ? 'Approval' : 'Rejection'}
                                </h3>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold text-slate-500">Deposit Amount:</span>
                                        <span className="font-black text-navy text-lg">{actionDeposit.paymentMethod === 'usdt' ? '$' : '₹'}{actionDeposit.amount.toLocaleString(actionDeposit.paymentMethod === 'usdt' ? 'en-US' : 'en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-slate-500">User:</span>
                                        <span className="font-bold text-navy">{actionDeposit.userId?.name}</span>
                                    </div>
                                </div>

                                {actionType === 'approved' ? (
                                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                        This will add <strong className="text-navy">{actionDeposit.paymentMethod === 'usdt' ? `₹${(actionDeposit.amount * 85).toLocaleString('en-IN')}` : `₹${actionDeposit.amount.toLocaleString('en-IN')}`}</strong>
                                        {actionDeposit.paymentMethod === 'usdt' ? ` (converted from $${actionDeposit.amount})` : ''}
                                        to the user's wallet balance.
                                    </p>
                                ) : (
                                    <p className="text-sm text-slate-600 font-medium">
                                        This deposit will be permanently rejected. Please provide a reason below.
                                    </p>
                                )}

                                <div>
                                    <label className="block text-sm font-bold text-navy mb-1.5">Note / Reason (Optional)</label>
                                    <textarea
                                        value={adminNote}
                                        onChange={(e) => setAdminNote(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neon"
                                        rows="2"
                                        placeholder="E.g. Verified via ICICI bank statement..."
                                    />
                                </div>

                                {message && (
                                    <div className={`p-3 rounded-xl text-sm font-bold text-center ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {message}
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setActionDeposit(null)}
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleActionSubmit}
                                    disabled={isSubmitting}
                                    className={`px-5 py-2.5 rounded-xl font-bold text-white flex items-center gap-2 transition-all shadow-lg disabled:opacity-50 ${actionType === 'approved' ? 'bg-green-600 hover:bg-green-700 shadow-green-600/20' : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'}`}
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Action'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
