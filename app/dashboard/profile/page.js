'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, ShieldCheck, Landmark, Lock, CheckCircle2, AlertCircle, Clock,
    Loader2, Building2, Plus, KeyRound, Unlock, Smartphone, Copy,
    ChevronRight, ArrowLeft, X
} from 'lucide-react';
import Image from 'next/image';

const fetcher = (url) => fetch(url).then((r) => r.json());

const SETTINGS_ITEMS = [
    { id: 'profile', label: 'Personal Information', sub: 'Name, address & location', icon: User, accent: 'bg-blue-50   text-blue-500' },
    { id: 'kyc', label: 'KYC Verification', sub: 'PAN, Aadhaar & documents', icon: ShieldCheck, accent: 'bg-emerald-50 text-emerald-500' },
    { id: 'bank', label: 'Bank Accounts', sub: 'Add & manage accounts', icon: Landmark, accent: 'bg-violet-50  text-violet-500' },
    { id: 'security', label: 'Security', sub: 'Two-factor authentication', icon: Lock, accent: 'bg-amber-50   text-amber-500' },
];

// ── Shared style tokens ──────────────────────────────────────
const field = "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[#0B1120] text-sm font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#39FF14]/40 focus:border-[#39FF14] transition-all";
const lbl = "block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5";

// ── Tiny utility components ──────────────────────────────────
function FieldGroup({ label, children }) {
    return <div><label className={lbl}>{label}</label>{children}</div>;
}

function Card({ children, className = '' }) {
    return (
        <div className={`bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden ${className}`}>
            {children}
        </div>
    );
}

function CardHeader({ icon: Icon, title, accent }) {
    return (
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-50">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${accent}`}>
                <Icon className="w-4 h-4" />
            </div>
            <span className="text-sm font-black text-[#0B1120] tracking-tight">{title}</span>
        </div>
    );
}

