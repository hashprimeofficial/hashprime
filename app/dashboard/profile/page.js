'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { User, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const fetcher = (url) => fetch(url).then((res) => res.json());

function ProfileSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div>
                <div className="h-9 bg-slate-100 rounded-lg w-48 mb-2" />
                <div className="h-5 bg-slate-100 rounded-lg w-72" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="h-6 bg-slate-100 rounded w-32" />
                    <div className="h-12 bg-slate-100 rounded-lg" />
                    <div className="h-12 bg-slate-100 rounded-lg" />
                    <div className="h-12 bg-slate-200 rounded-lg" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="h-6 bg-slate-100 rounded w-40" />
                    <div className="h-12 bg-slate-100 rounded-lg" />
                    <div className="h-12 bg-slate-100 rounded-lg" />
                    <div className="h-12 bg-slate-100 rounded-lg" />
                    <div className="h-12 bg-slate-200 rounded-lg" />
                </div>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const { data, error, isLoading, mutate } = useSWR('/api/auth/me', fetcher);

    const [nameForm, setNameForm] = useState({ name: '' });
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [nameStatus, setNameStatus] = useState(null); // { type: 'success'|'error', message }
    const [pwStatus, setPwStatus] = useState(null);
    const [nameSaving, setNameSaving] = useState(false);
    const [pwSaving, setPwSaving] = useState(false);

    if (isLoading) return <ProfileSkeleton />;
    if (error) return <div className="text-red-500 font-bold">Failed to load profile.</div>;

    const { user } = data;

    const handleNameSave = async (e) => {
        e.preventDefault();
        setNameSaving(true);
        setNameStatus(null);
        try {
            const res = await fetch('/api/auth/me', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: nameForm.name || user.name }),
            });
            const result = await res.json();
            if (res.ok) {
                setNameStatus({ type: 'success', message: 'Name updated successfully!' });
                mutate();
            } else {
                setNameStatus({ type: 'error', message: result.error || 'Failed to update name.' });
            }
        } catch {
            setNameStatus({ type: 'error', message: 'An unexpected error occurred.' });
        } finally {
            setNameSaving(false);
        }
    };

    const handlePwSave = async (e) => {
        e.preventDefault();
        setPwStatus(null);
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            setPwStatus({ type: 'error', message: 'New passwords do not match.' });
            return;
        }
        setPwSaving(true);
        try {
            const res = await fetch('/api/auth/me', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
            });
            const result = await res.json();
            if (res.ok) {
                setPwStatus({ type: 'success', message: 'Password changed successfully!' });
                setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setPwStatus({ type: 'error', message: result.error || 'Failed to change password.' });
            }
        } catch {
            setPwStatus({ type: 'error', message: 'An unexpected error occurred.' });
        } finally {
            setPwSaving(false);
        }
    };

    const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy font-medium focus:outline-none focus:ring-2 focus:ring-neon focus:border-neon transition-all";

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-3xl font-black text-navy mb-2 tracking-tight">Account Settings</h1>
                <p className="text-slate-500 font-medium">Manage your personal information and account security.</p>
            </div>

            {/* Account Overview */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-navy text-white rounded-2xl p-6 flex items-center gap-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-neon/10 blur-3xl rounded-full" />
                <div className="w-16 h-16 rounded-2xl bg-neon flex items-center justify-center text-3xl font-black text-navy shrink-0 shadow-lg">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="relative z-10">
                    <div className="text-xl font-black">{user.name}</div>
                    <div className="text-slate-300 text-sm font-medium mt-0.5">{user.email}</div>
                    <div className="mt-2 inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon" />
                        {user.role}
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Update Name */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-lg font-black text-navy">Personal Info</h2>
                    </div>

                    <form onSubmit={handleNameSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-navy mb-1.5">Full Name</label>
                            <input
                                type="text"
                                className={inputClass}
                                defaultValue={user.name}
                                onChange={(e) => setNameForm({ name: e.target.value })}
                                placeholder="Your full name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-navy mb-1.5">Email Address</label>
                            <input
                                type="email"
                                className={`${inputClass} opacity-60 cursor-not-allowed`}
                                value={user.email}
                                disabled
                                title="Email cannot be changed from here. Contact support."
                            />
                            <p className="text-xs text-slate-400 mt-1.5 font-medium">Email address can only be changed by an admin.</p>
                        </div>

                        {nameStatus && (
                            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm font-bold ${nameStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                                {nameStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                                {nameStatus.message}
                            </div>
                        )}

                        <button type="submit" disabled={nameSaving} className="w-full py-3 bg-navy text-white font-black rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50">
                            {nameSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                        </button>
                    </form>
                </motion.div>

                {/* Change Password */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-amber-600" />
                        </div>
                        <h2 className="text-lg font-black text-navy">Change Password</h2>
                    </div>

                    <form onSubmit={handlePwSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-navy mb-1.5">Current Password</label>
                            <input type="password" className={inputClass} value={pwForm.currentPassword} onChange={(e) => setPwForm(f => ({ ...f, currentPassword: e.target.value }))} placeholder="Enter current password" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-navy mb-1.5">New Password</label>
                            <input type="password" className={inputClass} value={pwForm.newPassword} onChange={(e) => setPwForm(f => ({ ...f, newPassword: e.target.value }))} placeholder="Min. 6 characters" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-navy mb-1.5">Confirm New Password</label>
                            <input type="password" className={inputClass} value={pwForm.confirmPassword} onChange={(e) => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))} placeholder="Repeat new password" required />
                        </div>

                        {pwStatus && (
                            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm font-bold ${pwStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                                {pwStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                                {pwStatus.message}
                            </div>
                        )}

                        <button type="submit" disabled={pwSaving} className="w-full py-3 bg-neon text-navy font-black rounded-xl hover:bg-[#32e512] transition-all flex items-center justify-center gap-2 shadow-sm shadow-neon/20 disabled:opacity-50">
                            {pwSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
