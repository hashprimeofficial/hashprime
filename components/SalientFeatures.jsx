"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Briefcase, ShieldCheck, PieChart, HeadphonesIcon } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const features = [
    {
        id: "diversified-crypto-portfolio",
        title: "Diversified Crypto Portfolio",
        description: "Whether you are a beginner or a pro-level trader, Hashprime is a user-friendly and easy-to-navigate app for a smooth and hassle-free crypto trading journey.",
        icon: Briefcase,
    },
    {
        id: "robust-security-measures",
        title: "Robust Security Measures",
        description: "Hashprime implements state-of-the-art security protocols such as two-factor authentication (2FA), cold storage for cryptos, and encrypted data transmission for securing the data and funds of the users.",
        icon: ShieldCheck,
    },
    {
        id: "competitive-trading-fees",
        title: "Competitive Trading Fees",
        description: "Hashprime offers competitive and transparent fee structures to attract traders from all backgrounds, fostering an inclusive trading community, allowing traders to maximize their profits.",
        icon: PieChart,
    },
    {
        id: "faster-customer-support",
        title: "Fastest Customer Support",
        description: "Whether it's a technical support call or an account-related query, our dedicated support team is committed to providing prompt and effective solutions to improve the overall user experience.",
        icon: HeadphonesIcon,
    }
];

export default function SalientFeatures() {
    const sectionRef = useRef(null);

    useGSAP(() => {
        // Text Reveal
        gsap.fromTo(".sf-text-reveal",
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                }
            }
        );

        // Card Stagger - relying on autoAlpha for better browser render behavior
        gsap.fromTo(".sf-card",
            { y: 50, autoAlpha: 0 },
            {
                y: 0,
                autoAlpha: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".sf-grid",
                    start: "top 80%",
                }
            }
        );

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative bg-white py-32 overflow-hidden" id="features">
            {/* Background Branding Elements */}
            <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-[0.03] overflow-hidden flex items-center justify-center">
                <Image src="/logoonly.png" alt="Brand Watermark" width={1000} height={1000} className="w-[120%] max-w-none opacity-50 grayscale" />
            </div>

            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#39FF14] opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8 border-b border-slate-100 pb-12">
                    <div className="max-w-2xl">
                        <div className="sf-text-reveal inline-flex items-center space-x-2 bg-slate-50 border border-slate-200 py-2 px-4 rounded-full mb-6">
                            <span className="w-2 h-2 rounded-full bg-navy"></span>
                            <span className="text-sm font-bold text-navy tracking-widest uppercase">Platform Excellence</span>
                        </div>
                        <h2 className="sf-text-reveal text-5xl md:text-7xl font-black text-navy tracking-tighter leading-[1.1]">
                            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy to-[#39FF14]">Hashprime</span> Advantage.
                        </h2>
                    </div>
                    <div className="max-w-md sf-text-reveal">
                        <p className="text-xl text-slate-500 font-medium leading-relaxed">
                            Cutting-edge infrastructure designed specifically for seasoned professionals and ambitious enthusiasts.
                        </p>
                    </div>
                </div>

                {/* Features Grid - New Approach */}
                <div className="sf-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.id}
                                className="sf-card group relative bg-white border border-slate-200 rounded-3xl p-8 hover:bg-navy transition-colors duration-500 flex flex-col h-full shadow-sm hover:shadow-2xl hover:shadow-navy/20"
                            >
                                <div className="mb-12">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-[#39FF14]/10 group-hover:border-[#39FF14]/20 transition-colors duration-500">
                                        <Icon className="w-8 h-8 text-navy group-hover:text-[#39FF14] transition-colors duration-500" />
                                    </div>
                                </div>

                                <div className="mt-auto relative z-10">
                                    <span className="block text-5xl font-black text-slate-100 group-hover:text-white/10 mb-6 transition-colors duration-500">
                                        0{index + 1}
                                    </span>
                                    <h3 className="text-2xl font-bold text-navy group-hover:text-white mb-4 transition-colors duration-500">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-500 group-hover:text-slate-300 font-medium leading-relaxed transition-colors duration-500">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Bottom Accent Line */}
                                <div className="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-[#39FF14] to-emerald-400 rounded-t-md opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500"></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
