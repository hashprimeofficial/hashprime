'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    User, ShieldCheck, Landmark, Lock, CheckCircle2, AlertCircle, Clock,
    Loader2, Building2, Plus, KeyRound, Unlock, Smartphone, Copy,
    ChevronRight, ArrowLeft, X
} from 'lucide-react';
import Image from 'next/image';

const fetcher = (url) => fetch(url).then((r) => r.json());

const SETTINGS_ITEMS = [
    { id: 'profile', label: 'Personal Information', sub: 'Name, address & location', icon: User, accent: 'bg-[#d4af35]/10 text-[#d4af35]' },
    { id: 'kyc', label: 'KYC Verification', sub: 'PAN, Aadhaar & documents', icon: ShieldCheck, accent: 'bg-[#d4af35]/10 text-[#d4af35]' },
    { id: 'bank', label: 'Bank Accounts', sub: 'Add & manage accounts', icon: Landmark, accent: 'bg-[#d4af35]/10 text-[#d4af35]' },
    { id: 'security', label: 'Security', sub: 'Two-factor authentication', icon: Lock, accent: 'bg-[#d4af35]/10 text-[#d4af35]' },
];

// ── Shared style tokens ──────────────────────────────────────
const field = "w-full bg-[#0A0A0A]/60 border border-[#d4af35]/20 rounded-xl px-4 py-3.5 text-white text-sm font-bold placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#d4af35] focus:border-[#d4af35] transition-all shadow-inner";
const lbl = "block text-[10px] font-black uppercase tracking-widest text-[#d4af35]/80 mb-2";

// ── Tiny utility components ──────────────────────────────────
function FieldGroup({ label, children }) {
    return <div><label className={lbl}>{label}</label>{children}</div>;
}

function Card({ children, className = '' }) {
    return (
        <div className={`bg-[#0A0A0A] rounded-3xl border border-[#d4af35]/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden relative group hover:border-[#d4af35]/40 transition-colors ${className}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af35]/5 rounded-full blur-[60px] pointer-events-none -mt-32 -mr-32" />
            <div className="relative z-10">{children}</div>
        </div>
    );
}

function CardHeader({ icon: Icon, title, accent }) {
    return (
        <div className="flex items-center gap-3 px-6 md:px-8 py-5 border-b border-[#d4af35]/10 bg-[#d4af35]/5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border border-[#d4af35]/20 shadow-inner ${accent}`}>
                <Icon className="w-4 h-4" />
            </div>
            <span className="text-base font-black text-white tracking-tight">{title}</span>
        </div>
    );
}

