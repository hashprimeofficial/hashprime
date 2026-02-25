"use client";

import Link from 'next/link';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function Navbar() {
    const ctaRef = useRef(null);
    const containerRef = useRef(null);

    useGSAP(() => {
        // Reveal animation
        gsap.fromTo(
            containerRef.current,
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );

        // Magnetic effect
        const xTo = gsap.quickTo(ctaRef.current, "x", { duration: 0.4, ease: "power3" });
        const yTo = gsap.quickTo(ctaRef.current, "y", { duration: 0.4, ease: "power3" });

        const mouseMove = (e) => {
            const { clientX, clientY } = e;
            const { height, width, left, top } = ctaRef.current.getBoundingClientRect();
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);
            xTo(x * 0.2);
            yTo(y * 0.2);
        };

        const mouseLeave = () => {
            xTo(0);
            yTo(0);
        };

        ctaRef.current.addEventListener("mousemove", mouseMove);
        ctaRef.current.addEventListener("mouseleave", mouseLeave);

        return () => {
            if (ctaRef.current) {
                ctaRef.current.removeEventListener("mousemove", mouseMove);
                ctaRef.current.removeEventListener("mouseleave", mouseLeave);
            }
        };
    }, { scope: containerRef });

    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 w-full">
            <header ref={containerRef} className="w-full max-w-5xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg shadow-navy/5 rounded-full px-6 transition-all duration-300">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-black tracking-tight text-navy">
                            Hashprime
                        </Link>
                    </div>
                    <nav className="hidden md:flex space-x-8">
                        <Link href="#markets" className="text-sm font-bold text-slate-500 hover:text-navy transition-colors">Markets</Link>
                        <Link href="#features" className="text-sm font-bold text-slate-500 hover:text-navy transition-colors">Features</Link>
                        <Link href="#security" className="text-sm font-bold text-slate-500 hover:text-navy transition-colors">Security</Link>
                        <Link href="#company" className="text-sm font-bold text-slate-500 hover:text-navy transition-colors">Company</Link>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <Link href="/login" className="hidden md:block text-sm font-bold text-slate-500 hover:text-navy transition-colors">
                            Log In
                        </Link>
                        <div ref={ctaRef} className="inline-block p-2 -m-2">
                            <Link href="/register" className="bg-navy text-white px-5 py-2 rounded-full text-sm font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}
