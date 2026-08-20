"use client";

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
    Radio, Wind, HardHat, Zap, Wrench, ArrowRight, Layers
} from 'lucide-react';

function SleekEngineeringPrism() {
    return (
        <div className="w-full h-full relative flex items-center justify-center p-4">
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_60px_rgba(212,175,53,0.35)]">
                <defs>
                    <radialGradient id="prismGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#d4af35" stopOpacity="0.4" />
                        <stop offset="50%" stopColor="#d4af35" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#050505" stopOpacity="0" />
                    </radialGradient>

                    <linearGradient id="prismGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f7e8b5" />
                        <stop offset="50%" stopColor="#d4af35" />
                        <stop offset="100%" stopColor="#a37f1c" />
                    </linearGradient>

                    <linearGradient id="goldPure" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fff" />
                        <stop offset="50%" stopColor="#d4af35" />
                        <stop offset="100%" stopColor="#967518" />
                    </linearGradient>
                </defs>

                {/* Ambient Glow Background */}
                <circle cx="100" cy="100" r="88" fill="url(#prismGlow)" />

                {/* 1. Outer Orbiting Ring */}
                <g className="animate-spin" style={{ transformOrigin: '100px 100px', animationDuration: '35s', animationTimingFunction: 'linear' }}>
                    <circle cx="100" cy="100" r="84" fill="none" stroke="url(#prismGradient)" strokeWidth="0.75" strokeDasharray="6 12" opacity="0.35" />
                    <circle cx="100" cy="16" r="3.5" fill="#d4af35" className="animate-pulse" />
                    <circle cx="184" cy="100" r="3.5" fill="#ffffff" className="animate-pulse" />
                    <circle cx="100" cy="184" r="3.5" fill="#d4af35" className="animate-pulse" />
                    <circle cx="16" cy="100" r="3.5" fill="#ffffff" className="animate-pulse" />
                </g>

                {/* 2. Concentric Geometric Structure */}
                <g className="animate-spin" style={{ transformOrigin: '100px 100px', animationDuration: '25s', animationDirection: 'reverse', animationTimingFunction: 'linear' }}>
                    <circle cx="100" cy="100" r="72" fill="none" stroke="url(#goldPure)" strokeWidth="1" strokeDasharray="40 15 20 15" opacity="0.5" />
                    <circle cx="100" cy="28" r="4" fill="#ffffff" className="drop-shadow-[0_0_8px_#ffffff]" />
                    <circle cx="172" cy="100" r="4" fill="#d4af35" className="drop-shadow-[0_0_8px_#d4af35]" />
                </g>

                {/* 3. Central Hexagonal Core */}
                <g className="animate-spin" style={{ transformOrigin: '100px 100px', animationDuration: '20s', animationTimingFunction: 'linear' }}>
                    <polygon points="100,42 142,66 142,114 100,138 58,114 58,66" fill="none" stroke="#d4af35" strokeWidth="0.75" opacity="0.4" />
                </g>

                {/* 4. Central Hub Core */}
                <circle cx="100" cy="100" r="34" fill="#0A0A0C" stroke="url(#goldPure)" strokeWidth="1.75" className="drop-shadow-[0_0_25px_rgba(212,175,53,0.4)]" />
                <circle cx="100" cy="100" r="28" fill="url(#prismGlow)" opacity="0.9" />
                
                <path d="M 100 82 L 115 91 L 115 109 L 100 118 L 85 109 L 85 91 Z" fill="none" stroke="#d4af35" strokeWidth="1.25" opacity="0.85" />
                
                {/* Central Pulse */}
                <circle cx="100" cy="100" r="6" fill="#ffffff" className="animate-ping" style={{ animationDuration: '2.5s' }} />
                <circle cx="100" cy="100" r="4" fill="#d4af35" />
                <circle cx="100" cy="100" r="1.5" fill="#ffffff" />
            </svg>
        </div>
    );
}

gsap.registerPlugin(ScrollTrigger, useGSAP);

