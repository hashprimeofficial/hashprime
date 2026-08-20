"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, Wind, HardHat, Globe2, ArrowRight } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const verticals = [
    {
        id: "telecom",
        title: "Telecom & Fiber Infrastructure",
        desc: "Turnkey site deployment, optical fiber blowing & fusion splicing, tower foundation, and 24/7 electrical O&M.",
        icon: Zap,
        href: "/total-telecom-services"
    },
    {
        id: "hvac",
        title: "Commercial & Residential HVAC",
        desc: "End-to-end sales, multi-brand installation, preventive jet servicing, and industrial cooling maintenance.",
        icon: Wind,
        href: "/ac-sales-and-service"
    },
    {
        id: "construction",
        title: "Civil Construction & Real Estate",
        desc: "Institutional engineering, structural builds, turnkey project contracting, and localized property advisory.",
        icon: HardHat,
        href: "/construction-and-works",
        featured: true
    },
    {
        id: "machinery-trading",
        title: "Heavy Machinery & Enterprise Trading",
        desc: "Industrial machinery servicing, heavy vehicle maintenance, and global commodity sourcing logistics.",
        icon: Globe2,
        href: "/mechanical-machinery-services"
    }
];

export default function EngineeringVerticals() {
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
        <section ref={sectionRef} className="relative bg-transparent py-24 md:py-32 overflow-hidden border-t border-white/[0.02]" id="infrastructure-pillars">

            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#d4af35]/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#d4af35]/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20">
                    <div className="is-header-animate inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#121212] border border-white/10 shadow-sm mb-6">
                        <HardHat className="w-4 h-4 text-[#d4af35]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af35]">Core Divisions</span>
                    </div>

                    <h2 className="is-header-animate text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
                        INTEGRATED ENGINEERING<br />
                        <span className="text-[#d4af35]">SOLUTIONS &amp; INFRASTRUCTURE</span>
                    </h2>
                    <p className="is-header-animate text-slate-400 text-base md:text-lg max-w-2xl">
                        Explore our multi-sector capabilities across telecommunications, power utilities, civil development, and industrial logistics.
                    </p>
                </div>

                {/* Grid */}
                <div className="is-grid-premium grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {verticals.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.id} className={`is-card-premium group relative bg-[#121212] border rounded-3xl p-8 md:p-10 flex flex-col justify-between transition-all duration-300 ${item.featured ? 'border-[#d4af35]/40 shadow-lg' : 'border-white/10 hover:border-[#d4af35]/30'}`}>
                                <div>
                                    <div className="w-14 h-14 rounded-2xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center mb-6 group-hover:bg-[#d4af35] group-hover:border-[#d4af35] transition-colors duration-300">
                                        <Icon className="w-7 h-7 text-[#d4af35] group-hover:text-[#0A0A0A] transition-colors duration-300" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-8">{item.desc}</p>
                                </div>
                                <Link href={item.href} className="inline-flex items-center gap-2 text-sm font-bold text-[#d4af35] hover:text-white transition-colors">
                                    Explore Division Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
