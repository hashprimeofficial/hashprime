"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, ArrowRight, Wrench, Zap, CheckCircle2 } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const serviceModels = [
    {
        id: "quarterly-om",
        title: "Preventive O&M SLA",
        period: "Quarterly Review",
        duration: "90 Days",
        metric: "99.9% Uptime",
        metricLabel: "Service Level Agreement",
        features: ["Scheduled Generator Servicing", "AC Filter & Coil Jet Cleaning", "Optical Fiber Loss Audits", "24/7 Priority Emergency Support"],
    },
    {
        id: "biannual-infrastructure",
        title: "Commercial Infrastructure SLA",
        period: "Biannual Care",
        duration: "180 Days",
        metric: "Turnkey Maintenance",
        metricLabel: "Complete Facility Care",
        features: ["Comprehensive HVAC Overhauls", "Substation & Transformer Checks", "Telecom Tower Structural Audits", "Detailed Compliance Reports"],
    },
    {
        id: "annual-turnkey",
        title: "Enterprise Turnkey Contract",
        period: "Annual Contract",
        duration: "365 Days",
        metric: "Dedicated Squads",
        metricLabel: "Dedicated Project Managers",
        features: ["End-to-End Civil & Electrical Works", "Rapid 2-Hour SLA Response", "Material Quality Assurance", "Dedicated District Lead Oversight"],
        featured: true
    },
    {
        id: "multiyear-partnership",
        title: "Multi-Year Enterprise Partner",
        period: "Strategic Long-Term",
        duration: "3 - 5 Years",
        metric: "Institutional Scope",
        metricLabel: "Large-Scale Deployments",
        features: ["Smart City & Fiber Backbone Rollout", "Multi-Site Tower & Grid Management", "Custom Infrastructure Engineering", "Executive Nodal Account Manager"],
    },
];

export default function DetailedSchemes() {
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
        <section ref={sectionRef} className="relative bg-transparent py-24 md:py-32 overflow-hidden border-t border-white/[0.02]" id="service-models">

            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#d4af35]/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#d4af35]/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20">
                    <div className="is-header-animate inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#121212] border border-white/10 shadow-sm mb-6">
                        <Wrench className="w-4 h-4 text-[#d4af35]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af35]">Execution Models</span>
                    </div>

                    <h2 className="is-header-animate text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
                        Enterprise Service & <br />
                        <span className="text-[#d4af35]">Operations & Maintenance Models</span>
                    </h2>
                    <p className="is-header-animate text-slate-400 text-base md:text-lg max-w-2xl">
                        Structured, SLA-governed contracting models designed for telecom operators, corporate facilities, and infrastructure developers.
                    </p>
                </div>

                {/* Grid */}
                <div className="is-grid-premium grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {serviceModels.map((item) => (
                        <div key={item.id} className={`is-card-premium group relative bg-[#121212] border rounded-3xl p-8 md:p-10 flex flex-col justify-between transition-all duration-300 ${item.featured ? 'border-[#d4af35]/50 shadow-[0_0_40px_rgba(212,175,53,0.1)]' : 'border-white/10 hover:border-[#d4af35]/30'}`}>
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-xs font-bold text-[#d4af35] uppercase tracking-wider bg-[#d4af35]/10 px-3 py-1 rounded-full">{item.period}</span>
                                    <span className="text-xs text-slate-400 font-medium">{item.duration}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                                <div className="my-6 p-4 rounded-2xl bg-[#0A0A0A] border border-white/5">
                                    <div className="text-2xl font-black text-white">{item.metric}</div>
                                    <div className="text-xs text-slate-400 mt-1">{item.metricLabel}</div>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {item.features.map((feat, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                            <CheckCircle2 className="w-4 h-4 text-[#d4af35] shrink-0" />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Link href="/hash-prime-groups" className="inline-flex items-center justify-center gap-2 w-full bg-[#1e1e1e] hover:bg-[#d4af35] text-white hover:text-[#0A0A0A] font-bold py-3 px-6 rounded-xl transition-colors duration-300 text-sm">
                                View Business Division <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
