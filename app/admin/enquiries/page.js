'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { MessageSquare, Phone, Mail, Clock, ShieldCheck, Search, Check, FileText, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AdminEnquiriesPage() {
    const { data, error, mutate } = useSWR('/api/admin/enquiries', fetcher);
    const [search, setSearch] = useState('');
    const [updatingParams, setUpdatingParams] = useState(null);

    const enquiries = data?.enquiries || [];

    // Local filtering
    const filtered = enquiries.filter(req =>
        req.name.toLowerCase().includes(search.toLowerCase()) ||
        req.fieldOfInquiry.toLowerCase().includes(search.toLowerCase()) ||
        (req.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (req.phone || '').includes(search)
    );

    const handleExport = () => {
        if (!filtered || filtered.length === 0) return;

        const exportData = filtered.map(enq => ({
            Name: enq.name,
            'Field Of Inquiry': enq.fieldOfInquiry,
            Email: enq.email,
            Phone: enq.phone,
            'Requested Date & Time': new Date(enq.contactDateTime).toLocaleString(),
            Status: enq.status,
            'Submitted At': new Date(enq.createdAt).toLocaleString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);

        // Auto-fit columns
        const colWidths = [
            { wch: 20 }, // Name
            { wch: 30 }, // Field of Inquiry
            { wch: 30 }, // Email
            { wch: 20 }, // Phone
            { wch: 25 }, // Requested Date
            { wch: 15 }, // Status
            { wch: 25 }, // Submitted
        ];
        worksheet['!cols'] = colWidths;

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Enquiries');
        XLSX.writeFile(workbook, 'Business_Enquiries.xlsx');
    };

    const updateStatus = async (id, newStatus) => {
        setUpdatingParams(id);
        try {
            const res = await fetch(`/api/admin/enquiries/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                mutate(); // re-fetch SWR cache
            }
        } catch (err) {
            console.error('Update failed', err);
        } finally {
            setUpdatingParams(null);
        }
    };

    if (error) return <div className="text-red-500">Failed to load enquiries.</div>;

    const pendingCount = enquiries.filter(e => e.status === 'pending').length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
                        <MessageSquare className="w-6 h-6 text-[#d4af35]" />
                        Business Enquiries
                    </h1>
                    <p className="text-[#a3a3a3] text-sm max-w-lg leading-relaxed">
                        Manage partnership and service requests targeting Hash Prime Groups.
                    </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 bg-[#0A0A0A] border border-[#d4af35]/15 rounded-2xl p-4 shadow-[0_0_20px_rgba(212,175,53,0.05)]">
                    <div>
                        <div className="text-[#d4af35] text-2xl font-black tabular-nums">{pendingCount}</div>
                        <div className="text-[#a3a3a3] text-[10px] font-bold uppercase tracking-widest">Pending</div>
                    </div>
                    <div className="w-px h-8 bg-[#d4af35]/10" />
                    <div>
                        <div className="text-white text-2xl font-black tabular-nums">{enquiries.length}</div>
                        <div className="text-[#a3a3a3] text-[10px] font-bold uppercase tracking-widest">Total</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1 w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a3a3a3]" />
                    <input
                        type="text"
                        placeholder="Search by name, email, phone or field..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#111] border border-[#333] focus:border-[#d4af35]/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#666] outline-none transition-colors"
                    />
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#d4af35]/10 hover:bg-[#d4af35]/20 text-[#d4af35] border border-[#d4af35]/30 rounded-xl transition-all font-bold text-sm tracking-widest uppercase w-full sm:w-auto justify-center whitespace-nowrap"
                >
                    <Download className="w-4 h-4" />
                    Export Excel
                </button>
            </div>

            {/* Data list */}
            {!data ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-2 border-[#d4af35]/30 border-t-[#d4af35] rounded-full animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 border border-white/5 bg-white/[0.02] rounded-3xl">
                    <FileText className="w-12 h-12 text-[#d4af35]/20 mx-auto mb-4" />
                    <p className="text-[#a3a3a3] text-sm">No enquiries found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((enq) => {
                        const isPending = enq.status === 'pending';
                        const isUpdating = updatingParams === enq._id;
                        return (
                            <div key={enq._id} className={`relative bg-[#0d0d0d] rounded-2xl p-6 border transition-all ${isPending ? 'border-[#d4af35]/30 shadow-[0_4px_20px_rgba(212,175,53,0.05)]' : 'border-white/5 opacity-70'
                                }`}>
                                {/* Status badge */}
                                <div className="absolute top-4 right-4 flex items-center gap-2">
                                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${isPending ? 'bg-[#d4af35]/10 text-[#d4af35] border-[#d4af35]/20' : 'bg-green-500/10 text-green-400 border-green-500/20'
                                        }`}>
                                        {enq.status}
                                    </span>
                                </div>

                                <h3 className="text-white font-bold text-lg mb-1 pr-16">{enq.name}</h3>
                                <p className="text-[#a3a3a3] text-xs font-bold uppercase tracking-wider mb-4 border-b border-white/5 pb-4">
                                    {enq.fieldOfInquiry}
                                </p>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-sm text-[#d4af35]">
                                        <Phone className="w-4 h-4 shrink-0" />
                                        <a href={`tel:${enq.phone}`} className="hover:underline text-slate-300">{enq.phone}</a>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-[#d4af35]">
                                        <Mail className="w-4 h-4 shrink-0" />
                                        <a href={`mailto:${enq.email}`} className="hover:underline text-slate-300">{enq.email}</a>
                                    </div>
                                    <div className="flex flex-col gap-1 pt-2">
                                        <div className="flex items-center gap-3 text-sm text-[#a3a3a3]">
                                            <Clock className="w-4 h-4 shrink-0 text-[#d4af35]/50" />
                                            <span>
                                                Time requested: <br />
                                                <span className="text-white font-medium">
                                                    {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(enq.contactDateTime))}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-slate-500 mt-2">
                                        Submitted: {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(enq.createdAt))}
                                    </div>
                                </div>

                                {/* Actions */}
                                {isPending ? (
                                    <button
                                        onClick={() => updateStatus(enq._id, 'contacted')}
                                        disabled={isUpdating}
                                        className="w-full py-2.5 px-4 bg-[#d4af35]/10 hover:bg-[#d4af35]/20 text-[#d4af35] border border-[#d4af35]/20 hover:border-[#d4af35]/40 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                                    >
                                        <Check className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        {isUpdating ? 'Updating...' : 'Mark Contacted'}
                                    </button>
                                ) : (
                                    <div className="w-full py-2.5 px-4 bg-green-500/5 text-green-500/50 border border-green-500/10 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                        <ShieldCheck className="w-4 h-4" />
                                        Handled
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
