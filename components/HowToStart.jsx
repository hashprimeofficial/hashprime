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
            icon: <UserPlus className="w-8 h-8 step-icon" />
        },
        {
            num: "02",
            title: "Fund Your Wallet",
            desc: "Deposit crypto or fiat easily via bank transfer, credit card, or P2P. Your funds are protected by industry-leading security.",
            icon: <Wallet className="w-8 h-8 step-icon" />
        },
        {
            num: "03",
            title: "Start Investing",
            desc: "Choose a scheme, select your amount, and confirm your investment. Watch your wealth grow in USDT.",
            icon: <ArrowLeftRight className="w-8 h-8 step-icon" />
        }
    ];

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".steps-container",
                start: "top 60%",
                end: "bottom 80%",
                scrub: 1,
            }
        });

        // Draw the line
        tl.fromTo(".progress-line",
            { scaleX: 0 },
            { scaleX: 1, ease: "none", duration: 2 }
            , 0);

        // Light up the icon containers and icons
        tl.to(".step-icon-container", {
            backgroundColor: "#0A0A0A", // Dark
            borderColor: "rgba(212, 175, 53, 0.5)",
            boxShadow: "0 25px 50px -12px rgba(212, 175, 53, 0.25)",
            stagger: 1,
            duration: 0.5,
            ease: "power2.out"
        }, 0);

        tl.to(".step-icon", {
            color: "#d4af35",
            stagger: 1,
            duration: 0.5,
        }, 0);

        tl.to(".step-num", {
            backgroundColor: "#d4af35",
            color: "#0A0A0A", // Dark
            borderColor: "#0A0A0A",
            scale: 1.1,
            stagger: 1,
            duration: 0.5,
            ease: "back.out(2)"
        }, 0);

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-32 bg-transparent relative overflow-hidden" id="how-to-start">
            <div className="absolute top-1/2 left-0 w-[800px] h-[800px] bg-[#d4af35] opacity-[0.03] rounded-full blur-[150px] pointer-events-none -translate-y-1/2 -translate-x-1/2 z-0"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="step-header text-center max-w-3xl mx-auto mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d4af35]/20 bg-[#d4af35]/5 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4af35] animate-pulse"></span>
                        <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#d4af35]">Onboarding</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-sm">
                        Start Investing in <span className="text-[#d4af35] pb-2">Minutes</span>
                    </h2>
                    <p className="text-xl text-slate-400 font-normal">
                        Your journey to financial freedom begins with three simple steps.
                    </p>
                </div>

                <div className="steps-container relative">
                    {/* Background Track Line */}
                    <div className="hidden md:block absolute top-[48px] left-[16.66%] right-[16.66%] h-[1px] bg-white/5 z-0 overflow-hidden">
                        {/* Animated Progress Line */}
                        <div className="progress-line absolute top-0 left-0 h-full w-full bg-gradient-to-r from-[#d4af35]/0 via-[#d4af35] to-[#d4af35]/0 origin-left scale-x-0"></div>
                    </div>

                    <div className="steps-grid grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                        {steps.map((step, index) => (
                            <div key={index} className="step-card relative flex flex-col items-center text-center group">
                                <div className="step-icon-container w-24 h-24 bg-[#0A0A0A] border border-white/5 rounded-[2rem] flex items-center justify-center mb-8 relative group-hover:-translate-y-3 transition-all duration-500 ease-out z-10 shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#d4af35]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]"></div>
                                    {step.icon}
                                    <div className="step-num absolute -top-3 -right-3 w-10 h-10 bg-[#0A0A0A] text-slate-500 font-black rounded-xl flex items-center justify-center border border-white/5 text-sm transition-all duration-500 font-display">
                                        {step.num}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-[#d4af35] transition-colors duration-300">{step.title}</h3>
                                <p className="text-slate-400 font-normal leading-relaxed max-w-xs group-hover:text-slate-300 transition-colors duration-300">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
