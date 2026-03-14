'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Plus, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';

const CATEGORIES = {
    'Investment': ['Missing Return', 'Status Pending', 'Other Investment Issue'],
    'Deposit': ['Deposit Not Reflected', 'Wrong Network Used', 'Bank Transfer Delay'],
    'Withdrawal': ['Withdrawal Pending', 'Incorrect Details', 'Referral Withdrawal Query'],
    'Account': ['KYC Issue', '2FA Setup', 'Profile Update'],
    'Other': ['General Query', 'Bug Report', 'Suggestions']
};

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function TicketsPage() {
    const { data, error, isLoading, mutate } = useSWR('/api/tickets', fetcher);

    const [isAdding, setIsAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({ subject: '', description: '', category: 'Investment', subCategory: CATEGORIES['Investment'][0] });
    const [message, setMessage] = useState('');
    const [screenshotBase64, setScreenshotBase64] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'category') {
            setFormData({ ...formData, category: value, subCategory: CATEGORIES[value][0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setMessage('Screenshot must be less than 5MB');
                return;
            }
            setPreviewUrl(URL.createObjectURL(file));

            const reader = new FileReader();
            reader.onloadend = () => {
                setScreenshotBase64(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsSaving(true);
        try {
            const res = await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, screenshotBase64 })
            });

            if (res.ok) {
                mutate();
                setIsAdding(false);
                setFormData({ subject: '', description: '', category: 'Investment', subCategory: CATEGORIES['Investment'][0] });
                setScreenshotBase64('');
                setPreviewUrl('');
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

    const inputClass = "w-full bg-[#0A0A0A]/60 border border-[#d4af35]/20 rounded-xl px-4 py-3.5 text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#d4af35] focus:border-[#d4af35] transition-all shadow-inner placeholder:text-white/20";

    return (
        <div className="max-w-4xl mx-auto space-y-8 relative pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2 tracking-tight flex items-center gap-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        <MessageSquare className="text-[#d4af35] w-8 h-8 drop-shadow-[0_0_8px_rgba(212,175,53,0.4)]" />
                        Support Tickets
                    </h1>
                    <p className="text-[#d4af35]/70 font-medium">Raise queries and track their resolution status.</p>
                </div>
                {!isAdding && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsAdding(true)}
                        className="bg-[#d4af35] hover:bg-[#f8d76d] text-[#0A0A0A] font-black py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(212,175,53,0.3)] uppercase tracking-widest text-sm"
                    >
                        <Plus className="w-5 h-5" /> New Ticket
                    </motion.button>
                )}
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div initial={{ opacity: 0, y: -20, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -20, height: 0 }}
                        className="bg-[#0A0A0A] border border-[#d4af35]/30 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af35]/5 rounded-full blur-[60px] pointer-events-none -mt-32 -mr-32 transition-all group-hover:bg-[#d4af35]/10" />

                        <h2 className="text-2xl font-black text-white mb-8 tracking-tight relative z-10 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#d4af35]/20 flex items-center justify-center border border-[#d4af35]/30">
                                <Plus className="w-5 h-5 text-[#d4af35]" />
                            </div>
                            Raise a New Ticket
                        </h2>

                        {message && <div className="mb-6 text-sm font-bold text-red-500 bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center gap-3 relative z-10"><AlertCircle className="w-5 h-5" /> {message}</div>}

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-[#d4af35]/80 uppercase tracking-widest mb-2">Category</label>
                                    <select name="category" value={formData.category} onChange={handleChange} className={`${inputClass} appearance-none cursor-pointer`}>
                                        {Object.keys(CATEGORIES).map(cat => (
                                            <option key={cat} value={cat} className="bg-[#0A0A0A] text-white font-bold">{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#d4af35]/80 uppercase tracking-widest mb-2">Sub-category</label>
                                    <select name="subCategory" value={formData.subCategory} onChange={handleChange} className={`${inputClass} appearance-none cursor-pointer`}>
                                        {CATEGORIES[formData.category].map(sub => (
                                            <option key={sub} value={sub} className="bg-[#0A0A0A] text-white font-bold">{sub}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-[#d4af35]/80 uppercase tracking-widest mb-2">Subject</label>
                                <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className={inputClass} placeholder="Brief summary of your issue" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-[#d4af35]/80 uppercase tracking-widest mb-2">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} required rows={5} className={`${inputClass} resize-none`} placeholder="Provide detailed information about your query..." />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-[#d4af35]/80 uppercase tracking-widest mb-2">Screenshot <span className="text-white/30 font-bold lowercase">(Optional)</span></label>
                                {previewUrl ? (
                                    <div className="relative rounded-2xl overflow-hidden border border-[#d4af35]/30 bg-[#0A0A0A] mb-3 group/img h-48 w-48 shadow-inner">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => { setPreviewUrl(''); setScreenshotBase64(''); }} className="absolute inset-0 bg-[#0A0A0A]/80 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-red-400 hover:text-red-500 font-bold text-sm tracking-widest uppercase backdrop-blur-sm">
                                            Remove Image
                                        </button>
                                    </div>
                                ) : (
                                    <label className="border-2 border-dashed border-[#d4af35]/30 rounded-2xl p-8 flex flex-col items-center justify-center bg-[#0A0A0A] hover:bg-[#d4af35]/10 hover:border-[#d4af35]/50 transition-all cursor-pointer max-w-sm shadow-inner group/upload">
                                        <div className="w-12 h-12 bg-[#d4af35]/10 rounded-full flex items-center justify-center mb-3 group-hover/upload:scale-110 transition-transform border border-[#d4af35]/20">
                                            <ImageIcon className="w-6 h-6 text-[#d4af35]" />
                                        </div>
                                        <span className="text-sm font-bold text-white tracking-wide">Upload screenshot</span>
                                        <span className="text-[10px] text-[#d4af35]/60 uppercase tracking-widest mt-1.5 font-bold">Max 5MB</span>
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                    </label>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-[#d4af35]/10">
                                <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-4 font-black uppercase tracking-widest text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-center">Cancel</button>
                                <button type="submit" disabled={isSaving} className="bg-[#d4af35] hover:bg-[#f8d76d] text-[#0A0A0A] font-black uppercase tracking-widest text-sm py-4 px-8 rounded-xl shadow-[0_4px_20px_rgba(212,175,53,0.3)] hover:shadow-[0_4px_25px_rgba(212,175,53,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Support Ticket'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isLoading && data?.tickets?.length === 0 && !isAdding && (
                <div className="bg-[#0A0A0A] border border-[#d4af35]/20 rounded-3xl p-16 text-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#d4af35]/5 blur-[60px] rounded-full pointer-events-none" />
                    <div className="w-20 h-20 bg-[#d4af35]/10 rounded-full flex items-center justify-center border border-[#d4af35]/20 mx-auto mb-6 shadow-inner relative z-10">
                        <MessageSquare className="w-10 h-10 text-[#d4af35]" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight relative z-10">No tickets raised yet</h3>
                    <p className="text-[#d4af35]/60 font-medium mb-8 max-w-md mx-auto relative z-10">If you have any queries, issues, or need assistance, feel free to contact our dedicated support team directly.</p>
                    <button onClick={() => setIsAdding(true)} className="bg-transparent border border-[#d4af35]/40 hover:border-[#d4af35] text-[#d4af35] hover:bg-[#d4af35]/10 font-black uppercase tracking-widest text-sm py-4 px-8 rounded-xl transition-all shadow-sm relative z-10">
                        Raise Your First Ticket
                    </button>
                </div>
            )}

            {isLoading && (
                <div className="space-y-6">
                    <div className="h-40 bg-[#0A0A0A] border border-[#d4af35]/10 rounded-3xl animate-pulse" />
                    <div className="h-40 bg-[#0A0A0A] border border-[#d4af35]/10 rounded-3xl animate-pulse" />
                </div>
            )}

            {!isLoading && data?.tickets?.length > 0 && (
                <div className="space-y-6 relative z-10">
                    <h2 className="text-2xl font-black text-white flex items-center gap-2 mb-6 tracking-tight">Your Ticket History</h2>
                    {data.tickets.map((ticket) => (
                        <div key={ticket._id} className="bg-[#0A0A0A] border border-[#d4af35]/20 rounded-3xl p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] group hover:border-[#d4af35]/40 transition-colors">
                            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
                                <div>
                                    <div className="inline-flex items-center gap-2 bg-[#d4af35]/10 px-3 py-1.5 rounded-lg border border-[#d4af35]/20 text-[10px] font-black uppercase tracking-widest text-[#d4af35] shadow-inner mb-3">
                                        <span>{ticket.category}</span>
                                        <span className="w-1 h-1 rounded-full bg-[#d4af35]/50" />
                                        <span>{ticket.subCategory}</span>
                                    </div>
                                    <h3 className="font-black text-white text-xl tracking-tight leading-snug">{ticket.subject}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-2">Raised on {new Date(ticket.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })} at {new Date(ticket.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                <div>
                                    {ticket.status === 'open' ? (
                                        <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-amber-500/30 shadow-inner"><AlertCircle className="w-4 h-4" /> Open</span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 bg-[#32e512]/10 text-[#32e512] px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-[#32e512]/30 shadow-inner"><CheckCircle2 className="w-4 h-4" /> Resolved</span>
                                    )}
                                </div>
                            </div>

                            <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 text-sm text-white/80 font-medium mb-6 whitespace-pre-wrap leading-relaxed shadow-inner">
                                {ticket.description}
                            </div>

                            {ticket.screenshotUrl && (
                                <div className="mb-6">
                                    <p className="text-[10px] uppercase font-black text-[#d4af35]/60 tracking-widest mb-2 border-t border-[#d4af35]/10 pt-4">Attached Evidence</p>
                                    <a href={ticket.screenshotUrl} target="_blank" rel="noopener noreferrer" className="inline-block group/img">
                                        <div className="w-32 h-32 rounded-2xl overflow-hidden border border-[#d4af35]/20 bg-[#0A0A0A] grayscale group-hover/img:grayscale-0 transition-all opacity-80 group-hover/img:opacity-100 shadow-[0_4px_15px_rgba(0,0,0,0.5)] group-hover/img:shadow-[0_8px_25px_rgba(212,175,53,0.3)] group-hover/img:border-[#d4af35]/50 relative">
                                            <img src={ticket.screenshotUrl} alt="Ticket screenshot" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0A]/60 opacity-0 group-hover/img:opacity-100 transition-opacity backdrop-blur-sm">
                                                <span className="text-[#d4af35] text-[10px] font-black uppercase tracking-widest bg-[#0A0A0A] border border-[#d4af35]/30 px-3 py-1.5 rounded-lg shadow-inner">View Full</span>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            )}

                            {ticket.adminReply && (
                                <div className="bg-gradient-to-br from-[#d4af35]/10 to-[#0A0A0A] border-l-4 border-l-[#d4af35] border-y border-r border-y-[#d4af35]/20 border-r-[#d4af35]/20 p-6 rounded-r-2xl shadow-inner mt-4 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af35]/5 rounded-full blur-[40px] pointer-events-none -mt-16 -mr-16" />
                                    <div className="flex items-center gap-3 mb-3 relative z-10">
                                        <div className="w-8 h-8 rounded-full bg-[#d4af35] flex items-center justify-center text-[#0A0A0A] text-xs font-black shadow-[0_4px_10px_rgba(212,175,53,0.4)] border-2 border-[#121212]">
                                            <MessageSquare className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-black text-[#d4af35] uppercase tracking-widest drop-shadow-[0_0_8px_rgba(212,175,53,0.4)]">Support Team Reply</span>
                                    </div>
                                    <p className="text-sm text-white font-medium whitespace-pre-wrap pl-11 leading-relaxed relative z-10">{ticket.adminReply}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
