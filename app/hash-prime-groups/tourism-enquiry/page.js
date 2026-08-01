"use client";

import React, { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Phone, Mail, Calendar, User, Globe, Users, Plane } from 'lucide-react';

const TOUR_TYPES = [
    "Domestic Tour Package",
    "International Tour Package",
    "Honeymoon Package",
    "Family Tour Package",
    "Corporate Tour / Team Outing",
    "Pilgrimage Tour",
    "Adventure / Trekking Tour",
    "Hill Station Package",
    "Beach & Coastal Tour",
    "Custom / Tailor-made Tour",
];

function TourismEnquiryForm() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        tourType: '',
        destination: '',
        travelDate: '',
        numberOfTravellers: '',
        message: '',
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/business-enquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    fieldOfInquiry: `Tourism — ${formData.tourType || 'General'} | Destination: ${formData.destination || 'TBD'} | Travellers: ${formData.numberOfTravellers || 'TBD'} | Travel Date: ${formData.travelDate || 'TBD'}`,
                    contactDateTime: formData.travelDate ? `${formData.travelDate}T09:00` : new Date().toISOString(),
                    message: formData.message,
                }),
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

    const inputCls = "w-full bg-[#0d0d0d] border border-[#2a2a2a] focus:border-[#d4af35] rounded-xl px-4 py-3.5 text-white outline-none transition-all duration-300 placeholder:text-white/20 text-sm";
    const labelCls = "block text-[11px] font-black uppercase tracking-[0.2em] text-[#d4af35]/70 mb-2";

    return (
        <main className="min-h-screen bg-[#020202] text-white font-sans selection:bg-[#d4af35]/30 relative overflow-hidden">

            {/* Background ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(212,175,53,0.08),transparent_60%)] pointer-events-none z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(212,175,53,0.04),transparent_60%)] pointer-events-none z-0" />
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]"
                style={{ backgroundImage: 'radial-gradient(#d4af35 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#121212] border border-[#d4af35]/20 mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af35] opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4af35]" />
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af35]">HashPrime Tourism</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-[0.9] mb-6">
                        <span className="text-white">Plan Your</span><br />
                        <span className="bg-gradient-to-r from-[#d4af35] via-[#f7d66a] to-[#d4af35] bg-clip-text text-transparent">
                            Dream Journey
                        </span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
                        Luxury travel experiences curated by HashPrime Tourism. Tell us where you want to go — we handle everything.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-8 items-start">

                    {/* Left: Info Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Tourism Head Card */}
                        <div className="bg-[#0a0a0a] border border-[#d4af35]/20 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(212,175,53,0.05)]">
                            <div className="aspect-[4/3] relative overflow-hidden">
                                <img
                                    src="/MANIKANDAPRABU R.jpeg"
                                    alt="Manikandaprabu R — Tourism Operations Head"
                                    className="w-full h-full object-cover object-top"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                <div className="absolute bottom-0 inset-x-0 p-5">
                                    <div className="h-px bg-gradient-to-r from-[#d4af35]/60 to-transparent mb-3" />
                                    <p className="font-black text-white text-base">Manikandaprabu R</p>
                                    <p className="text-[10px] font-bold text-[#d4af35] uppercase tracking-widest mt-1">Tourism Operations Head</p>
                                </div>
                            </div>
                        </div>

                        {/* Tour highlights */}
                        {[
                            { icon: Globe, label: "Pan-India & International Tours" },
                            { icon: Users, label: "Group, Family & Corporate Packages" },
                            { icon: Plane, label: "End-to-End Travel Management" },
                            { icon: MapPin, label: "100+ Destinations Covered" },
                        ].map(({ icon: Icon, label }) => (
                            <div key={label} className="flex items-center gap-4 px-5 py-4 bg-[#0a0a0a] border border-white/[0.06] rounded-2xl">
                                <div className="w-9 h-9 rounded-xl bg-[#d4af35]/10 border border-[#d4af35]/20 flex items-center justify-center shrink-0">
                                    <Icon className="w-4 h-4 text-[#d4af35]" />
                                </div>
                                <span className="text-sm font-semibold text-white/70">{label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Right: Form */}
                    <div className="lg:col-span-3">
                        {success ? (
                            <div className="bg-[#0a0a0a] border border-[#d4af35]/30 rounded-3xl p-12 text-center shadow-[0_0_50px_rgba(212,175,53,0.1)]">
                                <div className="w-20 h-20 bg-[#d4af35]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#d4af35]/20">
                                    <svg className="w-10 h-10 text-[#d4af35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-black text-white mb-3">Enquiry Submitted!</h2>
                                <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                                    Our tourism team will reach out to you within 24 hours with a customised travel plan.
                                </p>
                                <button
                                    onClick={() => router.push('/hash-prime-groups')}
                                    className="px-8 py-3 bg-[#d4af35] hover:bg-[#f7d66a] text-black font-black uppercase rounded-full transition-all duration-300"
                                >
                                    Back to HashPrime
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-[#d4af35]/20 rounded-3xl p-8 shadow-[0_0_50px_rgba(212,175,53,0.05)] space-y-6">
                                <h2 className="text-2xl font-black text-white mb-2">Tourism Enquiry Form</h2>
                                <div className="h-px bg-gradient-to-r from-[#d4af35]/40 to-transparent" />

                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">{error}</div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className={labelCls}>Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                            <input required type="text" name="name" value={formData.name} onChange={handleChange}
                                                className={`${inputCls} pl-10`} placeholder="Your name" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                                className={`${inputCls} pl-10`} placeholder="+91 98765 43210" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelCls}>Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <input required type="email" name="email" value={formData.email} onChange={handleChange}
                                            className={`${inputCls} pl-10`} placeholder="you@example.com" />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelCls}>Tour Type</label>
                                    <select required name="tourType" value={formData.tourType} onChange={handleChange} className={inputCls}>
                                        <option value="" disabled className="bg-[#0d0d0d]">Select a tour type…</option>
                                        {TOUR_TYPES.map(t => (
                                            <option key={t} value={t} className="bg-[#0d0d0d]">{t}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className={labelCls}>Destination</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                            <input type="text" name="destination" value={formData.destination} onChange={handleChange}
                                                className={`${inputCls} pl-10`} placeholder="e.g. Ooty, Goa, Dubai" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelCls}>No. of Travellers</label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                            <input type="number" min="1" name="numberOfTravellers" value={formData.numberOfTravellers} onChange={handleChange}
                                                className={`${inputCls} pl-10`} placeholder="e.g. 4" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelCls}>Preferred Travel Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <input type="date" name="travelDate" value={formData.travelDate} onChange={handleChange}
                                            min={new Date().toISOString().split('T')[0]}
                                            className={`${inputCls} pl-10`} />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelCls}>Special Requirements (Optional)</label>
                                    <textarea name="message" value={formData.message} onChange={handleChange} rows={3}
                                        className={`${inputCls} resize-none`}
                                        placeholder="Any special requests, dietary needs, accessibility requirements…" />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-[#d4af35] to-[#f7d66a] text-black font-black uppercase tracking-[0.2em] rounded-xl
                                        hover:shadow-[0_0_30px_rgba(212,175,53,0.4)] hover:scale-[1.02] transition-all duration-300
                                        disabled:opacity-50 disabled:scale-100 text-sm"
                                >
                                    {loading ? 'Submitting…' : '✈ Submit Tourism Enquiry'}
                                </button>

                                <p className="text-center text-[11px] text-slate-600 font-medium">
                                    We respond within 24 hours · Mon – Sat, 9 AM – 6 PM
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function TourismEnquiryPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-[#020202] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#d4af35]/30 border-t-[#d4af35] rounded-full animate-spin" />
            </main>
        }>
            <TourismEnquiryForm />
        </Suspense>
    );
}
