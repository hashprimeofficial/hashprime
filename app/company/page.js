"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function CompanyPage() {
    const containerRef = useRef(null);

    useGSAP(() => {
        gsap.from(".reveal-text", {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            delay: 0.2
        });
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="min-h-screen bg-[#121212] text-slate-100 pt-32 px-6 flex flex-col items-center">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#d4af35]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
            <div className="max-w-4xl mx-auto w-full text-center relative z-10">
                <div className="reveal-text inline-flex items-center space-x-2 bg-[#121212]/5 border border-white/10 py-2 px-4 rounded-full mb-8">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                    <span className="text-sm font-bold text-slate-200 uppercase tracking-widest">About Hashprime</span>
                </div>
                <h1 className="reveal-text text-6xl md:text-8xl font-black mb-8 tracking-tighter text-white leading-none">
                    Building the <br /> <span className="text-[#d4af35]">Future of Infrastructure</span>
                </h1>
                <p className="reveal-text text-xl md:text-2xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed mb-12">
                    {"Hashprime is a multi-service engineering and infrastructure company dedicated to delivering reliable, innovative, and high-quality solutions across the telecom, electrical, construction, real estate, and technology sectors..."}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left mt-8 mb-16">
                    <div className="reveal-text p-8 rounded-3xl bg-[#1a1a1a]/50 border border-white/10 backdrop-blur-sm">
                        <h2 className="text-[#d4af35] text-2xl font-black mb-4 uppercase tracking-wider">Our Mission</h2>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            {"To deliver dependable engineering, infrastructure, and technology solutions..."}
                        </p>
                    </div>
                    <div className="reveal-text p-8 rounded-3xl bg-[#1a1a1a]/50 border border-white/10 backdrop-blur-sm">
                        <h2 className="text-[#d4af35] text-2xl font-black mb-4 uppercase tracking-wider">Our Vision</h2>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            {"To be recognized as one of India's most trusted engineering and technology companies..."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
