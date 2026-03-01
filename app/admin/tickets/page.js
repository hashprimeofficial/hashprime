'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, CheckCircle2, AlertCircle, Loader2, Search, Send } from 'lucide-react';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AdminTicketsPage() {
    const { data, error, isLoading, mutate } = useSWR('/api/tickets', fetcher);
    const [resolvingId, setResolvingId] = useState(null);
    const [adminReplies, setAdminReplies] = useState({}); // ticketId: reply
    const [filter, setFilter] = useState('open'); // 'open', 'resolved', 'all'

    const handleReplyChange = (id, text) => {
        setAdminReplies(prev => ({ ...prev, [id]: text }));
    };

    const handleResolve = async (ticketId) => {
        const reply = adminReplies[ticketId];
        if (!reply || reply.trim() === '') {
            alert('Please provide a reply before resolving the ticket.');
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
            } else {
                alert('Failed to resolve ticket');
            }
        } catch (error) {
            alert('An unexpected error occurred');
        } finally {
            setResolvingId(null);
        }
    };

    if (isLoading) return <div className="space-y-4"><div className="h-10 bg-slate-200 rounded w-1/4 animate-pulse"></div><div className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div></div>;
    if (error) return <div className="text-red-500 font-bold p-6">Failed to load tickets.</div>;

    const allTickets = data?.tickets || [];
    const filteredTickets = allTickets.filter(t => filter === 'all' || t.status === filter);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-navy tracking-tight flex items-center gap-3">
                        <MessageSquare className="text-purple-500 w-8 h-8" />
                        Support Center
                    </h1>
                    <p className="text-slate-500 font-medium">Manage and resolve user queries.</p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-lg">
                    {['open', 'resolved', 'all'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 text-sm font-bold rounded-md capitalize transition-colors ${filter === f ? 'bg-white text-navy shadow-sm' : 'text-slate-500 hover:text-navy'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {filteredTickets.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
                        <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                        <h3 className="text-lg font-bold text-navy mb-2">Inbox Zero!</h3>
                        <p className="font-medium">No tickets match the current filter.</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {filteredTickets.map((ticket) => (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} key={ticket._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6">
                                {/* Ticket Details */}
                                <div className="flex-1 space-y-4 border-r-0 md:border-r border-slate-100 md:pr-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-black text-navy text-lg">{ticket.subject}</h3>
                                                {ticket.status === 'open' ? (
                                                    <span className="bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded text-[10px] font-bold border border-amber-200 uppercase tracking-widest">Open</span>
                                                ) : (
                                                    <span className="bg-green-50 text-green-700 px-2.5 py-0.5 rounded text-[10px] font-bold border border-green-200 uppercase tracking-widest">Resolved</span>
                                                )}
                                            </div>
                                            <p className="text-xs font-bold text-slate-400">
                                                From: <span className="text-navy">{ticket.user?.name}</span> ({ticket.user?.email}) • {new Date(ticket.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-700 font-medium whitespace-pre-wrap border border-slate-100">
                                        {ticket.description}
                                    </div>
                                </div>

                                {/* Admin Action */}
                                <div className="w-full md:w-1/3 min-w-[300px] flex flex-col justify-between">
                                    {ticket.status === 'resolved' ? (
                                        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl h-full flex flex-col">
                                            <div className="flex items-center gap-2 mb-3">
                                                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                                <span className="text-sm font-bold text-navy">Resolution Sent</span>
                                            </div>
                                            <p className="text-sm text-slate-700 font-medium whitespace-pre-wrap flex-1">{ticket.adminReply}</p>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col space-y-3">
                                            <textarea
                                                value={adminReplies[ticket._id] || ''}
                                                onChange={(e) => handleReplyChange(ticket._id, e.target.value)}
                                                placeholder="Write your resolution reply here..."
                                                className="w-full flex-1 bg-white border border-slate-200 rounded-xl p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:border-neon focus:ring-neon transition-all resize-none shadow-inner"
                                            />
                                            <button
                                                onClick={() => handleResolve(ticket._id)}
                                                disabled={resolvingId === ticket._id || !adminReplies[ticket._id]}
                                                className="w-full bg-navy hover:bg-black text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                            >
                                                {resolvingId === ticket._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                                Resolve & Notify
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
