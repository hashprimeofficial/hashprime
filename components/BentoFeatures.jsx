"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, Zap, HeadphonesIcon, HardHat, Radio, CheckCircle2 } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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
        title: "Workplace Safety & Standards",
        desc: "All site activities, high-voltage substations, and telecom tower structures strictly follow Indian Electricity Rules and NBC standards.",
        MicroAnimation: RadarAnimation,
    },
    {
        id: "telecom",
        col: "md:col-span-2",
        icon: Radio,
        title: "Carrier-Grade 99.99% Uptime",
        desc: "Turnkey electrical O&M, DG set backup management, and fiber restoration teams ensuring uninterrupted network operations.",
    },
    {
        id: "support",
        col: "md:col-span-2 lg:col-span-1",
        icon: HeadphonesIcon,
        title: "24/7 Field Response",
        desc: "Dedicated district zonal managers and emergency rapid response squads.",
        compact: true,
    },
    {
        id: "multisector",
        col: "md:col-span-2 lg:col-span-3",
        icon: HardHat,
        title: "Integrated Multi-Sector Execution",
        desc: "From commercial HVAC installations to dark fiber blowing, civil building foundations, and heavy machinery overhauls under one roof.",
        large: true,
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
        <section ref={sectionRef} className="relative bg-[#050505] py-20 md:py-32 overflow-hidden" id="bento-features">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="bento-header-element inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d4af35]/20 bg-[#d4af35]/5 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4af35] animate-pulse"></span>
                        <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#d4af35]">Engineering Highlights</span>
                    </div>
                    <h2 className="bento-header-element text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-6">
                        Built For Reliability &amp; <br />
                        <span className="text-[#d4af35]">Technical Excellence</span>
                    </h2>
                    <p className="bento-header-element text-slate-400 text-base md:text-lg">
                        Executing enterprise engineering, telecom connectivity, and civil infrastructure with unmatched precision.
                    </p>
                </div>

                <div className="bento-grid grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {features.map((feat) => {
                        const Icon = feat.icon;
                        const MicroAnimation = feat.MicroAnimation;
                        return (
                            <div
                                key={feat.id}
                                className={`bento-card-premium group relative bg-[#121212] border border-white/10 hover:border-[#d4af35]/40 rounded-3xl p-8 transition-all duration-500 overflow-hidden flex flex-col justify-between ${feat.col}`}
                            >
                                {MicroAnimation && <MicroAnimation />}
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center mb-6 group-hover:bg-[#d4af35] transition-colors duration-300">
                                        <Icon className="w-6 h-6 text-[#d4af35] group-hover:text-[#0A0A0A] transition-colors duration-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
