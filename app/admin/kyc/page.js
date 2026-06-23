'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2, XCircle, Loader2, ShieldCheck, Search, Eye,
    User as UserIcon, MapPin, Briefcase, FileText, X, AlertTriangle,
    ExternalLink, Mail, Download
} from 'lucide-react';
import * as XLSX from 'xlsx';

const fetcher = (url) => fetch(url).then((res) => res.json());

// ── Field ─────────────────────────────────────────────────────────────
const Field = ({ label, value }) => (
    <div>
        <div className="text-[9px] font-black text-[#d4af35]/40 uppercase tracking-[0.2em] mb-1">{label}</div>
        <div className="text-sm font-bold text-white">{value || <span className="text-white/20 font-medium italic">Not provided</span>}</div>
    </div>
);

// ── Section header ─────────────────────────────────────────────────────
const Section = ({ icon: Icon, title, children }) => (
    <div>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#d4af35]/10">
            <div className="w-6 h-6 rounded-lg bg-[#d4af35]/10 border border-[#d4af35]/20 flex items-center justify-center">
                <Icon className="w-3.5 h-3.5 text-[#d4af35]" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d4af35]/60">{title}</h3>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">{children}</div>
    </div>
);

// ── KYC Detail Slide-over ──────────────────────────────────────────────
function KYCDetailPanel({ user, onClose, onAction }) {
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

    const initials = (user.firstName?.[0] || user.name?.[0] || '?').toUpperCase();

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                key="backdrop"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                onClick={onClose}
            />
            {/* Slide panel */}
            <motion.div
                key="panel"
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#080808] z-50 shadow-[−8px_0_40px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden border-l border-[#d4af35]/20"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#d4af35]/15 bg-gradient-to-r from-[#d4af35]/10 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#d4af35]/30 to-[#d4af35]/5 border border-[#d4af35]/30 flex items-center justify-center font-black text-[#d4af35] text-base shrink-0">
                            {initials}
                        </div>
                        <div>
                            <div className="font-black text-white text-base leading-tight">{user.firstName} {user.lastName}</div>
                            <div className="text-[#d4af35]/50 text-xs font-medium">{user.email}</div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-[#d4af35]/40 hover:text-[#d4af35] hover:bg-[#d4af35]/10 transition-colors rounded-xl">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-7">
                    <Section icon={UserIcon} title="Personal Details">
                        <Field label="First Name" value={user.firstName} />
                        <Field label="Last Name" value={user.lastName} />
                        <Field label="Email" value={user.email} />
                        <Field label="Account Name" value={user.name} />
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
                        {/* PAN */}
                        <div>
                            <div className="text-[9px] font-black text-[#d4af35]/40 uppercase tracking-[0.2em] mb-1">PAN Number</div>
                            <div className="text-sm font-black text-white uppercase tracking-widest mb-2">
                                {user.panNumber || <span className="text-white/20 font-medium italic normal-case">Not provided</span>}
                            </div>
                            {user.panDocumentUrl ? (
                                <div className="space-y-1.5">
                                    <a href={user.panDocumentUrl} target="_blank" rel="noopener noreferrer" className="relative block w-full h-24 rounded-xl overflow-hidden border border-[#d4af35]/20 hover:border-[#d4af35]/60 transition-all group">
                                        <img src={user.panDocumentUrl} alt="PAN Document" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                            <ExternalLink className="w-4 h-4 text-[#d4af35]" />
                                            <span className="text-[#d4af35] text-[10px] font-black">Open</span>
                                        </div>
                                    </a>
                                    <a href={user.panDocumentUrl} target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg border border-[#d4af35]/20 text-[#d4af35]/60 hover:border-[#d4af35] hover:text-[#d4af35] transition-all">
                                        <ExternalLink className="w-3 h-3" /> View Full PAN Doc
                                    </a>
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/25 text-[10px] font-black">
                                    <FileText className="w-3 h-3" /> No image attached
                                </div>
                            )}
                        </div>

                        {/* Aadhaar */}
                        <div>
                            <div className="text-[9px] font-black text-[#d4af35]/40 uppercase tracking-[0.2em] mb-1">Aadhaar Number</div>
                            <div className="text-sm font-black text-white tracking-widest mb-2">
                                {user.aadhaarNumber || <span className="text-white/20 font-medium italic normal-case tracking-normal">Not provided</span>}
                            </div>
                            {user.aadhaarDocumentUrl ? (
                                <div className="space-y-1.5">
                                    <a href={user.aadhaarDocumentUrl} target="_blank" rel="noopener noreferrer" className="relative block w-full h-24 rounded-xl overflow-hidden border border-[#d4af35]/20 hover:border-[#d4af35]/60 transition-all group">
                                        <img src={user.aadhaarDocumentUrl} alt="Aadhaar Document" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                            <ExternalLink className="w-4 h-4 text-[#d4af35]" />
                                            <span className="text-[#d4af35] text-[10px] font-black">Open</span>
                                        </div>
                                    </a>
                                    <a href={user.aadhaarDocumentUrl} target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg border border-[#d4af35]/20 text-[#d4af35]/60 hover:border-[#d4af35] hover:text-[#d4af35] transition-all">
                                        <ExternalLink className="w-3 h-3" /> View Full Aadhaar Doc
                                    </a>
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/25 text-[10px] font-black">
                                    <FileText className="w-3 h-3" /> No image attached
                                </div>
                            )}
                        </div>
                    </Section>

                    {/* Rejection form */}
                    <AnimatePresence>
                        {showRejectForm && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-red-400" />
                                    <p className="text-sm font-black text-red-400">Rejection Reason <span className="text-red-400/50 font-normal">(will be emailed to user)</span></p>
                                </div>
                                <textarea
                                    value={rejectMsg}
                                    onChange={e => setRejectMsg(e.target.value)}
                                    placeholder="e.g. PAN document is blurry. Please resubmit a clear photo of your PAN card."
                                    rows={4}
                                    className="w-full bg-[#0A0A0A] border border-red-500/20 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-red-500/50 resize-none"
                                />
                                <div className="flex gap-2">
                                    <button onClick={() => { setShowRejectForm(false); setRejectMsg(''); }}
                                        className="flex-1 bg-[#0A0A0A] border border-white/10 text-white/50 font-bold py-2.5 rounded-xl text-sm hover:bg-white/5 transition-all">
                                        Cancel
                                    </button>
                                    <button onClick={handleReject} disabled={!rejectMsg.trim() || rejecting}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-black py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                                        {rejecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><XCircle className="w-4 h-4" /> Confirm Reject</>}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer actions */}
                {!showRejectForm && (
                    <div className="px-6 py-5 border-t border-[#d4af35]/10 flex gap-3 bg-[#080808]">
                        <button onClick={() => setShowRejectForm(true)}
                            className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-black py-3 rounded-2xl flex items-center justify-center gap-2 transition-all text-sm">
                            <XCircle className="w-4 h-4" /> Reject
                        </button>
                        <button onClick={handleApprove} disabled={approving}
                            className="flex-1 bg-[#d4af35] text-black font-black py-3 rounded-2xl flex items-center justify-center gap-2 transition-all text-sm hover:opacity-90 shadow-[0_0_20px_rgba(212,175,53,0.3)] disabled:opacity-50">
                            {approving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Approve KYC</>}
                        </button>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}

// ── Main page ──────────────────────────────────────────────────────────
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
        } finally {
            setActioningId(null);
        }
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#d4af35]" />
            <p className="text-[#d4af35]/50 text-sm font-black uppercase tracking-widest">Loading KYC queue…</p>
        </div>
    );
    if (error) return <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl font-bold">Failed to load KYC applications.</div>;

    const pendingUsers = data?.users || [];
    const filteredUsers = pendingUsers.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.panNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExport = () => {
        if (!filteredUsers || filteredUsers.length === 0) return;

        const exportData = filteredUsers.map(u => ({
            FirstName: u.firstName,
            LastName: u.lastName,
            AccountName: u.name,
            Email: u.email,
            Phone: u.phone,
            Address: u.address,
            City: u.city,
            State: u.state,
            Pincode: u.pincode,
            Country: u.country,
            Occupation: u.occupation,
            IncomeRange: u.incomeRange,
            SourceOfIncome: u.sourceOfIncome,
            PanNumber: u.panNumber,
            AadhaarNumber: u.aadhaarNumber,
            Status: u.kycStatus,
            RegisteredAt: new Date(u.createdAt).toLocaleString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'KYC');
        XLSX.writeFile(workbook, 'KYC_Export.xlsx');
    };

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-white flex items-center gap-3">
                            <div className="w-9 h-9 bg-[#d4af35]/10 rounded-xl border border-[#d4af35]/20 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-[#d4af35]" />
                            </div>
                            KYC Approvals
                        </h1>
                        <p className="text-[#d4af35]/40 text-sm font-medium mt-1 ml-12">
                            <span className="text-amber-400 font-black">{pendingUsers.length}</span> pending verification{pendingUsers.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="relative w-full md:w-64 flex gap-2">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d4af35]/40" />
                            <input type="text" placeholder="Search name, email, PAN…" value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-[#080808] border border-[#d4af35]/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#d4af35]/40 transition-all" />
                        </div>
                        <button onClick={handleExport} className="px-4 py-2.5 bg-[#d4af35]/10 hover:bg-[#d4af35]/20 text-[#d4af35] border border-[#d4af35]/30 rounded-xl transition-all font-bold flex items-center gap-2">
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {filteredUsers.length === 0 ? (
                    <div className="bg-[#080808] border border-[#d4af35]/15 rounded-3xl p-16 text-center">
                        <div className="w-16 h-16 bg-[#d4af35]/10 rounded-2xl border border-[#d4af35]/20 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8 text-[#d4af35]/40" />
                        </div>
                        <h3 className="text-lg font-black text-white mb-1">All Caught Up!</h3>
                        <p className="text-[#d4af35]/30 font-medium text-sm">No pending KYC applications.</p>
                    </div>
                ) : (
                    <div className="bg-[#080808] border border-[#d4af35]/15 rounded-3xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead className="bg-[#d4af35]/5 border-b border-[#d4af35]/10">
                                    <tr>
                                        {['Applicant', 'ID Numbers', 'Occupation & Income', 'Action'].map((h, i) => (
                                            <th key={h} className={`px-5 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/50 ${i === 3 ? 'text-right' : ''}`}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#d4af35]/5">
                                    {filteredUsers.map(user => (
                                        <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            className="hover:bg-[#d4af35]/3 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d4af35]/20 to-[#d4af35]/5 border border-[#d4af35]/20 flex items-center justify-center text-[#d4af35] font-black text-sm shrink-0">
                                                        {(user.firstName?.[0] || user.name?.[0] || '?').toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-sm">{user.firstName} {user.lastName}</div>
                                                        <div className="text-[10px] text-[#d4af35]/40 font-medium">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="text-xs font-bold text-[#d4af35]/50">PAN: <span className="text-white uppercase tracking-widest">{user.panNumber || '—'}</span></div>
                                                <div className="text-xs font-bold text-[#d4af35]/50 mt-1">Aadhar: <span className="text-white">{user.aadhaarNumber || '—'}</span></div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="text-sm font-bold text-white">{user.occupation || '—'}</div>
                                                <div className="text-xs text-[#d4af35]/40 mt-0.5">{user.incomeRange || ''}</div>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <button onClick={() => setSelectedUser(user)}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black border border-[#d4af35]/20 text-[#d4af35] hover:bg-[#d4af35]/10 hover:border-[#d4af35]/40 transition-all">
                                                    <Eye className="w-3.5 h-3.5" /> Review Profile
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

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
