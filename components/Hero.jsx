"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Play, TrendingUp, ShieldCheck, ArrowRightLeft } from "lucide-react";
import Link from "next/link";

function GoldenCryptoGlobe() {
    return (
        <div className="w-full h-full relative flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_50px_rgba(212,175,53,0.35)]">
                <defs>
                    <radialGradient id="centralGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#d4af35" stopOpacity="0.4" />
                        <stop offset="70%" stopColor="#d4af35" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#d4af35" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f5e0a3" />
                        <stop offset="50%" stopColor="#d4af35" />
                        <stop offset="100%" stopColor="#a37f1c" />
                    </linearGradient>
                </defs>

                {/* Background Glow */}
                <circle cx="100" cy="100" r="80" fill="url(#centralGlow)" />

                {/* Nested Orbiting Rings */}
                <g className="animate-spin" style={{ transformOrigin: '100px 100px', animationDuration: '20s' }}>
                    <circle cx="100" cy="100" r="70" fill="none" stroke="url(#goldGrad)" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
                    <circle cx="100" cy="30" r="4" fill="#d4af35" className="animate-pulse" />
                    <circle cx="100" cy="170" r="3" fill="#ffffff" />
                </g>

                <g className="animate-spin" style={{ transformOrigin: '100px 100px', animationDuration: '30s', animationDirection: 'reverse' }}>
                    <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="#d4af35" strokeWidth="0.75" opacity="0.4" transform="rotate(45 100 100)" />
                    <circle cx="43" cy="43" r="3" fill="#d4af35" />
                </g>

                <g className="animate-spin" style={{ transformOrigin: '100px 100px', animationDuration: '15s' }}>
                    <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.25" transform="rotate(-45 100 100)" />
                    <circle cx="157" cy="43" r="3.5" fill="#ffffff" className="animate-pulse" />
                </g>

                {/* Central Sphere / Core */}
                <circle cx="100" cy="100" r="28" fill="#0A0A0A" stroke="url(#goldGrad)" strokeWidth="1.5" />
                <circle cx="100" cy="100" r="22" fill="url(#centralGlow)" />
                
                {/* Golden Blockchain Grid inside the core */}
                <path d="M 88 100 L 112 100 M 100 88 L 100 112 M 91 91 L 109 109 M 91 109 L 109 91" stroke="#d4af35" strokeWidth="0.75" opacity="0.8" />
                <circle cx="100" cy="100" r="4" fill="#ffffff" className="animate-ping" style={{ animationDuration: '2s' }} />
                <circle cx="100" cy="100" r="2" fill="#d4af35" />
            </svg>
        </div>
    );
}

gsap.registerPlugin(useGSAP);

