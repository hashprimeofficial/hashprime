"use client";

import Link from 'next/link';
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function GlowingPortal() {
    const containerRef = useRef(null);
    const auraRef = useRef(null);
    const ringOneRef = useRef(null);
    const ringTwoRef = useRef(null);
    const dotTopRef = useRef(null);
    const dotBottomRef = useRef(null);
    const coreRef = useRef(null);
    const sweepRef = useRef(null);
    const linesRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Outer ring slow spin
            gsap.to(ringOneRef.current, {
                rotation: 360, duration: 12, repeat: -1, ease: 'none', transformOrigin: 'center center'
            });
            // Inner dashed ring reverse spin
            gsap.to(ringTwoRef.current, {
                rotation: -360, duration: 20, repeat: -1, ease: 'none', transformOrigin: 'center center'
            });

            // Dots move along circular path
            gsap.to(dotTopRef.current, {
                motionPath: { path: 'M 0 -72 A 72 72 0 1 1 0 72 A 72 72 0 1 1 0 -72', align: 'self', autoRotate: false },
                duration: 12, repeat: -1, ease: 'none'
            });
            gsap.to(dotBottomRef.current, {
                motionPath: { path: 'M 0 72 A 72 72 0 1 1 0 -72 A 72 72 0 1 1 0 72', align: 'self', autoRotate: false },
                duration: 12, repeat: -1, ease: 'none'
            });

            // Core pulse
            gsap.to(coreRef.current, {
                scale: 1.3, opacity: 0.7, duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut'
            });

            // Outer aura slow breathe
            gsap.to(auraRef.current, {
                scale: 1.15, opacity: 0.55, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut'
            });

            // Horizontal sweep across button
            gsap.to(sweepRef.current, {
                x: '350%', duration: 2.5, repeat: -1, repeatDelay: 1, ease: 'power2.inOut', startAt: { x: '-120%' }
            });

            // Data line particles
            linesRef.current.forEach((line, i) => {
                if (!line) return;
                gsap.fromTo(line,
                    { scaleX: 0, opacity: 1 },
                    { scaleX: 1, opacity: 0, duration: 1.2 + i * 0.3, repeat: -1, delay: i * 0.8, ease: 'power2.out', transformOrigin: 'left center' }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative flex justify-center items-center py-28 px-4 bg-transparent z-20 overflow-visible">

            <Link href="/hash-prime-groups" className="group relative inline-flex items-center justify-center">

                {/* — Outer warm aura ——————————————————————————————————————— */}
                <div
                    ref={auraRef}
                    className="absolute w-[400px] h-[130px] bg-[#d4af35] rounded-full blur-[60px] opacity-40 pointer-events-none scale-100"
                />

                {/* — SVG scanner rings ————————————————————————————————————— */}
                <svg
                    ref={ringOneRef}
                    className="absolute w-[340px] h-[140px] pointer-events-none"
                    viewBox="0 0 340 140"
                    fill="none"
                >
                    {/* Main ring */}
                    <ellipse cx="170" cy="70" rx="165" ry="64" stroke="url(#ring-grad)" strokeWidth="1" strokeDasharray="6 14" />
                    {/* Glow dots at scanner endpoints */}
                    <circle cx="170" cy="6" r="5" fill="#f7d66a" style={{ filter: 'drop-shadow(0 0 8px #f7d66a)' }} ref={dotTopRef} />
                    <circle cx="170" cy="134" r="4" fill="#d4af35" style={{ filter: 'drop-shadow(0 0 6px #d4af35)' }} ref={dotBottomRef} />
                    <defs>
                        <linearGradient id="ring-grad" x1="0" y1="0" x2="340" y2="0">
                            <stop offset="0%" stopColor="#d4af35" stopOpacity="0.1" />
                            <stop offset="50%" stopColor="#f7d66a" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#d4af35" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Dashed outer ring slightly bigger */}
                <svg
                    ref={ringTwoRef}
                    className="absolute w-[380px] h-[160px] pointer-events-none opacity-20 group-hover:opacity-50 transition-opacity duration-700"
                    viewBox="0 0 380 160"
                    fill="none"
                >
                    <ellipse cx="190" cy="80" rx="184" ry="74" stroke="#d4af35" strokeWidth="0.5" strokeDasharray="2 20" />
                </svg>

                {/* — Data trace lines —————————————————————————————————————— */}
                {/* Left top */}
                <div
                    ref={(el) => (linesRef.current[0] = el)}
                    className="absolute top-[-10%] left-[-8%] w-28 h-[1px] bg-gradient-to-r from-[#f7d66a] to-transparent origin-left rotate-[-30deg] pointer-events-none opacity-0"
                />
                {/* Right bottom */}
                <div
                    ref={(el) => (linesRef.current[1] = el)}
                    className="absolute bottom-[-10%] right-[-8%] w-24 h-[1px] bg-gradient-to-r from-transparent to-[#f7d66a] origin-right rotate-[-30deg] pointer-events-none opacity-0"
                />
                {/* Right top */}
                <div
                    ref={(el) => (linesRef.current[2] = el)}
                    className="absolute top-[-10%] right-[-6%] w-20 h-[1px] bg-gradient-to-l from-[#d4af35] to-transparent origin-right rotate-[30deg] pointer-events-none opacity-0"
                />

                {/* — Main Processor Button Body ———————————————————————————— */}
                <div className="relative z-10 px-10 py-[1.35rem] md:px-16 md:py-[1.5rem] bg-[#050505]/95 border border-[#d4af35]/30 rounded-full flex items-center gap-7 overflow-hidden
          shadow-[inset_0_0_30px_rgba(212,175,53,0.08)]
          group-hover:border-[#d4af35]/70
          group-hover:shadow-[0_0_60px_rgba(212,175,53,0.25),inset_0_0_40px_rgba(212,175,53,0.15)]
          transition-all duration-700"
                >
                    {/* Micro-circuit grid texture */}
                    <div className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(212,175,53,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,53,0.4) 1px, transparent 1px)',
                            backgroundSize: '10px 10px',
                            maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 100%)'
                        }}
                    />

                    {/* Metallic sweep */}
                    <div
                        ref={sweepRef}
                        className="absolute inset-y-0 w-[30%] skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/8 to-transparent pointer-events-none -translate-x-full"
                    />

                    {/* Top edge glass line */}
                    <div className="absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#f7d66a]/50 to-transparent pointer-events-none" />

                    {/* Label */}
                    <span className="relative z-10 text-xl md:text-2xl lg:text-3xl font-black tracking-[0.18em] uppercase text-[#d4af35] group-hover:text-[#f7d66a] group-hover:[text-shadow:0_0_25px_rgba(247,214,106,0.7)] transition-all duration-500">
                        Explore Hash Prime Groups
                    </span>

                    {/* Core Node */}
                    <div className="relative z-10 w-11 h-11 shrink-0 flex items-center justify-center">
                        {/* Spinning segmented ring */}
                        <svg className="absolute inset-0 w-full h-full animate-spin text-[#d4af35]/50 group-hover:text-[#f7d66a]" style={{ animationDuration: '4s' }} viewBox="0 0 44 44" fill="none">
                            <circle cx="22" cy="22" r="19" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 6" />
                        </svg>
                        {/* Pulsing core */}
                        <div
                            ref={coreRef}
                            className="w-4 h-4 rounded-full bg-[#d4af35] shadow-[0_0_20px_#d4af35] group-hover:shadow-[0_0_30px_#f7d66a] group-hover:bg-[#f7d66a] transition-all duration-500"
                        />
                        {/* Ping */}
                        <div className="absolute w-4 h-4 rounded-full bg-[#d4af35] opacity-0 group-hover:opacity-40 animate-ping" />
                    </div>
                </div>

            </Link>
        </section>
    );
}
