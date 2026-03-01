"use client";

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
    TrendingUp, PieChart, DollarSign, Briefcase, Globe2
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const projects = [
    { num: '01', Icon: TrendingUp, title: 'Stocks & IPL', tag: 'Equity', desc: 'Equities and IPO access — capture growth before the crowd.' },
    { num: '02', Icon: PieChart, title: 'Mutual Fund & ETF', tag: 'Diversified', desc: 'SIPs, index ETFs, and hybrid funds — managed, lower-risk growth.' },
    { num: '03', Icon: DollarSign, title: 'Currency & Commodity', tag: 'Forex', desc: 'Gold, silver, crude oil and forex pairs — hedge against inflation.' },
    { num: '04', Icon: Briefcase, title: 'Stock Case', tag: 'Thematic', desc: 'Analyst-curated baskets across tech, healthcare, and green energy.' },
    { num: '05', Icon: Globe2, title: 'Global Investing', tag: 'International', desc: 'US, European and Asian exchanges — earn in global currencies.' },
];

export default function OurProjects() {
    const sectionRef = useRef(null);

    // NOTE: useGSAP with { scope } auto-cleans its own tweens & ScrollTriggers on unmount.
    // Do NOT call ScrollTrigger.getAll().kill() here — that kills other components' triggers too.
    useGSAP(() => {
        gsap.fromTo('.op-header-content',
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: '.op-header-content', start: 'top 85%' }
            }
        );

        gsap.fromTo('.op-row',
            { x: -30, opacity: 0 },
            {
                x: 0, opacity: 1, duration: 0.55, ease: 'power2.out', stagger: 0.1,
                scrollTrigger: { trigger: '.op-rows', start: 'top 80%' }
            }
        );
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative bg-white py-24 md:py-32 overflow-hidden">

            {/* Subtle neon glow top */}
            <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-[#39FF14] opacity-[0.03] rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

                {/* ── Header ───────────────────────── */}
                <div className="op-header-content flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-20">
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="h-[2px] w-10 bg-[#39FF14]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Our Projects</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0B1120] leading-[0.92] tracking-tight">
                            Where Your<br />
                            <span style={{ color: '#39FF14' }}>Money Works</span>
                        </h2>
                    </div>
                    <p className="op-sub text-slate-400 text-sm font-medium max-w-xs leading-relaxed md:text-right">
                        Five verticals. One platform.
                    </p>
                </div>

                {/* ── Showcase Rows — NOT cards ─────── */}
                {/*
                    Design: full-width rows separated by hairline borders.
                    Each row: left icon bubble | center title+desc | right stat+arrow.
                    Hover: left neon bar appears, icon lifts, title shifts right, row bg tints.
                    Fully responsive — stacks on mobile gracefully.
                */}
                <div className="op-rows border-t border-slate-100">
                    {projects.map(({ num, Icon, title, tag, desc, stat }) => (
                        <div
                            key={num}
                            className="op-row group relative flex flex-col sm:flex-row sm:items-center gap-5 py-8 px-4 sm:px-6 border-b border-slate-100
                                       hover:bg-slate-50/70 hover:pl-8 sm:hover:pl-10 transition-all duration-300 cursor-default rounded-xl"
                        >
                            {/* Left neon accent bar */}
                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#39FF14] rounded-l-xl scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />

                            {/* Icon bubble */}
                            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-[#0B1120] flex items-center justify-center
                                            group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#0B1120]/20 transition-all duration-300">
                                <Icon size={24} strokeWidth={1.8} className="text-[#39FF14]" />
                            </div>

                            {/* Center: number + title + desc */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-3 mb-1">
                                    <span className="text-[10px] font-black text-slate-300 tracking-widest">{num}</span>
                                    <h3 className="text-xl sm:text-2xl font-black text-[#0B1120] tracking-tight group-hover:text-[#0B1120] transition-colors">
                                        {title}
                                    </h3>
                                    <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-[0.18em] text-slate-300 border border-slate-200 px-2 py-0.5 rounded-full">
                                        {tag}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-xl">{desc}</p>
                            </div>

                            {/* Right: arrow only */}
                            <div className="flex sm:flex-col items-center sm:items-end gap-3 flex-shrink-0">
                                <div className="w-9 h-9 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-300
                                                group-hover:border-[#0B1120] group-hover:text-[#0B1120] group-hover:translate-x-1
                                                sm:group-hover:translate-x-0 sm:group-hover:-translate-y-0.5 transition-all duration-300">
                                    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5">
                                        <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Bottom CTA ────────────────────── */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-5 mt-14 pt-10 border-t border-slate-100">
                    <p className="text-slate-400 text-sm">Your first investment takes under 5 minutes.</p>
                    <a href="/register"
                        className="group inline-flex items-center gap-3 bg-[#0B1120] text-white px-8 py-3.5 rounded-full font-black text-sm hover:bg-black hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300">
                        Open Your Account
                        <span className="text-[#39FF14] group-hover:translate-x-1 transition-transform duration-300 inline-block">→</span>
                    </a>
                </div>

            </div>
        </section>
    );
}
