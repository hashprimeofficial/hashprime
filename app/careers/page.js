'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Briefcase, Send, CheckCircle2, AlertCircle, Loader2, X, FileText, User, Mail, Phone, Link2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const OPEN_ROLES = [
    { id: 'front_office_executive', title: 'Front Office Executive', dept: 'Hash Prime Groups', type: 'Full-time', location: 'Tamil Nadu, India' },
    { id: 'district_coordinator_sales', title: 'District Coordinator (Sales)', dept: 'Hash Prime Groups', type: 'Full-time', location: 'Tamil Nadu, India' },
    { id: 'investment_analyst', title: 'Investment Analyst', dept: 'Finance', type: 'Full-time', location: 'Mumbai / Remote' },
    { id: 'backend_engineer', title: 'Backend Engineer', dept: 'Technology', type: 'Full-time', location: 'Bangalore / Remote' },
    { id: 'frontend_engineer', title: 'Frontend Engineer', dept: 'Technology', type: 'Full-time', location: 'Remote' },
    { id: 'compliance_officer', title: 'Compliance Officer', dept: 'Legal & Risk', type: 'Full-time', location: 'Hyderabad' },
    { id: 'growth_marketer', title: 'Growth Marketer', dept: 'Marketing', type: 'Full-time', location: 'Remote' },
    { id: 'other', title: 'Other / Open Application', dept: 'General', type: 'Any', location: 'India' },
];

