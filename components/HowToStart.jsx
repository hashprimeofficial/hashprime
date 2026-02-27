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
            backgroundColor: "#0f172a", // Navy
            borderColor: "rgba(57, 255, 20, 0.5)",
            boxShadow: "0 25px 50px -12px rgba(57, 255, 20, 0.25)",
            stagger: 1,
            duration: 0.5,
            ease: "power2.out"
        }, 0);

        tl.to(".step-icon", {
            color: "#39FF14",
            stagger: 1,
            duration: 0.5,
        }, 0);

        tl.to(".step-num", {
            backgroundColor: "#39FF14",
            color: "#0f172a", // Navy
            borderColor: "#ffffff",
            scale: 1.1,
            stagger: 1,
            duration: 0.5,
            ease: "back.out(2)"
        }, 0);

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-32 bg-white relative overflow-hidden" id="how-to-start">
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-gradient-to-r from-gray-100 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="step-header text-center max-w-3xl mx-auto mb-24">
                    <h2 className="text-5xl md:text-6xl font-black text-navy mb-6 tracking-tight drop-shadow-sm">
                        Start Investing in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-emerald-500 pb-2">Minutes</span>
                    </h2>
                    <p className="text-xl text-slate-500 font-medium">
                        Your journey to financial freedom begins with three simple steps.
                    </p>
                </div>

                <div className="steps-container relative">
                    {/* Background Track Line */}
                    <div className="hidden md:block absolute top-[48px] left-[16.66%] right-[16.66%] h-1.5 bg-slate-100 z-0 rounded-full overflow-hidden">
                        {/* Animated Progress Line */}
                        <div className="progress-line absolute top-0 left-0 h-full w-full bg-gradient-to-r from-[#39FF14] to-emerald-500 origin-left scale-x-0"></div>
                    </div>

                    <div className="steps-grid grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                        {steps.map((step, index) => (
                            <div key={index} className="step-card relative flex flex-col items-center text-center group">
                                <div className="step-icon-container w-24 h-24 bg-slate-100 border-2 border-slate-200 rounded-[2rem] flex items-center justify-center mb-8 relative group-hover:-translate-y-3 transition-transform duration-500 ease-out z-10">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-[2rem]"></div>
                                    {step.icon}
                                    <div className="step-num absolute -top-3 -right-3 w-10 h-10 bg-slate-200 text-slate-400 font-black rounded-xl flex items-center justify-center border-4 border-white text-sm transition-transform duration-300">
                                        {step.num}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-navy mb-4">{step.title}</h3>
                                <p className="text-slate-600 font-medium leading-relaxed max-w-xs">
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
