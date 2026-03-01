'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { MessageSquare, Plus, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function TicketsPage() {
    const { data, error, isLoading, mutate } = useSWR('/api/tickets', fetcher);

    const [isAdding, setIsAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({ subject: '', description: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsSaving(true);
        try {
            const res = await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                mutate();
                setIsAdding(false);
                setFormData({ subject: '', description: '' });
            } else {
                const result = await res.json();
                setMessage(result.error || 'Failed to raise ticket');
            }
        } catch (error) {
            setMessage('An unexpected error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy font-medium focus:outline-none focus:ring-2 focus:ring-neon focus:border-neon transition-all";

    return (
        <div className="max-w-4xl space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-navy mb-2 tracking-tight flex items-center gap-3">
                        <MessageSquare className="text-purple-500 w-8 h-8" />
                        Support Tickets
                    </h1>
                    <p className="text-slate-500 font-medium">Raise queries and track their resolution status.</p>
                </div>
                {!isAdding && (
                    <button onClick={() => setIsAdding(true)} className="bg-neon hover:bg-[#32e512] text-navy font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-sm">
                        <Plus className="w-5 h-5" /> New Ticket
                    </button>
                )}
            </div>

            {isAdding && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                    <h2 className="text-xl font-bold text-navy mb-6">Raise a New Ticket</h2>

                    {message && <div className="mb-4 text-sm font-bold text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">{message}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                            <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className={inputClass} placeholder="Brief summary of your issue" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} required rows={5} className={`${inputClass} resize-none`} placeholder="Provide detailed information about your query..." />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                            <button type="submit" disabled={isSaving} className="bg-navy hover:bg-black text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50">
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Ticket'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            {!isLoading && data?.tickets?.length === 0 && !isAdding && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center">
                    <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-navy mb-2">No tickets raised yet</h3>
                    <p className="text-slate-500 font-medium mb-6">If you have any queries or issues, feel free to contact our support team.</p>
                    <button onClick={() => setIsAdding(true)} className="bg-white border border-slate-200 text-navy font-bold py-2.5 px-6 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                        Raise Your First Ticket
                    </button>
                </div>
            )}

            {isLoading && <div className="space-y-4"><div className="h-32 bg-slate-100 rounded-2xl animate-pulse" /><div className="h-32 bg-slate-100 rounded-2xl animate-pulse" /></div>}

            {!isLoading && data?.tickets?.length > 0 && (
                <div className="space-y-4">
                    {data.tickets.map((ticket) => (
                        <div key={ticket._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-black text-navy text-lg">{ticket.subject}</h3>
                                    <p className="text-xs font-bold text-slate-400">Raised on {new Date(ticket.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    {ticket.status === 'open' ? (
                                        <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200"><AlertCircle className="w-3.5 h-3.5" /> Open</span>
                                    ) : (
                                        <span className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200"><CheckCircle2 className="w-3.5 h-3.5" /> Resolved</span>
                                    )}
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-700 font-medium mb-4 whitespace-pre-wrap">
                                {ticket.description}
                            </div>

                            {ticket.adminReply && (
                                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-black">A</div>
                                        <span className="text-sm font-bold text-navy">Admin Reply</span>
                                    </div>
                                    <p className="text-sm text-slate-700 font-medium whitespace-pre-wrap pl-8">{ticket.adminReply}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
