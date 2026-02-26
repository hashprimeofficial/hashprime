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
        <div ref={containerRef} className="min-h-screen bg-white text-slate-800 pt-32 px-6 flex flex-col items-center">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-purple-100/50 via-transparent to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
            <div className="max-w-4xl mx-auto w-full text-center relative z-10">
                <div className="reveal-text inline-flex items-center space-x-2 bg-slate-50 border border-slate-200 py-2 px-4 rounded-full mb-8">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                    <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">About Hashprime</span>
                </div>
                <h1 className="reveal-text text-6xl md:text-8xl font-black mb-8 tracking-tighter text-slate-900 leading-none">
                    Building the <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Future of Finance</span>
                </h1>
                <p className="reveal-text text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed mb-16">
                    Our mission is to create a fair, competitive, and highly secure digital asset market for investors of all sizes.
                </p>
            </div>
        </div>
    );
}
