"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, Lock, Eye, Server, FileCheck, BadgeCheck } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SecurityFeature = ({ icon: Icon, title, description, color }) => (
    <div className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 reveal-card">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-black text-navy mb-2">{title}</h3>
        <p className="text-slate-500 text-sm font-medium leading-relaxed">{description}</p>
    </div>
);

const FEATURES = [
    {
        icon: Lock,
        title: "End-to-End Encryption",
        description: "All data in transit and at rest is protected using AES-256 encryption — the same standard used by global banking institutions.",
        color: "bg-blue-500"
    },
    {
        icon: ShieldCheck,
        title: "JWT Authentication",
        description: "Every session is secured by a signed JSON Web Token with a 24-hour expiry, ensuring only you can access your account.",
        color: "bg-emerald-500"
    },
    {
        icon: Server,
        title: "Cold Wallet Storage",
        description: "95% of all digital assets are stored offline in geographically distributed cold wallets, unreachable by online threats.",
        color: "bg-purple-500"
    },
    {
        icon: Eye,
        title: "Constant Monitoring",
        description: "Our security infrastructure runs 24/7 anomaly detection and alerting to identify and neutralize suspicious activity in real-time.",
        color: "bg-rose-500"
    },
    {
        icon: FileCheck,
        title: "Regulatory Compliance",
        description: "We are built with GDPR and financial data protection standards in mind, ensuring your personal data is never sold or misused.",
        color: "bg-amber-500"
    },
    {
        icon: BadgeCheck,
        title: "Proven Track Record",
        description: "Zero security breaches since inception. Our team of security engineers performs quarterly penetration testing and audits.",
        color: "bg-cyan-500"
    },
];

const STATS = [
    { value: "0", label: "Security Breaches", suffix: "" },
    { value: "256", label: "Bit AES Encryption", suffix: "-" },
    { value: "95%", label: "Assets in Cold Storage", suffix: "" },
    { value: "24/7", label: "Active Monitoring", suffix: "" },
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
        <div ref={containerRef} className="min-h-screen bg-slate-50 text-slate-800 pt-32 pb-24 px-4 sm:px-6">
            {/* Background blobs */}
            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-emerald-100/60 via-transparent to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2 z-0" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Hero Header */}
                <div className="text-center mb-20">
                    <div className="reveal-text inline-flex items-center space-x-2 bg-white border border-slate-200 py-2 px-4 rounded-full mb-8 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">Bank-Grade Protection</span>
                    </div>
                    <h1 className="reveal-text text-5xl md:text-7xl font-black mb-6 tracking-tighter text-navy leading-none">
                        Uncompromising <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Security</span>
                    </h1>
                    <p className="reveal-text text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        Your capital and your data are protected by the same standards used by global financial institutions. Here's exactly how.
                    </p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
                    {STATS.map((stat) => (
                        <div key={stat.label} className="stat-item bg-white border border-slate-100 rounded-2xl p-6 text-center shadow-sm">
                            <div className="text-3xl font-black text-navy mb-1">{stat.suffix}{stat.value}</div>
                            <div className="text-slate-500 text-sm font-semibold">{stat.label}</div>
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
                <div className="bg-navy rounded-3xl p-10 md:p-14 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon/20 blur-3xl rounded-full pointer-events-none" />
                    <ShieldCheck className="w-14 h-14 text-neon mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4 relative z-10">Your Trust is Our Foundation</h2>
                    <p className="text-slate-300 font-medium max-w-xl mx-auto mb-8 relative z-10 leading-relaxed">
                        We have never experienced a security breach. We intend to keep it that way — through continuous investment in the best people, processes, and technology available.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center relative z-10">
                        <span className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded-full text-sm font-bold">✓ HTTPS Enforced</span>
                        <span className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded-full text-sm font-bold">✓ HttpOnly Cookies</span>
                        <span className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded-full text-sm font-bold">✓ CSRF Protected</span>
                        <span className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded-full text-sm font-bold">✓ XSS Hardened</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
