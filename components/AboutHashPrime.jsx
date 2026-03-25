"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, BarChart, FileText, Globe, Users, Award } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const features = [
    { title: "Diversified investment strategy", icon: BarChart },
    { title: "Disciplined portfolio management", icon: ShieldCheck },
    { title: "Transparent reporting for investors", icon: FileText }
];

const stats = [
    { value: "7+", label: "Years of Experience", desc: "Manage investor wealth", icon: Award },
    { value: "₹500M+", label: "AUM", desc: "Assets Under Management", icon: BarChart },
    { value: "5000+", label: "Investors", desc: "Trusted by many", icon: Users }
];

export default function AboutHashPrime() {
    const sectionRef = useRef(null);

    useGSAP(() => {
        // Entry animations for header elements
        gsap.fromTo(".ah-header-animate",
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out",
                scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }
            }
        );

        // Entry animations for stats cards
        gsap.fromTo(".ah-card-premium",
            { y: 60, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.2)",
                scrollTrigger: { trigger: ".ah-grid-premium", start: "top 85%" }
            }
        );
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative bg-[#050505] py-8 md:py-12 overflow-hidden" id="about">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Fixed Background Image Layer */}
                <div
                    className="about-parallax-bg absolute inset-0 opacity-[0.35] mix-blend-screen"
                    style={{
                        backgroundImage: 'url("/bg.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundAttachment: 'fixed'
                    }}
                />

                <div className="absolute top-20 right-[10%] w-[400px] h-[400px] bg-[#d4af35]/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-20 left-[5%] w-[500px] h-[500px] bg-[#d4af35]/15 rounded-full blur-[150px]" />
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'radial-gradient(#d4af35 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">

                {/* Header Section */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-24 md:mb-32">
                    <div className="flex flex-col items-start text-left lg:max-w-2xl">
                        <div className="ah-header-animate inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#121212]/5 border border-[#d4af35]/20 shadow-sm mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af35] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4af35]"></span>
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af35]">About Us</span>
                        </div>
                        <h2 className="ah-header-animate text-5xl md:text-7xl font-black text-white tracking-tight leading-[1] mb-8">
                            About<br />
                            <span className="text-[#d4af35]">HashPrime</span>
                        </h2>

                        <p className="ah-header-animate text-lg md:text-xl text-slate-400 font-normal max-w-xl leading-relaxed mb-10">
                            HashPrime is an asset management company focused on diversified portfolios for long-term growth investors seeking long-term financial markets opportunity.
                        </p>
                        <div className="ah-header-animate flex flex-col gap-4">
                            {features.map((feature, i) => {
                                const Icon = feature.icon;
                                return (
                                    <div key={i} className="flex items-center gap-4 text-white">
                                        <div className="w-10 h-10 rounded-full bg-[#d4af35]/10 flex items-center justify-center border border-[#d4af35]/20">
                                            <Icon className="w-5 h-5 text-[#d4af35]" />
                                        </div>
                                        <span className="text-lg font-bold">{feature.title}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="ah-header-animate flex-shrink-0 w-full lg:max-w-[500px] relative mx-auto lg:mx-0">
                        {/* Stats Grid right side */}
                        <div className="ah-grid-premium grid grid-cols-1 gap-6">
                            {stats.map((stat, i) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={i} className="ah-card-premium relative bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex items-center gap-8 hover:border-[#d4af35]/40 hover:shadow-[0_10px_30px_rgba(212,175,53,0.1)] transition-all duration-500 overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#d4af35]/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                                        <div className="w-16 h-16 rounded-2xl bg-[#0A0A0A] border border-white/5 flex items-center justify-center relative z-10 group-hover:bg-[#d4af35] transition-all duration-500">
                                            <Icon className="w-8 h-8 text-[#d4af35] group-hover:text-[#0A0A0A] transition-colors" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="text-4xl font-black text-white mb-1 tracking-tighter">{stat.value}</div>
                                            <div className="text-sm font-bold text-[#d4af35] uppercase tracking-wider mb-1">{stat.label}</div>
                                            <div className="text-slate-400 text-sm">{stat.desc}</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
