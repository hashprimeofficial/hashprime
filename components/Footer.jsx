"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUp, CheckCircle2, ChevronRight, Mail, Phone, MapPin, Instagram } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

function BackToTop() {
    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 rounded-full bg-[#121212] border border-white/10 flex items-center justify-center text-slate-400 hover:bg-[#d4af35] hover:text-[#0A0A0A] hover:border-[#d4af35] transition-all duration-500 shadow-lg hover:shadow-[0_0_20px_rgba(212,175,53,0.3)] hover:-translate-y-2 group"
            aria-label="Back to top"
        >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
    );
}

export default function Footer() {
    const footerRef = useRef(null);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 4000);
        }
    };

    useGSAP(() => {
        gsap.fromTo(".foo-anim",
            { y: 30, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out",
                scrollTrigger: { trigger: footerRef.current, start: "top 90%" }
            }
        );
    }, { scope: footerRef });

    return (
        <footer ref={footerRef} className="relative bg-[#050505] w-full mt-auto border-t border-white/[0.03] overflow-hidden">

            {/* Immersive Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#d4af35] opacity-[0.03] rounded-full blur-[150px]" />
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#d4af35] opacity-[0.02] rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay"></div>
            </div>

            {/* Top Newsletter CTA */}
            <div className="relative z-10 border-b border-white/[0.05] bg-[#121212]/30 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                        <div className="foo-anim max-w-xl text-center lg:text-left">
                            <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">Stay Ahead of the Markets</h3>
                            <p className="text-slate-400 text-lg">Join 10,000+ investors receiving our premium weekly market analysis and exclusive scheme updates.</p>
                        </div>

                        <div className="foo-anim w-full lg:w-auto relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af35]/20 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                            <form onSubmit={handleSubscribe} className="relative flex items-center bg-[#0A0A0A] border border-white/10 rounded-2xl p-2 w-full lg:w-[450px] shadow-2xl focus-within:border-[#d4af35]/50 focus-within:ring-1 focus-within:ring-[#d4af35]/30 transition-all duration-300">
                                {subscribed ? (
                                    <div className="flex items-center gap-3 text-[#d4af35] font-bold text-sm py-4 px-6 w-full">
                                        <CheckCircle2 className="w-5 h-5" />
                                        You're on the premium list!
                                    </div>
                                ) : (
                                    <>
                                        <div className="pl-4 text-slate-500"><Mail className="w-5 h-5" /></div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full px-4 py-4 bg-transparent border-none focus:outline-none focus:ring-0 text-white font-medium placeholder-slate-600"
                                            placeholder="Enter your email address..."
                                            required
                                        />
                                        <button type="submit" className="bg-[#d4af35] text-[#0A0A0A] font-black py-4 px-8 rounded-xl hover:bg-[#f5e0a3]/90 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,53,0.2)] whitespace-nowrap">
                                            Subscribe
                                        </button>
                                    </>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">

                    {/* Brand Column */}
                    <div className="foo-anim lg:col-span-4 flex flex-col">
                        <Link href="/" className="flex items-center group relative overflow-hidden mb-8 inline-block w-max">
                            <Image
                                src="/textonly.png"
                                alt="Hashprime Logo"
                                width={160}
                                height={45}
                                className="object-contain relative z-10 brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
                            />
                        </Link>
                        <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-sm">
                            Intelligent asset management for the modern investor. Built for speed, uncompromised security, and the ultimate user experience. Join the next generation of finance.
                        </p>

                        <div className="space-y-4 text-slate-400 text-sm">
                            <div className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer group">
                                <MapPin className="w-4 h-4 text-[#d4af35]" />
                                <span className="group-hover:translate-x-1 transition-transform">www.hashprime.in</span>
                            </div>
                            <div className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer group">
                                <Phone className="w-4 h-4 text-[#d4af35]" />
                                <span className="group-hover:translate-x-1 transition-transform">+91 86102 90782, +91 90039 99202</span>
                            </div>
                            <div className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer group">
                                <Mail className="w-4 h-4 text-[#d4af35]" />
                                <span className="group-hover:translate-x-1 transition-transform">support@hashprime.in</span>
                            </div>
                            <a href="https://www.instagram.com/hashprimegroups" target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-3 hover:text-white transition-colors group">
                                <Instagram className="w-4 h-4 text-[#d4af35] shrink-0" />
                                <span className="group-hover:translate-x-1 transition-transform">hashprimeindia</span>
                            </a>
                            {/* Highlighted @hashprimegroups pill */}
                            <a href="https://www.instagram.com/hashprimegroups" target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#d4af35]/15 to-[#d4af35]/5 border border-[#d4af35]/30 text-[#d4af35] text-[11px] font-black uppercase tracking-[0.2em] hover:border-[#d4af35]/60 hover:bg-[#d4af35]/20 transition-all duration-300 group w-max">
                                <Instagram className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-300" />
                                @hashprimegroups
                            </a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="foo-anim lg:col-span-2 lg:col-start-6">
                        <h3 className="text-white font-black mb-8 text-sm uppercase tracking-[0.2em]">Platform</h3>
                        <ul className="space-y-4">
                            {['Live Markets', 'Investment Plans', 'Referral Program', 'Security Engine'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="group flex items-center text-slate-400 hover:text-white text-sm font-medium transition-colors">
                                        <ChevronRight className="w-3 h-3 text-[#d4af35] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all mr-2" />
                                        <span className="group-hover:translate-x-1 transition-transform">{item}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="foo-anim lg:col-span-2">
                        <h3 className="text-white font-black mb-8 text-sm uppercase tracking-[0.2em]">Account</h3>
                        <ul className="space-y-4">
                            {['Client Login', 'Get Started', 'My Portfolio', 'Settings & Privacy'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="group flex items-center text-slate-400 hover:text-white text-sm font-medium transition-colors">
                                        <ChevronRight className="w-3 h-3 text-[#d4af35] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all mr-2" />
                                        <span className="group-hover:translate-x-1 transition-transform">{item}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="foo-anim lg:col-span-2 lg:col-start-10">
                        <h3 className="text-white font-black mb-8 text-sm uppercase tracking-[0.2em]">Company</h3>
                        <ul className="space-y-4">
                            {/* Highlighted Hash Prime Groups entry */}
                            <li>
                                <Link href="/hash-prime-groups" className="group inline-flex items-center gap-2 px-3 py-1.5 -ml-3 rounded-full bg-[#d4af35]/10 border border-[#d4af35]/25 text-[#d4af35] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#d4af35]/20 hover:border-[#d4af35]/50 transition-all duration-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af35] animate-pulse shrink-0" />
                                    Hash Prime Groups
                                </Link>
                            </li>
                            {[['About Us', '/company'], ['Leadership', '/company'], ['Careers', '/careers'], ['Contact Details', '#']].map(([item, href]) => (
                                <li key={item}>
                                    <Link href={href} className="group flex items-center text-slate-400 hover:text-white text-sm font-medium transition-colors">
                                        <ChevronRight className="w-3 h-3 text-[#d4af35] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all mr-2" />
                                        <span className="group-hover:translate-x-1 transition-transform">{item}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="foo-anim pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 text-sm font-medium">
                        &copy; {new Date().getFullYear()} HashPrime Asset Management. All rights reserved.
                    </p>

                    <div className="flex items-center space-x-8">
                        <Link href="#" className="text-slate-500 hover:text-white text-sm font-medium transition-colors">Privacy Policy</Link>
                        <Link href="#" className="text-slate-500 hover:text-white text-sm font-medium transition-colors">Terms of Service</Link>
                        <div className="hidden md:block w-[1px] h-4 bg-white/10"></div>
                        <BackToTop />
                    </div>
                </div>
            </div>
        </footer>
    );
}
