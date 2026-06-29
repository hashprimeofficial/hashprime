"use client";

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
    TrendingUp, PieChart, DollarSign, Briefcase, Globe2, ArrowRight
} from 'lucide-react';

function SleekCryptoPrism() {
    return (
        <div className="w-full h-full relative flex items-center justify-center p-4">
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_60px_rgba(212,175,53,0.35)]">
                <defs>
                    {/* Deep Ambient Gold Glow */}
                    <radialGradient id="prismGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#d4af35" stopOpacity="0.4" />
                        <stop offset="50%" stopColor="#d4af35" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#050505" stopOpacity="0" />
                    </radialGradient>

                    {/* Multi-tone Premium Gold-Cyan Linear Gradient */}
                    <linearGradient id="prismGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f7e8b5" />
                        <stop offset="40%" stopColor="#d4af35" />
                        <stop offset="80%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>

                    <linearGradient id="goldPure" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fff" />
                        <stop offset="50%" stopColor="#d4af35" />
                        <stop offset="100%" stopColor="#967518" />
                    </linearGradient>
                </defs>

                {/* Ambient Soft Glow Background */}
                <circle cx="100" cy="100" r="88" fill="url(#prismGlow)" />

                {/* 1. Outer Smooth Orbiting Ring */}
                <g className="animate-spin" style={{ transformOrigin: '100px 100px', animationDuration: '35s', animationTimingFunction: 'linear' }}>
                    <circle cx="100" cy="100" r="84" fill="none" stroke="url(#prismGradient)" strokeWidth="0.75" strokeDasharray="6 12" opacity="0.35" />
                    <circle cx="100" cy="16" r="3.5" fill="#d4af35" className="animate-pulse" />
                    <circle cx="184" cy="100" r="3.5" fill="#38bdf8" className="animate-pulse" />
                    <circle cx="100" cy="184" r="3.5" fill="#10b981" className="animate-pulse" />
                    <circle cx="16" cy="100" r="3.5" fill="#ffffff" className="animate-pulse" />
                </g>

                {/* 2. Counter-Rotating Interlocking Wave Ring */}
                <g className="animate-spin" style={{ transformOrigin: '100px 100px', animationDuration: '25s', animationDirection: 'reverse', animationTimingFunction: 'linear' }}>
                    <circle cx="100" cy="100" r="72" fill="none" stroke="url(#goldPure)" strokeWidth="1" strokeDasharray="40 15 20 15" opacity="0.5" />
                    <circle cx="100" cy="28" r="4" fill="#ffffff" className="drop-shadow-[0_0_8px_#ffffff]" />
                    <circle cx="172" cy="100" r="4" fill="#d4af35" className="drop-shadow-[0_0_8px_#d4af35]" />
                </g>

                {/* 3. Smooth Dynamic Concentric Polygon Grid */}
                <g className="animate-spin" style={{ transformOrigin: '100px 100px', animationDuration: '20s', animationTimingFunction: 'linear' }}>
                    <polygon points="100,42 142,66 142,114 100,138 58,114 58,66" fill="none" stroke="#d4af35" strokeWidth="0.5" opacity="0.25" />
                </g>
                <g className="animate-spin" style={{ transformOrigin: '100px 100px', animationDuration: '15s', animationDirection: 'reverse', animationTimingFunction: 'linear' }}>
                    <polygon points="100,48 136,100 100,152 64,100" fill="none" stroke="url(#prismGradient)" strokeWidth="0.75" strokeDasharray="8 4" opacity="0.4" />
                </g>

                {/* 4. Central High-End Polished Glass Vault Core */}
                <circle cx="100" cy="100" r="34" fill="#0A0A0C" stroke="url(#goldPure)" strokeWidth="1.75" className="drop-shadow-[0_0_25px_rgba(212,175,53,0.4)]" />
                <circle cx="100" cy="100" r="28" fill="url(#prismGlow)" opacity="0.9" />
                
                {/* Sleek Minimalist Crypto Shield Symbol */}
                <path d="M 100 82 L 115 91 L 115 109 L 100 118 L 85 109 L 85 91 Z" fill="none" stroke="#d4af35" strokeWidth="1.25" opacity="0.85" />
                <path d="M 100 87 L 111 94 L 111 106 L 100 113 L 89 106 L 89 94 Z" fill="url(#prismGradient)" opacity="0.2" />
                
                {/* Central Breathing Aura */}
                <circle cx="100" cy="100" r="6" fill="#ffffff" className="animate-ping" style={{ animationDuration: '2.5s' }} />
                <circle cx="100" cy="100" r="4" fill="#d4af35" />
                <circle cx="100" cy="100" r="1.5" fill="#ffffff" />
            </svg>
        </div>
    );
}

gsap.registerPlugin(ScrollTrigger, useGSAP);

