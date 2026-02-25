"use client";

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import LiveMarketTicker from './LiveMarketTicker';
import Link from 'next/link';
import Image from 'next/image';
import LightPillar from './LightPillar';

gsap.registerPlugin(useGSAP);

export default function Hero() {
    const containerRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        tl.fromTo(
            ".hero-badge",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
        )
            .fromTo(
                ".hero-title",
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.2 },
                "-=0.4"
            )
            .fromTo(
                ".hero-subtitle",
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
                "-=0.4"
            )
            .fromTo(
                ".hero-cta",
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.1 },
                "-=0.4"
            )
            .fromTo(
                ".hero-ticker",
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
                "-=0.2"
            );

        // Floating animation for coins
        gsap.to(".floating-coin-1", {
            y: "-=30",
            x: "+=15",
            rotation: 10,
            duration: 4,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });

        gsap.to(".floating-coin-2", {
            y: "+=25",
            x: "-=20",
            rotation: -15,
            duration: 5,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative pt-24 pb-32 overflow-hidden bg-white">
            {/* Floating Crypto Images */}
            <div className="absolute top-20 left-[10%] opacity-40 md:opacity-100 floating-coin-1 z-0 pointer-events-none w-24 h-24 md:w-40 md:h-40">
                <Image
                    src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026"
                    alt="Bitcoin"
                    width={160}
                    height={160}
                    className="object-contain drop-shadow-xl opacity-80"
                />
            </div>

            <div className="absolute top-40 right-[10%] opacity-40 md:opacity-100 floating-coin-2 z-0 pointer-events-none w-20 h-20 md:w-32 md:h-32">
                <Image
                    src="https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026"
                    alt="Ethereum"
                    width={128}
                    height={128}
                    className="object-contain drop-shadow-xl opacity-80"
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <div className="hero-badge inline-block px-4 py-1.5 mb-6 rounded-full bg-slate-50 border border-slate-100 text-sm font-bold text-navy shadow-sm">
                    ⚡ The Next Generation of Finance
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-navy tracking-tight mb-8 leading-tight max-w-5xl mx-auto">
                    <span className="hero-title block">The Apex of</span>
                    <span className="hero-title block text-transparent bg-clip-text bg-gradient-to-r from-neon to-green-400">Crypto Trading</span>
                </h1>

                <p className="hero-subtitle text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                    Next-generation speed, uncompromised security. Trade Spot, Margin, and Futures with zero friction and lightning-fast execution on Hashprime.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
                    <Link href="/register" className="hero-cta w-full sm:w-auto bg-neon text-navy px-8 py-4 rounded-full text-base font-bold shadow-lg shadow-neon/20 hover:shadow-neon/40 hover:-translate-y-1 hover:scale-105 transition-all duration-300">
                        Start Trading Now
                    </Link>
                    <Link href="/markets" className="hero-cta w-full sm:w-auto bg-white text-navy border-2 border-slate-200 px-8 py-4 rounded-full text-base font-bold hover:border-navy hover:bg-navy hover:text-white transition-all duration-300">
                        Explore Markets
                    </Link>
                </div>

                <div className="hero-ticker relative z-20">
                    <LiveMarketTicker />
                </div>
            </div>


            {/* Background decorative elements */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-80">
                <LightPillar
                    topColor="#39FF14"
                    bottomColor="#00BFFF"
                    intensity={1.2}
                    rotationSpeed={0.2}
                    glowAmount={0.003}
                    pillarWidth={2.5}
                    pillarHeight={0.3}
                    noiseIntensity={0.2}
                    pillarRotation={90}
                    interactive={true}
                    mixBlendMode="normal"
                    quality="high"
                />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon opacity-[0.03] rounded-full blur-3xl pointer-events-none z-0"></div>
        </section>
    );
}
