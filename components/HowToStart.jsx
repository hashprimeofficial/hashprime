"use client";

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileText, ClipboardCheck, Wrench } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function HowToStart() {
    const containerRef = useRef(null);

    const steps = [
        {
            num: "01",
            title: "Submit Project Scope",
            desc: "Share your civil site parameters, telecom layout blueprints, or HVAC and machinery maintenance requirements.",
            icon: <FileText className="w-8 h-8 step-icon" />
        },
        {
            num: "02",
            title: "Engineering Audit & SLA",
            desc: "Our technical leads assess feasibility, material sourcing, structural safety, and SLA timelines.",
            icon: <ClipboardCheck className="w-8 h-8 step-icon" />
        },
        {
            num: "03",
            title: "Turnkey Execution",
            desc: "End-to-end deployment with qualified site supervisors, certified safety standards, and milestone reporting.",
            icon: <Wrench className="w-8 h-8 step-icon" />
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
            backgroundColor: "#0A0A0A",
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
            color: "#0A0A0A",
            borderColor: "#0A0A0A",
            scale: 1.1,
            stagger: 1,
            duration: 0.5,
            ease: "back.out(2)"
        }, 0);

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-8 md:py-12 bg-transparent relative overflow-hidden" id="how-to-start">
            <div className="absolute top-1/2 left-0 w-[800px] h-[800px] bg-[#d4af35] opacity-[0.03] rounded-full blur-[150px] pointer-events-none -translate-y-1/2 -translate-x-1/2 z-0"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="step-header text-center max-w-3xl mx-auto mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d4af35]/20 bg-[#d4af35]/5 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4af35] animate-pulse"></span>
                        <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#d4af35]">Execution Flow</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-sm">
                        Turnkey Project <span className="text-[#d4af35] pb-2">Delivery</span>
                    </h2>
                    <p className="text-xl text-slate-400 font-normal">
                        Our structured engagement model ensures rigorous quality, safety, and on-time commissioning.
                    </p>
                </div>

                <div className="steps-container relative">
                    {/* Background Track Line */}
                    <div className="hidden md:block absolute top-[48px] left-[16.66%] right-[16.66%] h-[1px] bg-white/5 z-0 overflow-hidden">
                        {/* Animated Progress Line */}
                        <div className="progress-line w-full h-full bg-[#d4af35] origin-left scale-x-0"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                        {steps.map((step, idx) => (
                            <div key={idx} className="step-card flex flex-col items-center text-center">
                                <div className="relative mb-8">
                                    <div className="step-icon-container w-24 h-24 rounded-3xl bg-[#121212] border border-white/10 flex items-center justify-center text-slate-400 transition-all duration-300 shadow-lg">
                                        {step.icon}
                                    </div>
                                    <div className="step-num absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#1a1a1a] border border-white/20 text-white font-black text-xs flex items-center justify-center transition-all duration-300">
                                        {step.num}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{step.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
