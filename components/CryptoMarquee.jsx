"use client";

import { useEffect, useState, useRef } from "react";

const FALLBACK_COINS = [
    { id: "bitcoin", symbol: "BTC", name: "Bitcoin", current_price: 68500, price_change_percentage_24h: 1.24, image: "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png" },
    { id: "ethereum", symbol: "ETH", name: "Ethereum", current_price: 3520, price_change_percentage_24h: -0.85, image: "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png" },
    { id: "tether", symbol: "USDT", name: "Tether", current_price: 1.00, price_change_percentage_24h: 0.01, image: "https://assets.coingecko.com/coins/images/325/thumb/Tether.png" },
    { id: "solana", symbol: "SOL", name: "Solana", current_price: 178, price_change_percentage_24h: 3.41, image: "https://assets.coingecko.com/coins/images/4128/thumb/solana.png" },
    { id: "bnb", symbol: "BNB", name: "BNB", current_price: 612, price_change_percentage_24h: 0.72, image: "https://assets.coingecko.com/coins/images/825/thumb/bnb-icon2_2x.png" },
    { id: "ripple", symbol: "XRP", name: "XRP", current_price: 0.61, price_change_percentage_24h: -1.12, image: "https://assets.coingecko.com/coins/images/44/thumb/xrp-symbol-white-128.png" },
    { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", current_price: 0.165, price_change_percentage_24h: 2.18, image: "https://assets.coingecko.com/coins/images/5/thumb/dogecoin.png" },
    { id: "cardano", symbol: "ADA", name: "Cardano", current_price: 0.47, price_change_percentage_24h: -0.43, image: "https://assets.coingecko.com/coins/images/975/thumb/cardano.png" },
    { id: "avalanche", symbol: "AVAX", name: "Avalanche", current_price: 39.2, price_change_percentage_24h: 1.85, image: "https://assets.coingecko.com/coins/images/12559/thumb/Avalanche_Circle_RedWhite_Trans.png" },
    { id: "chainlink", symbol: "LINK", name: "Chainlink", current_price: 18.4, price_change_percentage_24h: 0.94, image: "https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png" },
];

function formatPrice(price) {
    if (price >= 10000) return `$${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
    if (price >= 1000) return `$${price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    if (price >= 1) return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return `$${price.toFixed(4)}`;
}

function CoinTile({ coin }) {
    const up = coin.price_change_percentage_24h >= 0;
    const pct = Math.abs(coin.price_change_percentage_24h).toFixed(2);

    return (
        <div className="group relative flex items-center gap-4 px-5 py-0 shrink-0 cursor-default">
            {/* Hover bg glow */}
            <div className={`absolute inset-y-1 inset-x-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
                ${up ? "bg-emerald-500/[0.05]" : "bg-red-500/[0.05]"}`} />

            {/* Coin logo */}
            <div className={`relative w-10 h-10 rounded-full overflow-hidden shrink-0
                ring-1 ring-white/10 group-hover:ring-[#d4af35]/40
                shadow-[0_0_14px_rgba(0,0,0,0.5)]
                transition-all duration-500`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={coin.image}
                    alt={coin.symbol}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            {/* Info */}
            <div className="flex flex-col gap-0.5 leading-none">
                {/* Name + symbol */}
                <div className="flex items-baseline gap-2">
                    <span className="text-[13px] font-black text-white/90 group-hover:text-white transition-colors duration-300 tracking-tight">
                        {coin.name}
                    </span>
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                        {coin.symbol}
                    </span>
                </div>

                {/* Price */}
                <span className="text-[16px] font-black tabular-nums text-white tracking-tight">
                    {formatPrice(coin.current_price)}
                </span>
            </div>

            {/* % Change pill */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black tabular-nums transition-all duration-300
                ${up
                    ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:ring-emerald-400/40"
                    : "bg-red-500/10 text-red-400 ring-1 ring-red-500/20 group-hover:bg-red-500/20 group-hover:ring-red-400/40"
                }`}>
                <span className="text-[10px]">{up ? "▲" : "▼"}</span>
                {pct}%
            </div>

            {/* Separator */}
            <div className="w-px h-7 bg-white/[0.06] ml-3 shrink-0 group-hover:bg-[#d4af35]/20 transition-colors duration-500" />
        </div>
    );
}

export default function CryptoMarquee() {
    const [coins, setCoins] = useState(FALLBACK_COINS);
    const [paused, setPaused] = useState(false);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        async function fetchCoins() {
            try {
                const res = await fetch(
                    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false",
                    { cache: "no-store" }
                );
                if (!res.ok) throw new Error("API error");
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setCoins(data);
                    setIsLive(true);
                }
            } catch {
                setIsLive(false);
            }
        }
        fetchCoins();
        const interval = setInterval(fetchCoins, 60_000);
        return () => clearInterval(interval);
    }, []);

    const tiles = [...coins, ...coins, ...coins]; // 3x for bulletproof loop

    return (
        <div
            className="relative w-full overflow-hidden"
            style={{ background: "linear-gradient(135deg, #070707 0%, #0a0900 50%, #070707 100%)" }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Ambient gold glow band */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-full bg-[#d4af35] opacity-[0.025] blur-[80px] rounded-full" />
            </div>

            {/* Top border — animated shimmer */}
            <div className="absolute top-0 inset-x-0 h-px overflow-hidden pointer-events-none">
                <div className="h-full w-full bg-gradient-to-r from-transparent via-[#d4af35]/60 to-transparent"
                    style={{ animation: "shimmer-line 3s ease-in-out infinite" }} />
            </div>
            {/* Bottom border */}
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#d4af35]/20 to-transparent pointer-events-none" />

            {/* Left fade + LIVE badge */}
            <div className="absolute left-0 top-0 bottom-0 w-36 bg-gradient-to-r from-[#070707] via-[#070707]/90 to-transparent z-10 pointer-events-none flex items-center">
                <div className="ml-4 flex items-center gap-2.5 bg-[#0d0d0d] border border-[#d4af35]/30 rounded-full px-4 py-2
                    shadow-[0_0_20px_rgba(212,175,53,0.15),inset_0_0_12px_rgba(212,175,53,0.04)]
                    pointer-events-auto">
                    <span className="relative flex h-2 w-2 shrink-0">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLive ? "bg-emerald-400" : "bg-[#d4af35]"}`} />
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? "bg-emerald-400" : "bg-[#d4af35]"}`} />
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-[0.28em] text-[#d4af35] whitespace-nowrap">
                        {isLive ? "Live" : "Prices"}
                    </span>
                </div>
            </div>

            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#070707] to-transparent z-10 pointer-events-none" />

            {/* Scrolling strip */}
            <div
                className="flex items-center"
                style={{
                    animation: `marquee-ticker 50s linear infinite`,
                    animationPlayState: paused ? "paused" : "running",
                    width: "max-content",
                    paddingTop: "14px",
                    paddingBottom: "14px",
                    paddingLeft: "160px",
                }}
            >
                {tiles.map((coin, idx) => (
                    <CoinTile key={`${coin.id}-${idx}`} coin={coin} />
                ))}
            </div>

            {/* Inline keyframes */}
            <style>{`
                @keyframes marquee-ticker {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(calc(-100% / 3)); }
                }
                @keyframes shimmer-line {
                    0%   { transform: translateX(-100%); opacity: 0.4; }
                    50%  { opacity: 1; }
                    100% { transform: translateX(100%); opacity: 0.4; }
                }
            `}</style>
        </div>
    );
}
