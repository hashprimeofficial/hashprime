"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TrendingUp, Clock, ArrowRight } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Count down to next scheme opening (hardcoded next month opening)
function useCountdown(targetDate) {
    const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
    useEffect(() => {
        const tick = () => {
            const diff = targetDate - Date.now();
            if (diff <= 0) { setTimeLeft({ d: 0, h: 0, m: 0, s: 0 }); return; }
            setTimeLeft({
                d: Math.floor(diff / 86400000),
                h: Math.floor((diff % 86400000) / 3600000),
                m: Math.floor((diff % 3600000) / 60000),
                s: Math.floor((diff % 60000) / 1000),
            });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [targetDate]);
    return timeLeft;
}

const schemes = [
    {
        id: "three-month",
        title: "3 Month Scheme",
        duration: "90 Days",
        benefit: "18%",
        benefitCurrency: "USD",
        investments: ["50K", "1L", "3L", "5L"],
        // Opens 1st of next month
        nextOpen: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).getTime(),
    },
    {
        id: "six-month",
        title: "6 Month Scheme",
        duration: "180 Days",
        benefit: "38%",
        benefitCurrency: "USD",
        investments: ["1L", "3L", "5L"],
        // Opens in 15 days
        nextOpen: Date.now() + 15 * 86400000,
    }
];

function CountdownDisplay({ targetDate }) {
    const { d, h, m, s } = useCountdown(targetDate);
    const units = [
        { label: "D", val: d },
        { label: "H", val: h },
        { label: "M", val: m },
        { label: "S", val: s },
    ];
    return (
        <div className="flex items-center space-x-2">
            {units.map(({ label, val }, i) => (
                <div key={i} className="flex flex-col items-center">
                    <span className="text-2xl font-black text-navy tabular-nums leading-none">
                        {String(val).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
                </div>
            ))}
        </div>
    );
}

export default function InvestmentSchemes() {
    const sectionRef = useRef(null);
    const [hoveredTier, setHoveredTier] = useState(null);

    useGSAP(() => {
        gsap.fromTo(".is-text-reveal",
            { y: 30, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out",
                scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
            }
        );
        gsap.fromTo(".is-card",
            { y: 50, autoAlpha: 0 },
            {
                y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.15, ease: "power2.out",
                scrollTrigger: { trigger: ".is-grid", start: "top 80%" }
            }
        );
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative bg-slate-50 py-32 overflow-hidden border-t border-slate-200" id="investment-schemes">
            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col items-center">
                    <div className="is-text-reveal inline-flex items-center space-x-2 bg-white border border-slate-200 py-2 px-4 rounded-full mb-6 shadow-sm">
                        <TrendingUp className="w-4 h-4 text-navy" />
                        <span className="text-sm font-bold text-navy tracking-widest uppercase">Wealth Generation</span>
                    </div>
                    <h2 className="is-text-reveal text-5xl md:text-7xl font-black text-navy tracking-tighter leading-tight mb-6">
                        Elite Investment <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy to-[#39FF14]">Structures</span>
                    </h2>
                    <p className="is-text-reveal text-xl text-slate-500 font-medium leading-relaxed">
                        Accelerate your portfolio growth with our precisely engineered, high-yield investment structures spanning multiple lock-in periods.
                    </p>
                </div>

                {/* Grid */}
                <div className="is-grid grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {schemes.map((scheme) => (
                        <div key={scheme.id} className="is-card group bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl hover:border-[#39FF14]/50 transition-all duration-500 flex flex-col relative">
                            {/* Top Accent Bar */}
                            <div className="h-2 w-full bg-slate-100 group-hover:bg-[#39FF14] transition-colors duration-500"></div>

                            <div className="p-8 md:p-10 flex-grow flex flex-col bg-white">
                                {/* Badge row */}
                                <div className="flex justify-between items-center mb-10">
                                    <div className="inline-flex items-center space-x-2 bg-slate-50 border border-slate-100 py-2 px-4 rounded-xl">
                                        <Clock className="w-5 h-5 text-navy" />
                                        <span className="font-bold text-navy">{scheme.duration} Lock</span>
                                    </div>
                                    <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center bg-white group-hover:bg-navy group-hover:border-navy transition-colors duration-500">
                                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-500" />
                                    </div>
                                </div>

                                {/* Title + Return */}
                                <div className="mb-8">
                                    <h3 className="text-3xl font-black text-navy mb-4 tracking-tight">{scheme.title}</h3>
                                    <div className="flex items-end space-x-2">
                                        <span className="text-7xl font-black text-navy leading-none tracking-tighter">{scheme.benefit}</span>
                                        <span className="text-xl font-bold text-slate-500 pb-2">Return / {scheme.benefitCurrency}</span>
                                    </div>
                                </div>

                                {/* Countdown Timer */}
                                <div className="mb-8 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col space-y-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Next Scheme Opens In</span>
                                    <CountdownDisplay targetDate={scheme.nextOpen} />
                                </div>

                                {/* Divider */}
                                <div className="w-full h-[1px] bg-slate-100 mb-8"></div>

                                {/* Tiers */}
                                <div className="mt-auto">
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Investment Tiers</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {scheme.investments.map((inv, idx) => {
                                            const uid = `${scheme.id}-${idx}`;
                                            return (
                                                <div
                                                    key={idx}
                                                    onMouseEnter={() => setHoveredTier(uid)}
                                                    onMouseLeave={() => setHoveredTier(null)}
                                                    className={`py-3 px-6 rounded-xl border-2 font-black text-lg transition-all duration-300 cursor-default select-none
                                                    ${hoveredTier === uid ? 'border-navy bg-navy text-[#39FF14] -translate-y-1' : 'border-slate-100 bg-slate-50 text-navy'}`}
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
