"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, Zap, Headphones, Coins } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const features = [
    {
        id: "security",
        col: "md:col-span-2",
        icon: ShieldCheck,
        title: "Bank-Grade Security",
        desc: "Sleep soundly knowing your assets are protected by industry-leading encryption, advanced 2FA, and robust cold-storage solutions.",
    },
    {
        id: "investing",
        col: "md:col-span-2",
        icon: Zap,
        title: "Zero-Friction Investing",
        desc: "Maximize your returns with our hyper-competitive fee structure. Invest more, pay less and keep what you earn.",
    },
    {
        id: "support",
        col: "md:col-span-2 lg:col-span-1",
        icon: Headphones,
        title: "24/7 Lightning Support",
        desc: "Expert assistance at your fingertips, anytime you need.",
        compact: true,
    },
    {
        id: "assets",
        col: "md:col-span-2 lg:col-span-3",
        icon: Coins,
        title: "Unlimited Asset Access",
        desc: "Dive into a massive ocean of liquidity with hundreds of active pairs. From Bitcoin to the newest altcoins, your portfolio knows no bounds.",
        large: true,
    },
];

export default function BentoFeatures() {
    const sectionRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo(".bento-header",
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
                scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }
            }
        );

        gsap.fromTo(".bento-card",
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.2)",
                scrollTrigger: { trigger: ".bento-grid", start: "top 80%" }
            }
        );
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="py-24 bg-white" id="features">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="bento-header text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-6xl font-black text-navy mb-6 tracking-tight leading-tight">
                        Engineered for{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-emerald-500">
                            Excellence
                        </span>
                    </h2>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed">
                        Experience a feature-rich, ultra-secure platform designed to give you the ultimate investment advantage.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="bento-grid grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[280px]">
                    {features.map((f) => {
                        const Icon = f.icon;
                        return (
                            <div
                                key={f.id}
                                className={`bento-card ${f.col} bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between group hover:-translate-y-2 hover:shadow-xl hover:border-gray-200 transition-all duration-300 relative overflow-hidden`}
                            >
                                {/* Icon */}
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-[#39FF14] transition-colors duration-300 relative z-10">
                                    <Icon className="w-7 h-7 text-[#39FF14] group-hover:text-navy transition-colors duration-300" />
                                </div>

                                {/* Text */}
                                <div className={`relative z-10 ${f.large ? "md:w-2/3" : ""}`}>
                                    <h3 className={`font-black text-navy mb-3 ${f.compact ? "text-xl" : "text-2xl"}`}>
                                        {f.title}
                                    </h3>
                                    <p className={`text-slate-500 font-medium leading-relaxed group-hover:text-slate-700 transition-colors ${f.compact ? "text-sm" : ""}`}>
                                        {f.desc}
                                    </p>
                                </div>

                                {/* Giant bg icon for "large" card */}
                                {f.large && (
                                    <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-500 pointer-events-none">
                                        <Icon className="w-64 h-64 text-navy" />
                                    </div>
                                )}

                                {/* Hover glow shimmer */}
                                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-[#39FF14]/5 to-transparent"></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
