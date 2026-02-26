"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useSWR from "swr";
import Image from "next/image";
import { ArrowUpRight, ArrowDownRight, Activity, TrendingUp } from "lucide-react";

gsap.registerPlugin(useGSAP);

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function MarketsPage() {
    const containerRef = useRef(null);

    // Fetch top 10 cryptos using our secure backend proxy route
    const { data: cryptoData, error, isLoading } = useSWR(
        '/api/market?limit=10',
        fetcher,
        { refreshInterval: 15000 } // Refresh every 15s since markets move fast
    );

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

    useGSAP(() => {
        // Only run when data loads
        if (!isLoading && cryptoData && Array.isArray(cryptoData)) {
            gsap.fromTo(".market-row",
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.05,
                    ease: "power2.out",
                }
            );
        }
    }, [isLoading, cryptoData]);

    return (
        <div ref={containerRef} className="min-h-screen bg-slate-50 text-slate-800 pt-32 pb-24 px-4 sm:px-6 flex flex-col items-center">
            {/* Background branding */}
            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-neon/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2 z-0"></div>

            <div className="max-w-6xl mx-auto w-full relative z-10">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="reveal-text inline-flex items-center space-x-2 bg-white border border-slate-200 py-2 px-4 rounded-full mb-8 shadow-sm">
                        <Activity className="w-4 h-4 text-neon animate-pulse" />
                        <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">Live Global Markets</span>
                    </div>
                    <h1 className="reveal-text text-5xl md:text-7xl font-black mb-6 tracking-tighter text-navy leading-none">
                        Top Cryptocurrency <br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-[#32e512]">Prices</span>
                    </h1>
                    <p className="reveal-text text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        Track the top market movers in real-time. Deep liquidity and institutional-grade data accuracy.
                    </p>
                </div>

                {/* Data Table / List */}
                <div className="reveal-text bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">

                    {/* Table Header */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-5 bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <div className="col-span-1">Rank</div>
                        <div className="col-span-4">Asset</div>
                        <div className="col-span-3 text-right">Price</div>
                        <div className="col-span-2 text-right">24h Change</div>
                        <div className="col-span-2 text-right">Market Cap</div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="py-32 flex flex-col items-center justify-center space-y-4">
                            <div className="w-12 h-12 border-4 border-slate-100 border-t-neon rounded-full animate-spin"></div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm animate-pulse">Establishing Secure Connection...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="py-24 text-center">
                            <p className="text-red-500 font-bold mb-2">Error connecting to live market feed.</p>
                            <p className="text-slate-500 text-sm">Please try refreshing the page or check back later.</p>
                        </div>
                    )}

                    {/* Market Data */}
                    {cryptoData && Array.isArray(cryptoData) && (
                        <div className="divide-y divide-slate-100">
                            {cryptoData.map((coin, index) => {
                                // LiveCoinWatch delta.day represents the 24h multiplier (e.g. 1.05 = +5%, 0.95 = -5%)
                                const rawChange = coin.delta?.day;
                                const changePct = rawChange !== undefined ? (rawChange - 1) * 100 : 0;
                                const isPositive = changePct >= 0;

                                // Format currency helpers
                                const formatPrice = (price) => {
                                    if (price < 1) return `$${price.toFixed(4)}`;
                                    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
                                };

                                const formatMarketCap = (cap) => {
                                    if (!cap) return 'N/A';
                                    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
                                    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
                                    return `$${cap.toLocaleString()}`;
                                };

                                return (
                                    <div key={coin.code} className="market-row opacity-0 group flex flex-col md:grid md:grid-cols-12 gap-4 md:items-center px-4 md:px-8 py-5 hover:bg-slate-50/50 cursor-pointer transition-colors duration-300">

                                        {/* Mobile: Top Row */}
                                        <div className="flex justify-between items-center md:hidden mb-2">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-xs font-bold text-slate-400 bg-slate-100 w-6 h-6 rounded-full flex items-center justify-center">
                                                    {index + 1}
                                                </span>
                                                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                                                    {coin.png32 && <Image src={coin.png32} alt={coin.name || coin.code} fill className="object-cover" />}
                                                </div>
                                                <span className="font-bold text-navy">{coin.name || coin.code}</span>
                                                <span className="text-xs font-bold text-slate-400 px-2 py-0.5 bg-slate-100 rounded-md">{coin.code}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="font-black text-navy">{formatPrice(coin.rate)}</span>
                                                <div className={`flex items-center space-x-1 text-sm font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                    {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                                    <span>{Math.abs(changePct).toFixed(2)}%</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Desktop: Columns */}
                                        <div className="hidden md:flex col-span-1 items-center">
                                            <span className="text-sm font-bold text-slate-400 w-8 text-center">{index + 1}</span>
                                        </div>

                                        <div className="hidden md:flex col-span-4 items-center space-x-4">
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 group-hover:scale-110 transition-transform duration-300">
                                                {coin.png32 && <Image src={coin.png32} alt={coin.name || coin.code} fill className="object-cover p-1" />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-navy text-lg group-hover:text-neon transition-colors">{coin.name || coin.code}</div>
                                            </div>
                                            <div className="text-xs font-bold text-slate-500 px-2 py-1 bg-slate-100 rounded-md">{coin.code}</div>
                                        </div>

                                        <div className="hidden md:flex col-span-3 items-center justify-end">
                                            <span className="font-black text-navy text-lg group-hover:scale-105 transition-transform origin-right">{formatPrice(coin.rate)}</span>
                                        </div>

                                        <div className="hidden md:flex col-span-2 items-center justify-end">
                                            <div className={`flex items-center space-x-1 font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'} bg-${isPositive ? 'emerald' : 'rose'}-50 px-3 py-1.5 rounded-lg`}>
                                                {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                                <span>{Math.abs(changePct).toFixed(2)}%</span>
                                            </div>
                                        </div>

                                        <div className="hidden md:flex col-span-2 items-center justify-end">
                                            <span className="font-medium text-slate-500">{formatMarketCap(coin.cap)}</span>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
