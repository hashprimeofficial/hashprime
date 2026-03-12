"use client";

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import { ArrowUpRight, Play, TrendingUp, ShieldCheck } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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
                    <div className="hero-glass-badge inline-flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full bg-[#121212] border border-[#d4af35]/20 shadow-[0_0_15px_rgba(212,175,53,0.05)] mb-8">
                        <span className="bg-[#d4af35] text-[#0A0A0A] text-[10px] font-black uppercase px-2 py-1 rounded-full">New</span>
                        <span className="text-[#d4af35] text-xs font-bold uppercase tracking-widest">Institutional Yield Platform</span>
                    </div>

                    <div className="mb-8 [perspective:1000px]">
                        <div className="overflow-hidden">
                            <h1 className="hero-title-line font-black text-6xl md:text-[5.5rem] leading-[0.9] tracking-tighter text-white drop-shadow-sm mb-2">
                                REIMAGINE
                            </h1>
                        </div>
                        <div className="overflow-hidden">
                            <h1 className="hero-title-line font-black text-6xl md:text-[5.5rem] leading-[0.9] tracking-tighter text-[#d4af35] mb-2">
                                YOUR WEALTH
                            </h1>
                        </div>
                        <div className="overflow-hidden">
                            <h1 className="hero-title-line font-black text-5xl md:text-7xl leading-[0.9] tracking-tighter text-white/50">
                                FOR THE FUTURE
                            </h1>
                        </div>
                    </div>

                    <p className="hero-desc text-slate-300 text-lg md:text-xl font-medium max-w-xl mb-12 leading-relaxed">
                        Execute strategies with precision. We combine deep liquidity, algorithmic trading access, and vault-grade security into a single, seamless terminal.
                    </p>

                    <div className="hero-actions flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
                        <Link href="/register"
                            className="group relative flex items-center justify-center gap-3 w-full sm:w-auto bg-[#d4af35] text-[#0A0A0A] px-10 py-5 rounded-full font-black text-sm uppercase tracking-wider overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,53,0.3)]">
                            <span className="relative z-10 flex items-center gap-2">
                                Open Account <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </span>
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        </Link>

                        <button className="group flex items-center justify-center gap-3 w-full sm:w-auto text-white px-8 py-5 rounded-full font-bold text-sm bg-[#121212] border border-white/5 hover:border-[#d4af35]/50 transition-all hover:bg-[#d4af35]/5">
                            <div className="w-8 h-8 rounded-full bg-[#d4af35]/10 flex items-center justify-center group-hover:bg-[#d4af35] transition-colors">
                                <Play size={14} className="text-[#d4af35] group-hover:text-[#0A0A0A] ml-1 transition-colors" />
                            </div>
                            How It Works
                        </button>
                    </div>
                </div>

                {/* Right side immersive visuals */}
                <div className="lg:col-span-5 relative w-full aspect-square md:aspect-[4/5] z-10">
                    {/* Dark Golden Central Globe/Lottie */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute w-[300px] h-[300px] bg-[#d4af35] rounded-full blur-[100px] opacity-[0.08] animate-pulse"></div>
                        <div className="w-[120%] h-[120%] relative z-10">
                            <DotLottieReact
                                src="https://lottie.host/5c4816c7-cb2f-4fd4-aab5-971db825b83e/mi4CERlSie.lottie"
                                autoplay
                                loop
                                className="w-full h-full scale-[1.2] drop-shadow-[0_0_20px_rgba(212,175,53,0.2)]"
                            />
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
                        <div className="text-2xl font-black text-white">+14.2%</div>
                        <div className="text-[10px] text-[#d4af35] font-bold mt-1">Global average APY</div>
                    </div>

                    <div className="hero-floating-card hero-float-2 absolute bottom-[20%] left-[-5%] sm:left-[-10%] md:left-[-20%] bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.5)] w-52 z-20">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-[#d4af35]/10 flex items-center justify-center border border-[#d4af35]/20">
                                <ShieldCheck size={14} className="text-[#d4af35]" />
                            </div>
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Vault Status</span>
                        </div>
                        <div className="text-lg font-black text-white">Secured</div>
                        <div className="text-[10px] text-[#d4af35] font-bold mt-1">Multi-sig verified</div>
                    </div>

                    {/* Frame elements */}
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#d4af35]/20 rounded-tr-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#d4af35]/20 rounded-bl-3xl"></div>
                </div>
            </div>
        </section>
    );
}
