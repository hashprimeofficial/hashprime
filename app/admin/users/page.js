'use client';

import useSWR from 'swr';
import { ShieldAlert, Trash2, Edit2, Loader2, X } from 'lucide-react';
import { useState } from 'react';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AdminUsersPage() {
    const { data, error, isLoading, mutate } = useSWR('/api/admin/users', fetcher);

    const [editingUser, setEditingUser] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);

    if (isLoading) return <div className="text-slate-400 animate-pulse font-medium">Loading users...</div>;
    if (error) return <div className="text-red-500 font-bold">Failed to load users data</div>;

    const { users = [] } = data || {};

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to permanently delete this user? All their investments will also be deleted.')) return;

        setIsDeleting(id);
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
            if (res.ok) {
                mutate(); // Refresh data
            } else {
                alert('Failed to delete user');
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
            name: form.get('name'),
            usdtBalance: parseFloat(form.get('usdtBalance')),
            role: form.get('role')
        };

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
                alert('Failed to update user');
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
                <h1 className="text-3xl font-black text-navy mb-2 tracking-tight">User Management</h1>
                <p className="text-slate-500 font-medium">View, edit, and manage all registered investors across the platform.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto min-h-[50vh]">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-bold">Name</th>
                                <th className="px-6 py-4 font-bold">Email (Ref Code)</th>
                                <th className="px-6 py-4 font-bold">USDT Balance</th>
                                <th className="px-6 py-4 font-bold">Referred By</th>
                                <th className="px-6 py-4 font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-navy flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-black text-slate-500 shadow-sm shrink-0">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div>{user.name}</div>
                                            {user.role === 'admin' && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded uppercase font-black">Admin</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-medium">{user.email}</td>
                                    <td className="px-6 py-4 font-black text-green-600">{user.usdtBalance.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-slate-400 font-medium">{user.referredBy || '-'}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setEditingUser(user)}
                                                className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                                                title="Edit User"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                disabled={isDeleting === user._id}
                                                className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors disabled:opacity-50"
                                                title="Delete User"
                                            >
                                                {isDeleting === user._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500 font-medium bg-slate-50 flex flex-col items-center justify-center">
                                        <ShieldAlert className="w-8 h-8 text-slate-400 mb-2" />
                                        No registered users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h3 className="text-xl font-black text-navy">Edit User</h3>
                            <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-navy transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-navy mb-1.5">Full Name</label>
                                <input name="name" type="text" defaultValue={editingUser.name} required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy font-medium focus:outline-none focus:ring-2 focus:ring-neon focus:border-neon transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-navy mb-1.5">USDT Balance</label>
                                <input name="usdtBalance" type="number" step="0.01" defaultValue={editingUser.usdtBalance} required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy font-medium focus:outline-none focus:ring-2 focus:ring-neon focus:border-neon transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-navy mb-1.5">Account Role</label>
                                <select name="role" defaultValue={editingUser.role} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy font-medium focus:outline-none focus:ring-2 focus:ring-neon focus:border-neon transition-all cursor-pointer">
                                    <option value="user">User</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-lg transition-colors">Cancel</button>
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
