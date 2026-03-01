"use client";

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
    ShieldCheck, Zap, BarChart3, Globe, Lock, Cpu, ChevronRight
} from 'lucide-react';
import LightPillar from './LightPillar';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const services = [
    { num: '01', Icon: ShieldCheck, title: 'Secure Custody', tag: 'Security', desc: 'Institutional-grade cold storage and multi-sig security for your digital assets. Your peace of mind is our priority.' },
    { num: '02', Icon: Zap, title: 'Instant Swaps', tag: 'Trading', desc: 'Deep liquidity and lightning-fast execution for over 200+ trading pairs with minimal slippage.' },
    { num: '03', Icon: BarChart3, title: 'Advanced Analytics', tag: 'Research', desc: 'AI-driven market insights and real-time data to power your investment decisions. Stay ahead of the curve.' },
    { num: '04', Icon: Globe, title: 'Cross-Border Payments', tag: 'Payments', desc: 'Global settlement infrastructure for seamless international transactions at the speed of light.' },
    { num: '05', Icon: Lock, title: 'Private Wealth', tag: 'Premium', desc: 'Dedicated account management and bespoke strategies for high-net-worth investors and family offices.' },
    { num: '06', Icon: Cpu, title: 'API Integration', tag: 'Developer', desc: 'Robust, low-latency APIs for programmatic trading and custom integrations for institutions.' },
];

export default function OurServices() {
    const sectionRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo('.os-header-content',
            { y: 60, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1.2, ease: 'power4.out',
                scrollTrigger: { trigger: '.os-header-content', start: 'top 90%' }
            }
        );

        gsap.fromTo('.os-row',
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.15,
                scrollTrigger: { trigger: '.os-rows', start: 'top 85%' }
            }
        );

        // Subtle background elements parallax
        gsap.to('.os-pill-bg', {
            y: -100,
            ease: 'none',
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative bg-[#0B1120] py-24 md:py-40 overflow-hidden text-white">

            {/* High Impact Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                <LightPillar
                    topColor="#39FF14"
                    bottomColor="#0B1120"
                    intensity={0.6}
                    pillarWidth={4.0}
                    glowAmount={0.01}
                />
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#39FF14 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* Glowing Orbs */}
            <div className="os-pill-bg absolute top-[10%] -left-20 w-[600px] h-[600px] bg-[#39FF14] opacity-[0.07] rounded-full blur-[150px] pointer-events-none" />
            <div className="os-pill-bg absolute bottom-[10%] -right-20 w-[500px] h-[500px] bg-emerald-500 opacity-[0.05] rounded-full blur-[150px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

                {/* ── Header ───────────────────────── */}
                <div className="os-header-content flex flex-col items-center text-center mb-24">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-[1px] w-12 bg-[#39FF14]" />
                        <span className="text-[12px] font-black uppercase tracking-[0.4em] text-[#39FF14]/80">The Ecosystem</span>
                        <div className="h-[1px] w-12 bg-[#39FF14]" />
                    </div>
                    <h2 className="text-5xl sm:text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter mb-8">
                        PREMIUM<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#39FF14] to-emerald-400">SERVICES</span>
                    </h2>
                    <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                        Redefining the boundaries of digital finance with institutional-grade infrastructure and elegant simplicity.
                    </p>
                </div>

                {/* ── Services Rows ─────── */}
                <div className="os-rows space-y-4">
                    {services.map(({ num, Icon, title, tag, desc }) => (
                        <div
                            key={num}
                            className="os-row group relative flex flex-col md:flex-row md:items-center gap-6 p-8 md:p-10 
                                       bg-white/[0.02] border border-white/[0.05] backdrop-blur-md rounded-[2rem]
                                       hover:bg-white/[0.05] hover:border-[#39FF14]/30 hover:shadow-[0_0_40px_rgba(57,255,20,0.05)]
                                       transition-all duration-500 cursor-pointer overflow-hidden"
                        >
                            {/* Animated Background Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#39FF14]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            {/* Icon bubble */}
                            <div className="relative z-10 flex-shrink-0 w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center
                                            group-hover:scale-110 group-hover:bg-[#39FF14] group-hover:border-[#39FF14] group-hover:shadow-[0_0_30px_#39FF1466] transition-all duration-500">
                                <Icon size={32} strokeWidth={1.5} className="text-[#39FF14] group-hover:text-[#0B1120] transition-colors duration-500" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 flex-1 min-w-0">
                                <div className="flex items-center gap-4 mb-2">
                                    <span className="text-[12px] font-black text-[#39FF14]/40 tracking-widest">{num}</span>
                                    <h3 className="text-2xl md:text-3xl font-black tracking-tight group-hover:text-white transition-colors duration-300">
                                        {title}
                                    </h3>
                                    <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-[0.2em] text-[#39FF14]/60 bg-[#39FF14]/5 border border-[#39FF14]/20 px-3 py-1 rounded-full">
                                        {tag}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-lg leading-relaxed max-w-2xl group-hover:text-slate-300 transition-colors duration-300">
                                    {desc}
                                </p>
                            </div>

                            {/* Action */}
                            <div className="relative z-10 flex items-center gap-4">
                                <span className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-[#39FF14] opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                    Explore More
                                </span>
                                <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white
                                                group-hover:border-[#39FF14] group-hover:bg-[#39FF14] group-hover:text-[#0B1120] 
                                                transition-all duration-500">
                                    <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform duration-500" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Bottom CTA ────────────────────── */}
                <div className="relative z-10 mt-24 text-center">
                    <div className="inline-block p-[1px] rounded-full bg-gradient-to-r from-transparent via-[#39FF14]/50 to-transparent">
                        <div className="bg-[#0B1120] rounded-full px-12 py-10 flex flex-col items-center">
                            <h4 className="text-3xl font-black mb-4">Ready to elevate your portfolio?</h4>
                            <p className="text-slate-400 mb-8 max-w-md mx-auto">Join thousands of investors already leveraging our premium infrastructure.</p>
                            <a href="/register"
                                className="group relative inline-flex items-center gap-4 bg-[#39FF14] text-[#0B1120] px-10 py-5 rounded-full font-black text-lg hover:scale-105 hover:shadow-[0_0_50px_#39FF1444] transition-all duration-500">
                                Launch Your Account
                                <span className="group-hover:translate-x-1 transition-transform duration-500 inline-block">→</span>
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
