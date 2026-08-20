"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Briefcase, ShieldCheck, CheckCircle2, HeadphonesIcon, ArrowUpRight, Wrench } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const features = [
    {
        id: "multi-sector-engineering",
        num: "01",
        title: "Multi-Sector Engineering Capacity",
        description: "Seamlessly bridging telecom networks, power grids, civil construction, and commercial HVAC under one unified delivery engine.",
        icon: Wrench,
        color: "bg-[#d4af35]/5"
    },
    {
        id: "robust-safety-qa",
        num: "02",
        title: "Stringent Safety & QA Protocols",
        description: "Strict adherence to Indian Electricity Rules, National Building Code standards, and calibrated OTDR fiber diagnostic audits.",
        icon: ShieldCheck,
        color: "bg-[#d4af35]/5"
    },
    {
        id: "sla-transparency",
        num: "03",
        title: "Milestone-Based SLA Governance",
        description: "Transparent commercial contracting, rigorous project management milestones, and verifiable completion certificates.",
        icon: CheckCircle2,
        color: "bg-[#d4af35]/5"
    },
    {
        id: "district-field-support",
        num: "04",
        title: "24/7 District Field Support",
        description: "Dedicated zonal operations managers and rapid-deployment squads stationed across South India for emergency maintenance.",
        icon: HeadphonesIcon,
        color: "bg-[#d4af35]/5"
    }
];

export default function SalientFeatures() {
    const sectionRef = useRef(null);

    useGSAP(() => {
        gsap.to(".sf-orb", {
            y: "random(-20, 20)",
            x: "random(-20, 20)",
            duration: "random(3, 5)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        gsap.fromTo(".sf-header-animate",
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out",
                scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }
            }
        );

        gsap.fromTo(".sf-card-premium",
            { y: 60, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.2)",
                scrollTrigger: { trigger: ".sf-grid-premium", start: "top 85%" }
            }
        );
    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            className="relative bg-[#121212] py-16 md:py-24 overflow-hidden"
            id="features"
        >
            <div className="absolute inset-0 pointer-events-none">
                <div className="sf-orb absolute top-20 left-[10%] w-[400px] h-[400px] bg-[#d4af35]/5 rounded-full blur-[120px]" />
                <div className="sf-orb absolute bottom-20 right-[5%] w-[500px] h-[500px] bg-[#d4af35]/10 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="sf-header-animate inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d4af35]/20 bg-[#d4af35]/5 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4af35] animate-pulse"></span>
                        <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#d4af35]">Core Advantages</span>
                    </div>
                    <h2 className="sf-header-animate text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-6">
                        Engineering Excellence <br />
                        <span className="text-[#d4af35]">Delivered Nationwide</span>
                    </h2>
                    <p className="sf-header-animate text-slate-400 text-base md:text-lg">
                        Why national telecom carriers, commercial developers, and institutional enterprises partner with Hashprime.
                    </p>
                </div>

                <div className="sf-grid-premium grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {features.map((feat) => {
                        const Icon = feat.icon;
                        return (
                            <div
                                key={feat.id}
                                className="sf-card-premium group relative bg-[#0A0A0A] border border-white/10 hover:border-[#d4af35]/40 rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-[#141414] border border-white/10 flex items-center justify-center group-hover:bg-[#d4af35] transition-colors duration-300">
                                            <Icon className="w-6 h-6 text-[#d4af35] group-hover:text-[#0A0A0A] transition-colors duration-300" />
                                        </div>
                                        <span className="text-xs font-mono font-bold text-[#d4af35]">{feat.num}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">{feat.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-6">{feat.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
