"use client";

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
    TrendingUp, PieChart, DollarSign, Briefcase, Globe2, ArrowRight
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const projects = [
    { num: '01', Icon: TrendingUp, title: 'Stocks & IPL', tag: 'Equity', desc: 'Equities and IPO access — capture growth before the crowd. High-yield potential in emerging markets.' },
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
        <section ref={sectionRef} className="relative bg-white py-24 md:py-32 overflow-hidden">

            {/* Soft Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#39FF14]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

                {/* ── Header ───────────────────────── */}
                <div className="op-header-content flex flex-col items-center text-center mb-20">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-[2px] w-8 bg-[#39FF14]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Our Strategic Verticals</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-[#0B1120] leading-[0.9] tracking-tighter mb-8 ">
                        WHERE YOUR<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B1120] to-[#39FF14]">MONEY WORKS</span>
                    </h2>
                    <p className="text-slate-500 text-lg font-medium max-w-xl leading-relaxed">
                        Five specialized investment verticals engineered to capture alpha across global markets.
                    </p>
                </div>

                {/* ── Showcase Rows ─────── */}
                <div className="op-rows space-y-4">
                    {projects.map(({ num, Icon, title, tag, desc }) => (
                        <div
                            key={num}
                            className="op-row group relative flex flex-col md:flex-row md:items-center gap-6 p-6 md:p-8 
                                       bg-slate-50 border border-slate-100 rounded-3xl
                                       hover:bg-white hover:border-[#39FF14]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)]
                                       transition-all duration-500 cursor-default"
                        >
                            {/* Left Accent */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#39FF14] rounded-r-full opacity-0 group-hover:opacity-100 transition-all duration-500" />

                            {/* Icon bubble */}
                            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center
                                            group-hover:scale-110 group-hover:shadow-lg group-hover:border-[#39FF14]/20 transition-all duration-500">
                                <Icon size={28} strokeWidth={1.5} className="text-[#39FF14]" />
                            </div>

                            {/* Center Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-4 mb-2">
                                    <span className="text-[12px] font-black text-slate-300 tracking-widest">{num}</span>
                                    <h3 className="text-2xl font-black text-[#0B1120] tracking-tight group-hover:text-[#0B1120] transition-colors">
                                        {title}
                                    </h3>
                                    <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-[0.2em] text-[#39FF14]/60 bg-[#39FF14]/5 border border-[#39FF14]/20 px-3 py-1 rounded-full">
                                        {tag}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-base leading-relaxed max-w-2xl">{desc}</p>
                            </div>

                            {/* Right Arrow */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-300
                                                group-hover:border-[#0B1120] group-hover:text-[#0B1120] group-hover:shadow-md
                                                transition-all duration-500">
                                    <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform duration-500" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Bottom CTA ────────────────────── */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-20 pt-12 border-t border-slate-100">
                    <p className="text-slate-400 text-sm font-medium">Global exposure. Local expertise. Start today.</p>
                    <a href="/register"
                        className="group inline-flex items-center gap-3 bg-[#0B1120] text-white px-10 py-4 rounded-full font-black text-sm hover:bg-black hover:-translate-y-1 hover:shadow-2xl transition-all duration-500">
                        Launch Your Portfolio
                        <span className="text-[#39FF14] group-hover:translate-x-1 transition-transform duration-500 inline-block">→</span>
                    </a>
                </div>

            </div>
        </section>
    );
}
