"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TrendingUp, ArrowRight, ShieldCheck, Clock, Layers, Globe2 } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const schemes = [
    {
        id: "short-term",
        title: "Short-Term Income",
        desc: "Focused short-term plan offering time-bound returns with lower risk strategies.",
        icon: Clock
    },
    {
        id: "balanced",
        title: "Balanced Growth",
        desc: "Moderate plan aimed at consistent, balanced returns through diversified portfolios.",
        icon: Layers
    },
    {
        id: "long-term",
        title: "Long-Term Wealth",
        desc: "Growth-oriented plan designed for multi-year horizons emphasizing disciplined compounding.",
        icon: TrendingUp,
        featured: true
    },
    {
        id: "global",
        title: "Global Exposure",
        desc: "Diversified plan providing access to international markets and global currencies.",
        icon: Globe2
    }
];

export default function InvestmentSchemes() {
    const sectionRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo(".is-header-animate",
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out",
                scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }
            }
        );
        gsap.fromTo(".is-card-premium",
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "back.out(1.2)",
                scrollTrigger: { trigger: ".is-grid-premium", start: "top 85%" }
            }
        );
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative bg-transparent py-32 md:py-48 overflow-hidden border-t border-white/[0.02]" id="investment-schemes">

            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#d4af35]/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#d4af35]/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-24">
                    <div className="is-header-animate inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#121212] border border-white/10 shadow-sm mb-8">
                        <TrendingUp className="w-4 h-4 text-[#d4af35]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af35]">Structured Yield</span>
                    </div>

                    <h2 className="is-header-animate text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8">
                        SMART INVESTMENT<br />
                        <span className="text-[#d4af35]">PLANS FOR YOUR WEALTH</span>
                    </h2>

                </div>

                {/* Grid */}
                <div className="is-grid-premium grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                    {schemes.map((scheme) => {
                        const Icon = scheme.icon;
                        return (
                            <div key={scheme.id} className={`is-card-premium group relative bg-[#121212] border rounded-[3rem] p-10 md:p-14 
                                                        hover:border-[#d4af35]/40 hover:shadow-[0_30px_60px_rgba(0,0,0,0.05)] transition-all duration-500 flex flex-col h-full overflow-hidden
                                                        ${scheme.featured ? 'border-[#d4af35]/40 shadow-lg' : 'border-white/10/60'}`}>

                                {/* Glassmorphic Accent */}
                                <div className="absolute top-0 right-0 w-48 h-48 bg-[#d4af35]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#d4af35]/20 transition-all duration-700" />

                                <div className="relative z-10 flex-grow flex flex-col">
                                    {/* Header Row */}
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-16 h-16 rounded-2xl bg-[#121212] border border-white/5 flex items-center justify-center shadow-sm group-hover:bg-[#d4af35] group-hover:border-[#d4af35] transition-all duration-500">
                                            <Icon className="w-8 h-8 text-white group-hover:text-[#0A0A0A] transition-colors duration-500" strokeWidth={1.5} />
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-[#121212]/5 flex items-center justify-center group-hover:bg-[#d4af35] transition-all duration-500">
                                            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#0A0A0A] -rotate-45 group-hover:rotate-0 transition-all duration-500" />
                                        </div>
                                    </div>

                                    <h3 className="text-3xl font-black text-white tracking-tight mb-4 group-hover:text-[#d4af35] transition-colors">{scheme.title}</h3>

                                    <p className="text-slate-400 font-normal leading-relaxed text-lg group-hover:text-slate-300 transition-colors">
                                        {scheme.desc}
                                    </p>

                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Note */}
                <div className="mt-16 text-center text-slate-500 text-sm max-w-3xl mx-auto is-header-animate italic border-t border-white/5 pt-8">
                    Note: Plan terms, durations, and fixed returns are subject to conditions. Investors should read plan documentation carefully before investing.
                </div>
            </div>
        </section>
    );
}
