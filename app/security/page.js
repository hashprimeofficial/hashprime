"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function SecurityPage() {
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
        <div ref={containerRef} className="min-h-screen bg-slate-50 text-slate-800 pt-32 px-6 flex flex-col items-center">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-emerald-100/50 via-transparent to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
            <div className="max-w-4xl mx-auto w-full text-center relative z-10">
                <div className="reveal-text inline-flex items-center space-x-2 bg-white border border-slate-200 py-2 px-4 rounded-full mb-8 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">Bank Grade Protection</span>
                </div>
                <h1 className="reveal-text text-6xl md:text-8xl font-black mb-8 tracking-tighter text-slate-900 leading-none">
                    Uncompromising <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Security</span>
                </h1>
                <p className="reveal-text text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed mb-16">
                    Sleep soundly knowing 95% of digital assets are stored offline in geographically distributed cold wallets.
                </p>
            </div>
        </div>
    );
}
