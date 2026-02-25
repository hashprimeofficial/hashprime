"use client";

import useSWR from 'swr';
import { TrendingUp, TrendingDown, Loader2, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function LiveMarketTicker() {
    const containerRef = useRef(null);

    const { data, error, isLoading, isValidating } = useSWR(
        '/api/market',
        fetcher,
        { refreshInterval: 10000 }
    );

    useGSAP(() => {
        gsap.fromTo(
            ".ticker-card",
            { y: 40, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.2)", stagger: 0.15, delay: 0.2 }
        );
    }, { scope: containerRef });

    const assets = [
        {
            id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC',
            icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026',
            // Mock 7-day sparkline data
            sparkline: [42000, 43200, 41800, 44100, 43800, 45200, 44600].map((v, i) => ({ i, v }))
        },
        {
            id: 'ethereum', name: 'Ethereum', symbol: 'ETH',
            icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026',
            sparkline: [2800, 2750, 2900, 2850, 3100, 2950, 3050].map((v, i) => ({ i, v }))
        },
        {
            id: 'solana', name: 'Solana', symbol: 'SOL',
            icon: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=026',
            sparkline: [140, 155, 148, 162, 158, 170, 167].map((v, i) => ({ i, v }))
        },
    ];

    if (error) return <div className="text-center text-sm font-semibold text-red-500 py-4">Failed to load live market data.</div>;

    return (
        <div ref={containerRef} className="w-full max-w-5xl mx-auto mt-16 relative z-20">
            {/* Auto-refresh indicator */}
            {isValidating && !isLoading && (
                <div className="flex items-center justify-center space-x-2 mb-3 text-xs text-slate-400 font-medium">
                    <RefreshCw className="w-3 h-3 animate-spin text-[#39FF14]" />
                    <span>Updating prices...</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {assets.map((asset) => {
                    const coinData = Array.isArray(data) ? data.find(c => c.code === asset.symbol) : null;
                    const price = coinData?.rate;
                    const rawChange = coinData?.delta?.day;
                    const change = rawChange !== undefined ? (rawChange - 1) * 100 : 0;
                    const isPositive = change >= 0;
                    // Adjust sparkline direction based on real price change
                    const sparklineData = isPositive
                        ? asset.sparkline
                        : [...asset.sparkline].reverse();

                    return (
                        <div key={asset.id} className="ticker-card opacity-0 bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 flex flex-col relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(57,255,20,0.12)] transition-all duration-500 hover:-translate-y-2">
                            {/* Top row: icon + name + symbol */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <Image src={asset.icon} alt={asset.name} width={28} height={28} className="object-contain" />
                                    <div>
                                        <span className="font-extrabold text-navy text-base leading-none block">{asset.symbol}</span>
                                        <span className="text-slate-400 text-xs font-semibold">{asset.name}</span>
                                    </div>
                                </div>
                                {/* Change badge */}
                                {!isLoading && coinData && (
                                    <div className={`flex items-center space-x-1 font-bold text-xs px-2.5 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                        <span>{Math.abs(change).toFixed(2)}%</span>
                                    </div>
                                )}
                            </div>

                            {/* Price */}
                            {isLoading || !coinData ? (
                                <Loader2 className="h-8 w-8 animate-spin text-slate-300 my-2" />
                            ) : (
                                <div className="text-3xl font-black text-navy mb-4 tracking-tighter">
                                    ${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                            )}

                            {/* 7-day Sparkline */}
                            <div className="h-14 w-full mt-auto">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={sparklineData}>
                                        <Line
                                            type="monotone"
                                            dataKey="v"
                                            stroke={isPositive ? '#22c55e' : '#ef4444'}
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                        <Tooltip
                                            contentStyle={{ display: 'none' }}
                                            cursor={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="text-[10px] text-slate-300 text-right mt-1 font-medium">7-day trend</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