function Toast({ type, msg }) {
    if (!msg) return null;
    const cfg = {
        success: { bg: 'bg-[#32e512]/10 border-[#32e512]/30', text: 'text-[#32e512]', icon: <CheckCircle2 className="w-5 h-5 shrink-0" /> },
        error: { bg: 'bg-red-500/10 border-red-500/30', text: 'text-red-500', icon: <AlertCircle className="w-5 h-5 shrink-0" /> },
        warning: { bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-500', icon: <Clock className="w-5 h-5 shrink-0" /> },
    }[type] || {};
    return (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 px-5 py-4 rounded-xl border text-sm font-black shadow-inner backdrop-blur-sm ${cfg.bg} ${cfg.text}`}>
            {cfg.icon}{msg}
        </motion.div>
    );
}

function KycBadge({ status }) {
    const map = {
        approved: <span className="inline-flex items-center gap-1.5 bg-[#32e512]/10 text-[#32e512] border border-[#32e512]/30 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-inner"><CheckCircle2 className="w-3.5 h-3.5" />Verified</span>,
        pending: <span className="inline-flex items-center gap-1.5 bg-amber-500/10  text-amber-500  border border-amber-500/30  px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-inner"><Clock className="w-3.5 h-3.5" />Pending</span>,
        rejected: <span className="inline-flex items-center gap-1.5 bg-red-500/10    text-red-500    border border-red-500/30    px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-inner"><X className="w-3.5 h-3.5" />Rejected</span>,
    };
    return map[status] || <span className="inline-flex items-center gap-1.5 bg-white/5 text-white/50 border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-inner"><AlertCircle className="w-3.5 h-3.5" />Unverified</span>;
}

function SaveBtn({ disabled, loading }) {
    return (
        <button type="submit" disabled={disabled}
            className="inline-flex items-center gap-2 bg-[#d4af35] hover:bg-[#f8d76d] text-[#0A0A0A] font-black uppercase tracking-widest text-sm px-8 py-4 rounded-xl shadow-[0_4px_20px_rgba(212,175,53,0.3)] hover:shadow-[0_4px_25px_rgba(212,175,53,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
        </button>
    );
}

// ════════════════════════════════════════════════════════
// TAB 1 — PERSONAL INFORMATION
// ════════════════════════════════════════════════════════
function ProfileTab({ formData, onChange, onSubmit, saving, message }) {
    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <Toast type={message.type} msg={message.text} />
            <Card>
                <CardHeader icon={User} title="Personal Details" accent="bg-[#d4af35]/10 text-[#d4af35]" />
                <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FieldGroup label="First Name"><input name="firstName" value={formData.firstName} onChange={onChange} className={field} placeholder="John" /></FieldGroup>
                    <FieldGroup label="Last Name"><input name="lastName" value={formData.lastName} onChange={onChange} className={field} placeholder="Doe" /></FieldGroup>
                    <div className="sm:col-span-2"><FieldGroup label="Address"><input name="address" value={formData.address} onChange={onChange} className={field} placeholder="Street address" /></FieldGroup></div>
                    <FieldGroup label="City"><input name="city" value={formData.city} onChange={onChange} className={field} /></FieldGroup>
                    <FieldGroup label="State"><input name="state" value={formData.state} onChange={onChange} className={field} /></FieldGroup>
                    <FieldGroup label="Pincode"><input name="pincode" value={formData.pincode} onChange={onChange} className={field} /></FieldGroup>
                    <FieldGroup label="Country"><input name="country" value={formData.country} onChange={onChange} className={field} /></FieldGroup>
                </div>
            </Card>
            <div className="flex justify-end pt-1"><SaveBtn disabled={saving} loading={saving} /></div>
        </form>
    );
}

// ════════════════════════════════════════════════════════
// TAB 2 — KYC
// ════════════════════════════════════════════════════════
function KycTab({ formData, onChange, onFileChange, uploads, user, onSubmit, saving, message }) {
    const locked = user?.kycStatus === 'approved';
    const dis = `${field} disabled:opacity-50 disabled:bg-[#121212]/5 disabled:cursor-not-allowed`;
    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <Toast type={message.type} msg={message.text} />
            {locked && <Toast type="success" msg="KYC verified and locked. Raise a support ticket to make changes." />}
            {user?.kycStatus === 'pending' && <Toast type="warning" msg="Your KYC is under review by our team." />}

            <Card>
                <CardHeader icon={ShieldCheck} title="Identity Information" accent="bg-[#d4af35]/10 text-[#d4af35]" />
                <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FieldGroup label="PAN Number"><input name="panNumber" value={formData.panNumber} onChange={onChange} disabled={locked} className={`${dis} uppercase`} placeholder="ABCDE1234F" /></FieldGroup>
                    <FieldGroup label="Aadhaar Number"><input name="aadhaarNumber" value={formData.aadhaarNumber} onChange={onChange} disabled={locked} className={dis} placeholder="1234 5678 9012" /></FieldGroup>
                    <FieldGroup label="Occupation"><input name="occupation" value={formData.occupation} onChange={onChange} disabled={locked} className={dis} /></FieldGroup>
                    <FieldGroup label="Source of Income"><input name="sourceOfIncome" value={formData.sourceOfIncome} onChange={onChange} disabled={locked} className={dis} placeholder="e.g. Salary, Business" /></FieldGroup>
                    <div className="sm:col-span-2">
                        <FieldGroup label="Annual Income Range">
                            <select name="incomeRange" value={formData.incomeRange} onChange={onChange} disabled={locked} className={`${dis} cursor-pointer appearance-none`}>
                                <option value="" className="bg-[#0A0A0A] text-white">Select range</option>
                                <option value="Below 5L" className="bg-[#0A0A0A] text-white">Below ₹5 Lakh</option>
                                <option value="5L - 10L" className="bg-[#0A0A0A] text-white">₹5L – ₹10L</option>
                                <option value="10L - 25L" className="bg-[#0A0A0A] text-white">₹10L – ₹25L</option>
                                <option value="Above 25L" className="bg-[#0A0A0A] text-white">Above ₹25L</option>
                            </select>
                        </FieldGroup>
                    </div>
                </div>
            </Card>

            <Card>
                <CardHeader icon={CheckCircle2} title="Document Uploads" accent="bg-[#d4af35]/10 text-[#d4af35]" />
                <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {[
                        { name: 'panImage', label: 'PAN Card', urlKey: 'panDocumentUrl', b64Key: 'panImageBase64' },
                        { name: 'aadhaarImage', label: 'Aadhaar Card', urlKey: 'aadhaarDocumentUrl', b64Key: 'aadhaarImageBase64' },
                    ].map(({ name, label, urlKey, b64Key }) => (
                        <div key={name}>
                            <label className={lbl}>{label}</label>
                            {uploads[b64Key] ? (
                                <div className="mb-4 rounded-xl overflow-hidden border-2 border-[#d4af35] relative shadow-inner">
                                    <img src={uploads[b64Key]} alt={label} className="w-full h-40 object-cover" />
                                    <div className="absolute top-2 right-2 bg-[#d4af35] text-[#0A0A0A] text-[10px] uppercase font-black px-3 py-1 rounded-lg">New</div>
                                </div>
                            ) : formData[urlKey] ? (
                                <div className="mb-4 rounded-xl overflow-hidden border border-[#d4af35]/30 relative group shadow-inner">
                                    <img src={formData[urlKey]} alt={label} className="w-full h-40 object-cover" />
                                    {!locked && <div className="absolute inset-0 bg-[#0A0A0A]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[#d4af35] text-xs font-black uppercase tracking-widest backdrop-blur-sm">Replace</div>}
                                </div>
                            ) : null}
                            <input type="file" name={name} accept="image/*" onChange={onFileChange} disabled={locked}
                                className="w-full text-xs text-white/50 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:tracking-widest file:bg-[#d4af35]/10 file:text-[#d4af35] hover:file:bg-[#d4af35]/20 disabled:opacity-50 cursor-pointer transition-colors" />
                        </div>
                    ))}
                </div>
            </Card>
            <div className="flex justify-end pt-1"><SaveBtn disabled={saving || locked} loading={saving} /></div>
        </form>
    );
}

// ════════════════════════════════════════════════════════
// TAB 3 — BANK ACCOUNTS
// ════════════════════════════════════════════════════════
function BankTab() {
    const { data, isLoading, mutate } = useSWR('/api/bank-accounts', fetcher);
    const [adding, setAdding] = useState(false);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState('');
    const blank = { accountHolderName: '', accountNumber: '', confirmAccountNumber: '', ifsc: '', bankName: '', branch: '', accountType: 'Savings' };
    const [form, setForm] = useState(blank);
    const upd = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault(); setErr('');
        if (form.accountNumber !== form.confirmAccountNumber) { setErr('Account numbers do not match.'); return; }
        setSaving(true);
        try {
            const res = await fetch('/api/bank-accounts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
            if (res.ok) { mutate(); setAdding(false); setForm(blank); }
            else { const r = await res.json(); setErr(r.error || 'Failed to save.'); }
        } catch { setErr('Unexpected error.'); }
        finally { setSaving(false); }
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Your Accounts</p>
                {!adding && (
                    <button onClick={() => setAdding(true)}
                        className="inline-flex items-center gap-1.5 text-xs font-black text-white bg-[#d4af35]/10 hover:bg-[#d4af35]/20 border border-[#d4af35]/30 px-4 py-2 rounded-xl transition-all">
                        <Plus className="w-3.5 h-3.5" /> Add Account
                    </button>
                )}
            </div>

            <AnimatePresence>
                {adding && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <Card>
                            <CardHeader icon={Plus} title="New Bank Account" accent="bg-[#d4af35]/10 text-[#d4af35]" />
                            <div className="p-6 md:p-8">
                                {err && <Toast type="error" msg={err} />}
                                <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4 relative z-10">
                                    <div className="sm:col-span-2"><FieldGroup label="Account Holder Name"><input name="accountHolderName" value={form.accountHolderName} onChange={upd} required className={field} placeholder="As per bank records" /></FieldGroup></div>
                                    <FieldGroup label="Account Number"><input type="password" name="accountNumber" value={form.accountNumber} onChange={upd} required className={field} /></FieldGroup>
                                    <FieldGroup label="Confirm Account Number"><input name="confirmAccountNumber" value={form.confirmAccountNumber} onChange={upd} required className={field} /></FieldGroup>
                                    <FieldGroup label="IFSC Code"><input name="ifsc" value={form.ifsc} onChange={upd} required className={`${field} uppercase`} placeholder="SBIN0001234" /></FieldGroup>
                                    <FieldGroup label="Bank Name"><input name="bankName" value={form.bankName} onChange={upd} required className={field} /></FieldGroup>
                                    <FieldGroup label="Branch"><input name="branch" value={form.branch} onChange={upd} required className={field} /></FieldGroup>
                                    <FieldGroup label="Account Type">
                                        <select name="accountType" value={form.accountType} onChange={upd} className={`${field} appearance-none cursor-pointer`}>
                                            <option value="Savings" className="bg-[#0A0A0A] text-white">Savings</option>
                                            <option value="Current" className="bg-[#0A0A0A] text-white">Current</option>
                                        </select>
                                    </FieldGroup>
                                    <div className="sm:col-span-2 flex flex-col sm:flex-row gap-4 pt-4 border-t border-[#d4af35]/10 mt-2">
                                        <button type="button" onClick={() => { setAdding(false); setErr(''); }} className="flex-1 py-4 text-sm font-black uppercase tracking-widest text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors">Cancel</button>
                                        <button type="submit" disabled={saving} className="flex-1 py-4 text-sm font-black uppercase tracking-widest bg-[#d4af35] text-[#0A0A0A] hover:bg-[#f8d76d] rounded-xl flex justify-center items-center gap-2 transition-all disabled:opacity-50 shadow-[0_4px_20px_rgba(212,175,53,0.3)]">
                                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Account'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {isLoading && <div className="h-28 bg-[#121212]/5 rounded-2xl animate-pulse border border-white/5" />}

            {!isLoading && !data?.bankAccounts?.length && !adding && (
                <div className="flex flex-col items-center justify-center p-16 text-center bg-[#0A0A0A] rounded-3xl border border-[#d4af35]/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#d4af35]/5 blur-[60px] rounded-full pointer-events-none" />
                    <div className="w-20 h-20 bg-[#d4af35]/10 rounded-full flex items-center justify-center border border-[#d4af35]/20 mb-6 shadow-inner relative z-10">
                        <Building2 className="w-10 h-10 text-[#d4af35]" />
                    </div>
                    <p className="font-black text-white text-2xl mb-2 tracking-tight relative z-10">No accounts yet</p>
                    <p className="text-[#d4af35]/60 font-medium mb-8 relative z-10">Add a bank account to enable withdrawals directly from your INR Wallet.</p>
                    <button onClick={() => setAdding(true)} className="text-sm font-black uppercase tracking-widest px-8 py-4 bg-transparent border border-[#d4af35]/40 hover:border-[#d4af35] hover:bg-[#d4af35]/10 rounded-xl text-[#d4af35] shadow-sm transition-all relative z-10">Add Your First Account</button>
                </div>
            )}

            {!isLoading && data?.bankAccounts?.map((acc) => (
                <Card key={acc._id}>
                    <div className="p-6 md:p-8 flex flex-col md:flex-row items-start justify-between gap-6 relative z-10">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-[#d4af35]/10 border border-[#d4af35]/20 flex items-center justify-center shadow-inner"><Landmark className="w-5 h-5 text-[#d4af35]" /></div>
                                <div>
                                    <p className="font-black text-white text-lg tracking-tight">{acc.bankName}</p>
                                    <p className="text-[10px] font-black text-[#d4af35]/70 uppercase tracking-widest mt-0.5">{acc.accountType}</p>
                                </div>
                            </div>
                            <p className="font-mono font-black text-[#d4af35] text-xl tracking-[0.2em] mb-4 drop-shadow-[0_0_8px_rgba(212,175,53,0.3)]">•••• •••• {acc.accountNumber.slice(-4)}</p>
                            <div className="flex gap-8 border-t border-[#d4af35]/10 pt-4 mt-2">
                                <div><p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1.5">IFSC Code</p><p className="text-sm font-bold text-white uppercase tracking-wide">{acc.ifsc}</p></div>
                                <div><p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1.5">Account Holder</p><p className="text-sm font-bold text-white tracking-wide">{acc.accountHolderName}</p></div>
                            </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 bg-[#32e512]/10 text-[#32e512] border border-[#32e512]/30 px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest font-black shrink-0 shadow-inner"><CheckCircle2 className="w-4 h-4" />Active</span>
                    </div>
                </Card>
            ))}
        </div>
    );
}

// ════════════════════════════════════════════════════════
// TAB 4 — SECURITY
// ════════════════════════════════════════════════════════
function SecurityTab() {
    const { data: stats, mutate } = useSWR('/api/dashboard/stats', fetcher);
    const [setup, setSetup] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [verifyCode, setVerifyCode] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [disableCode, setDisableCode] = useState('');
    const [disabling, setDisabling] = useState(false);
    const [err, setErr] = useState('');
    const [ok, setOk] = useState('');
    const [copied, setCopied] = useState(false);
    const enabled = stats?.user?.isTwoFactorEnabled;

    const copy = () => { if (setup?.secret) { navigator.clipboard.writeText(setup.secret); setCopied(true); setTimeout(() => setCopied(false), 2000); } };
    const generate = async () => { setGenerating(true); setErr(''); try { const r = await (await fetch('/api/auth/2fa/setup')).json(); if (!r.secret) throw new Error(r.error); setSetup(r); } catch (e) { setErr(e.message); } finally { setGenerating(false); } };
    const enable = async (e) => { e.preventDefault(); setVerifying(true); setErr(''); setOk(''); try { const res = await fetch('/api/auth/2fa/setup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ secret: setup.secret, token: verifyCode }) }); const r = await res.json(); if (!res.ok) throw new Error(r.error); setOk('2FA enabled — your account is now protected.'); setSetup(null); setVerifyCode(''); mutate(); } catch (e) { setErr(e.message); } finally { setVerifying(false); } };
    const disable = async (e) => { e.preventDefault(); setDisabling(true); setErr(''); setOk(''); try { const res = await fetch('/api/auth/2fa/disable', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: disableCode }) }); const r = await res.json(); if (!res.ok) throw new Error(r.error); setOk('2FA has been disabled.'); setDisableCode(''); mutate(); } catch (e) { setErr(e.message); } finally { setDisabling(false); } };

    return (
        <div className="space-y-5">
            {err && <Toast type="error" msg={err} />}
            {ok && <Toast type="success" msg={ok} />}

            {/* Status Banner */}
            <div className={`rounded-3xl border p-6 md:p-8 flex items-center gap-5 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] ${enabled ? 'bg-[#32e512]/5 border-[#32e512]/20' : 'bg-[#d4af35]/5 border-[#d4af35]/20'}`}>
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[50px] pointer-events-none -mt-24 -mr-24 opacity-50" style={{ backgroundColor: enabled ? '#32e512' : '#d4af35' }} />
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner relative z-10 ${enabled ? 'bg-[#32e512]/10 border-[#32e512]/30' : 'bg-[#d4af35]/10 border-[#d4af35]/30'}`}>
                    {enabled ? <Lock className={`w-6 h-6 ${enabled ? 'text-[#32e512]' : 'text-[#d4af35]'}`} /> : <Unlock className="w-6 h-6 text-[#d4af35]" />}
                </div>
                <div className="flex-1 min-w-0 relative z-10">
                    <p className={`font-black tracking-tight text-lg md:text-xl mb-1 ${enabled ? 'text-[#32e512] drop-shadow-[0_0_8px_rgba(50,229,18,0.3)]' : 'text-[#d4af35] drop-shadow-[0_0_8px_rgba(212,175,53,0.3)]'}`}>{enabled ? 'Two-Factor Authentication Active' : '2FA Not Enabled'}</p>
                    <p className={`font-bold text-sm ${enabled ? 'text-[#32e512]/70' : 'text-[#d4af35]/70'}`}>{enabled ? 'Your login requires an authenticator code.' : 'Add an extra layer of protection.'}</p>
                </div>
            </div>

            {/* Disable flow */}
            {enabled && (
                <Card>
                    <CardHeader icon={Unlock} title="Disable Two-Factor Authentication" accent="bg-red-500/10 text-red-500" />
                    <div className="p-6 md:p-8 relative z-10">
                        <p className="text-sm text-[#d4af35]/70 font-medium mb-6">Enter the 6-digit code from your authenticator app to disable 2FA.</p>
                        <form onSubmit={disable} className="max-w-xs space-y-6">
                            <input type="text" inputMode="numeric" value={disableCode} onChange={e => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="------" className={`${field} text-center text-3xl tracking-[0.5em] font-black h-16`} />
                            <button type="submit" disabled={disabling || disableCode.length !== 6} className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 font-black py-4 rounded-xl flex justify-center items-center gap-2 text-sm uppercase tracking-widest transition-all shadow-inner disabled:opacity-40 disabled:cursor-not-allowed">
                                {disabling ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Unlock className="w-4 h-4" />Disable 2FA</>}
                            </button>
                        </form>
                    </div>
                </Card>
            )}

            {/* Enable start */}
            {!enabled && !setup && (
                <Card>
                    <CardHeader icon={KeyRound} title="Set Up Two-Factor Authentication" accent="bg-[#d4af35]/10 text-[#d4af35]" />
                    <div className="p-6 md:p-8 relative z-10">
                        <div className="flex items-start gap-4 bg-[#0A0A0A] rounded-2xl border border-[#d4af35]/20 p-5 mb-8 shadow-inner">
                            <Smartphone className="w-6 h-6 text-[#d4af35] shrink-0 mt-0.5" />
                            <p className="text-sm text-[#d4af35]/80 font-bold leading-relaxed">Use Google Authenticator, Authy, or any TOTP-compatible app to scan a QR code and generate secure login tokens.</p>
                        </div>
                        <button onClick={generate} disabled={generating} className="inline-flex items-center gap-2 bg-[#d4af35] hover:bg-[#f8d76d] text-[#0A0A0A] shadow-[0_4px_20px_rgba(212,175,53,0.3)] font-black text-sm uppercase tracking-widest px-8 py-4 rounded-xl transition-all disabled:opacity-50">
                            {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><KeyRound className="w-5 h-5" />Begin Setup</>}
                        </button>
                    </div>
                </Card>
            )}

            {/* Enable QR + verify */}
            {!enabled && setup && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 relative z-10">
                    <Card>
                        <CardHeader icon={Smartphone} title="Step 1 — Scan QR Code" accent="bg-[#d4af35]/10 text-[#d4af35]" />
                        <div className="p-6 md:p-8 relative z-10">
                            <div className="flex flex-col sm:flex-row items-center gap-8 bg-[#0A0A0A] rounded-3xl border border-[#d4af35]/20 p-6 shadow-inner">
                                <div className="bg-white p-4 rounded-2xl border-4 border-[#d4af35]/30 shadow-[0_0_20px_rgba(212,175,53,0.2)] shrink-0">
                                    <Image src={setup.qrCodeDataUrl} alt="2FA QR Code" width={160} height={160} className="rounded-xl" />
                                </div>
                                <div className="space-y-4 text-center sm:text-left">
                                    <p className="text-base font-black text-white tracking-tight">Can't scan the QR?</p>
                                    <p className="text-sm text-[#d4af35]/70 font-bold">Enter this setup key manually in your app:</p>
                                    <div className="flex items-center justify-center sm:justify-start gap-3">
                                        <code className="bg-[#121212] border border-[#d4af35]/30 rounded-xl px-4 py-3 text-sm font-mono font-bold text-[#d4af35] tracking-wider shadow-inner">{setup.secret}</code>
                                        <button type="button" onClick={copy} className="p-3.5 rounded-xl border border-[#d4af35]/30 bg-[#121212] hover:bg-[#d4af35]/10 text-[#d4af35] hover:text-[#f8d76d] transition-colors shadow-inner">
                                            {copied ? <CheckCircle2 className="w-5 h-5 text-[#32e512]" /> : <Copy className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-1.5 rounded-lg inline-block shadow-inner mt-2">Never share this key with anyone.</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <CardHeader icon={ShieldCheck} title="Step 2 — Verify & Activate" accent="bg-[#d4af35]/10 text-[#d4af35]" />
                        <div className="p-6 md:p-8 relative z-10">
                            <p className="text-sm text-[#d4af35]/70 font-medium mb-6">Enter the 6-digit code from your authenticator app to confirm setup.</p>
                            <form onSubmit={enable} className="max-w-md space-y-6">
                                <input type="text" inputMode="numeric" value={verifyCode} onChange={e => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="------" className={`${field} text-center text-3xl tracking-[0.5em] font-black h-16`} />
                                <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-[#d4af35]/10">
                                    <button type="button" onClick={() => setSetup(null)} className="flex-1 py-4 text-sm font-black uppercase tracking-widest text-[#d4af35]/60 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl transition-all shadow-inner">Cancel</button>
                                    <button type="submit" disabled={verifying || verifyCode.length !== 6} className="flex-1 py-4 text-sm font-black uppercase tracking-widest bg-[#d4af35] text-[#0A0A0A] hover:bg-[#f8d76d] rounded-xl flex justify-center items-center gap-2 transition-all shadow-[0_4px_20px_rgba(212,175,53,0.3)] disabled:opacity-40 disabled:cursor-not-allowed">
                                        {verifying ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Activate 2FA'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}

function AccountCard({ authUser, user }) {
    return (
        <div className="relative bg-gradient-to-br from-[#1f1805] to-[#0A0A0A] border border-[#d4af35]/30 rounded-3xl p-6 md:p-8 flex items-center justify-between gap-4 overflow-hidden mb-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] group hover:border-[#d4af35]/50 transition-colors">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#d4af35]/10 rounded-full blur-[60px] pointer-events-none -mt-24 -mr-24 transition-all group-hover:bg-[#d4af35]/20" />
            <div className="flex items-center gap-5 z-10">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#d4af35]/10 flex items-center justify-center font-black text-[#d4af35] text-2xl border border-[#d4af35]/30 shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                    {authUser?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                    <p className="font-black text-white text-lg md:text-xl tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">{authUser?.name}</p>
                    <p className="text-[#d4af35]/80 font-bold text-sm">{authUser?.email}</p>
                </div>
            </div>
            <div className="z-10 text-right shrink-0">
                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-2">KYC Status</p>
                <KycBadge status={user?.kycStatus} />
            </div>
        </div>
    );
}

function MobileList({ authUser, user, onSelect }) {
    return (
        <div className="space-y-4 pb-20">
            <AccountCard authUser={authUser} user={user} />
            <div className="space-y-3">
                {SETTINGS_ITEMS.map(({ id, label, icon: Icon }) => (
                    <motion.button
                        key={id}
                        onClick={() => onSelect(id)}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center gap-5 px-6 py-6 bg-[#0A0A0A] border border-[#d4af35]/20 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-[#d4af35]/40 transition-all duration-200 text-left group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-[#d4af35]/10 border border-[#d4af35]/20 flex items-center justify-center shrink-0 group-hover:bg-[#d4af35]/20 group-hover:scale-105 transition-all shadow-inner">
                            <Icon className="w-5 h-5 text-[#d4af35]" />
                        </div>
                        <p className="flex-1 font-black text-white text-lg tracking-tight">{label}</p>
                        <div className="w-10 h-10 rounded-xl bg-[#121212] border border-white/5 flex items-center justify-center group-hover:bg-[#d4af35]/10 group-hover:border-[#d4af35]/30 transition-all shadow-inner">
                            <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-[#d4af35] group-hover:translate-x-0.5 transition-all" />
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

function MobileDetail({ sectionId, onBack, tabProps }) {
    const item = SETTINGS_ITEMS.find(i => i.id === sectionId);
    return (
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.22 }}
            className="absolute inset-0 bg-[#0A0A0A] z-10 overflow-y-auto">
            <div className="sticky top-0 bg-[#0A0A0A] border-b border-[#d4af35]/20 flex items-center gap-3 px-4 py-3.5 z-20 shadow-[0_2px_20px_rgba(0,0,0,0.5)]">
                <button onClick={onBack} className="flex items-center gap-1 text-sm font-black text-white -ml-1 px-2 py-1.5 rounded-lg hover:bg-[#d4af35]/10 transition-colors">
                    <ArrowLeft className="w-4 h-4 text-[#d4af35]" /> Settings
                </button>
                <div className="h-3.5 w-px bg-[#d4af35]/20" />
                <span className="text-sm font-black text-white truncate">{item?.label}</span>
            </div>
            <div className="p-4 pb-12">
                {sectionId === 'profile' && <ProfileTab  {...tabProps} />}
                {sectionId === 'kyc' && <KycTab      {...tabProps} />}
                {sectionId === 'bank' && <BankTab />}
                {sectionId === 'security' && <SecurityTab />}
            </div>
        </motion.div>
    );
}

function DesktopHub({ authUser, user, tabProps }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const activeFromUrl = searchParams.get('tab') || 'profile';
    const [active, setActive] = useState(activeFromUrl);

    useEffect(() => {
        setActive(activeFromUrl);
    }, [activeFromUrl]);

    return (
        <div className="max-w-3xl">
            <AccountCard authUser={authUser} user={user} />

            {/* Tab strip - hidden on desktop since sidebar has it */}
            <div className="hidden bg-slate-100 rounded-2xl mb-6">
                {SETTINGS_ITEMS.map(({ id, label, icon: Icon }) => {
                    const on = active === id;
                    return (
                        <button key={id} onClick={() => setActive(id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-black transition-all ${on ? 'bg-[#121212] text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}>
                            <Icon className={`w-4 h-4 shrink-0 ${on ? 'text-[#d4af35]' : ''}`} />
                            <span className="hidden sm:inline">{label.split(' ')[0]}</span>
                        </button>
                    );
                })}
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                    {active === 'profile' && <ProfileTab  {...tabProps} />}
                    {active === 'kyc' && <KycTab      {...tabProps} />}
                    {active === 'bank' && <BankTab />}
                    {active === 'security' && <SecurityTab />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

// ════════════════════════════════════════════════════════
// SKELETON
// ════════════════════════════════════════════════════════
function Skeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-[88px] bg-slate-100 rounded-2xl" />
            <div className="h-10 bg-slate-100 rounded-2xl w-full" />
            <div className="h-64 bg-slate-100 rounded-2xl" />
        </div>
    );
}

// ════════════════════════════════════════════════════════
// ROOT PAGE
// ════════════════════════════════════════════════════════
export default function ProfilePage() {
    const { data: authData } = useSWR('/api/auth/me', fetcher);
    const { data: profileData, error, isLoading, mutate } = useSWR('/api/profile', fetcher);

    const [mobileSection, setMobileSection] = useState(null);
    const [form, setForm] = useState({ firstName: '', lastName: '', address: '', pincode: '', city: '', state: '', country: '', panNumber: '', aadhaarNumber: '', occupation: '', sourceOfIncome: '', incomeRange: '', panDocumentUrl: '', aadhaarDocumentUrl: '' });
    const [uploads, setUploads] = useState({ panImageBase64: '', aadhaarImageBase64: '' });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (!profileData?.user) return;
        const u = profileData.user;
        setForm({ firstName: u.firstName || '', lastName: u.lastName || '', address: u.address || '', pincode: u.pincode || '', city: u.city || '', state: u.state || '', country: u.country || '', panNumber: u.panNumber || '', aadhaarNumber: u.aadhaarNumber || '', occupation: u.occupation || '', sourceOfIncome: u.sourceOfIncome || '', incomeRange: u.incomeRange || '', panDocumentUrl: u.panDocumentUrl || '', aadhaarDocumentUrl: u.aadhaarDocumentUrl || '' });
    }, [profileData]);

    const onChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const onFileChange = (e) => {
        const { name, files } = e.target;
        if (!files?.[0]) return;
        if (files[0].size > 5 * 1024 * 1024) { setMessage({ type: 'error', text: 'Image must be under 5 MB.' }); return; }
        const r = new FileReader();
        r.onloadend = () => {
            if (name === 'panImage') setUploads(p => ({ ...p, panImageBase64: r.result }));
            if (name === 'aadhaarImage') setUploads(p => ({ ...p, aadhaarImageBase64: r.result }));
        };
        r.readAsDataURL(files[0]);
    };

    const onSubmit = async (e) => {
        e.preventDefault(); setSaving(true); setMessage({ type: '', text: '' });
        try {
            const res = await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, ...uploads }) });
            const json = await res.json();
            if (res.ok) { setMessage({ type: 'success', text: 'Profile saved successfully.' }); mutate(); setUploads({ panImageBase64: '', aadhaarImageBase64: '' }); }
            else { setMessage({ type: 'error', text: json.error || 'Failed to save.' }); }
        } catch { setMessage({ type: 'error', text: 'Unexpected error.' }); }
        finally { setSaving(false); }
    };

    if (isLoading || !authData) return <Skeleton />;
    if (error) return <p className="text-red-500 font-bold p-6">Failed to load profile.</p>;

    const authUser = authData.user;
    const user = profileData?.user;

    const tabProps = { formData: form, onChange, onFileChange, uploads, user, onSubmit, saving, message };

    return (
        <>
            {/* ── MOBILE ── */}
            <div className="md:hidden relative min-h-[80vh] overflow-hidden">
                <MobileList authUser={authUser} user={user} onSelect={setMobileSection} />
                <AnimatePresence>
                    {mobileSection && (
                        <MobileDetail key={mobileSection} sectionId={mobileSection}
                            onBack={() => { setMobileSection(null); setMessage({ type: '', text: '' }); }}
                            tabProps={tabProps} />
                    )}
                </AnimatePresence>
            </div>

            {/* ── DESKTOP ── */}
            <div className="hidden md:block">
                <DesktopHub authUser={authUser} user={user} tabProps={tabProps} />
            </div>
        </>
    );
}
