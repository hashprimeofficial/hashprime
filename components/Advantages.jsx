"use client";

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChartBar, Lock, Globe, ArrowRight } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Advantages() {
    const containerRef = useRef(null);
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        {
            id: 0,
            title: "Advanced Trading Engine",
            icon: <ChartBar className="w-5 h-5 mb-2" />,
            content: "Experience ultra-fast execution with our proprietary matching engine handling up to 1.5 million transactions per second. Never miss a market movement again.",
            image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop"
        },
        {
            id: 1,
            title: "Ironclad Security",
            icon: <Lock className="w-5 h-5 mb-2" />,
            content: "Your assets are safeguarded by military-grade encryption, 95% cold storage policy, and rigorous real-time risk management protocols.",
            image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop"
        },
        {
            id: 2,
            title: "Global Liquidity",
            icon: <Globe className="w-5 h-5 mb-2" />,
            content: "Access deep liquidity pools aggregated from top-tier providers worldwide, ensuring minimal slippage even on large volume trades.",
            image: "https://images.unsplash.com/photo-1639762681485-074b7f4aec4a?q=80&w=2070&auto=format&fit=crop"
        }
    ];

    useGSAP(() => {
        gsap.fromTo(
            ".adv-header",
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
            ".adv-content",
            { x: -30, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".adv-grid",
                    start: "top 70%",
                }
            }
        );

        gsap.fromTo(
            ".adv-image",
            { x: 30, opacity: 0, scale: 0.95 },
            {
                x: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".adv-grid",
                    start: "top 70%",
                }
            }
        );

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-24 bg-gray-50 border-t border-gray-100" id="advantages">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="adv-header text-center max-w-3xl mx-auto mb-16 opacity-0">
                    <h2 className="text-4xl md:text-5xl font-black text-navy mb-6 tracking-tight">
                        The Hashprime <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-green-500">Advantage</span>
                    </h2>
                    <p className="text-lg text-slate-500 font-medium">
                        Discover why millions of traders choose us to navigate the crypto ecosystem.
                    </p>
                </div>

                <div className="adv-grid grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    <div className="adv-content opacity-0 flex flex-col space-y-6">
                        <div className="flex space-x-4 border-b border-gray-200 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex flex-col items-start px-4 py-3 rounded-t-xl transition-all whitespace-nowrap ${activeTab === tab.id
                                            ? 'border-b-2 border-neon text-navy bg-white shadow-sm'
                                            : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                                        }`}
                                >
                                    <span className={`${activeTab === tab.id ? 'text-neon' : ''}`}>
                                        {tab.icon}
                                    </span>
                                    <span className="font-bold text-sm tracking-wide">{tab.title}</span>
                                </button>
                            ))}
                        </div>

                        <div className="min-h-[150px]">
                            <h3 className="text-3xl font-black text-navy mb-4">{tabs[activeTab].title}</h3>
                            <p className="text-lg text-slate-500 leading-relaxed mb-8">
                                {tabs[activeTab].content}
                            </p>
                            <button className="flex items-center space-x-2 text-navy font-bold hover:text-neon transition-colors group">
                                <span>Learn more about {tabs[activeTab].title.toLowerCase()}</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    <div className="adv-image opacity-0 relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
                        {/* Using a standard img tag here since it's an external dynamic Unsplash source without knowing exact dimensions to fit, but object-cover handles it beautifully */}
                        <img
                            src={tabs[activeTab].image}
                            alt={tabs[activeTab].title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent"></div>
                    </div>

                </div>
            </div>
        </section>
    );
}
