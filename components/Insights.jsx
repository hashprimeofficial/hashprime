"use client";

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Clock } from 'lucide-react';
import Image from 'next/image';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Insights() {
    const containerRef = useRef(null);

    const articles = [
        {
            id: 1,
            category: "Analysis",
            title: "Bitcoin breaks critical resistance: What's next for the bull run?",
            date: "Oct 24, 2026",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=2069&auto=format&fit=crop"
        },
        {
            id: 2,
            category: "Product Update",
            title: "Introducing Hashprime Futures V2: Lower latency, higher leverage",
            date: "Oct 22, 2026",
            readTime: "3 min read",
            image: "https://images.unsplash.com/photo-1621501103258-3e9a4c8a2b0e?q=80&w=1974&auto=format&fit=crop"
        },
        {
            id: 3,
            category: "Ecosystem",
            title: "The rise of Solana DeFi: Top protocols to watch this cycle",
            date: "Oct 18, 2026",
            readTime: "7 min read",
            image: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=2064&auto=format&fit=crop"
        }
    ];

    useGSAP(() => {
        gsap.fromTo(
            ".insight-header",
            { y: 40, opacity: 0 },
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

        gsap.fromTo(
            ".insight-card",
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".insights-grid",
                    start: "top 75%",
                }
            }
        );
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-24 bg-gray-50 border-t border-gray-100" id="insights">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="insight-header flex flex-col md:flex-row md:items-end justify-between mb-16 opacity-0">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-black text-navy mb-4 tracking-tight">
                            Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-green-500">Insights</span>
                        </h2>
                        <p className="text-lg text-slate-500 font-medium">
                            Stay ahead of the curve with expert market analysis and platform updates.
                        </p>
                    </div>
                    <button className="hidden md:flex items-center space-x-2 text-navy font-bold hover:text-neon transition-colors group">
                        <span>View all articles</span>
                        <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                </div>

                <div className="insights-grid grid grid-cols-1 md:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <div key={article.id} className="insight-card opacity-0 bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm group hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                            <div className="relative h-56 w-full overflow-hidden">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-navy text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                    {article.category}
                                </div>
                            </div>

                            <div className="p-8 flex flex-col flex-grow">
                                <h3 className="text-xl font-black text-navy mb-4 group-hover:text-neon transition-colors line-clamp-2">
                                    {article.title}
                                </h3>

                                <div className="mt-auto flex items-center justify-between text-slate-400 text-sm font-semibold">
                                    <div className="flex items-center space-x-4">
                                        <span>{article.date}</span>
                                        <div className="flex items-center space-x-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{article.readTime}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="md:hidden mt-8 w-full flex justify-center items-center space-x-2 text-navy font-bold py-4 rounded-xl border-2 border-slate-100 hover:border-neon hover:text-neon transition-colors">
                    <span>View all articles</span>
                    <ArrowUpRight className="w-5 h-5" />
                </button>
            </div>
        </section>
    );
}
