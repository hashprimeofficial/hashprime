
"use client";

import { ShieldCheck, Zap, Headphones, Coins } from 'lucide-react';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function BentoFeatures() {
    const containerRef = useRef(null);

    useGSAP(() => {
        // Header animation
        gsap.fromTo(
            ".bento-header",
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            }
        );

        // Cards staggered animation
        gsap.fromTo(
            ".bento-card",
            { y: 60, opacity: 0, scale: 0.95 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".bento-grid",
                    start: "top 75%",
                }
            }
        );

        // Subtle parallax for the giant coin icon
        gsap.to(".giant-coin", {
            y: -40,
            ease: "none",
            scrollTrigger: {
                trigger: ".bento-card-large",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-24 bg-white" id="features">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bento-header text-center max-w-3xl mx-auto mb-16 opacity-0">
                    <h2 className="text-4xl md:text-5xl font-black text-navy mb-6 tracking-tight">
                        Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-green-500">Excellence</span>
                    </h2>
                    <p className="text-lg text-slate-500 font-medium">
                        Experience a feature-rich, ultra-secure platform designed to give you the ultimate trading advantage.
                    </p>
                </div>

                <div className="bento-grid grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[280px]">
                    {/* Large Card 1 */}
                    <div className="bento-card opacity-0 md:col-span-2 bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between group hover:-translate-y-2 hover:shadow-lg transition-all duration-300">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-neon group-hover:text-navy transition-colors duration-300">
                            <ShieldCheck className="w-7 h-7 text-neon group-hover:text-navy transition-colors duration-300" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-navy mb-3">Bank-Grade Security</h3>
                            <p className="text-slate-500 font-medium leading-relaxed group-hover:text-slate-700 transition-colors">
                                Sleep soundly knowing your assets are protected by industry-leading encryption, advanced 2FA, and robust cold-storage solutions.
                            </p>
                        </div>
                    </div>

                    {/* Large Card 2 */}
                    <div className="bento-card opacity-0 md:col-span-2 bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between group hover:-translate-y-2 hover:shadow-lg transition-all duration-300">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-neon group-hover:text-navy transition-colors duration-300">
                            <Zap className="w-7 h-7 text-neon group-hover:text-navy transition-colors duration-300" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-navy mb-3">Zero-Friction Trading</h3>
                            <p className="text-slate-500 font-medium leading-relaxed group-hover:text-slate-700 transition-colors">
                                Maximize our profits with our hyper-competitive fee structure. Trade more, pay less and keep what you earn.
                            </p>
                        </div>
                    </div>

                    {/* Small Card 1 */}
                    <div className="bento-card opacity-0 md:col-span-2 lg:col-span-1 bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between group hover:-translate-y-2 hover:shadow-lg transition-all duration-300">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-neon group-hover:text-navy transition-colors duration-300">
                            <Headphones className="w-7 h-7 text-neon group-hover:text-navy transition-colors duration-300" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-navy mb-2">24/7 Lightning Support</h3>
                            <p className="text-slate-500 font-medium text-sm group-hover:text-slate-700 transition-colors">
                                Expert assistance at your fingertips, anytime you need.
                            </p>
                        </div>
                    </div>

                    {/* Large Card 3 */}
                    <div className="bento-card opacity-0 bento-card-large md:col-span-2 lg:col-span-3 bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between group hover:-translate-y-2 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                        <div className="relative z-10 w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-neon group-hover:text-navy transition-colors duration-300">
                            <Coins className="w-7 h-7 text-neon group-hover:text-navy transition-colors duration-300" />
                        </div>
                        <div className="relative z-10 md:w-2/3">
                            <h3 className="text-2xl font-black text-navy mb-3">Unlimited Asset Access</h3>
                            <p className="text-slate-500 font-medium leading-relaxed group-hover:text-slate-700 transition-colors">
                                Dive into a massive ocean of liquidity with hundreds of active pairs. From Bitcoin to the newest altcoins, your portfolio knows no bounds.
                            </p>
                        </div>
                        <div className="giant-coin absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-[0.03] group-hover:text-neon group-hover:opacity-[0.05] transition-all duration-500 pointer-events-none">
                            <Coins className="w-64 h-64 text-navy" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
