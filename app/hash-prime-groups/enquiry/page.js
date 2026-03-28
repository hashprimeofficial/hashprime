"use client";

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// ── Inner component uses useSearchParams — must live inside <Suspense> ─────────
function EnquiryForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultField = searchParams.get('field') || '';

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        fieldOfInquiry: defaultField,
        contactDateTime: '',
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (defaultField) {
            setFormData(prev => ({ ...prev, fieldOfInquiry: defaultField }));
        }
    }, [defaultField]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/business-enquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                setSuccess(true);
            } else {
                setError(data.message || 'Error submitting form.');
            }
        } catch {
            setError('Network error, please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#020202] text-[#e0e0e0] font-sans selection:bg-[#d4af35]/30 flex flex-col items-center justify-center py-20 px-4 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,53,0.1),transparent_70%)] pointer-events-none z-0" />

            <div className="relative z-10 w-full max-w-xl bg-[#0a0a0a] border border-[#d4af35]/30 rounded-[2rem] p-10 shadow-[0_0_50px_rgba(212,175,53,0.1)]">
                <h1 className="text-3xl md:text-5xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#d4af35] to-[#f7d66a] mb-6 tracking-tight text-center">
                    Business Enquiry
                </h1>

                {success ? (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 bg-[#d4af35]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-[#d4af35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Request Submitted</h2>
                        <p className="text-[#a3a3a3] mb-8">
                            Our team will review your inquiry and contact you at the scheduled date &amp; time.
                        </p>
                        <button
                            onClick={() => router.push('/hash-prime-groups')}
                            className="px-8 py-3 bg-transparent border border-[#d4af35] text-[#d4af35] hover:bg-[#d4af35] hover:text-black font-bold uppercase rounded-full transition-all duration-300"
                        >
                            Back to Hub
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {error && <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg text-sm">{error}</div>}

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-bold text-[#d4af35] uppercase tracking-wider">Name</label>
                            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="bg-[#111] border border-[#333] focus:border-[#d4af35] rounded-xl px-4 py-3 text-white outline-none transition-colors" placeholder="John Doe" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-bold text-[#d4af35] uppercase tracking-wider">Phone number</label>
                            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="bg-[#111] border border-[#333] focus:border-[#d4af35] rounded-xl px-4 py-3 text-white outline-none transition-colors" placeholder="+91 98765 43210" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-bold text-[#d4af35] uppercase tracking-wider">Email</label>
                            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="bg-[#111] border border-[#333] focus:border-[#d4af35] rounded-xl px-4 py-3 text-white outline-none transition-colors" placeholder="john@company.com" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-bold text-[#d4af35] uppercase tracking-wider">Field of Inquiry</label>
                            <input required type="text" name="fieldOfInquiry" value={formData.fieldOfInquiry} onChange={handleChange} className="bg-[#111] border border-[#333] focus:border-[#d4af35] rounded-xl px-4 py-3 text-white outline-none transition-colors" placeholder="e.g. Total Telecom O&M" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-bold text-[#d4af35] uppercase tracking-wider">Contact us: Date &amp; Time</label>
                            <input required type="datetime-local" name="contactDateTime" value={formData.contactDateTime} onChange={handleChange} className="bg-[#111] border border-[#333] focus:border-[#d4af35] rounded-xl px-4 py-3 text-white outline-none transition-colors" />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 w-full py-4 bg-gradient-to-r from-[#d4af35] to-[#f7d66a] text-black font-black uppercase tracking-[0.2em] rounded-xl hover:shadow-[0_0_30px_rgba(212,175,53,0.3)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:scale-100"
                        >
                            {loading ? 'Submitting...' : 'Submit Enquiry'}
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}

// ── Suspense boundary required by Next.js for useSearchParams at page level ────
export default function BusinessEnquiryPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-[#020202] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#d4af35]/30 border-t-[#d4af35] rounded-full animate-spin" />
            </main>
        }>
            <EnquiryForm />
        </Suspense>
    );
}
