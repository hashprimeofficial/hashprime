'use client';

import React, { useState } from 'react';
import {
    Plane, FileText, Globe, Users, BookOpen,
    Shield, ArrowRight, CheckCircle, Star, Clock
} from 'lucide-react';

export default function AbroadJobConsultancyPage() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        serviceType: '',
        targetCountry: '',
        currentOccupation: '',
        details: '',
    });
    const [status, setStatus] = useState({ loading: false, success: false, error: null });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: null });
        try {
            const res = await fetch('/api/business-enquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    fieldOfInquiry: `Abroad Job Consultancy — ${formData.serviceType}`,
                    source: 'abroad-job-consultancy',
                    details: `Target Country: ${formData.targetCountry}\nCurrent Occupation: ${formData.currentOccupation}\n\nDetails: ${formData.details}`,
                    contactDateTime: new Date().toISOString(),
                }),
            });
            if (!res.ok) throw new Error('Failed to submit');
            setStatus({ loading: false, success: true, error: null });
            setFormData({ name: '', phone: '', email: '', serviceType: '', targetCountry: '', currentOccupation: '', details: '' });
        } catch {
            setStatus({ loading: false, success: false, error: 'Failed to submit request. Please try again.' });
        }
    };

    const services = [
        {
            icon: <FileText className="w-8 h-8 text-[#d4af35]" />,
            title: 'Document Preparation',
            description: 'End-to-end support with passport applications, attestation, experience certificates, police clearance, and all required documentation for overseas employment.',
        },
        {
            icon: <Globe className="w-8 h-8 text-[#d4af35]" />,
            title: 'Visa Assistance',
            description: 'Expert guidance through work visa categories, embassy submission, interview preparation, and tracking your application status from start to approval.',
        },
        {
            icon: <Users className="w-8 h-8 text-[#d4af35]" />,
            title: 'Overseas Job Placement',
            description: 'Direct connections with verified international employers across Gulf countries, Southeast Asia, and Europe. We match your skills to the right opportunities.',
        },
        {
            icon: <BookOpen className="w-8 h-8 text-[#d4af35]" />,
            title: 'Pre-Departure Orientation',
            description: 'Comprehensive briefing on destination country culture, labor laws, workplace rights, accommodation, banking, and emergency contacts before you fly.',
        },
        {
            icon: <Plane className="w-8 h-8 text-[#d4af35]" />,
            title: 'Travel & Logistics Support',
            description: 'Assistance with flight bookings, airport transfers, and initial accommodation arrangements at your destination country.',
        },
        {
            icon: <Shield className="w-8 h-8 text-[#d4af35]" />,
            title: 'Post-Arrival Support',
            description: 'Continued guidance after you land — resolving employer disputes, worker rights advice, and repatriation assistance if needed.',
        },
    ];

    const destinations = [
        'Saudi Arabia', 'UAE / Dubai', 'Qatar', 'Kuwait',
        'Bahrain', 'Oman', 'Malaysia', 'Singapore', 'Germany', 'Canada',
    ];

    const whyUs = [
        { title: '3+ Years of Experience', desc: 'Focused overseas consultancy with proven placement success across multiple countries.' },
        { title: 'Verified Employer Network', desc: 'Only partnered with licensed, reputable international employers — zero fraudulent offers.' },
        { title: 'End-to-End Handling', desc: 'From your first inquiry to landing at your destination, we manage every single step.' },
        { title: 'Transparent Process', desc: 'No hidden fees. Clear timelines, honest communication, and regular status updates.' },
    ];

    return (
        <main className="bg-[#0A0A0A] min-h-screen text-slate-300 font-sans selection:bg-[#d4af35]/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'LocalBusiness',
                        name: 'Hashprime Abroad Job Consultancy',
                        description: 'Trusted overseas employment consultancy by Hashprime — document preparation, visa assistance, international job placement, and pre-departure support.',
                        url: 'https://hashprime.in/abroad-job-consultancy',
                        address: { '@type': 'PostalAddress', addressCountry: 'IN' },
                        category: 'Employment Agency',
                    }),
                }}
            />

            {/* ── HERO ─────────────────────────────────────────────────── */}
            <section className="relative pt-32 pb-24 px-6 lg:px-8 overflow-hidden border-b border-white/[0.06] bg-[#0A0A0A]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4af35]/10 via-[#0A0A0A] to-[#0A0A0A] opacity-40" />
                <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Left — text */}
                    <div className="lg:col-span-7 text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6">
                            <span className="w-2 h-2 rounded-full bg-[#d4af35] animate-pulse" />
                            <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">Hashprime Enterprise Solutions</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
                            <span className="bg-gradient-to-r from-[#d4af35] to-[#E5C158] bg-clip-text text-transparent">
                                Abroad Job Consultancy
                            </span>
                            <br />& Overseas Placement
                        </h1>
                        <p className="text-lg text-slate-400 mb-8 max-w-xl">
                            Your trusted partner for securing verified international employment — from document handling and visa processing to seamless job placement and post-arrival support.
                        </p>

                        {/* Destination tags */}
                        <div className="flex flex-wrap gap-2">
                            {destinations.map((d, i) => (
                                <span key={i}
                                    className="text-[11px] font-semibold px-3 py-1.5 rounded-full
                                        bg-white/[0.04] border border-white/[0.07] text-slate-400">
                                    {d}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right — image */}
                    <div className="lg:col-span-5 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af35] to-[#E5C158] rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000" />
                        <div className="relative bg-[#0E0E0E] border border-white/[0.06] rounded-3xl overflow-hidden aspect-[16/10] shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200"
                                alt="Abroad Job Consultancy — International Placement"
                                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 brightness-75"
                            />
                            {/* Stat overlay */}
                            <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                                {[
                                    { label: 'Countries', value: '10+' },
                                    { label: 'Placements', value: '50+' },
                                    { label: 'Experience', value: '3+ Yrs' },
                                ].map((s, i) => (
                                    <div key={i} className="flex-1 bg-black/70 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
                                        <p className="text-[#d4af35] font-black text-lg leading-none">{s.value}</p>
                                        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SERVICES GRID ─────────────────────────────────────────── */}
            <section className="py-24 px-6 lg:px-8 bg-[#0E0E0E]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Consultancy Services</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            We handle every stage of your overseas employment journey so you can focus on your new career.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service, idx) => (
                            <div key={idx}
                                className="bg-[#0A0A0A] border border-white/[0.06] rounded-2xl p-8
                                    hover:border-[#d4af35]/40 transition-all group">
                                <div className="mb-6 p-4 rounded-xl bg-[#0E0E0E] border border-white/[0.06] inline-block
                                    group-hover:scale-110 transition-transform">
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── WHY CHOOSE US + ENQUIRY FORM ─────────────────────────── */}
            <section className="py-24 px-6 lg:px-8 border-y border-white/[0.06]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                        {/* Why Choose Us */}
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Why Choose Hashprime Abroad Consultancy?
                            </h2>
                            <p className="text-slate-400 mb-8 text-lg">
                                We are committed to ethical, transparent placement with zero room for fraud or hidden fees.
                            </p>
                            <div className="space-y-6 mb-10">
                                {whyUs.map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="mt-1">
                                            <Shield className="w-6 h-6 text-[#d4af35] shrink-0" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold text-lg">{item.title}</h4>
                                            <p className="text-slate-400">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Process steps */}
                            <div className="bg-[#0E0E0E] rounded-2xl border border-white/[0.06] p-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af35]/60 mb-5">Process Overview</p>
                                <div className="space-y-4">
                                    {[
                                        'Submit your enquiry & initial consultation',
                                        'Profile assessment & job matching',
                                        'Document preparation & verification',
                                        'Visa processing & employer coordination',
                                        'Pre-departure orientation briefing',
                                        'Arrival support & ongoing assistance',
                                    ].map((step, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <span className="w-6 h-6 rounded-full bg-[#d4af35]/10 border border-[#d4af35]/30
                                                flex items-center justify-center text-[10px] font-black text-[#d4af35] shrink-0">
                                                {i + 1}
                                            </span>
                                            <p className="text-sm text-slate-400">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Enquiry Form */}
                        <div className="bg-[#0E0E0E] p-8 md:p-10 rounded-2xl border border-white/[0.06]">
                            <h3 className="text-2xl font-bold text-white mb-2">Start Your Journey Abroad</h3>
                            <p className="text-slate-500 text-sm mb-6">Fill out the form and our team will contact you within 24 hours.</p>

                            {status.success ? (
                                <div className="bg-[#111811] border border-green-900/50 rounded-xl p-8 text-center">
                                    <div className="inline-flex justify-center items-center w-14 h-14 rounded-full bg-green-900/30 text-green-500 mb-4">
                                        <CheckCircle className="w-7 h-7" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-white mb-2">Request Submitted!</h4>
                                    <p className="text-slate-400">Our consultancy team will reach out to you shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <input
                                            type="text" name="name" required
                                            placeholder="Full Name"
                                            value={formData.name} onChange={handleChange}
                                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500
                                                focus:outline-none focus:border-[#d4af35]/50 transition-colors"
                                        />
                                        <input
                                            type="tel" name="phone" required
                                            placeholder="Phone Number"
                                            value={formData.phone} onChange={handleChange}
                                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500
                                                focus:outline-none focus:border-[#d4af35]/50 transition-colors"
                                        />
                                    </div>

                                    <input
                                        type="email" name="email" required
                                        placeholder="Email Address"
                                        value={formData.email} onChange={handleChange}
                                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500
                                            focus:outline-none focus:border-[#d4af35]/50 transition-colors"
                                    />

                                    <select
                                        name="serviceType" required
                                        value={formData.serviceType} onChange={handleChange}
                                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white
                                            focus:outline-none focus:border-[#d4af35]/50 transition-colors appearance-none"
                                    >
                                        <option value="" disabled>Select Service Required</option>
                                        <option value="Document Preparation">Document Preparation</option>
                                        <option value="Visa Assistance">Visa Assistance</option>
                                        <option value="Job Placement">Overseas Job Placement</option>
                                        <option value="Pre-Departure Orientation">Pre-Departure Orientation</option>
                                        <option value="Full Package">Full End-to-End Package</option>
                                    </select>

                                    <select
                                        name="targetCountry" required
                                        value={formData.targetCountry} onChange={handleChange}
                                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white
                                            focus:outline-none focus:border-[#d4af35]/50 transition-colors appearance-none"
                                    >
                                        <option value="" disabled>Target Country / Region</option>
                                        {destinations.map((d, i) => (
                                            <option key={i} value={d}>{d}</option>
                                        ))}
                                        <option value="Other">Other</option>
                                    </select>

                                    <input
                                        type="text" name="currentOccupation"
                                        placeholder="Current Occupation / Field"
                                        value={formData.currentOccupation} onChange={handleChange}
                                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500
                                            focus:outline-none focus:border-[#d4af35]/50 transition-colors"
                                    />

                                    <textarea
                                        name="details"
                                        placeholder="Additional Details — skills, experience, preferred job role..."
                                        rows="4"
                                        value={formData.details} onChange={handleChange}
                                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500
                                            focus:outline-none focus:border-[#d4af35]/50 transition-colors resize-none"
                                    />

                                    {status.error && (
                                        <div className="p-3 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 text-sm">
                                            {status.error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status.loading}
                                        className="w-full bg-gradient-to-r from-[#d4af35] to-[#b8941f] text-black font-bold
                                            py-4 px-8 rounded-xl hover:from-[#E5C158] hover:to-[#d4af35]
                                            transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                                    >
                                        {status.loading ? 'Submitting...' : 'Submit Enquiry'}
                                        {!status.loading && <ArrowRight className="w-5 h-5" />}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
