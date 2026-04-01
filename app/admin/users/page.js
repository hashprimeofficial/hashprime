'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users as UsersIcon, ShieldAlert, Trash2, Edit2, Loader2, X,
    Search, DollarSign, IndianRupee, Gift, ShieldCheck, RefreshCw, Download
} from 'lucide-react';
import * as XLSX from 'xlsx';

const fetcher = (url) => fetch(url).then((res) => res.json());

const inputCls = 'w-full bg-[#0A0A0A] border border-[#d4af35]/15 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-[#d4af35]/40 transition-all placeholder:text-white/20';
const labelCls = 'block text-xs font-black uppercase tracking-widest text-[#d4af35]/50 mb-1.5';

function KycBadge({ status }) {
    const map = {
        approved: 'bg-[#32e512]/10 text-[#32e512] border-[#32e512]/20',
        pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
        unsubmitted: 'bg-white/5 text-white/30 border-white/10',
    };
    return (
        <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] uppercase font-black tracking-widest border ${map[status] || map.unsubmitted}`}>
            {status || 'Unsubmitted'}
        </span>
    );
}

export default function AdminUsersPage() {
    const { data, error, isLoading, mutate } = useSWR('/api/admin/users', fetcher);

    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);
    const [transactionUser, setTransactionUser] = useState(null);
    const [isTransacting, setIsTransacting] = useState(false);
    const [txMessage, setTxMessage] = useState({ type: '', text: '' });
    const [saveMsg, setSaveMsg] = useState('');

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#d4af35]" />
            <p className="text-[#d4af35]/50 text-sm font-black uppercase tracking-widest">Loading users…</p>
        </div>
    );
    if (error) return <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl font-bold">Failed to load users data</div>;

    let { users = [] } = data || {};
    if (searchTerm) {
        const t = searchTerm.toLowerCase();
        users = users.filter(u =>
            u.name?.toLowerCase().includes(t) ||
            u.email?.toLowerCase().includes(t) ||
            u.referralCode?.toLowerCase().includes(t)
        );
    }

    const handleExport = () => {
        if (!users || users.length === 0) return;

        const exportData = users.map(user => ({
            Name: user.name,
            Email: user.email,
            Role: user.role,
            ReferralCode: user.referralCode || '',
            USDWallet: user.usdWallet || user.usdtBalance || 0,
            INRWallet: user.inrWallet || user.walletBalance || 0,
            ReferralWallet: user.referralWallet || 0,
            KYCStatus: user.kycStatus || 'unsubmitted',
            Registered: new Date(user.createdAt).toLocaleString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
        XLSX.writeFile(workbook, 'Users_Export.xlsx');
    };

    const handleDelete = async (id) => {
        if (!confirm('Permanently delete this user and all their investments?')) return;
        setIsDeleting(id);
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
            if (res.ok) mutate();
        } finally {
            setIsDeleting(null);
        }
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveMsg('');
        const form = new FormData(e.target);
        const updates = {
            name: form.get('name'),
            email: form.get('email'),
            usdWallet: parseFloat(form.get('usdWallet')) || 0,
            inrWallet: parseFloat(form.get('inrWallet')) || 0,
            referralWallet: parseFloat(form.get('referralWallet')) || 0,
            kycStatus: form.get('kycStatus'),
            role: form.get('role'),
        };
        const pw = form.get('password');
        if (pw) updates.password = pw;
        try {
            const res = await fetch(`/api/admin/users/${editingUser._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            if (res.ok) {
                setEditingUser(null);
                mutate();
            } else {
                const d = await res.json();
                setSaveMsg(d.error || 'Failed to update user');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleManualTransaction = async (e) => {
        e.preventDefault();
        setIsTransacting(true);
        setTxMessage({ type: '', text: '' });
        const form = new FormData(e.target);
        const payload = {
            account: form.get('account'),
            action: form.get('action'),
            amount: parseFloat(form.get('amount')),
            description: form.get('description'),
        };
        try {
            const res = await fetch(`/api/admin/users/${transactionUser._id}/transaction`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            if (res.ok) {
                setTxMessage({ type: 'success', text: result.message || 'Transaction applied.' });
                mutate();
                setTimeout(() => { setTransactionUser(null); setTxMessage({ type: '', text: '' }); }, 2000);
            } else {
                setTxMessage({ type: 'error', text: result.error || 'Transaction failed' });
            }
        } catch {
            setTxMessage({ type: 'error', text: 'Unexpected error.' });
        } finally {
            setIsTransacting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#d4af35]/10 rounded-xl border border-[#d4af35]/20 flex items-center justify-center">
                            <UsersIcon className="w-5 h-5 text-[#d4af35]" />
                        </div>
                        User Management
                    </h1>
                    <p className="text-[#d4af35]/40 text-sm font-medium mt-1 ml-12">{(data?.users || []).length} registered investors</p>
                </div>
                <div className="relative w-full md:w-64 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d4af35]/40" />
                        <input
                            type="text"
                            placeholder="Search name, email, ref code…"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-[#080808] border border-[#d4af35]/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#d4af35]/40 transition-all"
                        />
                    </div>
                    <button onClick={handleExport} className="px-4 py-2.5 bg-[#d4af35]/10 hover:bg-[#d4af35]/20 text-[#d4af35] border border-[#d4af35]/30 rounded-xl transition-all font-bold flex items-center gap-2" title="Export Users">
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="bg-[#080808] border border-[#d4af35]/15 rounded-3xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-[#d4af35]/5 border-b border-[#d4af35]/10">
                            <tr>
                                {['User', 'Email / Ref', 'USD Wallet', 'INR Wallet', 'Referral', 'KYC', 'Actions'].map(h => (
                                    <th key={h} className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/50">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#d4af35]/5">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-[#d4af35]/3 transition-colors group">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#d4af35]/20 to-[#d4af35]/5 border border-[#d4af35]/20 flex items-center justify-center text-[#d4af35] font-black text-xs shrink-0">
                                                {user.name?.charAt(0)?.toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-sm">{user.name}</div>
                                                {user.role === 'admin' && (
                                                    <span className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded-md uppercase font-black tracking-wider">Admin</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="text-sm text-white/60 font-medium">{user.email}</div>
                                        {user.referralCode && <div className="text-[10px] font-black text-[#d4af35]/40 mt-0.5 tracking-widest">REF: {user.referralCode}</div>}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="font-black text-blue-400">${(user.usdWallet || user.usdtBalance || 0).toFixed(2)}</div>
                                        <div className="text-[10px] text-[#d4af35]/30 font-bold uppercase tracking-widest">USDT</div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="font-black text-[#d4af35]">₹{(user.inrWallet || user.walletBalance || 0).toLocaleString('en-IN')}</div>
                                        <div className="text-[10px] text-[#d4af35]/30 font-bold uppercase tracking-widest">INR</div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="font-black text-[#32e512]">${(user.referralWallet || 0).toFixed(2)}</div>
                                        <div className="text-[10px] text-[#32e512]/30 font-bold uppercase tracking-widest">REF</div>
                                    </td>
                                    <td className="px-5 py-4"><KycBadge status={user.kycStatus} /></td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <button onClick={() => setTransactionUser(user)} title="Manage Wallets"
                                                className="px-2.5 py-1.5 bg-[#d4af35]/10 border border-[#d4af35]/20 text-[#d4af35] hover:bg-[#d4af35]/20 rounded-lg text-xs font-black transition-all">
                                                Wallets
                                            </button>
                                            <button onClick={() => setEditingUser(user)} title="Edit User"
                                                className="p-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all">
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => handleDelete(user._id)} disabled={isDeleting === user._id} title="Delete User"
                                                className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg transition-all disabled:opacity-50">
                                                {isDeleting === user._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-5 py-12 text-center text-[#d4af35]/30 font-medium">
                                        {searchTerm ? 'No users match your search.' : 'No registered users found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit User Modal */}
            <AnimatePresence>
                {editingUser && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-[#080808] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-[#d4af35]/20 max-h-[90vh] flex flex-col">
                            <div className="flex justify-between items-center p-6 border-b border-[#d4af35]/10 bg-[#d4af35]/5">
                                <h3 className="text-lg font-black text-white">Edit User</h3>
                                <button onClick={() => setEditingUser(null)} className="p-1.5 text-[#d4af35]/40 hover:text-[#d4af35] hover:bg-[#d4af35]/10 rounded-xl transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 overflow-y-auto">
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className={labelCls}>Full Name</label><input name="name" defaultValue={editingUser.name} required className={inputCls} /></div>
                                    <div><label className={labelCls}>Email</label><input name="email" type="email" defaultValue={editingUser.email} required className={inputCls} /></div>
                                </div>

                                <div className="text-[10px] font-black uppercase tracking-widest text-[#d4af35]/40 pt-2 border-t border-[#d4af35]/10">Wallet Balances</div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className={labelCls}><DollarSign className="w-3 h-3 inline mr-1 text-blue-400" />USDT</label>
                                        <input name="usdWallet" type="number" step="0.01" defaultValue={editingUser.usdWallet ?? editingUser.usdtBalance ?? 0} className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}><IndianRupee className="w-3 h-3 inline mr-1 text-[#d4af35]" />INR</label>
                                        <input name="inrWallet" type="number" step="1" defaultValue={editingUser.inrWallet ?? editingUser.walletBalance ?? 0} className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}><Gift className="w-3 h-3 inline mr-1 text-[#32e512]" />Referral</label>
                                        <input name="referralWallet" type="number" step="0.01" defaultValue={editingUser.referralWallet ?? 0} className={inputCls} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelCls}><ShieldCheck className="w-3 h-3 inline mr-1" />KYC Status</label>
                                        <select name="kycStatus" defaultValue={editingUser.kycStatus || 'unsubmitted'} className={inputCls + ' cursor-pointer'}>
                                            <option value="unsubmitted">Unsubmitted</option>
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Role</label>
                                        <select name="role" defaultValue={editingUser.role} className={inputCls + ' cursor-pointer'}>
                                            <option value="user">User</option>
                                            <option value="admin">Administrator</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelCls + ' flex items-center justify-between'}>
                                        New Password
                                        <span className="normal-case font-normal text-white/20">optional</span>
                                    </label>
                                    <input name="password" type="text" placeholder="Leave blank to keep current" className={inputCls} />
                                </div>

                                {saveMsg && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">{saveMsg}</div>}

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-3 text-white/30 font-bold hover:bg-white/5 rounded-xl transition-colors">Cancel</button>
                                    <button type="submit" disabled={isSaving} className="flex-1 py-3 bg-[#d4af35] text-black font-black rounded-xl shadow-[0_0_15px_rgba(212,175,53,0.2)] hover:opacity-90 transition-all flex justify-center items-center gap-2 disabled:opacity-50">
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Wallet Transaction Modal */}
            <AnimatePresence>
                {transactionUser && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-[#080808] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-[#d4af35]/20">
                            <div className="flex justify-between items-center p-6 border-b border-[#d4af35]/10 bg-[#d4af35]/5">
                                <div>
                                    <h3 className="text-lg font-black text-white">Wallet Management</h3>
                                    <p className="text-xs text-[#d4af35]/50 font-bold mt-0.5">User: <strong className="text-[#d4af35]">{transactionUser.name}</strong></p>
                                </div>
                                <button onClick={() => setTransactionUser(null)} className="p-1.5 text-[#d4af35]/40 hover:text-[#d4af35] hover:bg-[#d4af35]/10 rounded-xl transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Current balances */}
                            <div className="grid grid-cols-3 gap-3 px-6 py-4 border-b border-[#d4af35]/10">
                                <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl p-3 text-center">
                                    <div className="text-[9px] font-black uppercase tracking-widest text-blue-400/60 mb-1">USDT Wallet</div>
                                    <div className="font-black text-blue-400">${(transactionUser.usdWallet ?? transactionUser.usdtBalance ?? 0).toFixed(2)}</div>
                                </div>
                                <div className="bg-[#d4af35]/5 border border-[#d4af35]/15 rounded-xl p-3 text-center">
                                    <div className="text-[9px] font-black uppercase tracking-widest text-[#d4af35]/60 mb-1">INR Wallet</div>
                                    <div className="font-black text-[#d4af35]">₹{(transactionUser.inrWallet ?? transactionUser.walletBalance ?? 0).toLocaleString('en-IN')}</div>
                                </div>
                                <div className="bg-[#32e512]/5 border border-[#32e512]/15 rounded-xl p-3 text-center">
                                    <div className="text-[9px] font-black uppercase tracking-widest text-[#32e512]/60 mb-1">Referral</div>
                                    <div className="font-black text-[#32e512]">${(transactionUser.referralWallet ?? 0).toFixed(2)}</div>
                                </div>
                            </div>

                            <form onSubmit={handleManualTransaction} className="p-6 space-y-4">
                                {txMessage.text && (
                                    <div className={`p-3 rounded-xl text-sm font-bold text-center ${txMessage.type === 'success' ? 'bg-[#32e512]/10 text-[#32e512] border border-[#32e512]/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                        {txMessage.text}
                                    </div>
                                )}
                                <div>
                                    <label className={labelCls}>Target Wallet</label>
                                    <select name="account" className={inputCls + ' cursor-pointer'}>
                                        <option value="inrWallet">INR Wallet (₹)</option>
                                        <option value="usdWallet">USDT Wallet ($)</option>
                                        <option value="referralWallet">Referral Wallet ($)</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelCls}>Action</label>
                                        <select name="action" className={inputCls + ' cursor-pointer'}>
                                            <option value="add">Deposit (Add)</option>
                                            <option value="subtract">Withdrawal (Subtract)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Amount</label>
                                        <input name="amount" type="number" step="0.01" min="0.01" required className={inputCls} placeholder="0.00" />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>Admin Note <span className="normal-case font-normal text-white/20">(visible to user)</span></label>
                                    <textarea name="description" rows="2" placeholder="e.g. Manual correction, Bonus credit…" required className={inputCls + ' resize-none'} />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setTransactionUser(null)} className="flex-1 py-3 text-white/30 font-bold hover:bg-white/5 rounded-xl transition-colors">Cancel</button>
                                    <button type="submit" disabled={isTransacting} className="flex-1 py-3 bg-[#d4af35] text-black font-black rounded-xl shadow-[0_0_15px_rgba(212,175,53,0.2)] hover:opacity-90 transition-all flex justify-center items-center gap-2 disabled:opacity-50">
                                        {isTransacting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><RefreshCw className="w-4 h-4" /> Execute</>}
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
