"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, Zap, HeadphonesIcon, Coins } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CryptoMarquee = () => (
    <div className="absolute -bottom-10 left-0 right-0 overflow-hidden flex whitespace-nowrap opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none z-0 transform group-hover:-translate-y-10">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10" />
        <div className="animate-marquee flex min-w-full items-center">
            {[...Array(2)].map((_, i) => (
                <div key={i} className="flex min-w-full justify-around items-center px-4 shrink-0 gap-16">
                    <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/btc.svg" className="w-12 h-12 opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_15px_rgba(247,147,26,0.3)]" alt="BTC" />
                    <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/eth.svg" className="w-12 h-12 opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_15px_rgba(98,126,234,0.3)]" alt="ETH" />
                    <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/usdt.svg" className="w-12 h-12 opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_15px_rgba(38,161,123,0.3)]" alt="USDT" />
                    <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/sol.svg" className="w-12 h-12 opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_15px_rgba(20,241,149,0.3)]" alt="SOL" />
                    <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/xrp.svg" className="w-12 h-12 opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_15px_rgba(35,41,47,0.3)]" alt="XRP" />
                    <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/ada.svg" className="w-12 h-12 opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_15px_rgba(0,51,173,0.3)]" alt="ADA" />
                </div>
            ))}
        </div>
        <style dangerouslySetInnerHTML={{
            __html: `
            .animate-marquee { animation: marquee 20s linear infinite; }
            @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); } }
        `}} />
    </div>
);

const RadarAnimation = () => (
    <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#d4af35]/5 rounded-full blur-xl animate-pulse" />
        <div className="absolute w-[80%] h-[80%] rounded-full border-[0.5px] border-[#d4af35]/30 animate-ping" style={{ animationDuration: '4s' }}></div>
        <div className="absolute w-[40%] h-[40%] rounded-full border-[0.5px] border-[#d4af35]/40 animate-ping" style={{ animationDuration: '4s', animationDelay: '2s' }}></div>
        <div className="absolute w-full h-[50%] bg-gradient-to-t from-transparent to-[#d4af35]/10 origin-bottom animate-spin" style={{ top: 0, animationDuration: '3s' }}></div>
        <div className="w-3 h-3 rounded-full bg-[#d4af35] shadow-[0_0_15px_#d4af35]"></div>
    </div>
);

const features = [
    {
        id: "security",
        col: "md:col-span-2",
        icon: ShieldCheck,
        title: "Bank-Grade Security",
        desc: "Sleep soundly knowing your assets are protected by industry-leading encryption, advanced 2FA, and robust cold-storage solutions.",
        MicroAnimation: RadarAnimation,
    },
    {
        id: "investing",
        col: "md:col-span-2",
        icon: Zap,
        title: "Zero-Friction Investing",
        desc: "Maximize your returns with our hyper-competitive fee structure. Invest more, pay less and keep what you earn.",
    },
    {
        id: "support",
        col: "md:col-span-2 lg:col-span-1",
        icon: HeadphonesIcon,
        title: "24/7 Premium Support",
        desc: "Expert assistance at your fingertips, anytime you need.",
        compact: true,
    },
    {
        id: "assets",
        col: "md:col-span-2 lg:col-span-3",
        icon: Coins,
        title: "Unlimited Asset Access",
        desc: "Dive into a massive ocean of liquidity with hundreds of active pairs. From Bitcoin to the newest altcoins, your portfolio knows no bounds.",
        large: true,
        MicroAnimation: CryptoMarquee,
    },
];

export default function BentoFeatures() {
    const sectionRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo(".bento-header-element",
            { y: 30, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out",
                scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
            }
        );

        gsap.fromTo(".bento-card-premium",
            { y: 60, opacity: 0, scale: 0.97 },
            {
                y: 0, opacity: 1, scale: 1, duration: 0.9, stagger: 0.1, ease: "power4.out",
                scrollTrigger: { trigger: ".bento-grid", start: "top 80%" }
            }
        );
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="py-24 md:py-32 bg-[#050505] relative overflow-hidden" id="features">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-[#d4af35] opacity-[0.03] rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#d4af35] opacity-[0.02] rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
                    <div className="bento-header-element inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d4af35]/20 bg-[#d4af35]/5 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4af35] animate-pulse"></span>
                        <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#d4af35]">Core Infrastructure</span>
                    </div>
                    <h2 className="bento-header-element text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
                        Engineered for{" "}
                        <span className="text-[#d4af35]">
                            Excellence
                        </span>
                    </h2>
                    <p className="bento-header-element text-lg md:text-xl text-slate-400 font-normal leading-relaxed">
                        Experience a feature-rich, ultra-secure platform designed to give you the ultimate investment advantage without compromise.
                    </p>
                </div>

                <div className="bento-grid grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
                    {features.map((f) => {
                        const Icon = f.icon;
                        const Micro = f.MicroAnimation;
                        return (
                            <div
                                key={f.id}
                                className={`bento-card-premium ${f.col} bg-[#0A0A0A]/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 border border-white/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex flex-col justify-between group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(212,175,53,0.1)] hover:border-[#d4af35]/30 transition-all duration-500 relative overflow-hidden`}
                            >
                                {/* Immersive Subtle Gradient Hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#d4af35]/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0 pointer-events-none" />

                                <div className="w-16 h-16 bg-[#121212] border border-white/5 rounded-2xl flex items-center justify-center shadow-inner mb-6 group-hover:bg-[#d4af35] group-hover:border-[#d4af35] group-hover:shadow-[0_0_30px_rgba(212,175,53,0.3)] transition-all duration-500 relative z-20 overflow-hidden text-[#d4af35] group-hover:text-[#0A0A0A]">
                                    <Icon className="w-8 h-8 transition-transform duration-500 group-hover:scale-110" strokeWidth={1.5} />
                                </div>

                                <div className={`relative z-20 ${f.large ? "md:w-[60%]" : ""}`}>
                                    <h3 className={`font-black text-white mb-3 tracking-tight group-hover:text-[#d4af35] transition-colors duration-300 ${f.compact ? "text-xl" : "text-3xl"}`}>
                                        {f.title}
                                    </h3>
                                    <p className={`text-slate-400 font-normal leading-relaxed group-hover:text-slate-300 transition-colors duration-300 ${f.compact ? "text-[15px]" : "text-lg"}`}>
                                        {f.desc}
                                    </p>
                                </div>

                                {f.large && (
                                    <div className="absolute -right-10 -bottom-10 translate-x-1/4 translate-y-1/4 opacity-[0.02] group-hover:opacity-[0.05] group-hover:scale-110 transition-all duration-700 pointer-events-none z-0">
                                        <Icon className="w-80 h-80 text-white" />
                                    </div>
                                )}

                                {Micro && <Micro />}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