function Toast({ type, msg }) {
    if (!msg) return null;
    const cfg = {
        success: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" /> },
        error: { bg: 'bg-red-50   border-red-200', text: 'text-red-700', icon: <AlertCircle className="w-4 h-4 shrink-0 text-red-500" /> },
        warning: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', icon: <Clock className="w-4 h-4 shrink-0 text-amber-500" /> },
    }[type] || {};
    return (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${cfg.bg} ${cfg.text}`}>
            {cfg.icon}{msg}
        </motion.div>
    );
}

function KycBadge({ status }) {
    const map = {
        approved: <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full text-[11px] font-black"><CheckCircle2 className="w-3 h-3" />Verified</span>,
        pending: <span className="inline-flex items-center gap-1.5 bg-amber-50  text-amber-600  border border-amber-200  px-3 py-1 rounded-full text-[11px] font-black"><Clock className="w-3 h-3" />Pending</span>,
        rejected: <span className="inline-flex items-center gap-1.5 bg-red-50    text-red-600    border border-red-200    px-3 py-1 rounded-full text-[11px] font-black"><X className="w-3 h-3" />Rejected</span>,
    };
    return map[status] || <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-500 border border-slate-200 px-3 py-1 rounded-full text-[11px] font-black"><AlertCircle className="w-3 h-3" />Unverified</span>;
}

function SaveBtn({ disabled, loading }) {
    return (
        <button type="submit" disabled={disabled}
            className="inline-flex items-center gap-2 bg-[#0B1120] hover:bg-[#162032] text-white font-black text-sm px-8 py-3.5 rounded-xl shadow-sm transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
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
                <CardHeader icon={User} title="Personal Details" accent="bg-blue-50 text-blue-500" />
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
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
    const dis = `${field} disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed`;
    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <Toast type={message.type} msg={message.text} />
            {locked && <Toast type="success" msg="KYC verified and locked. Raise a support ticket to make changes." />}
            {user?.kycStatus === 'pending' && <Toast type="warning" msg="Your KYC is under review by our team." />}

            <Card>
                <CardHeader icon={ShieldCheck} title="Identity Information" accent="bg-emerald-50 text-emerald-500" />
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FieldGroup label="PAN Number"><input name="panNumber" value={formData.panNumber} onChange={onChange} disabled={locked} className={`${dis} uppercase`} placeholder="ABCDE1234F" /></FieldGroup>
                    <FieldGroup label="Aadhaar Number"><input name="aadhaarNumber" value={formData.aadhaarNumber} onChange={onChange} disabled={locked} className={dis} placeholder="1234 5678 9012" /></FieldGroup>
                    <FieldGroup label="Occupation"><input name="occupation" value={formData.occupation} onChange={onChange} disabled={locked} className={dis} /></FieldGroup>
                    <FieldGroup label="Source of Income"><input name="sourceOfIncome" value={formData.sourceOfIncome} onChange={onChange} disabled={locked} className={dis} placeholder="e.g. Salary, Business" /></FieldGroup>
                    <div className="sm:col-span-2">
                        <FieldGroup label="Annual Income Range">
                            <select name="incomeRange" value={formData.incomeRange} onChange={onChange} disabled={locked} className={dis}>
                                <option value="">Select range</option>
                                <option value="Below 5L">Below ₹5 Lakh</option>
                                <option value="5L - 10L">₹5L – ₹10L</option>
                                <option value="10L - 25L">₹10L – ₹25L</option>
                                <option value="Above 25L">Above ₹25L</option>
                            </select>
                        </FieldGroup>
                    </div>
                </div>
            </Card>

            <Card>
                <CardHeader icon={CheckCircle2} title="Document Uploads" accent="bg-emerald-50 text-emerald-500" />
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                        { name: 'panImage', label: 'PAN Card', urlKey: 'panDocumentUrl', b64Key: 'panImageBase64' },
                        { name: 'aadhaarImage', label: 'Aadhaar Card', urlKey: 'aadhaarDocumentUrl', b64Key: 'aadhaarImageBase64' },
                    ].map(({ name, label, urlKey, b64Key }) => (
                        <div key={name}>
                            <label className={lbl}>{label}</label>
                            {uploads[b64Key] ? (
                                <div className="mb-3 rounded-xl overflow-hidden border-2 border-[#39FF14] relative">
                                    <img src={uploads[b64Key]} alt={label} className="w-full h-32 object-cover" />
                                    <div className="absolute top-2 right-2 bg-[#39FF14] text-[#0B1120] text-[10px] font-black px-2 py-0.5 rounded-full">New</div>
                                </div>
                            ) : formData[urlKey] ? (
                                <div className="mb-3 rounded-xl overflow-hidden border border-slate-200 relative group">
                                    <img src={formData[urlKey]} alt={label} className="w-full h-32 object-cover" />
                                    {!locked && <div className="absolute inset-0 bg-[#0B1120]/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold rounded-xl">Replace</div>}
                                </div>
                            ) : null}
                            <input type="file" name={name} accept="image/*" onChange={onFileChange} disabled={locked}
                                className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#0B1120] file:text-white hover:file:bg-[#162032] disabled:opacity-50 cursor-pointer" />
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
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your Accounts</p>
                {!adding && (
                    <button onClick={() => setAdding(true)}
                        className="inline-flex items-center gap-1.5 text-xs font-black text-[#0B1120] bg-[#39FF14]/10 hover:bg-[#39FF14]/20 border border-[#39FF14]/30 px-4 py-2 rounded-xl transition-all">
                        <Plus className="w-3.5 h-3.5" /> Add Account
                    </button>
                )}
            </div>

            <AnimatePresence>
                {adding && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <Card>
                            <CardHeader icon={Plus} title="New Bank Account" accent="bg-slate-100 text-slate-500" />
                            <div className="p-6">
                                {err && <Toast type="error" msg={err} />}
                                <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
                                    <div className="sm:col-span-2"><FieldGroup label="Account Holder Name"><input name="accountHolderName" value={form.accountHolderName} onChange={upd} required className={field} placeholder="As per bank records" /></FieldGroup></div>
                                    <FieldGroup label="Account Number"><input type="password" name="accountNumber" value={form.accountNumber} onChange={upd} required className={field} /></FieldGroup>
                                    <FieldGroup label="Confirm Account Number"><input name="confirmAccountNumber" value={form.confirmAccountNumber} onChange={upd} required className={field} /></FieldGroup>
                                    <FieldGroup label="IFSC Code"><input name="ifsc" value={form.ifsc} onChange={upd} required className={`${field} uppercase`} placeholder="SBIN0001234" /></FieldGroup>
                                    <FieldGroup label="Bank Name"><input name="bankName" value={form.bankName} onChange={upd} required className={field} /></FieldGroup>
                                    <FieldGroup label="Branch"><input name="branch" value={form.branch} onChange={upd} required className={field} /></FieldGroup>
                                    <FieldGroup label="Account Type">
                                        <select name="accountType" value={form.accountType} onChange={upd} className={field}>
                                            <option value="Savings">Savings</option>
                                            <option value="Current">Current</option>
                                        </select>
                                    </FieldGroup>
                                    <div className="sm:col-span-2 flex gap-3 pt-2">
                                        <button type="button" onClick={() => { setAdding(false); setErr(''); }} className="flex-1 py-3 text-sm font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all">Cancel</button>
                                        <button type="submit" disabled={saving} className="flex-1 py-3 text-sm font-black bg-[#0B1120] text-white hover:bg-[#162032] rounded-xl flex justify-center items-center gap-2 transition-all disabled:opacity-50">
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Account'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {isLoading && <div className="h-28 bg-slate-50 rounded-2xl animate-pulse border border-slate-100" />}

            {!isLoading && !data?.bankAccounts?.length && !adding && (
                <div className="flex flex-col items-center py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Building2 className="w-10 h-10 text-slate-300 mb-3" />
                    <p className="font-black text-[#0B1120] text-sm mb-1">No accounts yet</p>
                    <p className="text-slate-400 text-xs font-medium mb-5">Add a bank account to enable withdrawals.</p>
                    <button onClick={() => setAdding(true)} className="text-xs font-bold px-5 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-[#0B1120] shadow-sm transition-all">Add Your First Account</button>
                </div>
            )}

            {!isLoading && data?.bankAccounts?.map((acc) => (
                <Card key={acc._id}>
                    <div className="p-5 flex items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center"><Landmark className="w-4 h-4 text-violet-500" /></div>
                                <div>
                                    <p className="font-black text-[#0B1120] text-sm">{acc.bankName}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{acc.accountType}</p>
                                </div>
                            </div>
                            <p className="font-mono font-bold text-[#0B1120] text-base tracking-widest mb-3">•••• •••• {acc.accountNumber.slice(-4)}</p>
                            <div className="flex gap-6">
                                <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">IFSC</p><p className="text-xs font-bold text-[#0B1120] uppercase">{acc.ifsc}</p></div>
                                <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Holder</p><p className="text-xs font-bold text-[#0B1120]">{acc.accountHolderName}</p></div>
                            </div>
                        </div>
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-black shrink-0"><CheckCircle2 className="w-3 h-3" />Active</span>
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
            <div className={`rounded-2xl border p-5 flex items-center gap-4 ${enabled ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${enabled ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                    {enabled ? <Lock className="w-5 h-5 text-emerald-600" /> : <Unlock className="w-5 h-5 text-amber-500" />}
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`font-black text-sm ${enabled ? 'text-emerald-800' : 'text-amber-800'}`}>{enabled ? 'Two-Factor Authentication Active' : '2FA Not Enabled'}</p>
                    <p className={`text-xs font-medium mt-0.5 ${enabled ? 'text-emerald-600' : 'text-amber-600'}`}>{enabled ? 'Your login requires an authenticator code.' : 'Add an extra layer of protection.'}</p>
                </div>
                <div className={`w-2 h-2 rounded-full shrink-0 ${enabled ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]' : 'bg-amber-400'}`} />
            </div>

            {/* Disable flow */}
            {enabled && (
                <Card>
                    <CardHeader icon={Unlock} title="Disable Two-Factor Authentication" accent="bg-red-50 text-red-500" />
                    <div className="p-6">
                        <p className="text-sm text-slate-500 font-medium mb-5">Enter the 6-digit code from your authenticator app to disable 2FA.</p>
                        <form onSubmit={disable} className="max-w-xs space-y-4">
                            <input type="text" inputMode="numeric" value={disableCode} onChange={e => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="6-digit code" className={`${field} text-center text-2xl tracking-[0.5em] font-black`} />
                            <button type="submit" disabled={disabling || disableCode.length !== 6} className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-black py-3 rounded-xl flex justify-center items-center gap-2 text-sm transition-all disabled:opacity-40">
                                {disabling ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Unlock className="w-4 h-4" />Disable 2FA</>}
                            </button>
                        </form>
                    </div>
                </Card>
            )}

            {/* Enable start */}
            {!enabled && !setup && (
                <Card>
                    <CardHeader icon={KeyRound} title="Set Up Two-Factor Authentication" accent="bg-[#39FF14]/10 text-[#1a8a00]" />
                    <div className="p-6">
                        <div className="flex items-start gap-3 bg-slate-50 rounded-xl border border-slate-100 p-4 mb-6">
                            <Smartphone className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-slate-500 font-medium">Use Google Authenticator, Authy, or any TOTP-compatible app to scan a QR code.</p>
                        </div>
                        <button onClick={generate} disabled={generating} className="inline-flex items-center gap-2 bg-[#0B1120] hover:bg-[#162032] text-white font-black text-sm px-6 py-3 rounded-xl transition-all disabled:opacity-50">
                            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><KeyRound className="w-4 h-4" />Begin Setup</>}
                        </button>
                    </div>
                </Card>
            )}

            {/* Enable QR + verify */}
            {!enabled && setup && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <Card>
                        <CardHeader icon={Smartphone} title="Step 1 — Scan QR Code" accent="bg-blue-50 text-blue-500" />
                        <div className="p-6">
                            <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 rounded-2xl border border-slate-100 p-5">
                                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm shrink-0">
                                    <Image src={setup.qrCodeDataUrl} alt="2FA QR Code" width={130} height={130} className="rounded-lg" />
                                </div>
                                <div className="space-y-3 text-center sm:text-left">
                                    <p className="text-sm font-black text-[#0B1120]">Can't scan the QR?</p>
                                    <p className="text-xs text-slate-400 font-medium">Enter this key manually in your app:</p>
                                    <div className="flex items-center justify-center sm:justify-start gap-2">
                                        <code className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-[#0B1120] tracking-wider shadow-sm">{setup.secret}</code>
                                        <button type="button" onClick={copy} className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 hover:text-[#0B1120] transition-colors shadow-sm">
                                            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <p className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg inline-block">Never share this key with anyone.</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <CardHeader icon={ShieldCheck} title="Step 2 — Verify & Activate" accent="bg-[#39FF14]/10 text-[#1a8a00]" />
                        <div className="p-6">
                            <p className="text-sm text-slate-500 font-medium mb-5">Enter the 6-digit code from your authenticator app to confirm.</p>
                            <form onSubmit={enable} className="max-w-xs space-y-4">
                                <input type="text" inputMode="numeric" value={verifyCode} onChange={e => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="6-digit code" className={`${field} text-center text-2xl tracking-[0.5em] font-black`} />
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setSetup(null)} className="flex-1 py-3 text-sm font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all">Cancel</button>
                                    <button type="submit" disabled={verifying || verifyCode.length !== 6} className="flex-1 py-3 text-sm font-black bg-[#0B1120] text-white hover:bg-[#162032] rounded-xl flex justify-center items-center gap-2 transition-all disabled:opacity-40">
                                        {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Activate'}
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

// ════════════════════════════════════════════════════════
// ACCOUNT HERO CARD (shared)
// ════════════════════════════════════════════════════════
function AccountCard({ authUser, user }) {
    return (
        <div className="relative bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between gap-4 overflow-hidden mb-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="absolute -top-8 -right-8 w-36 h-36 bg-[#39FF14]/8 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-4 z-10">
                <div className="w-12 h-12 rounded-2xl bg-[#39FF14] flex items-center justify-center font-black text-[#0B1120] text-xl shadow-sm">
                    {authUser?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                    <p className="font-black text-[#0B1120] text-base">{authUser?.name}</p>
                    <p className="text-slate-400 text-sm">{authUser?.email}</p>
                </div>
            </div>
            <div className="z-10 text-right shrink-0">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">KYC</p>
                <KycBadge status={user?.kycStatus} />
            </div>
        </div>
    );
}

// ════════════════════════════════════════════════════════
// MOBILE — Settings list view
// ════════════════════════════════════════════════════════
function MobileList({ authUser, user, onSelect }) {
    return (
        <div className="space-y-3">
            <AccountCard authUser={authUser} user={user} />
            <div className="space-y-2">
                {SETTINGS_ITEMS.map(({ id, label, icon: Icon }) => (
                    <motion.button
                        key={id}
                        onClick={() => onSelect(id)}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center gap-4 px-5 py-5 bg-white border border-slate-100 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#39FF14]/50 hover:shadow-[0_4px_20px_rgba(57,255,20,0.10)] transition-all duration-200 text-left group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center shrink-0 group-hover:bg-[#39FF14]/20 group-hover:scale-105 transition-all">
                            <Icon className="w-5 h-5 text-[#1a8a00]" />
                        </div>
                        <p className="flex-1 font-black text-[#0B1120] text-base tracking-tight">{label}</p>
                        <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-[#39FF14]/10 group-hover:border-[#39FF14]/30 transition-all">
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#1a8a00] group-hover:translate-x-0.5 transition-all" />
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

// ════════════════════════════════════════════════════════
// MOBILE — Detail drill-down view
// ════════════════════════════════════════════════════════
function MobileDetail({ sectionId, onBack, tabProps }) {
    const item = SETTINGS_ITEMS.find(i => i.id === sectionId);
    return (
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.22 }}
            className="absolute inset-0 bg-slate-50 z-10 overflow-y-auto">
            <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center gap-3 px-4 py-3.5 z-20">
                <button onClick={onBack} className="flex items-center gap-1 text-sm font-black text-[#0B1120] -ml-1 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                    <ArrowLeft className="w-4 h-4 text-[#39FF14]" /> Settings
                </button>
                <div className="h-3.5 w-px bg-slate-200" />
                <span className="text-sm font-black text-[#0B1120] truncate">{item?.label}</span>
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

// ════════════════════════════════════════════════════════
// DESKTOP — Tabbed hub
// ════════════════════════════════════════════════════════
function DesktopHub({ authUser, user, tabProps }) {
    const [active, setActive] = useState('profile');

    return (
        <div className="max-w-3xl">
            <AccountCard authUser={authUser} user={user} />

            {/* Tab strip */}
            <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl mb-6">
                {SETTINGS_ITEMS.map(({ id, label, icon: Icon }) => {
                    const on = active === id;
                    return (
                        <button key={id} onClick={() => setActive(id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-black transition-all ${on ? 'bg-white text-[#0B1120] shadow-sm' : 'text-slate-400 hover:text-[#0B1120]'}`}>
                            <Icon className={`w-4 h-4 shrink-0 ${on ? 'text-[#39FF14]' : ''}`} />
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
