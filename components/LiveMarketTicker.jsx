"use client";

import useSWR from 'swr';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function LiveMarketTicker() {
    const containerRef = useRef(null);

    const { data, error, isLoading } = useSWR(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true',
        fetcher,
        { refreshInterval: 10000 }
    );

    useGSAP(() => {
        gsap.fromTo(
            ".ticker-card",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.1, delay: 0.5 }
        );
    }, { scope: containerRef });

    const assets = [
        {
            id: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'BTC',
            icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026'
        },
        {
            id: 'ethereum',
            name: 'Ethereum',
            symbol: 'ETH',
            icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026'
        },
        {
            id: 'solana',
            name: 'Solana',
            symbol: 'SOL',
            icon: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=026'
        },
    ];

    if (error) return <div className="text-center text-sm font-semibold text-red-500 py-4">Failed to load live market data.</div>;

    return (
        <div ref={containerRef} className="w-full max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {assets.map((asset) => {
                const coinData = data?.[asset.id];
                const price = coinData?.usd;
                const change = coinData?.usd_24h_change;
                const isPositive = change >= 0;

                return (
                    <div key={asset.id} className="ticker-card opacity-0 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-md transition-all hover:-translate-y-1">
                        <div className="flex items-center space-x-3 mb-3">
                            <Image
                                src={asset.icon}
                                alt={asset.name}
                                width={28}
                                height={28}
                                className="object-contain"
                            />
                            <span className="font-extrabold text-navy text-xl">{asset.symbol}</span>
                            <span className="text-slate-400 text-sm font-semibold">{asset.name}</span>
                        </div>

                        {isLoading || !coinData ? (
                            <Loader2 className="h-8 w-8 animate-spin text-slate-300 my-2" />
                        ) : (
                            <>
                                <div className="text-4xl font-black text-navy mb-2 tracking-tighter">
                                    ${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <div className={`flex items-center space-x-1.5 font-bold text-sm px-3 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                    <span>{Math.abs(change).toFixed(2)}%</span>
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