const projects = [
    { num: '01', Icon: Radio, title: 'Total Telecom Services', tag: 'Telecom', desc: 'Turnkey tower foundation, shelter installation, and 24/7 electrical O&M maintaining 99.99% network uptime.', href: '/total-telecom-services' },
    { num: '02', Icon: Zap, title: 'Fiberoptic Infrastructure', tag: 'Optical Fiber', desc: 'High-speed dark fiber layouts, trenching, pneumatic blowing, and low-loss precision fusion splicing.', href: '/fiberoptical-services' },
    { num: '03', Icon: Wind, title: 'Commercial & Residential HVAC', tag: 'Cooling', desc: 'End-to-end sales, multi-brand installation, preventive jet servicing, and industrial ducting maintenance.', href: '/ac-sales-and-service' },
    { num: '04', Icon: HardHat, title: 'Civil Construction & Works', tag: 'Civil Works', desc: 'Commercial developments, municipal infrastructure, smart city integrations, and boundary fencing.', href: '/construction-and-works' },
    { num: '05', Icon: Wrench, title: 'Generator Sales & Service', tag: 'Power Utilities', desc: 'Diesel generator deployment, preventive overhauls, automatic transfer switch integration, and load audits.', href: '/generator-services' },
    { num: '06', Icon: Layers, title: 'All 11 Business Divisions', tag: 'Complete Portfolio', desc: 'Explore our full multi-sector capabilities across engineering, machinery, legal care, and logistics.', href: '/hash-prime-groups', isAction: true },
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
        <section ref={sectionRef} className="relative bg-transparent py-16 md:py-24 overflow-hidden border-t border-white/[0.02]">

            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-[#d4af35] opacity-[0.02] rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-[#d4af35] opacity-[0.02] rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* ── Header ───────────────────────── */}
                <div className="op-header-content flex flex-col lg:flex-row items-center justify-between gap-16 mb-20">
                    <div className="flex flex-col items-start text-left lg:max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d4af35]/20 bg-[#d4af35]/5 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af35] animate-pulse"></span>
                            <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#d4af35]">Execution Portfolio</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-6">
                            WHERE ENGINEERING<br />
                            <span className="text-[#d4af35]">CREATES IMPACT</span>
                        </h2>
                        <p className="text-slate-400 text-base md:text-lg font-normal max-w-xl leading-relaxed">
                            Turnkey engineering and infrastructure capabilities delivering proven reliability across critical utilities and commercial enterprises.
                        </p>
                    </div>

                    <div className="flex-shrink-0 w-full max-w-[320px] lg:max-w-none lg:w-[420px] aspect-square relative mx-auto lg:mx-0">
                        <div className="absolute inset-0 bg-[#d4af35]/5 rounded-full blur-[80px] animate-pulse" />
                        <SleekEngineeringPrism />
                    </div>
                </div>

                {/* ── Showcase Rows ─────── */}
                <div className="op-rows grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(({ num, Icon, title, tag, desc, href, isAction }) => (
                        <Link
                            key={num}
                            href={href}
                            className={`group block p-8 rounded-3xl transition-all duration-300 border ${
                                isAction
                                    ? 'bg-[#d4af35] text-[#0A0A0A] border-[#d4af35] shadow-[0_0_30px_rgba(212,175,53,0.3)]'
                                    : 'bg-[#121212] border-white/10 hover:border-[#d4af35]/40 text-white'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                    isAction ? 'bg-black/10' : 'bg-[#1a1a1a] border border-white/10 group-hover:bg-[#d4af35] transition-colors'
                                }`}>
                                    <Icon className={`w-6 h-6 ${isAction ? 'text-[#0A0A0A]' : 'text-[#d4af35] group-hover:text-[#0A0A0A] transition-colors'}`} />
                                </div>
                                <span className={`text-xs font-mono font-bold uppercase ${isAction ? 'text-black/70' : 'text-slate-500'}`}>
                                    {tag}
                                </span>
                            </div>
                            <h3 className={`text-xl font-bold mb-3 ${isAction ? 'text-black' : 'text-white'}`}>{title}</h3>
                            <p className={`text-sm leading-relaxed mb-6 ${isAction ? 'text-black/80' : 'text-slate-400'}`}>{desc}</p>
                            <div className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
                                isAction ? 'text-black' : 'text-[#d4af35] group-hover:text-white'
                            }`}>
                                Explore Division <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
