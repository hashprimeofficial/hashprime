"use client";

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Zap, Wind, HardHat, Landmark, Scale,
    Cog, Tent, Radio, Cable, BarChart3, ArrowUpRight, ChevronRight
} from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// ─── Data ──────────────────────────────────────────────────────────────────────


const team = [
    { name: "Mr. Vijayabharathi Veerasamy", title: "Founder & Managing Director", img: "/Mr. VIJAYABHARATHI VEERASAMY.jpeg" },
    { name: "Mr. Naveenkumar Mayavan", title: "Co-Founder & CEO", img: "/NAVEENKUMAR MAYAVAN.jpeg" },
    { name: "Mrs. Maheshwari Santhosh", title: "General Manager", img: "/Miss. MAHESHWARI ASOKAN.jpeg" },
    { name: "Mrs. Hemalatha Kannan", title: "HR Manager", img: "/HEMALATHA KANNAN.jpeg" },
    { name: "Mr. Kannan Thangavel", title: "Accounts Manager", img: "/Mr.KANNAN THANGAVEL.jpeg" },
];

const businesses = [
    { icon: Zap, title: "Telecom O&M", sub: "Total Telecom O&M Service (Electrical)", img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=900", desc: "Ensuring 99.99% uptime for global telecom architectures via elite electrical O&M engineering." },
    { icon: Wind, title: "AC Services", sub: "All Type AC Sales and Service", img: "https://images.unsplash.com/photo-1527689638836-411945a2b57c?q=80&w=900", desc: "Premium cooling solutions — end-to-end sales, installation and maintenance." },
    { icon: HardHat, title: "Construction", sub: "Private Construction", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=900", desc: "Structural masterpieces bridging world-class aesthetics and monolithic durability." },
    { icon: Landmark, title: "Real Estate", sub: "Real Estate", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=900", desc: "Aggressive property acquisitions, investments and premium multi-vertical leasing." },
    { icon: Scale, title: "Legal Care", sub: "Legal Care", img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=900", desc: "Ironclad legal advisory and dispute resolution frameworks for corporate compliance." },
    { icon: Cog, title: "Generator", sub: "Generator Sales and Service", img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=900", desc: "Heavy-duty uninterrupted power systems engineered for critical commercial operations." },
    { icon: Tent, title: "Shelter Work", sub: "Shelter Work", img: "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?q=80&w=900", desc: "Secure, weather-resistant shelter infrastructure deployed with military precision." },
    { icon: Radio, title: "Ericsson", sub: "Ericsson Work (Only New Site)", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=900", desc: "Turnkey new-site integrations for Ericsson telecommunication cell deployments." },
    { icon: Cable, title: "Fibre Optical", sub: "Fibre Optical", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=900", desc: "Light-speed data transmission infrastructure laid with zero-latency precision." },
    { icon: BarChart3, title: "Trading", sub: "Trading (ICT & SMC)", img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=900", desc: "Dynamic wholesale trading spanning ICT segments and critical SMC supply networks." },
];

// ─── TeamCard — full-bleed 9:16 portrait, content overlay ────────────────────
// ─── TeamCard — full-bleed 9:16 portrait, always-visible overlay on mobile ────
function TeamCard({ member, idx }) {
    return (
        <div className="hpg-card group relative overflow-hidden rounded-3xl bg-[#0E0E0E] border border-white/[0.06]
            aspect-[9/16]
            hover:border-[#d4af35]/50 hover:shadow-[0_30px_80px_rgba(212,175,53,0.18)]
            transition-all duration-700 ease-out md:hover:-translate-y-4 cursor-default">

            {/* ── Full-bleed photo ──────────────────────────────────────────── */}
            <img
                src={member.img}
                alt={member.name}
                className="absolute inset-0 w-full h-full object-cover object-top
                    grayscale-[20%] brightness-[0.8]
                    md:group-hover:grayscale-0 md:group-hover:brightness-95 md:group-hover:scale-[1.06]
                    transition-all duration-[1.8s] ease-out"
            />

            {/* ── Permanent bottom vignette (stronger on mobile) ────────────── */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 md:via-black/20 md:to-transparent pointer-events-none" />

            {/* ── Hover gold tint wash — desktop only ──────────────────────── */}
            <div className="hidden md:block absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t from-[#d4af35]/25 via-[#d4af35]/5 to-transparent
                group-hover:h-[70%] transition-all duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none" />

            {/* ── Glowing scan-line — desktop only ─────────────────────────── */}
            <div className="hidden md:block absolute inset-x-0 bottom-0 h-[1.5px] bg-[#d4af35]
                [box-shadow:0_0_12px_#d4af35,0_0_28px_rgba(212,175,53,0.6)]
                opacity-0 group-hover:opacity-100 group-hover:-translate-y-[85%]
                transition-all duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none" />

            {/* ── HUD corner brackets — desktop only ───────────────────────── */}
            <div className="hidden md:block absolute top-4 left-4 w-7 h-7 border-t-[2px] border-l-[2px] border-[#d4af35]/0 group-hover:border-[#d4af35]/70 transition-all duration-500 delay-100" />
            <div className="hidden md:block absolute top-4 right-4 w-7 h-7 border-t-[2px] border-r-[2px] border-[#d4af35]/0 group-hover:border-[#d4af35]/70 transition-all duration-500 delay-100" />
            <div className="hidden md:block absolute bottom-4 left-4 w-7 h-7 border-b-[2px] border-l-[2px] border-[#d4af35]/0 group-hover:border-[#d4af35]/70 transition-all duration-500 delay-150" />
            <div className="hidden md:block absolute bottom-4 right-4 w-7 h-7 border-b-[2px] border-r-[2px] border-[#d4af35]/0 group-hover:border-[#d4af35]/70 transition-all duration-500 delay-150" />

            {/* ── Index badge ───────────────────────────────────────────────── */}
            <span className="absolute top-4 left-4 text-[10px] font-black text-white/30 tracking-[0.2em] tabular-nums
                md:group-hover:text-[#d4af35]/60 transition-colors duration-500">
                {String(idx + 1).padStart(2, '0')}
            </span>

            {/* ── Content overlay
                 Mobile: always fully visible (no hover on touch)
                 Desktop: animates up on hover
            ──────────────────────────────────────────────────────────────── */}
            <div className="absolute inset-x-0 bottom-0 px-4 pb-5 md:px-6 md:pb-7
                translate-y-0 opacity-100
                md:translate-y-3 md:opacity-80 md:group-hover:translate-y-0 md:group-hover:opacity-100
                transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">

                {/* Gold divider line — wipes in on desktop, static thin line on mobile */}
                <div className="h-px bg-[#d4af35]/40 md:bg-[#d4af35] md:w-0 md:group-hover:w-full mb-3
                    [box-shadow:0_0_6px_rgba(212,175,53,0.5)]
                    transition-all duration-700 ease-out" />

                <p className="text-white font-black text-sm md:text-base leading-snug tracking-tight mb-2">
                    {member.name}
                </p>

                {/* Role pill */}
                <span className="inline-flex items-center gap-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.18em]
                    text-[#d4af35] bg-black/70 backdrop-blur-sm border border-[#d4af35]/30 rounded-full px-2.5 py-1 md:px-3 md:py-1.5">
                    <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#d4af35] animate-pulse shrink-0" />
                    {member.title}
                </span>
            </div>
        </div>
    );
}


// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HashPrimeGroupsPage() {
    const pageRef = useRef(null);
    const [activeBiz, setActiveBiz] = useState(null);

    useGSAP(() => {
        // ── Hero entrance ────────────────────────────────────────────────────
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        heroTl
            .fromTo('.hpg-badge', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.2)
            .fromTo('.hpg-h1-line1', { y: 80, opacity: 0, skewY: 4 }, { y: 0, opacity: 1, skewY: 0, duration: 1 }, 0.45)
            .fromTo('.hpg-h1-line2', { y: 80, opacity: 0, skewY: 4 }, { y: 0, opacity: 1, skewY: 0, duration: 1 }, 0.6)
            .fromTo('.hpg-sub', { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.85)
            .fromTo('.hpg-ctas', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 1.0)
            .fromTo('.hpg-stats', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 1.15);

        // ── Pinned section label ──────────────────────────────────────────────
        gsap.utils.toArray('.reveal-up').forEach((el) => {
            gsap.fromTo(el, { y: 60, opacity: 0 }, {
                y: 0, opacity: 1, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 88%', once: true }
            });
        });

        // ── Team cards ───────────────────────────────────────────────────────
        gsap.fromTo('.hpg-card', { y: 80, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.9, stagger: 0.09, ease: 'back.out(1.1)',
            scrollTrigger: { trigger: '.hpg-team-grid', start: 'top 80%', once: true }
        });

        // ── Business cards ───────────────────────────────────────────────────
        gsap.fromTo('.hpg-biz', { y: 70, opacity: 0, scale: 0.96 }, {
            y: 0, opacity: 1, scale: 1, duration: 0.75, stagger: 0.055, ease: 'power3.out',
            scrollTrigger: { trigger: '.hpg-biz-grid', start: 'top 82%', once: true }
        });

        // ── Careers teaser ───────────────────────────────────────────────────
        gsap.fromTo('.hpg-careers-card', { y: 60, opacity: 0 }, {
            y: 0, opacity: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: '.hpg-careers-card', start: 'top 85%', once: true }
        });

        // ── Stat counters pan ────────────────────────────────────────────────
        gsap.fromTo('.hpg-stat-item', { y: 30, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: '.hpg-stats-row', start: 'top 88%', once: true }
        });

    }, { scope: pageRef });

    return (
        <div ref={pageRef} className="relative bg-[#050505] overflow-x-hidden">

            {/* ── Global dot-grid ───────────────────────────────────────────── */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]"
                style={{ backgroundImage: 'radial-gradient(#d4af35 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

            {/* ══════════════════════════════════════════════════════════════════
                A. HERO — full-viewport, cinematic
            ══════════════════════════════════════════════════════════════════ */}
            <section className="relative z-10 py-36 px-6 flex flex-col items-center text-center overflow-hidden">

                {/* Ambient depth layers */}
                <div className="absolute -left-40 top-0 w-[600px] h-[600px] bg-[#d4af35] rounded-full blur-[200px] opacity-[0.05] pointer-events-none" />
                <div className="absolute -right-40 bottom-0 w-[500px] h-[500px] bg-[#d4af35] rounded-full blur-[180px] opacity-[0.03] pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(212,175,53,0.02)_0%,transparent_50%,rgba(212,175,53,0.01)_100%)] pointer-events-none" />
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, #d4af35 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                {/* Headline */}
                <div className="relative overflow-hidden leading-none">
                    <h1 className="hpg-h1-line2 text-[15vw] md:text-[10vw] lg:text-[8vw] font-black tracking-[-0.03em] uppercase leading-[0.9] text-shine">
                        Hash Prime
                    </h1>
                </div>

                {/* Gold hairline — centered */}
                <div className="hpg-sub my-6 h-px w-20 bg-gradient-to-r from-transparent via-[#d4af35] to-transparent mx-auto" />

                {/* Subtitle */}
                <p className="hpg-sub text-base md:text-lg text-slate-400 leading-relaxed max-w-lg mx-auto">
                    We operate{" "}
                    <span className="text-white font-semibold relative inline-block">
                        10+ Business Modules
                        <span className="absolute -bottom-px left-0 right-0 h-px bg-[#d4af35]/60" />
                    </span>
                    {" "}all over Tamil Nadu.
                </p>

            </section>

            {/* Transition orb */}
            <div className="absolute top-[85vh] right-[-12%] w-[700px] h-[700px] bg-[#d4af35] opacity-[0.03] rounded-full blur-[150px] pointer-events-none z-0" />

            {/* ══════════════════════════════════════════════════════════════════
                C. THE 10 DIVISIONS — Premium line-by-line list
            ══════════════════════════════════════════════════════════════════ */}
            <section id="divisions" className="relative z-10 py-4 px-6 md:px-16">

                {/* Section header */}
                <div className="reveal-up max-w-[90rem] mx-auto mb-16">
                    <div className="flex flex-col md:flex-row md:items-end gap-8 justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#121212] border border-[#d4af35]/20 mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af35] opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4af35]" />
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af35]">10 Verticals</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[0.95]">
                                Our Business<br /><span className="text-[#d4af35]">Divisions</span>
                            </h2>
                        </div>
                        <p className="text-slate-500 text-base max-w-sm leading-relaxed md:text-right">
                            Click any row to open the enquiry form pre-filled for that division.
                        </p>
                    </div>
                </div>

                {/* Line-by-line list */}
                <div className="hpg-biz-grid max-w-[90rem] mx-auto">
                    {businesses.map((biz, idx) => {
                        const Icon = biz.icon;
                        return (
                            <Link


                                key={idx}
                                href={`/hash-prime-groups/enquiry?field=${encodeURIComponent(biz.sub)}`}
                                className="hpg-biz group relative flex items-center gap-6 md:gap-10 px-4 md:px-8 py-6 md:py-7
                                    border-b border-white/[0.06] last:border-b-0
                                    hover:bg-[#0E0E0E] hover:border-b-[#d4af35]/20
                                    transition-all duration-500 ease-out cursor-pointer overflow-hidden"
                            >
                                {/* Gold sweep on hover */}
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#d4af35]/[0.04] via-[#d4af35]/[0.02] to-transparent
                                    group-hover:translate-x-0 transition-transform duration-700 ease-out pointer-events-none" />

                                {/* Index */}
                                <span className="shrink-0 text-[11px] md:text-xs font-black tabular-nums tracking-[0.18em]
                                    text-white/20 group-hover:text-[#d4af35]/50 transition-colors duration-400 w-6 text-right select-none">
                                    {String(idx + 1).padStart(2, '0')}
                                </span>

                                {/* Icon */}
                                <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#121212] border border-white/[0.06]
                                    flex items-center justify-center
                                    group-hover:bg-[#d4af35] group-hover:border-[#d4af35]
                                    transition-all duration-500 ease-out">
                                    <Icon className="w-5 h-5 text-[#d4af35] group-hover:text-black transition-colors duration-500" />
                                </div>

                                {/* Title */}
                                <p className="flex-1 text-base md:text-xl lg:text-2xl font-black text-white/80 tracking-tight
                                    group-hover:text-white transition-colors duration-400 leading-snug">
                                    {biz.sub}
                                </p>

                                {/* Divider line — expands on hover */}
                                <div className="hidden md:block h-px flex-1 max-w-[160px] bg-white/[0.04]
                                    group-hover:bg-[#d4af35]/30 transition-colors duration-500" />

                                {/* Enquiry label — desktop only */}
                                <span className="hidden md:block shrink-0 text-[10px] font-black uppercase tracking-[0.25em]
                                    text-slate-700 group-hover:text-[#d4af35] transition-colors duration-500">
                                    Enquiry
                                </span>

                                {/* Arrow */}
                                <div className="shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-white/[0.08]
                                    flex items-center justify-center
                                    group-hover:bg-[#d4af35] group-hover:border-[#d4af35]
                                    transition-all duration-500 ease-out">
                                    <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-black group-hover:rotate-45 transition-all duration-300" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Transition orb */}


            {/* ══════════════════════════════════════════════════════════════════
                E-PRE. EXECUTIVE DIRECTORS — responsive 3D flip cards
            ══════════════════════════════════════════════════════════════════ */}
            <section className="relative z-10 py-24 px-6 md:px-16">
                <div className="reveal-up max-w-[90rem] mx-auto">

                    {/* Section header */}
                    <div className="flex items-center gap-5 mb-14">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af35] animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af35]/60">Executive Directors</span>
                        </div>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#d4af35]/20 to-transparent" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">Hash Prime Groups</span>
                    </div>

                    {/* Cards — 2-col mobile / 3-col sm / 5-col lg */}
                    <div className="hpg-team-grid flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-5">
                        {team.map((member, idx) => (
                            <div
                                key={idx}
                                className="hpg-card"
                                style={{
                                    perspective: '1400px',
                                    flexBasis: 'calc(50% - 6px)',
                                    maxWidth: 'calc(50% - 6px)',
                                    aspectRatio: '3/4',
                                }}
                                onMouseEnter={e => {
                                    const inner = e.currentTarget.querySelector('.flip-inner');
                                    if (inner) inner.style.transform = 'rotateY(180deg)';
                                }}
                                onMouseLeave={e => {
                                    const inner = e.currentTarget.querySelector('.flip-inner');
                                    if (inner) inner.style.transform = 'rotateY(0deg)';
                                }}
                            >
                                {/* Responsive overrides via inline style — sm: 33%, lg: 200px fixed */}
                                <style>{`
                                    @media (min-width: 640px) {
                                        .hpg-card { flex-basis: calc(33.333% - 11px) !important; max-width: calc(33.333% - 11px) !important; }
                                    }
                                    @media (min-width: 1024px) {
                                        .hpg-card { flex-basis: 200px !important; max-width: 200px !important; }
                                    }
                                `}</style>

                                {/* Flip inner */}
                                <div
                                    className="flip-inner relative w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
                                    style={{ transformStyle: 'preserve-3d' }}
                                >
                                    {/* ── FRONT ── */}
                                    <div
                                        className="absolute inset-0 rounded-2xl overflow-hidden border border-white/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                                        style={{ backfaceVisibility: 'hidden' }}
                                    >
                                        <img
                                            src={member.img}
                                            alt={member.name}
                                            className="w-full h-full object-cover object-top"
                                        />
                                        {/* Bottom vignette */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/10" />
                                        {/* Subtle gold top-right glow */}
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af35]/10 blur-[40px] rounded-full" />
                                        {/* Index badge */}
                                        <span className="absolute top-3 left-3 text-[9px] font-black text-white/30 tabular-nums tracking-widest">
                                            {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        {/* Gold shimmer line top */}
                                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#d4af35]/30 to-transparent" />


                                    </div>

                                    {/* ── BACK ── */}
                                    <div
                                        className="absolute inset-0 rounded-2xl bg-[#0A0A0A] border border-[#d4af35]/30
                                            flex flex-col items-center justify-center gap-4 px-5
                                            [box-shadow:inset_0_0_60px_rgba(212,175,53,0.06),0_4px_40px_rgba(0,0,0,0.6)]"
                                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                    >
                                        {/* Corner brackets */}
                                        <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-[#d4af35]/40" />
                                        <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-[#d4af35]/40" />
                                        <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-[#d4af35]/40" />
                                        <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-[#d4af35]/40" />

                                        {/* Circular photo thumbnail */}
                                        <div className="w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-[#d4af35]/40 shrink-0
                                            shadow-[0_0_20px_rgba(212,175,53,0.2)]">
                                            <img
                                                src={member.img}
                                                alt={member.name}
                                                className="w-full h-full object-cover object-top"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="text-center">
                                            <p className="text-[13px] font-black text-white leading-snug tracking-tight mb-2.5">
                                                {member.name}
                                            </p>
                                            <div className="w-10 h-px bg-[#d4af35]/50 mx-auto mb-2.5" />
                                            <p className="text-[9.5px] font-bold text-[#d4af35] uppercase tracking-wider leading-snug">
                                                {member.title}
                                            </p>
                                        </div>

                                        {/* Pulsing dot */}
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4af35] animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════════
                E. MONOLITHIC CONTACT FOOTER
            ══════════════════════════════════════════════════════════════════ */}
            <section className="relative z-10 py-12 md:py-16 px-6 flex flex-col items-center text-center">
                <div className="reveal-up mb-6 max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#121212] border border-[#d4af35]/20 mb-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af35] opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4af35]" />
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af35]">Get In Touch</span>
                    </div>
                    <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
                        Ready to partner? Connect with the Hash Prime team — we respond within 24 hours.
                    </p>
                </div>

                {/* Monolithic text CTA */}
                <Link href="/contact-details" className="group relative block w-full max-w-[90rem] mx-auto">
                    <div className="absolute inset-0 bg-[#d4af35] rounded-[3rem] blur-[120px] opacity-0 group-hover:opacity-[0.05] transition-opacity duration-1000 pointer-events-none" />
                    <h2 className="relative text-[14vw] lg:text-[12vw] leading-[0.82] font-black uppercase tracking-tighter
                        text-white/[0.04] group-hover:text-white/[0.08] transition-colors duration-700">
                        <span className="text-shine group-hover:opacity-100 transition-all duration-1000">Hash Prime</span>
                        <br />
                        <span className="text-white/[0.04] group-hover:text-[#d4af35] transition-colors duration-700 delay-100">Groups</span>
                    </h2>
                    <div className="absolute inset-x-[10%] top-1/2 h-px bg-gradient-to-r from-transparent via-[#d4af35]/40 to-transparent
                        scale-x-0 group-hover:scale-x-100 transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)]" />
                    <p className="mt-4 text-sm text-[#d4af35] uppercase tracking-[0.4em] font-black opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300">
                        Initialize Contact →
                    </p>
                </Link>
            </section>

        </div>
    );
}
