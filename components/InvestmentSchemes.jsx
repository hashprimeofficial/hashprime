"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TrendingUp, ArrowRight, ShieldCheck } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const schemes = [
    {
        id: "three-month",
        title: "Balanced Growth",
        period: "3 Month Scheme",
        duration: "90 Days",
        benefit: "18%",
        benefitCurrency: "USD",
        investments: ["50K", "1L", "3L", "5L"],
    },
    {
        id: "six-month",
        title: "Elite Performance",
        period: "6 Month Scheme",
        duration: "180 Days",
        benefit: "38%",
        benefitCurrency: "USD",
        investments: ["1L", "3L", "5L"],
    },
    {
        id: "one-year",
        title: "Pro Capitalist",
        period: "1 Year Scheme",
        duration: "365 Days",
        benefit: "80%",
        benefitCurrency: "USD",
        investments: ["Min 5L"],
        featured: true
    },
    {
        id: "five-year",
        title: "Legacy Wealth",
        period: "5 Year Scheme",
        duration: "5 Years",
        benefit: "500%",
        benefitCurrency: "USD",
        investments: ["10L to 50L"],
    }
];

export default function InvestmentSchemes() {
    const sectionRef = useRef(null);
    const [hoveredTier, setHoveredTier] = useState(null);

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
        <section ref={sectionRef} className="relative bg-[#F9FAFB] py-32 md:py-48 overflow-hidden border-t border-slate-100" id="investment-schemes">

            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#39FF14]/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-24">
                    <div className="is-header-animate inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8">
                        <TrendingUp className="w-4 h-4 text-[#39FF14]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Structured Yield</span>
                    </div>

                    <h2 className="is-header-animate text-5xl md:text-8xl font-black text-[#0B1120] tracking-tighter leading-[0.9] mb-8">
                        INVESTMENT<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B1120] via-[#0B1120]/80 to-[#39FF14]">STRUCTURES</span>
                    </h2>

                    <p className="is-header-animate text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
                        Fixed-term alpha strategies designed for high-conviction capital allocation. Institutional yields, democratized.
                    </p>
                </div>

                {/* Grid */}
                <div className="is-grid-premium grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                    {schemes.map((scheme) => (
                        <div key={scheme.id} className={`is-card-premium group relative bg-white border rounded-[3rem] p-10 md:p-14 
                                                        hover:border-[#39FF14]/40 hover:shadow-[0_30px_60px_rgba(0,0,0,0.05)] transition-all duration-500 flex flex-col h-full overflow-hidden
                                                        ${scheme.featured ? 'border-[#39FF14]/40 shadow-lg' : 'border-slate-200/60'}`}>

                            {/* Glassmorphic Accent */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-[#39FF14]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#39FF14]/20 transition-all duration-700" />

                            <div className="relative z-10 flex-grow flex flex-col">
                                {/* Header Row */}
                                <div className="flex justify-between items-start mb-14">
                                    <div className="flex flex-col gap-2">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
                                            <ShieldCheck className="w-3.5 h-3.5 text-[#39FF14]" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{scheme.duration} Lock</span>
                                        </div>
                                        <h3 className="text-4xl font-black text-[#0B1120] tracking-tight">{scheme.title}</h3>
                                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{scheme.period}</span>
                                    </div>
                                    <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#39FF14] transition-all duration-500">
                                        <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-[#0B1120] -rotate-45 group-hover:rotate-0 transition-all duration-500" />
                                    </div>
                                </div>

                                {/* Yield Section */}
                                <div className="mb-14 border-l-4 border-[#39FF14] pl-8">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-8xl font-black text-[#0B1120] leading-none tracking-tighter">{scheme.benefit}</span>
                                        <span className="text-2xl font-black text-slate-400 mb-2">ROI</span>
                                    </div>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest mt-2">Target Returns / {scheme.benefitCurrency}</p>
                                </div>

                                {/* Tiers */}
                                <div className="mt-auto">
                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Investment Thresholds</h4>
                                    <div className="flex flex-wrap gap-4">
                                        {scheme.investments.map((inv, idx) => {
                                            const uid = `${scheme.id}-${idx}`;
                                            return (
                                                <div
                                                    key={idx}
                                                    onMouseEnter={() => setHoveredTier(uid)}
                                                    onMouseLeave={() => setHoveredTier(null)}
                                                    className={`py-4 px-8 rounded-2xl border-2 font-black text-xl transition-all duration-500 cursor-default
                                                    ${hoveredTier === uid ? 'border-[#0B1120] bg-[#0B1120] text-[#39FF14] shadow-xl -translate-y-1' : 'border-slate-100 bg-white text-slate-400'}`}
                                                >{inv}</div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
