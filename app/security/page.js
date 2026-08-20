"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, Lock, Eye, Server, FileCheck, HardHat } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SecurityFeature = ({ icon: Icon, title, description, color }) => (
    <div className="group bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 reveal-card">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-black text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm font-medium leading-relaxed">{description}</p>
    </div>
);

const FEATURES = [
    {
        icon: Lock,
        title: "Client Data Encryption",
        description: "All client documentation, contracts, and engineering blueprints are secured with AES-256 encryption at rest and in transit.",
        color: "bg-blue-500"
    },
    {
        icon: ShieldCheck,
        title: "Secure Session Authentication",
        description: "Platform accounts utilize signed, time-limited JSON Web Tokens and strict HttpOnly cookie security protocols.",
        color: "bg-emerald-500"
    },
    {
        icon: HardHat,
        title: "Site Safety Governance",
        description: "All field operations, tower climbing, and high-voltage grid works strictly follow Indian Electricity Rules & NBC safety directives.",
        color: "bg-amber-500"
    },
    {
        icon: Eye,
        title: "Continuous Uptime Monitoring",
        description: "Telecom infrastructure sites and electrical installations are monitored with real-time alerting to prevent downtime.",
        color: "bg-rose-500"
    },
    {
        icon: FileCheck,
        title: "Statutory & Privacy Compliance",
        description: "Built in adherence with the Information Technology Act and Indian Digital Personal Data Protection (DPDP) standards.",
        color: "bg-purple-500"
    },
    {
        icon: Server,
        title: "Infrastructure Redundancy",
        description: "Cloud-hosted services utilize geographically distributed backups with multi-factor administrative access controls.",
        color: "bg-cyan-500"
    },
];

const STATS = [
    { value: "99.99%", label: "Telecom SLA Uptime", suffix: "" },
    { value: "256", label: "Bit AES Encryption", suffix: "-" },
    { value: "100%", label: "Site Safety Adherence", suffix: "" },
    { value: "24/7", label: "Operational Monitoring", suffix: "" },
];

export default function SecurityPage() {
    const containerRef = useRef(null);

    useGSAP(() => {
        gsap.from(".reveal-text", {
            y: 50, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.2
        });
        gsap.from(".stat-item", {
            y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.5
        });
    }, { scope: containerRef });

    useGSAP(() => {
        gsap.fromTo(".reveal-card",
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out",
                scrollTrigger: { trigger: ".cards-grid", start: "top 75%" }
            }
        );
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="min-h-screen bg-[#121212]/5 text-slate-100 pt-32 pb-24 px-4 sm:px-6">
            {/* Background blobs */}
            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-[#d4af35]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2 z-0" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Hero Header */}
                <div className="text-center mb-20">
                    <div className="reveal-text inline-flex items-center space-x-2 bg-[#121212] border border-white/10 py-2 px-4 rounded-full mb-8 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-[#d4af35] animate-pulse" />
                        <span className="text-sm font-bold text-slate-200 uppercase tracking-widest">Operational & Data Standards</span>
                    </div>
                    <h1 className="reveal-text text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white leading-none">
                        Industrial & Digital <br />
                        <span className="text-[#d4af35]">Security</span>
                    </h1>
                    <p className="reveal-text text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                        From physical on-site engineering safety to digital client confidentiality, integrity and reliability guide all our operations.
                    </p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
                    {STATS.map((stat) => (
                        <div key={stat.label} className="stat-item bg-[#121212] border border-white/5 rounded-2xl p-6 text-center shadow-sm">
                            <div className="text-3xl font-black text-white mb-1">{stat.suffix}{stat.value}</div>
                            <div className="text-slate-400 text-sm font-semibold">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Feature Cards */}
                <div className="cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                    {FEATURES.map((feature) => (
                        <SecurityFeature key={feature.title} {...feature} />
                    ))}
                </div>

                {/* Trust Banner */}
                <div className="bg-[#121212] border border-[#d4af35]/30 rounded-3xl p-10 md:p-14 text-center relative overflow-hidden shadow-2xl">
                    <ShieldCheck className="w-14 h-14 text-[#d4af35] mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4 relative z-10">Integrity and Operational Safety</h2>
                    <p className="text-slate-300 font-medium max-w-xl mx-auto mb-8 relative z-10 leading-relaxed">
                        We adhere to continuous safety engineering, rigorous contractor vetting, and industry-standard digital privacy protocols.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center relative z-10">
                        <span className="bg-[#0A0A0A] text-[#d4af35] border border-[#d4af35]/30 px-4 py-2 rounded-full text-sm font-bold">✓ HTTPS Enforced</span>
                        <span className="bg-[#0A0A0A] text-[#d4af35] border border-[#d4af35]/30 px-4 py-2 rounded-full text-sm font-bold">✓ HttpOnly Cookies</span>
                        <span className="bg-[#0A0A0A] text-[#d4af35] border border-[#d4af35]/30 px-4 py-2 rounded-full text-sm font-bold">✓ CSRF & XSS Hardened</span>
                        <span className="bg-[#0A0A0A] text-[#d4af35] border border-[#d4af35]/30 px-4 py-2 rounded-full text-sm font-bold">✓ On-Site Safety Certified</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
