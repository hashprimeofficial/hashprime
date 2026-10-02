'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

const TARGET_DATE = new Date('2026-10-21T00:00:00+05:30').getTime();

function calculateTimeLeft() {
    const now = Date.now();
    const difference = TARGET_DATE - now;

    if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
    }

    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isComplete: false,
    };
}

export default function MaintenancePage() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isComplete: false,
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatNumber = (num) => String(num).padStart(2, '0');

    return (
        <div className="relative min-h-screen w-full flex flex-col justify-between items-center bg-[#050505] text-white px-4 py-8 md:py-16 overflow-hidden selection:bg-[#d4af35]/30">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#d4af35] opacity-[0.06] rounded-full blur-[140px] pointer-events-none z-0" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-[#d4af35] opacity-[0.04] rounded-full blur-[160px] pointer-events-none z-0" />
            <div className="absolute top-1/2 left-[-15%] w-[500px] h-[500px] bg-[#d4af35] opacity-[0.03] rounded-full blur-[150px] pointer-events-none z-0" />

            {/* Subtle Grid Texture */}
            <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
                style={{
                    backgroundImage: `radial-gradient(rgba(212, 175, 53, 0.4) 1px, transparent 1px)`,
                    backgroundSize: '32px 32px'
                }}
            />

            {/* Top Brand Bar */}
            <header className="relative z-10 w-full max-w-5xl flex justify-center items-center">
                <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.02] border border-white/5 backdrop-blur-md shadow-2xl">
                    <Image
                        src="/logoonly.png"
                        alt="Hashprime"
                        width={32}
                        height={32}
                        className="w-8 h-8 object-contain drop-shadow-[0_0_12px_rgba(212,175,53,0.5)]"
                        priority
                    />
                    <span className="font-display font-bold text-lg tracking-wider text-white">
                        HASH<span className="text-[#d4af35]">PRIME</span>
                    </span>
                </div>
            </header>

            {/* Main Content Hero */}
            <main className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center my-auto py-8">
                {/* Primary Headline */}
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-8 max-w-3xl leading-tight">
                    Under Scheduled Updates & Enhancements
                </h1>

                {/* Exact Requested Message in a Premium Box */}
                <div className="relative w-full max-w-2xl px-6 py-6 md:px-8 md:py-7 rounded-2xl bg-white/[0.02] border border-[#d4af35]/25 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(212,175,53,0.06)] mb-12">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#0A0A0A] border border-[#d4af35]/40 text-[11px] font-semibold uppercase tracking-widest text-[#d4af35] flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-[#d4af35]" />
                        Official Notice
                    </div>
                    <p className="text-base sm:text-lg md:text-xl text-neutral-200 font-normal leading-relaxed italic">
                        &ldquo;Our website is currently undergoing scheduled updates and enhancements. We’ll be back online on <span className="font-semibold text-[#d4af35] not-italic">21 October 2026</span>. Thank you for your patience and understanding.&rdquo;
                    </p>
                </div>

                {/* Automatic Countdown Timer */}
                <div className="w-full max-w-3xl flex flex-col items-center">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full max-w-2xl">
                        {/* Days */}
                        <div className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-[#0e0e0e]/80 border border-[#d4af35]/20 backdrop-blur-xl shadow-lg relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-b from-[#d4af35]/5 to-transparent pointer-events-none" />
                            <span 
                                suppressHydrationWarning 
                                className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white tabular-nums tracking-tight"
                            >
                                {mounted ? formatNumber(timeLeft.days) : '--'}
                            </span>
                            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#d4af35] mt-2">
                                Days
                            </span>
                        </div>

                        {/* Hours */}
                        <div className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-[#0e0e0e]/80 border border-[#d4af35]/20 backdrop-blur-xl shadow-lg relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-b from-[#d4af35]/5 to-transparent pointer-events-none" />
                            <span 
                                suppressHydrationWarning 
                                className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white tabular-nums tracking-tight"
                            >
                                {mounted ? formatNumber(timeLeft.hours) : '--'}
                            </span>
                            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#d4af35] mt-2">
                                Hours
                            </span>
                        </div>

                        {/* Minutes */}
                        <div className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-[#0e0e0e]/80 border border-[#d4af35]/20 backdrop-blur-xl shadow-lg relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-b from-[#d4af35]/5 to-transparent pointer-events-none" />
                            <span 
                                suppressHydrationWarning 
                                className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white tabular-nums tracking-tight"
                            >
                                {mounted ? formatNumber(timeLeft.minutes) : '--'}
                            </span>
                            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#d4af35] mt-2">
                                Minutes
                            </span>
                        </div>

                        {/* Seconds */}
                        <div className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-[#0e0e0e]/80 border border-[#d4af35]/30 backdrop-blur-xl shadow-lg relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-b from-[#d4af35]/10 to-transparent pointer-events-none" />
                            <span 
                                suppressHydrationWarning 
                                className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-[#d4af35] tabular-nums tracking-tight animate-pulse"
                            >
                                {mounted ? formatNumber(timeLeft.seconds) : '--'}
                            </span>
                            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#f5e0a3] mt-2">
                                Seconds
                            </span>
                        </div>
                    </div>

                    {timeLeft.isComplete && (
                        <p className="mt-4 text-sm text-[#d4af35] font-semibold animate-pulse">
                            Scheduled updates are in their final stage. Reconnecting shortly...
                        </p>
                    )}
                </div>
            </main>

            {/* Bottom Footer Notice */}
            <footer className="relative z-10 w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-white/5 text-xs text-neutral-500 gap-2">
                <span>&copy; {new Date().getFullYear()} Hashprime Solutions Private Limited. All rights reserved.</span>
                <span className="text-neutral-600">Access Restricted During Scheduled Maintenance</span>
            </footer>
        </div>
    );
}
