"use client";

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import LightPillar from './LightPillar';
import { ArrowUpRight } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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
        const tl = gsap.timeline({ delay: 0.05 });
        tl.fromTo('.hero-badge', { y: -18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' })
            .fromTo('.hero-line-1', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power4.out' }, '-=0.1')
            .fromTo('.hero-line-2', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power4.out' }, '-=0.6')
            .fromTo('.hero-sub', { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }, '-=0.4')
            .fromTo('.hero-cta', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.1 }, '-=0.3')
            .fromTo('.hero-lottie-wrap', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.2)' }, '-=0.8')
            .fromTo('.cs-wrap', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)', stagger: 0.1 }, '-=0.3');

        tl.call(() => {
            gsap.to('.cs-1', { y: -36, x: 14, rotation: 10, duration: 4.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
            gsap.to('.cs-2', { y: 28, x: -18, rotation: -12, duration: 5.2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.4 });
            gsap.to('.cs-3', { y: -22, x: 10, rotation: 8, duration: 6.0, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.6 });
            gsap.to('.cs-5', { y: -24, x: 8, rotation: 11, duration: 4.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.8 });
        });

    }, { scope: containerRef });

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-white pt-24 pb-16"
        >
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-65">
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
                    <div className="hidden md:flex items-center justify-center" style={{ width: size + 24, height: size + 24 }}>
                        <span className="font-black text-[#0B1120] opacity-20 select-none leading-none" style={{ fontSize: size * 0.65, lineHeight: 1 }}>
                            {char}
                        </span>
                    </div>
                    <div className="flex md:hidden items-center justify-center" style={{ width: mobileSize + 12, height: mobileSize + 12 }}>
                        <span className="font-black text-[#0B1120] opacity-10 select-none leading-none" style={{ fontSize: mobileSize * 0.65, lineHeight: 1 }}>
                            {char}
                        </span>
                    </div>
                </div>
            ))}

            {/* ── Main Content ─────────────────── */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left Side: Text */}
                <div className="flex flex-col items-start text-left">


                    <div className="mb-8">
                        <div className="overflow-hidden">
                            <h1 className="hero-line-1 text-shine font-black leading-tight tracking-tight text-[clamp(2.8rem,7vw,5.5rem)] text-[#0B1120]">
                                Let's Save Money
                            </h1>
                        </div>
                        <div className="overflow-hidden">
                            <h1 className="hero-line-2 font-black  leading-tight tracking-tight text-[clamp(2.8rem,7vw,5.5rem)] text-[#0B1120]">
                                For The Future
                            </h1>
                        </div>
                    </div>

                    <p className="hero-sub text-[#0B1120] text-md md:text-lg font-medium max-w-lg mb-12 leading-relaxed opacity-80">
                        Multiply your wealth with structured plans across stocks, commodities, and global markets. Engineered for elite investors.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <Link href="/register"
                            className="hero-cta group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0B1120] text-white px-10 py-5 rounded-full text-sm font-bold shadow-lg hover:bg-black hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                            Start Investing
                            <ArrowUpRight size={16} className="text-[#39FF14] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                        </Link>
                        <Link href="/markets"
                            className="hero-cta w-full sm:w-auto inline-flex items-center justify-center border-2 border-slate-200 text-[#0B1120] px-10 py-5 rounded-full text-sm font-bold hover:border-[#39FF14] hover:bg-[#39FF14] hover:text-[#0B1120] transition-all duration-300">
                            Explore Markets
                        </Link>
                    </div>
                </div>

                {/* Right Side: Lottie */}
                <div className="hero-lottie-wrap relative w-full aspect-square max-w-[350px] mx-auto lg:ml-auto">
                    <div className="absolute inset-0 bg-[#39FF14]/5 rounded-full blur-[100px] animate-pulse" />
                    <DotLottieReact
                        src="https://lottie.host/5c4816c7-cb2f-4fd4-aab5-971db825b83e/mi4CERlSie.lottie"
                        autoplay
                        loop
                        style={{ width: '100%', height: '100%', transform: 'scale(1.1)' }}
                    />
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
        </section>
    );
}
