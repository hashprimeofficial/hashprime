"use client";

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import LightPillar from './LightPillar';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(useGSAP);

// Currency symbols — size = desktop px, mobileSize = mobile px, hideMobile = hide on small screens
const symbols = [
    { char: '$', cls: 'cs-1', top: '12%', left: '2%', size: 88, mobileSize: 36, hideMobile: false },
    { char: '₹', cls: 'cs-2', top: '15%', right: '2%', size: 74, mobileSize: 32, hideMobile: false },
    { char: '€', cls: 'cs-3', top: '60%', left: '1%', size: 64, mobileSize: 28, hideMobile: true },
    { char: '£', cls: 'cs-5', bottom: '16%', right: '2%', size: 68, mobileSize: 28, hideMobile: true },
];

export default function Hero() {
    const containerRef = useRef(null);

    useGSAP(() => {
        // Entrance — NO skewY to avoid visual rotation
        const tl = gsap.timeline({ delay: 0.05 });
        tl.fromTo('.hero-badge', { y: -18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' })
            .fromTo('.hero-line-1', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out' }, '-=0.1')
            .fromTo('.hero-line-2', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out' }, '-=0.6')
            .fromTo('.hero-sub', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }, '-=0.4')
            .fromTo('.hero-cta', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.1 }, '-=0.3')
            .fromTo('.hero-stat', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', stagger: 0.08 }, '-=0.25')
            // Currency symbols appear after text
            .fromTo('.cs-wrap', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)', stagger: 0.1 }, '-=0.3');

        // Perpetual float — starts after entrance completes
        tl.call(() => {
            gsap.to('.cs-1', { y: -36, x: 14, rotation: 10, duration: 4.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
            gsap.to('.cs-2', { y: 28, x: -18, rotation: -12, duration: 5.2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.4 });
            gsap.to('.cs-3', { y: -22, x: 10, rotation: 8, duration: 6.0, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.6 });
            gsap.to('.cs-4', { y: 18, x: -10, rotation: -14, duration: 3.9, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.2 });
            gsap.to('.cs-5', { y: -24, x: 8, rotation: 11, duration: 4.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.8 });
        });

    }, { scope: containerRef });

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-white pt-20 pb-16"
        >
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-35">
                <LightPillar
                    topColor="#39FF14" bottomColor="#10B981"
                    intensity={0.8} rotationSpeed={0.15} glowAmount={0.005}
                    pillarWidth={2} pillarHeight={0.25} noiseIntensity={0.1}
                    pillarRotation={90} interactive={true} mixBlendMode="normal" quality="high"
                />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#39FF14] opacity-[0.025] rounded-full blur-3xl pointer-events-none z-0" />

            {/* ── Floating Currency Symbols ─────── */}
            {symbols.map(({ char, cls, size, mobileSize, hideMobile, top, left, right, bottom }) => (
                <div
                    key={cls}
                    className={`cs-wrap ${cls} absolute z-0 pointer-events-none ${hideMobile ? 'hidden md:flex' : 'flex'}`}
                    style={{ top, left, right, bottom }}
                >
                    {/* Desktop size */}
                    <div className="hidden md:flex items-center justify-center"
                        style={{ width: size + 24, height: size + 24 }}
                    >
                        <span
                            className="font-black text-[#0B1120] opacity-20 select-none leading-none"
                            style={{ fontSize: size * 0.65, lineHeight: 1 }}
                        >
                            {char}
                        </span>
                    </div>
                    {/* Mobile size — smaller, more transparent */}
                    <div className="flex md:hidden items-center justify-center"
                        style={{ width: mobileSize + 12, height: mobileSize + 12 }}
                    >
                        <span
                            className="font-black text-[#0B1120] opacity-10 select-none leading-none"
                            style={{ fontSize: mobileSize * 0.65, lineHeight: 1 }}
                        >
                            {char}
                        </span>
                    </div>
                </div>
            ))}

            {/* ── Main Content ─────────────────── */}
            <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10 w-full">
                <div className="flex  flex-col items-center text-center">


                    {/* Headline — both lines BLACK with shimmer on line 1 */}
                    <div className="text-shine mt-10">

                        <div className="overflow-hidden mb-1">
                            <h1 className="hero-line-1  font-black leading-none tracking-tight text-[clamp(2.8rem,7vw,6.5rem)]">
                                Let's Save Money
                            </h1>
                        </div>
                        <div className="overflow-hidden  mb-10">
                            <h1 className="hero-line-2  font-black leading-none tracking-tight text-[clamp(2.8rem,7vw,6.5rem)] text-[#0B1120]">
                                For The Future
                            </h1>
                        </div>
                    </div>

                    {/* Sub */}
                    <p className="hero-sub text-slate-400 text-base md:text-lg font-medium max-w-md mx-auto mb-12 leading-relaxed">
                        Multiply your wealth with structured plans across stocks, commodities, and global markets.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 mb-20">
                        <Link href="/register"
                            className="hero-cta group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0B1120] text-white px-9 py-4 rounded-full text-sm font-bold shadow-lg hover:bg-black hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300">
                            Start Investing
                            <ArrowUpRight size={15} className="text-[#39FF14] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                        </Link>
                        <Link href="/markets"
                            className="hero-cta w-full sm:w-auto inline-flex items-center justify-center border-2 border-slate-200 text-[#0B1120] px-9 py-4 rounded-full text-sm font-bold hover:border-[#39FF14] hover:bg-[#39FF14] hover:text-[#0B1120] transition-all duration-300">
                            Explore Markets
                        </Link>
                    </div>



                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
        </section>
    );
}
