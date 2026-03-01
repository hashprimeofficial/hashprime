"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Briefcase, ShieldCheck, PieChart, HeadphonesIcon, ArrowUpRight } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const features = [
    {
        id: "diversified-crypto-portfolio",
        num: "01",
        title: "Diversified Crypto Portfolio",
        description: "Seamlessly manage stocks, commodities, and global equities in one unified interface. Hashprime simplifies complex investing.",
        icon: Briefcase,
        color: "from-blue-500/20 to-cyan-400/20"
    },
    {
        id: "robust-security-measures",
        num: "02",
        title: "Robust Security Measures",
        description: "Institutional-grade encryption and multi-layer authentication. Your assets are safeguarded by world-class security protocols.",
        icon: ShieldCheck,
        color: "from-[#39FF14]/20 to-emerald-400/20"
    },
    {
        id: "competitive-investment-options",
        num: "03",
        title: "Competitive Investment Options",
        description: "Access premium investment schemes with transparent fee structures. Maximize your growth potential with curated plans.",
        icon: PieChart,
        color: "from-purple-500/20 to-pink-400/20"
    },
    {
        id: "faster-customer-support",
        num: "04",
        title: "Fastest Customer Support",
        description: "Dedicated 24/7 expert support. Whether technical or account-related, we ensure your journey is always smooth.",
        icon: HeadphonesIcon,
        color: "from-orange-500/20 to-amber-400/20"
    }
];

export default function SalientFeatures() {
    const sectionRef = useRef(null);

    useGSAP(() => {
        // Subtle floating background elements
        gsap.to(".sf-orb", {
            y: "random(-20, 20)",
            x: "random(-20, 20)",
            duration: "random(3, 5)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        gsap.fromTo(".sf-header-animate",
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out",
                scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }
            }
        );

        gsap.fromTo(".sf-card-premium",
            { y: 60, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.2)",
                scrollTrigger: { trigger: ".sf-grid-premium", start: "top 85%" }
            }
        );
    }, { scope: sectionRef });

    const handleMouseMove = (e) => {
        const cards = sectionRef.current.querySelectorAll(".glow-card-premium");
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    };

    return (
        <section
            ref={sectionRef}
            onMouseMove={handleMouseMove}
            className="relative bg-white py-32 md:py-48 overflow-hidden"
            id="features"
        >
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="sf-orb absolute top-20 left-[10%] w-[400px] h-[400px] bg-[#39FF14]/5 rounded-full blur-[120px]" />
                <div className="sf-orb absolute bottom-20 right-[5%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px]" />
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'radial-gradient(#0B1120 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">

                {/* Header Section */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-24 md:mb-32">
                    <div className="flex flex-col items-start text-left lg:max-w-2xl">
                        <div className="sf-header-animate inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 shadow-sm mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39FF14] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39FF14]"></span>
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">The Ultimate Advantage</span>
                        </div>

                        <h2 className="sf-header-animate text-5xl md:text-8xl font-black text-[#0B1120] tracking-tighter leading-[0.9] mb-8">
                            ENGINEERED FOR<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B1120] via-[#0B1120]/80 to-[#39FF14]">EXCELLENCE</span>
                        </h2>

                        <p className="sf-header-animate text-lg md:text-xl text-slate-400 font-medium max-w-xl leading-relaxed">
                            Industry-leading infrastructure designed for precision, security, and institutional-grade performance.
                        </p>
                    </div>

                    <div className="sf-header-animate flex-shrink-0 w-full max-w-[320px] lg:max-w-none lg:w-[450px] aspect-square relative mx-auto lg:mx-0">
                        <div className="absolute inset-0 bg-[#39FF14]/5 rounded-full blur-[80px] animate-pulse" />
                        <DotLottieReact
                            src="https://lottie.host/8cdd7866-124a-49a2-841f-3774cb1686fb/Wa3EzgZqx3.lottie"
                            autoplay
                            loop
                            style={{ width: '100%', height: '100%' }}
                        />
                    </div>
                </div>

                {/* Grid Section */}
                <div className="sf-grid-premium grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.id}
                                className="sf-card-premium glow-card-premium group relative bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-[2.5rem] p-10 hover:border-[#39FF14]/40 transition-all duration-500 flex flex-col h-full shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(57,255,20,0.1)] overflow-hidden cursor-pointer"
                            >
                                {/* Background Accent Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                                {/* Cursor Glow */}
                                <div className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 transition duration-500 group-hover:opacity-100"
                                    style={{ background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(57,255,20,0.1), transparent 40%)' }} />

                                {/* Icon Wrapper */}
                                <div className="mb-10 relative z-10 transition-transform duration-500 group-hover:-translate-y-2">
                                    <div className="w-20 h-20 rounded-3xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:bg-[#39FF14] group-hover:border-[#39FF14] group-hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] transition-all duration-500">
                                        <Icon className="w-10 h-10 text-[#0B1120] transition-colors duration-500" strokeWidth={1.5} />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="mt-auto relative z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-4xl font-black text-slate-100 group-hover:text-[#0B1120]/5 transition-colors duration-500">
                                            {feature.num}
                                        </span>
                                        <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 bg-[#39FF14] p-2 rounded-full">
                                            <ArrowUpRight size={18} className="text-[#0B1120]" />
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-black text-[#0B1120] mb-4 tracking-tight">
                                        {feature.title}
                                    </h3>

                                    <p className="text-slate-400 font-medium leading-relaxed group-hover:text-slate-700 transition-colors duration-500">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Bottom Accent Line */}
                                <div className="absolute bottom-0 left-10 right-10 h-1 bg-[#39FF14] rounded-t-full opacity-0 group-hover:opacity-100 transform translate-y-full group-hover:translate-y-0 transition-all duration-500"></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
