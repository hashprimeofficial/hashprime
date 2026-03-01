'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2, XCircle, Loader2, ShieldCheck, Search, Eye,
    User as UserIcon, MapPin, Briefcase, FileText, X, AlertTriangle,
    ExternalLink, Mail
} from 'lucide-react';

const fetcher = (url) => fetch(url).then((res) => res.json());

// ── Field row ─────────────────────────────────────────────────────
const Field = ({ label, value }) => (
    <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</div>
        <div className="text-sm font-bold text-[#0B1120]">{value || <span className="text-slate-300 font-medium italic">Not provided</span>}</div>
    </div>
);

// ── Section header ────────────────────────────────────────────────
const Section = ({ icon: Icon, title, children }) => (
    <div>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <Icon className="w-4 h-4" style={{ color: '#39FF14' }} />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">{title}</h3>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">{children}</div>
    </div>
);

// ── KYC Detail Slide-over ──────────────────────────────────────────
function KYCDetailPanel({ user, onClose, onAction, actioning }) {
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [rejectMsg, setRejectMsg] = useState('');
    const [approving, setApproving] = useState(false);
    const [rejecting, setRejecting] = useState(false);

    const handleApprove = async () => {
        setApproving(true);
        await onAction(user._id, 'approved', '');
        onClose();
    };

    const handleReject = async () => {
        if (!rejectMsg.trim()) return;
        setRejecting(true);
        await onAction(user._id, 'rejected', rejectMsg);
        onClose();
    };

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                key="backdrop"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                onClick={onClose}
            />
            {/* Panel */}
            <motion.div
                key="panel"
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 bg-[#0B1120]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm" style={{ background: '#39FF14', color: '#0B1120' }}>
                            {(user.firstName?.[0] || user.name?.[0] || '?').toUpperCase()}
                        </div>
                        <div>
                            <div className="font-black text-white text-base">{user.firstName} {user.lastName}</div>
                            <div className="text-slate-400 text-xs font-medium">{user.email}</div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto p-7 space-y-7">

                    <Section icon={UserIcon} title="Personal Details">
                        <Field label="First Name" value={user.firstName} />
                        <Field label="Last Name" value={user.lastName} />
                        <Field label="Email" value={user.email} />
                        <Field label="Name (Account)" value={user.name} />
                    </Section>

                    <Section icon={MapPin} title="Address">
                        <div className="col-span-2"><Field label="Street Address" value={user.address} /></div>
                        <Field label="City" value={user.city} />
                        <Field label="State" value={user.state} />
                        <Field label="Pincode" value={user.pincode} />
                        <Field label="Country" value={user.country} />
                    </Section>

                    <Section icon={Briefcase} title="Occupation & Income">
                        <Field label="Occupation" value={user.occupation} />
                        <Field label="Source of Income" value={user.sourceOfIncome} />
                        <div className="col-span-2"><Field label="Income Range" value={user.incomeRange} /></div>
                    </Section>

                    <Section icon={FileText} title="Identity Documents">
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">PAN Number</div>
                            <div className="text-sm font-black text-[#0B1120] uppercase tracking-widest">{user.panNumber || <span className="text-slate-300 font-medium italic">Not provided</span>}</div>
                            {user.panDocumentUrl && (
                                <a href={user.panDocumentUrl} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 mt-2 text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:border-[#39FF14] hover:text-[#0B1120] transition-all">
                                    <ExternalLink className="w-3 h-3" /> View PAN Doc
                                </a>
                            )}
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Aadhaar Number</div>
                            <div className="text-sm font-black text-[#0B1120] tracking-widest">{user.aadhaarNumber || <span className="text-slate-300 font-medium italic">Not provided</span>}</div>
                            {user.aadhaarDocumentUrl && (
                                <a href={user.aadhaarDocumentUrl} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 mt-2 text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:border-[#39FF14] hover:text-[#0B1120] transition-all">
                                    <ExternalLink className="w-3 h-3" /> View Aadhaar Doc
                                </a>
                            )}
                        </div>
                    </Section>

                    {/* Rejection form */}
                    <AnimatePresence>
                        {showRejectForm && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                className="bg-red-50 border border-red-200 rounded-2xl p-5 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-red-500" />
                                    <p className="text-sm font-black text-red-700">Rejection Reason </p>
                                </div>
                                <textarea
                                    value={rejectMsg}
                                    onChange={e => setRejectMsg(e.target.value)}
                                    placeholder="e.g. PAN document is blurry. Please resubmit a clear photo of your PAN card."
                                    rows={4}
                                    className="w-full bg-white border border-red-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium focus:outline-none focus:border-red-400 resize-none"
                                />
                                <div className="flex gap-2">
                                    <button onClick={() => { setShowRejectForm(false); setRejectMsg(''); }}
                                        className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-2.5 rounded-xl text-sm hover:bg-slate-50 transition-all">
                                        Cancel
                                    </button>
                                    <button onClick={handleReject} disabled={!rejectMsg.trim() || rejecting}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                                        {rejecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><XCircle className="w-4 h-4" /> Reject</>}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Action footer */}
                {!showRejectForm && (
                    <div className="px-7 py-5 border-t border-slate-100 flex gap-3 bg-white">
                        <button onClick={() => setShowRejectForm(true)}
                            className="flex-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm">
                            <XCircle className="w-4 h-4" /> Reject
                        </button>
                        <button onClick={handleApprove} disabled={approving}
                            className="flex-1 font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm disabled:opacity-50"
                            style={{ background: '#39FF14', color: '#0B1120', boxShadow: '0 4px 16px rgba(57,255,20,0.25)' }}>
                            {approving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Approve KYC</>}
                        </button>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}

// ── Main page ──────────────────────────────────────────────────────
export default function AdminKYCPage() {
    const { data, error, isLoading, mutate } = useSWR('/api/kyc', fetcher);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [actioningId, setActioningId] = useState(null);

    const handleAction = async (userId, status, rejectionMessage) => {
        setActioningId(userId);
        try {
            const res = await fetch('/api/kyc', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, status, rejectionMessage })
            });
            if (res.ok) mutate();
            else alert('Failed to update KYC status');
        } catch {
            alert('An unexpected error occurred');
        } finally {
            setActioningId(null);
        }
    };

    if (isLoading) return (
        <div className="space-y-4">
            <div className="h-10 bg-slate-200 rounded w-1/4 animate-pulse" />
            <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
        </div>
    );
    if (error) return <div className="text-red-500 font-bold p-6">Failed to load pending KYC applications.</div>;

    const pendingUsers = data?.users || [];
    const filteredUsers = pendingUsers.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.panNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#0B1120] tracking-tight flex items-center gap-3">
                            <ShieldCheck className="w-8 h-8" style={{ color: '#39FF14' }} />
                            KYC Approvals
                        </h1>
                        <p className="text-slate-500 font-medium">Review and verify user KYC submissions.</p>
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search by name or email…" value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none transition-all"
                            onFocus={e => e.target.style.boxShadow = '0 0 0 3px rgba(57,255,20,0.15)'}
                            onBlur={e => e.target.style.boxShadow = ''} />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    {filteredUsers.length === 0 ? (
                        <div className="p-14 text-center">
                            <CheckCircle2 className="w-14 h-14 mx-auto mb-4 text-slate-200" />
                            <h3 className="text-lg font-black text-[#0B1120] mb-1">All caught up!</h3>
                            <p className="text-slate-400 font-medium text-sm">No pending KYC applications.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Applicant</th>
                                        <th className="px-6 py-4 font-bold">ID Numbers</th>
                                        <th className="px-6 py-4 font-bold">Occupation</th>
                                        <th className="px-6 py-4 font-bold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredUsers.map(user => (
                                        <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={user._id}
                                            className="hover:bg-slate-50/70 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                                                        style={{ background: 'rgba(57,255,20,0.12)', color: '#0B1120' }}>
                                                        {(user.firstName?.[0] || user.name?.[0] || '?').toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-[#0B1120] text-sm">{user.firstName} {user.lastName}</div>
                                                        <div className="text-xs text-slate-400 font-medium">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs font-bold text-slate-500">PAN: <span className="text-[#0B1120] uppercase tracking-widest">{user.panNumber || '—'}</span></div>
                                                <div className="text-xs font-bold text-slate-500 mt-1">Aadhaar: <span className="text-[#0B1120]">{user.aadhaarNumber || '—'}</span></div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-[#0B1120]">{user.occupation || '—'}</div>
                                                <div className="text-xs text-slate-400 mt-0.5">{user.incomeRange}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => setSelectedUser(user)}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black border border-[#39FF14]/30 text-[#0B1120] hover:bg-[#39FF14] transition-all"
                                                    style={{ background: 'rgba(57,255,20,0.08)' }}>
                                                    <Eye className="w-3.5 h-3.5" /> View Profile
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail slide-over */}
            {selectedUser && (
                <KYCDetailPanel
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onAction={handleAction}
                    actioning={actioningId}
                />
            )}
        </>
    );
}
