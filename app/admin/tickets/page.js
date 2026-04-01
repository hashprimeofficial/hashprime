'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare, CheckCircle2, Clock, Loader2, Send, Filter,
    Image as ImageIcon, User, AlertCircle, X, ExternalLink, Download
} from 'lucide-react';
import * as XLSX from 'xlsx';

const fetcher = (url) => fetch(url).then((res) => res.json());

const PRIORITY_COLORS = {
    high: 'bg-red-500/10 text-red-400 border-red-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    low: 'bg-[#d4af35]/10 text-[#d4af35] border-[#d4af35]/20',
};

export default function AdminTicketsPage() {
    const { data, error, isLoading, mutate } = useSWR('/api/tickets', fetcher);
    const [resolvingId, setResolvingId] = useState(null);
    const [adminReplies, setAdminReplies] = useState({});
    const [filter, setFilter] = useState('open');
    const [expandedId, setExpandedId] = useState(null);
    const [screenshotPreview, setScreenshotPreview] = useState(null);
    const [msgState, setMsgState] = useState({});

    const handleReplyChange = (id, text) => setAdminReplies(prev => ({ ...prev, [id]: text }));

    const handleResolve = async (ticketId) => {
        const reply = adminReplies[ticketId];
        if (!reply?.trim()) {
            setMsgState(prev => ({ ...prev, [ticketId]: { type: 'error', text: 'Please provide a reply first.' } }));
            return;
        }
        setResolvingId(ticketId);
        try {
            const res = await fetch(`/api/tickets/${ticketId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminReply: reply, status: 'resolved' })
            });
            if (res.ok) {
                mutate();
                setAdminReplies(prev => ({ ...prev, [ticketId]: '' }));
                setMsgState(prev => ({ ...prev, [ticketId]: { type: 'success', text: '✓ Resolved & user notified.' } }));
                setTimeout(() => setMsgState(prev => ({ ...prev, [ticketId]: null })), 3000);
            } else {
                setMsgState(prev => ({ ...prev, [ticketId]: { type: 'error', text: 'Failed to resolve ticket.' } }));
            }
        } catch {
            setMsgState(prev => ({ ...prev, [ticketId]: { type: 'error', text: 'Unexpected error.' } }));
        } finally {
            setResolvingId(null);
        }
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#d4af35]" />
            <p className="text-[#d4af35]/50 text-sm font-black uppercase tracking-widest">Loading tickets…</p>
        </div>
    );
    if (error) return <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl font-bold">Failed to load tickets.</div>;

    const allTickets = data?.tickets || [];
    const filteredTickets = filter === 'all' ? allTickets : allTickets.filter(t => t.status === filter);
    const openCount = allTickets.filter(t => t.status === 'open').length;
    const resolvedCount = allTickets.filter(t => t.status === 'resolved').length;

    const handleExport = () => {
        if (!filteredTickets || filteredTickets.length === 0) return;

        const exportData = filteredTickets.map(t => ({
            Subject: t.subject,
            User: t.user?.name || 'Unknown',
            Email: t.user?.email || 'N/A',
            Category: t.category,
            SubCategory: t.subCategory || '',
            Description: t.description,
            Status: t.status,
            AdminReply: t.adminReply || '',
            CreatedAt: new Date(t.createdAt).toLocaleString(),
            ResolvedAt: t.status === 'resolved' ? new Date(t.updatedAt).toLocaleString() : '',
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tickets');
        XLSX.writeFile(workbook, 'Tickets_Export.xlsx');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#d4af35]/10 rounded-xl border border-[#d4af35]/20 flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-[#d4af35]" />
                        </div>
                        Support Center
                    </h1>
                    <p className="text-[#d4af35]/40 text-sm font-medium mt-1 ml-12">
                        <span className="text-amber-400 font-black">{openCount} open</span> · {resolvedCount} resolved
                    </p>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-1 bg-[#d4af35]/5 border border-[#d4af35]/15 p-1 rounded-2xl">
                    {[
                        { key: 'open', label: `Open (${openCount})` },
                        { key: 'resolved', label: `Resolved (${resolvedCount})` },
                        { key: 'all', label: `All (${allTickets.length})` },
                    ].map(({ key, label }) => (
                        <button key={key} onClick={() => setFilter(key)}
                            className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${filter === key
                                ? 'bg-[#d4af35] text-black shadow-[0_0_12px_rgba(212,175,53,0.25)]'
                                : 'text-[#d4af35]/50 hover:text-[#d4af35]'
                                }`}>
                            {label}
                        </button>
                    ))}
                    <button onClick={handleExport} className="px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all text-[#d4af35] bg-[#d4af35]/10 border border-[#d4af35]/30 ml-2 flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" /> Export
                    </button>
                </div>
            </div>

            {/* Tickets */}
            {filteredTickets.length === 0 ? (
                <div className="bg-[#080808] border border-[#d4af35]/15 rounded-3xl p-16 text-center">
                    <CheckCircle2 className="w-14 h-14 mx-auto mb-4 text-[#d4af35]/20" />
                    <h3 className="text-lg font-black text-white mb-1">All Clear!</h3>
                    <p className="text-[#d4af35]/30 font-medium text-sm">No tickets match the current filter.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    <AnimatePresence>
                        {filteredTickets.map((ticket) => {
                            const isExpanded = expandedId === ticket._id;
                            const isOpen = ticket.status === 'open';
                            const msg = msgState[ticket._id];

                            return (
                                <motion.div
                                    key={ticket._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className={`bg-[#080808] border rounded-3xl overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.4)] transition-colors ${isOpen ? 'border-amber-500/20' : 'border-[#d4af35]/10'
                                        }`}
                                >
                                    {/* Ticket row (always visible) */}
                                    <div
                                        className="p-5 flex items-start gap-4 cursor-pointer hover:bg-[#d4af35]/3 transition-colors"
                                        onClick={() => setExpandedId(isExpanded ? null : ticket._id)}
                                    >
                                        {/* Avatar */}
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border font-black text-sm ${isOpen
                                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                            : 'bg-[#d4af35]/10 border-[#d4af35]/20 text-[#d4af35]'
                                            }`}>
                                            {ticket.user?.name?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-[#d4af35]">
                                                    {ticket.category}
                                                </span>
                                                {ticket.subCategory && (
                                                    <span className="text-[10px] text-[#d4af35]/40">· {ticket.subCategory}</span>
                                                )}
                                                {isOpen ? (
                                                    <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg">
                                                        <Clock className="w-3 h-3" /> Open
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 bg-[#32e512]/10 text-[#32e512] border border-[#32e512]/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg">
                                                        <CheckCircle2 className="w-3 h-3" /> Resolved
                                                    </span>
                                                )}
                                                {ticket.screenshotUrl && (
                                                    <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-black uppercase px-2 py-0.5 rounded-lg">
                                                        <ImageIcon className="w-3 h-3" /> Has Image
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-black text-white text-sm mt-1 truncate">{ticket.subject}</h3>
                                            <p className="text-xs text-[#d4af35]/40 mt-0.5">
                                                {ticket.user?.name} ({ticket.user?.email}) · {new Date(ticket.createdAt).toLocaleDateString('en-GB')} {new Date(ticket.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>

                                        <div className={`text-[#d4af35]/30 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>

                                    {/* Expanded detail */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-5 pb-5 border-t border-[#d4af35]/10 pt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    {/* Left: Message + screenshot */}
                                                    <div className="space-y-4">
                                                        <div>
                                                            <div className="text-[10px] font-black uppercase tracking-widest text-[#d4af35]/40 mb-2">User Message</div>
                                                            <div className="bg-[#0A0A0A] border border-[#d4af35]/10 rounded-2xl p-4 text-sm text-white/70 font-medium whitespace-pre-wrap leading-relaxed">
                                                                {ticket.description}
                                                            </div>
                                                        </div>
                                                        {ticket.screenshotUrl && (
                                                            <div>
                                                                <div className="text-[10px] font-black uppercase tracking-widest text-[#d4af35]/40 mb-2">Attachment</div>
                                                                <div className="flex items-center gap-3">
                                                                    <button
                                                                        onClick={() => setScreenshotPreview(ticket.screenshotUrl)}
                                                                        className="w-20 h-20 rounded-xl overflow-hidden border border-[#d4af35]/20 hover:border-[#d4af35]/50 transition-all relative group"
                                                                    >
                                                                        <img src={ticket.screenshotUrl} alt="Screenshot" className="w-full h-full object-cover" />
                                                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                            <ExternalLink className="w-4 h-4 text-[#d4af35]" />
                                                                        </div>
                                                                    </button>
                                                                    <a href={ticket.screenshotUrl} target="_blank" rel="noopener noreferrer"
                                                                        className="text-xs text-[#d4af35] font-black border border-[#d4af35]/20 px-3 py-1.5 rounded-xl hover:bg-[#d4af35]/10 transition-all inline-flex items-center gap-1">
                                                                        <ExternalLink className="w-3 h-3" /> Open Full
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Right: Reply / Resolution */}
                                                    <div>
                                                        {ticket.status === 'resolved' ? (
                                                            <div className="bg-[#32e512]/5 border border-[#32e512]/15 rounded-2xl p-4 h-full">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <CheckCircle2 className="w-4 h-4 text-[#32e512]" />
                                                                    <span className="text-sm font-black text-[#32e512]">Resolution Sent</span>
                                                                </div>
                                                                <p className="text-sm text-white/60 font-medium whitespace-pre-wrap leading-relaxed">{ticket.adminReply}</p>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col h-full space-y-3">
                                                                <div className="text-[10px] font-black uppercase tracking-widest text-[#d4af35]/40">Write Resolution</div>
                                                                <textarea
                                                                    value={adminReplies[ticket._id] || ''}
                                                                    onChange={(e) => handleReplyChange(ticket._id, e.target.value)}
                                                                    placeholder="Write your resolution reply here…"
                                                                    className="flex-1 w-full bg-[#0A0A0A] border border-[#d4af35]/15 rounded-2xl p-4 text-sm text-white font-medium focus:outline-none focus:border-[#d4af35]/40 transition-all resize-none min-h-[120px] placeholder:text-white/20"
                                                                />
                                                                {msg && (
                                                                    <div className={`p-2.5 rounded-xl text-xs font-black text-center ${msg.type === 'success' ? 'bg-[#32e512]/10 text-[#32e512] border border-[#32e512]/15' : 'bg-red-500/10 text-red-400 border border-red-500/15'
                                                                        }`}>{msg.text}</div>
                                                                )}
                                                                <button
                                                                    onClick={() => handleResolve(ticket._id)}
                                                                    disabled={resolvingId === ticket._id || !adminReplies[ticket._id]?.trim()}
                                                                    className="w-full bg-[#d4af35] hover:opacity-90 text-black font-black py-3 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(212,175,53,0.2)]"
                                                                >
                                                                    {resolvingId === ticket._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                                                    Resolve & Notify User
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* Screenshot preview */}
            <AnimatePresence>
                {screenshotPreview && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
                        onClick={() => setScreenshotPreview(null)}>
                        <button className="absolute top-5 right-5 text-white/60 hover:text-white bg-white/10 rounded-xl p-2 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                        <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            src={screenshotPreview} alt="Screenshot"
                            className="max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl object-contain border border-[#d4af35]/20"
                            onClick={e => e.stopPropagation()} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
