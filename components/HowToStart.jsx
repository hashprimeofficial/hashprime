"use client";

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UserPlus, Wallet, ArrowLeftRight } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function HowToStart() {
    const containerRef = useRef(null);

    const steps = [
        {
            num: "01",
            title: "Create an Account",
            desc: "Sign up in seconds using your email or Google account. Verify your identity instantly to unlock all features.",
            icon: <UserPlus className="w-8 h-8 text-white" />
        },
        {
            num: "02",
            title: "Fund Your Wallet",
            desc: "Deposit crypto or fiat easily via bank transfer, credit card, or P2P. Your funds are protected by industry-leading security.",
            icon: <Wallet className="w-8 h-8 text-white" />
        },
        {
            num: "03",
            title: "Start Trading",
            desc: "Dive into the markets. Buy, sell, and trade hundreds of assets instantly with our institutional-grade matching engine.",
            icon: <ArrowLeftRight className="w-8 h-8 text-white" />
        }
    ];

    useGSAP(() => {
        gsap.fromTo(
            ".step-header",
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 75%",
                }
            }
        );

        gsap.fromTo(
            ".step-card",
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".steps-grid",
                    start: "top 70%",
                }
            }
        );
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-32 bg-white relative overflow-hidden" id="how-to-start">
            {/* Decorative gradient sphere */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-gradient-to-r from-gray-100 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="step-header text-center max-w-3xl mx-auto mb-24 opacity-0">
                    <h2 className="text-5xl md:text-6xl font-black text-navy mb-6 tracking-tight drop-shadow-sm">
                        Start Trading in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-emerald-500 pb-2">Minutes</span>
                    </h2>
                    <p className="text-xl text-slate-500 font-medium">
                        Your journey to financial freedom begins with three simple steps.
                    </p>
                </div>

                <div className="steps-grid grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connector Line (visible only on desktop) */}
                    <div className="hidden md:block absolute top-[48px] left-[15%] right-[15%] h-0.5 bg-gray-200 z-0 border-[1px] border-dashed border-gray-300"></div>

                    {steps.map((step, index) => (
                        <div key={index} className="step-card opacity-0 relative z-10 flex flex-col items-center text-center group">
                            <div className="w-24 h-24 bg-navy rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-navy/20 relative group-hover:-translate-y-3 transition-transform duration-500 ease-out rotate-3 group-hover:rotate-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-[2rem]"></div>
                                {step.icon}
                                <div className="absolute -top-3 -right-3 w-10 h-10 bg-neon text-navy font-black rounded-xl flex items-center justify-center border-4 border-white text-sm shadow-md transition-transform duration-300 group-hover:scale-110">
                                    {step.num}
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-navy mb-4 group-hover:text-neon transition-colors duration-300">{step.title}</h3>
                            <p className="text-slate-600 font-medium leading-relaxed max-w-xs">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