const projects = [
    { num: '01', Icon: TrendingUp, title: 'Stocks & IPO', tag: 'Equity', desc: 'Equities and IPO access — capture growth before the crowd. High-yield potential in emerging markets.' },
    { num: '02', Icon: PieChart, title: 'Mutual Fund & ETF', tag: 'Diversified', desc: 'SIPs, index ETFs, and hybrid funds — managed, lower-risk growth for long-term stability.' },
    { num: '03', Icon: DollarSign, title: 'Currency & Commodity', tag: 'Forex', desc: 'Gold, silver, crude oil and forex pairs — hedge against inflation with global assets.' },
    { num: '04', Icon: Briefcase, title: 'Stock Case', tag: 'Thematic', desc: 'Analyst-curated baskets across tech, healthcare, and green energy. Smart thematic investing.' },
    { num: '05', Icon: Globe2, title: 'Global Investing', tag: 'International', desc: 'US, European and Asian exchanges — earn in global currencies and diversify geographically.' },
];

export default function OurProjects() {
    const sectionRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo('.op-header-content',
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: '.op-header-content', start: 'top 85%' }
            }
        );

        gsap.fromTo('.op-row',
            { y: 30, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', stagger: 0.1,
                scrollTrigger: { trigger: '.op-rows', start: 'top 80%' }
            }
        );
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative bg-transparent py-8 md:py-12 overflow-hidden border-t border-white/[0.02]">

            {/* Soft Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-[#d4af35] opacity-[0.02] rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-[#d4af35] opacity-[0.02] rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Header ───────────────────────── */}
                <div className="op-header-content flex flex-col lg:flex-row items-center justify-between gap-16 mb-24">
                    <div className="flex flex-col items-start text-left lg:max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d4af35]/20 bg-[#d4af35]/5 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af35] animate-pulse"></span>
                            <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#d4af35]">Strategic Verticals</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight mb-6 mt-4">
                            WHERE YOUR<br />
                            <span className="text-[#d4af35]">MONEY WORKS</span>
                        </h2>
                        <p className="text-slate-500 text-lg font-medium max-w-xl leading-relaxed">
                            Five specialized investment verticals engineered to capture alpha across global markets.
                        </p>
                    </div>

                    <div className="flex-shrink-0 w-full max-w-[320px] lg:max-w-none lg:w-[450px] aspect-square relative mx-auto lg:mx-0">
                        <div className="absolute inset-0 bg-[#d4af35]/5 rounded-full blur-[80px] animate-pulse" />
                        <SleekCryptoPrism />
                    </div>
                </div>

                {/* ── Showcase Rows ─────── */}
                <div className="op-rows grid grid-cols-1 md:grid-cols-1 gap-4">
                    {projects.map(({ num, Icon, title, tag, desc }) => (
                        <div
                            key={num}
                            className="op-row group relative flex flex-col md:flex-row md:items-center gap-6 p-6 md:p-8 
                                       bg-[#0A0A0A]/50 backdrop-blur-sm border border-white/5 rounded-[2rem]
                                       hover:bg-[#121212]/80 hover:border-[#d4af35]/20 hover:shadow-[0_10px_40px_rgba(212,175,53,0.05)]
                                       transition-all duration-700 cursor-default overflow-hidden"
                        >
                            {/* Subtle Radial Gradient Hover Map */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#d4af35]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0 pointer-events-none" />

                            {/* Left Line Accent (Clean & Minimal) */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 bg-[#d4af35] opacity-0 group-hover:h-3/4 group-hover:opacity-100 transition-all duration-500 rounded-r-full" />

                            {/* Minimal Icon Bubble */}
                            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-[#0A0A0A] border border-white/5 flex items-center justify-center relative z-10
                                            group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(212,175,53,0.1)] group-hover:border-[#d4af35]/30 transition-all duration-500 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-[#d4af35]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]"></div>
                                <Icon size={24} strokeWidth={1.5} className="text-[#d4af35]" />
                            </div>

                            {/* Center Content */}
                            <div className="flex-1 min-w-0 relative z-10">
                                <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-3">
                                    <span className="text-[11px] font-black text-slate-500 tracking-widest font-display">{num}</span>
                                    <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-[#d4af35] transition-colors duration-500 font-display">
                                        {title}
                                    </h3>
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#d4af35]/80 bg-[#d4af35]/5 border border-[#d4af35]/20 px-3 py-1 rounded-full whitespace-nowrap">
                                        {tag}
                                    </span>
                                </div>
                                <p className="text-slate-400 font-normal text-[15px] leading-relaxed max-w-2xl group-hover:text-slate-300 transition-colors duration-500">{desc}</p>
                            </div>

                            {/* Right Arrow (Minimal Reveal) */}
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-slate-500 bg-[#0A0A0A]
                                                group-hover:border-[#d4af35]/40 group-hover:text-[#d4af35] group-hover:bg-[#d4af35]/5
                                                transition-all duration-500 group-hover:translate-x-1">
                                    <ArrowRight size={18} strokeWidth={2} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Bottom CTA ────────────────────── */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-20 pt-12 border-t border-white/5">
                    <p className="text-slate-300 text-sm font-medium">Global exposure. Local expertise. Start today.</p>
                    <a href="/register"
                        className="group inline-flex items-center gap-3 bg-[#d4af35] text-[#0A0A0A] px-10 py-4 rounded-full font-black text-sm hover:bg-[#f5e0a3]/90 hover:-translate-y-1 hover:shadow-2xl transition-all duration-500">
                        Launch Your Portfolio
                        <span className="text-[#0A0A0A] group-hover:translate-x-1 transition-transform duration-500 inline-block">→</span>
                    </a>
                </div>

            </div>
        </section>
    );
}
