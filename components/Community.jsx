"use client";

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Linkedin, Instagram, Send, Loader2, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CONTACT_INFO = [
    {
        icon: Phone,
        label: 'Call Us',
        lines: ['+91 86102 90782', '+91 90039 99202'],
        href: 'tel:+918610290782',
    },
    {
        icon: Mail,
        label: 'Email Us',
        lines: ['support@hashprime.in'],
        href: 'mailto:support@hashprime.in',
    },
    {
        icon: MapPin,
        label: 'Visit Us',
        lines: ['Prestige Towers, 5th Floor,', 'MG Road, Bengaluru, India'],
        href: 'https://maps.google.com',
    },
];

const SOCIALS = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/hashprimeindia', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://instagram.com/hashprimeindia', label: 'Instagram' },
];

export default function ContactSection() {
    const containerRef = useRef(null);
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    useGSAP(() => {
        gsap.fromTo('.contact-reveal',
            { y: 35, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
                scrollTrigger: { trigger: containerRef.current, start: 'top 80%' }
            }
        );
    }, { scope: containerRef });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        await new Promise(r => setTimeout(r, 1400));
        setSending(false);
        setSent(true);
        setForm({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setSent(false), 5000);
    };

    return (
        <section
            ref={containerRef}
            id="contact"
            className="relative bg-[#050505] overflow-hidden border-t border-white/[0.03]"
        >
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#d4af35] opacity-[0.04] rounded-full blur-[180px]" />
            </div>

            {/* ── Header ── */}
            <div className="relative z-10 text-center pt-20 pb-14 px-6">
                <h2 className="contact-reveal text-5xl md:text-6xl font-black text-white tracking-tight mb-4">
                    Contact <span className="text-[#d4af35]">Us</span>
                </h2>
                <div className="contact-reveal flex items-center justify-center gap-4">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#d4af35]/50" />
                    <p className="text-white/40 font-medium">Get in touch with us today</p>
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#d4af35]/50" />
                </div>
            </div>

            {/* ── Main Grid ── */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 pb-0 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                {/* Left — Contact Info */}
                <div className="contact-reveal space-y-0 divide-y divide-white/[0.05]">
                    {CONTACT_INFO.map(({ icon: Icon, label, lines, href }) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-start gap-5 py-7 hover:bg-[#d4af35]/[0.03] px-2 rounded-xl transition-all"
                        >
                            <div className="w-12 h-12 rounded-xl bg-[#0A0A0A] border border-[#d4af35]/20 flex items-center justify-center shrink-0 group-hover:border-[#d4af35]/50 group-hover:bg-[#d4af35]/10 transition-all">
                                <Icon className="w-5 h-5 text-[#d4af35]" />
                            </div>
                            <div>
                                <p className="text-[#d4af35] font-black text-base mb-1">{label}</p>
                                {lines.map((l, i) => (
                                    <p key={i} className="text-white/70 font-medium text-sm leading-relaxed">{l}</p>
                                ))}
                            </div>
                        </a>
                    ))}
                </div>

                {/* Right — Form */}
                <div className="contact-reveal bg-[#0A0A0A] border border-[#d4af35]/15 rounded-3xl p-7 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
                    <h3 className="text-xl font-black text-[#d4af35] mb-6">Get in Touch</h3>

                    {sent ? (
                        <div className="flex flex-col items-center gap-3 py-10 text-center">
                            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                            <p className="text-white font-black text-lg">Message Sent!</p>
                            <p className="text-white/40 text-sm">We'll get back to you within 24 hours.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {[
                                { key: 'name', placeholder: 'Your Name', type: 'text' },
                                { key: 'email', placeholder: 'Your Email', type: 'email' },
                                { key: 'phone', placeholder: 'Your Phone', type: 'tel' },
                            ].map(({ key, placeholder, type }) => (
                                <input
                                    key={key}
                                    required={key !== 'phone'}
                                    type={type}
                                    placeholder={placeholder}
                                    value={form[key]}
                                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                                    className="w-full bg-[#050505] border border-[#d4af35]/15 rounded-xl px-4 py-3.5 text-white font-medium placeholder-white/20 focus:outline-none focus:border-[#d4af35]/50 transition-all text-sm"
                                />
                            ))}
                            <textarea
                                required
                                rows={4}
                                placeholder="Your Message"
                                value={form.message}
                                onChange={e => setForm({ ...form, message: e.target.value })}
                                className="w-full bg-[#050505] border border-[#d4af35]/15 rounded-xl px-4 py-3.5 text-white font-medium placeholder-white/20 focus:outline-none focus:border-[#d4af35]/50 transition-all text-sm resize-none"
                            />
                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full bg-gradient-to-r from-[#d4af35] to-[#c9a227] text-[#0A0A0A] font-black uppercase tracking-widest py-4 rounded-xl hover:brightness-110 transition-all shadow-[0_0_20px_rgba(212,175,53,0.2)] flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                            >
                                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Send Message</>}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* ── Map Strip ── */}
            <div className="relative z-10 mt-14 h-[180px] bg-[#080808] overflow-hidden border-t border-white/[0.04]">
                {/* Stylized dark map via iframe */}
                <iframe
                    title="HashPrime Office Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.985509669604!2d77.6093!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae168d7c8f2d3b%3A0x98fdf5c1d2f15c71!2sMG%20Road%2C%20Bengaluru!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%"
                    height="180"
                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) saturate(0.3) brightness(0.5)', opacity: 0.7 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
                {/* Office pin overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-20 flex flex-col items-center">
                    <div className="flex items-center gap-2 bg-[#0A0A0A]/90 border border-[#d4af35]/30 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
                        <MapPin className="w-3.5 h-3.5 text-[#d4af35]" />
                        <span className="text-[#d4af35] font-black text-xs">Our Office</span>
                    </div>
                    <div className="w-px h-4 bg-[#d4af35]/60" />
                    <div className="w-2 h-2 rounded-full bg-[#d4af35]" />
                </div>
            </div>

            {/* ── Footer Bar ── */}
            <div className="contact-reveal relative z-10 border-t border-white/[0.05] bg-[#050505]">
                <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Working Hours */}
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-[#d4af35]/20 flex items-center justify-center shrink-0">
                            <Clock className="w-4 h-4 text-[#d4af35]" />
                        </div>
                        <div>
                            <p className="text-[#d4af35] font-black text-sm">Working Hours</p>
                            <p className="text-white/50 text-xs font-medium">Mon – Fri: 9:00 AM – 6:00 PM</p>
                        </div>
                    </div>

                    {/* Social Icons */}
                    <div className="flex items-center gap-4">
                        <span className="text-white/40 text-sm font-bold">Follow Us:</span>
                        {SOCIALS.map(({ icon: Icon, href, label }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="w-9 h-9 rounded-full bg-[#0A0A0A] border border-white/10 flex items-center justify-center text-white/40 hover:text-[#d4af35] hover:border-[#d4af35]/40 hover:bg-[#d4af35]/10 transition-all"
                            >
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