export default function Hero() {
    const containerRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ delay: 0.1 });

        tl.fromTo('.hero-glass-badge', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out' })
            .fromTo('.hero-title-line', { y: 40, opacity: 0, rotationX: 10 }, { y: 0, opacity: 1, rotationX: 0, duration: 0.9, stagger: 0.2, ease: 'power4.out' }, '-=0.6')
            .fromTo('.hero-desc', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.4')
            .fromTo('.hero-actions', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5')
            .fromTo('.hero-floating-card', { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'back.out(1.2)' }, '-=0.4');

        // Continuous floating animation
        gsap.to('.hero-float-1', { y: -15, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to('.hero-float-2', { y: 15, x: 10, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });

        // Scanline animation
        gsap.to('.hero-scanline', { top: '100%', duration: 8, repeat: -1, ease: 'none' });

    }, { scope: containerRef });

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0A] pt-24 pb-20 perspective-1000"
        >
            {/* Absolute Background Setup */}
            <div className="absolute inset-0 z-0">
                {/* Dotted Grid Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#d4af35_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]"></div>

                {/* Optical Glows (No CSS linear gradients) */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#d4af35] rounded-full blur-[150px] opacity-[0.04]"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#d4af35] rounded-full blur-[120px] opacity-[0.03]"></div>

                {/* Animated Vertical Scanline */}
                <div className="hero-scanline absolute top-0 left-0 right-0 h-[1px] bg-[#d4af35] opacity-20 blur-[1px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

                {/* Left side content */}
                <div className="lg:col-span-7 flex flex-col items-start z-20">
                    <div className="mb-6">
                        <h1 className="hero-title-line font-black text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight text-white drop-shadow-sm mb-4">
                            Intelligent <span className="text-[#d4af35]">Asset Management</span><br />
                            <span className="text-white/80 text-3xl md:text-4xl lg:text-5xl mt-2 block">for the Modern Investor</span>
                        </h1>
                    </div>

                    <p className="hero-desc text-slate-300 text-base md:text-lg font-medium max-w-xl mb-10 leading-relaxed">
                        Grow your wealth with diversified strategies in global equities, funds, commodities, and fixed-return investment portfolios.
                    </p>

                    <div className="hero-actions flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
                        <Link href="/register"
                            className="group relative flex items-center justify-center gap-3 w-full sm:w-auto bg-[#d4af35] text-[#0A0A0A] px-10 py-5 rounded-full font-black text-sm uppercase tracking-wider overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,53,0.3)]">
                            <span className="relative z-10 flex items-center gap-2">
                                Start Investing <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </span>
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        </Link>

                        <Link href="/schemes" className="group flex items-center justify-center gap-3 w-full sm:w-auto text-white px-8 py-5 rounded-full font-bold text-sm bg-[#121212] border border-white/5 hover:border-[#d4af35]/50 transition-all hover:bg-[#d4af35]/5">
                            <div className="w-8 h-8 rounded-full bg-[#d4af35]/10 flex items-center justify-center group-hover:bg-[#d4af35] transition-colors">
                                <Play size={14} className="text-[#d4af35] group-hover:text-[#0A0A0A] ml-1 transition-colors" />
                            </div>
                            View Plans
                        </Link>
                    </div>
                </div>

                {/* Right side immersive visuals */}
                <div className="lg:col-span-5 relative w-full aspect-square md:aspect-[4/5] z-10">
                    {/* Dark Golden Central Globe/Lottie */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute w-[300px] h-[300px] bg-[#d4af35] rounded-full blur-[100px] opacity-[0.08] animate-pulse"></div>
                        <div className="w-[120%] h-[120%] relative z-10">
                            <GoldenCryptoGlobe />
                        </div>
                    </div>

                    {/* Immersive Floating Glass Cards */}
                    <div className="hero-floating-card hero-float-1 absolute top-[15%] right-[-5%] sm:right-[-10%] md:right-0 bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.5)] w-48 z-20">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-[#d4af35]/10 flex items-center justify-center border border-[#d4af35]/20">
                                <TrendingUp size={14} className="text-[#d4af35]" />
                            </div>
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Live Yield</span>
                        </div>
                        <div className="text-2xl font-black text-white">+500%</div>
                        <div className="text-[10px] text-[#d4af35] font-bold mt-1">Highest returns</div>
                    </div>

                    <div className="hero-floating-card hero-float-2 absolute bottom-[20%] left-[-5%] sm:left-[-10%] md:left-[-20%] bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.5)] w-52 z-20">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-[#d4af35]/10 flex items-center justify-center border border-[#d4af35]/20">
                                <ShieldCheck size={14} className="text-[#d4af35]" />
                            </div>
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Trusted Investments</span>
                        </div>
                        <div className="text-lg font-black text-white">100%</div>
                        <div className="text-[10px] text-[#d4af35] font-bold mt-1">Secured & Verified</div>
                    </div>

                    {/* Frame elements */}
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#d4af35]/20 rounded-tr-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#d4af35]/20 rounded-bl-3xl"></div>
                </div>
            </div>
        </section>
    );
}