export default function CareersPage() {
    const fileInputRef = useRef(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', experience: '', linkedIn: '', coverLetter: '' });
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeBase64, setResumeBase64] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setShowForm(true);
        setError('');
        setSuccess(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { setError('Resume must be under 5MB.'); return; }
        setResumeFile(file);
        setError('');
        const reader = new FileReader();
        reader.onload = () => setResumeBase64(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!resumeBase64) { setError('Please upload your resume.'); return; }
        setIsSubmitting(true);
        setError('');
        try {
            const res = await fetch('/api/careers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, position: selectedRole.title, resumeBase64 }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Submission failed.');
            setSuccess(true);
            setShowForm(false);
            setForm({ name: '', email: '', phone: '', experience: '', linkedIn: '', coverLetter: '' });
            setResumeFile(null);
            setResumeBase64('');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {/* Nav */}
            <nav className="border-b border-white/5 backdrop-blur-xl bg-[#050505]/80 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <Image src="/textonly.png" alt="HashPrime" width={130} height={36} className="brightness-0 invert opacity-90" />
                    </Link>
                    <Link href="/" className="text-sm font-bold text-white/40 hover:text-white transition-colors">← Back to Home</Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative overflow-hidden py-28 px-6">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-[#d4af35] opacity-[0.04] rounded-full blur-[180px]" />
                    <div className="absolute bottom-[-30%] right-[-10%] w-[500px] h-[500px] bg-[#d4af35] opacity-[0.03] rounded-full blur-[150px]" />
                </div>
                <div className="relative z-10 max-w-3xl mx-auto text-center">
                    <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af35]/70 mb-6 border border-[#d4af35]/20 bg-[#d4af35]/5 px-5 py-2 rounded-full">We're Hiring</span>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 leading-[1.05]">
                        Build the Future of <span className="text-[#d4af35]">Finance</span>
                    </h1>
                    <p className="text-white/50 text-lg font-medium max-w-xl mx-auto">
                        Join a team redefining how India invests. We're looking for ambitious people who thrive at the intersection of finance and technology.
                    </p>
                </div>
            </section>

            {/* Open Roles */}
            <section className="max-w-5xl mx-auto px-6 pb-24">
                <h2 className="text-2xl font-black text-white mb-8 tracking-tight">Open Positions</h2>

                <AnimatePresence>
                    {success && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="mb-8 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 flex items-center gap-4">
                            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                            <div>
                                <p className="text-emerald-400 font-black">Application submitted!</p>
                                <p className="text-white/40 text-sm font-medium">Our team will review your application and get in touch within 5–7 business days.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid gap-4 mb-16">
                    {OPEN_ROLES.map((role) => (
                        <motion.div
                            key={role.id}
                            whileHover={{ x: 4 }}
                            onClick={() => handleRoleSelect(role)}
                            className={`group cursor-pointer rounded-2xl border p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${selectedRole?.id === role.id && showForm ? 'border-[#d4af35] bg-[#d4af35]/5' : 'border-white/[0.06] bg-[#0A0A0A] hover:border-[#d4af35]/30'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#d4af35]/10 border border-[#d4af35]/20 flex items-center justify-center shrink-0">
                                    <Briefcase className="w-5 h-5 text-[#d4af35]" />
                                </div>
                                <div>
                                    <h3 className="font-black text-white text-base">{role.title}</h3>
                                    <p className="text-[#d4af35]/60 text-xs font-bold uppercase tracking-widest">{role.dept}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 md:ml-auto">
                                {[role.type, role.location].map((tag) => (
                                    <span key={tag} className="text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-white/50 px-3 py-1.5 rounded-full">{tag}</span>
                                ))}
                                <span className="text-[#d4af35] font-black text-xs group-hover:translate-x-1 transition-transform">Apply →</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Application Form */}
                <AnimatePresence>
                    {showForm && selectedRole && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            id="apply-form"
                            className="bg-[#0A0A0A] border border-[#d4af35]/20 rounded-3xl p-6 md:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.5)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af35]/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />

                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div>
                                    <p className="text-[10px] text-[#d4af35]/60 font-black uppercase tracking-widest mb-1">Applying for</p>
                                    <h2 className="text-2xl font-black text-white">{selectedRole.title}</h2>
                                </div>
                                <button onClick={() => setShowForm(false)} className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-[#d4af35]/70 mb-2">Full Name *</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af35]/40" />
                                            <input required type="text" placeholder="John Doe"
                                                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                                className="w-full bg-[#040404] border border-[#d4af35]/15 rounded-xl pl-11 pr-4 py-3 text-white font-medium focus:outline-none focus:border-[#d4af35]/50 transition-all placeholder-white/20" />
                                        </div>
                                    </div>
                                    {/* Email */}
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-[#d4af35]/70 mb-2">Email Address *</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af35]/40" />
                                            <input required type="email" placeholder="you@example.com"
                                                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                                className="w-full bg-[#040404] border border-[#d4af35]/15 rounded-xl pl-11 pr-4 py-3 text-white font-medium focus:outline-none focus:border-[#d4af35]/50 transition-all placeholder-white/20" />
                                        </div>
                                    </div>
                                    {/* Phone */}
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-[#d4af35]/70 mb-2">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af35]/40" />
                                            <input type="tel" placeholder="+91 98765 43210"
                                                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                                                className="w-full bg-[#040404] border border-[#d4af35]/15 rounded-xl pl-11 pr-4 py-3 text-white font-medium focus:outline-none focus:border-[#d4af35]/50 transition-all placeholder-white/20" />
                                        </div>
                                    </div>
                                    {/* Experience */}
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-[#d4af35]/70 mb-2">Years of Experience</label>
                                        <select
                                            value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })}
                                            className="w-full bg-[#040404] border border-[#d4af35]/15 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-[#d4af35]/50 transition-all appearance-none">
                                            <option value="">Select experience level</option>
                                            <option value="0-1 years">0–1 years (Fresher)</option>
                                            <option value="1-3 years">1–3 years</option>
                                            <option value="3-5 years">3–5 years</option>
                                            <option value="5-10 years">5–10 years</option>
                                            <option value="10+ years">10+ years</option>
                                        </select>
                                    </div>
                                </div>

                                {/* LinkedIn */}
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-[#d4af35]/70 mb-2">LinkedIn / Portfolio URL</label>
                                    <div className="relative">
                                        <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af35]/40" />
                                        <input type="url" placeholder="https://linkedin.com/in/yourprofile"
                                            value={form.linkedIn} onChange={e => setForm({ ...form, linkedIn: e.target.value })}
                                            className="w-full bg-[#040404] border border-[#d4af35]/15 rounded-xl pl-11 pr-4 py-3 text-white font-medium focus:outline-none focus:border-[#d4af35]/50 transition-all placeholder-white/20" />
                                    </div>
                                </div>

                                {/* Cover Letter */}
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-[#d4af35]/70 mb-2">Cover Letter / About You</label>
                                    <textarea rows={4} placeholder="Tell us why you'd be a great fit at HashPrime..."
                                        value={form.coverLetter} onChange={e => setForm({ ...form, coverLetter: e.target.value })}
                                        className="w-full bg-[#040404] border border-[#d4af35]/15 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-[#d4af35]/50 transition-all placeholder-white/20 resize-none" />
                                </div>

                                {/* Resume Upload */}
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-[#d4af35]/70 mb-2">Resume / CV *</label>
                                    <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
                                    <button type="button" onClick={() => fileInputRef.current?.click()}
                                        className={`w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center gap-3 transition-all ${resumeFile ? 'border-[#d4af35]/40 bg-[#d4af35]/5' : 'border-[#d4af35]/20 hover:border-[#d4af35]/40 hover:bg-[#d4af35]/5'}`}>
                                        {resumeFile ? (
                                            <>
                                                <FileText className="w-8 h-8 text-[#d4af35]" />
                                                <p className="text-[#d4af35] font-black text-sm">{resumeFile.name}</p>
                                                <p className="text-white/30 text-xs">Click to change file</p>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-8 h-8 text-[#d4af35]/40" />
                                                <p className="text-white/60 font-bold text-sm">Click to upload your resume</p>
                                                <p className="text-white/25 text-xs">PDF, DOC, DOCX · Max 5MB</p>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="flex items-start gap-2.5 p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-sm font-medium">
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
                                    </div>
                                )}

                                <button type="submit" disabled={isSubmitting}
                                    className="w-full py-4 bg-[#d4af35] text-[#0A0A0A] font-black uppercase tracking-widest rounded-2xl hover:bg-[#f8d76d] transition-all shadow-[0_0_25px_rgba(212,175,53,0.25)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Submit Application</>}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* Footer strip */}
            <div className="border-t border-white/5 py-8 text-center">
                <p className="text-white/20 text-sm">© {new Date().getFullYear()} HashPrime Asset Management. All rights reserved.</p>
            </div>
        </div>
    );
}
