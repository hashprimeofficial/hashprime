"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SalientFeatures from '@/components/SalientFeatures';

gsap.registerPlugin(useGSAP);

export default function FeaturesPage() {
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
        <div ref={containerRef} className="min-h-screen bg-slate-50 text-slate-800 pt-32 flex flex-col items-center">
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-100/50 via-transparent to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 -translate-x-1/4"></div>
            <div className="w-full relative z-10 px-6 max-w-7xl mx-auto mb-20 text-center">
                <h1 className="reveal-text text-6xl md:text-8xl font-black mb-8 tracking-tighter text-slate-900 leading-none mt-12">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Everything</span> Built In.
                </h1>
                <p className="reveal-text text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                    Designed from the ground up to give you the ultimate trading advantage.
                </p>
            </div>

            <div className="w-full">
                <SalientFeatures />
            </div>
        </div>
    );
}
