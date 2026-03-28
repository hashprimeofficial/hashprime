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
    { name: "Miss. Maheshwari Asokan", title: "General Manager", img: "/Miss. MAHESHWARI ASOKAN.jpeg" },
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
            <section className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-28 pt-36 pb-24 overflow-hidden">

                {/* Left ambient orb */}
                <div className="absolute -left-40 top-1/4 w-[700px] h-[700px] bg-[#d4af35] rounded-full blur-[200px] opacity-[0.07] pointer-events-none" />
                {/* Right ambient orb */}
                <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-[#d4af35] rounded-full blur-[180px] opacity-[0.04] pointer-events-none" />

                {/* Badge */}
                <div className="hpg-badge inline-flex items-center self-start gap-2.5 px-4 py-2 rounded-full bg-[#121212] border border-[#d4af35]/20 mb-10">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af35] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4af35]" />
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af35]">Hash Prime Groups — Est. 2018</span>
                </div>

                {/* Headline — clipped, cinematic */}
                <div className="overflow-hidden mb-2">
                    <h1 className="hpg-h1-line1 text-[15vw] md:text-[11vw] lg:text-[9vw] font-black tracking-tighter uppercase leading-[0.85] text-white">
                        Hash Prime
                    </h1>
                </div>
                <div className="overflow-hidden mb-10">
                    <h1 className="hpg-h1-line2 text-[15vw] md:text-[11vw] lg:text-[9vw] font-black tracking-tighter uppercase leading-[0.85] text-shine">
                        Groups
                    </h1>
                </div>

                {/* Sub + CTAs in a flex row on desktop */}
                <div className="flex flex-col lg:flex-row lg:items-end gap-10 lg:gap-24">
                    <div className="max-w-xl">
                        <p className="hpg-sub text-lg md:text-xl text-slate-400 leading-relaxed mb-8">
                            We operate across <span className="text-white font-semibold">10 distinct industries</span> — delivering infrastructure, technology & telecoms excellence across India.
                        </p>
                        <div className="hpg-ctas flex flex-wrap gap-4">
                            <Link href="/hash-prime-groups/enquiry"
                                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#d4af35] text-black font-black uppercase tracking-[0.15em] text-sm rounded-full overflow-hidden hover:shadow-[0_0_40px_rgba(212,175,53,0.4)] hover:scale-105 transition-all duration-500">
                                <div className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/30 group-hover:animate-shimmer" />
                                <span className="relative z-10">Initiate Enquiry</span>
                                <ArrowUpRight className="w-4 h-4 relative z-10 group-hover:rotate-45 transition-transform duration-300" />
                            </Link>
                            <a href="#divisions"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-white/10 text-slate-400 font-bold uppercase tracking-[0.15em] text-sm rounded-full hover:border-[#d4af35]/40 hover:text-white transition-all duration-500">
                                View Divisions <ChevronRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Keyword marquee strip */}
                    <div className="hpg-stats flex flex-wrap gap-x-8 gap-y-3 lg:ml-auto lg:justify-end pt-2">
                        {['Telecom', 'Real Estate', 'Legal', 'Construction', 'Fibre Optical', 'Trading', 'Generator'].map((kw) => (
                            <span key={kw} className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-600 hover:text-[#d4af35] transition-colors duration-300 cursor-default">{kw}</span>
                        ))}
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-30">
                    <div className="w-px h-14 bg-gradient-to-b from-[#d4af35] to-transparent" />
                    <span className="text-[9px] uppercase tracking-widest text-[#d4af35]">Scroll</span>
                </div>
            </section>

            {/* Transition orb */}
            <div className="absolute top-[85vh] right-[-12%] w-[700px] h-[700px] bg-[#d4af35] opacity-[0.03] rounded-full blur-[150px] pointer-events-none z-0" />

            {/* ══════════════════════════════════════════════════════════════════
                B. EXECUTIVE TEAM
            ══════════════════════════════════════════════════════════════════ */}
            <section className="relative z-10 py-32 px-6 md:px-16">
                {/* Label */}
                <div className="reveal-up max-w-[90rem] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#121212] border border-[#d4af35]/20 mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af35] opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4af35]" />
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af35]">Our People</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[0.95]">
                            Executive<br /><span className="text-[#d4af35]">Directors</span>
                        </h2>
                    </div>
                    <p className="text-slate-500 text-base max-w-sm leading-relaxed md:text-right">
                        The visionaries steering Hash Prime Groups across every vertical.
                    </p>
                </div>

                {/* 3-2 centered big card grid */}
                <div className="hpg-team-grid max-w-[80rem] mx-auto">

                    {/* 2-col on mobile → 3-col on lg for top row */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
                        {team.slice(0, 3).map((member, idx) => <TeamCard key={idx} member={member} idx={idx} />)}
                    </div>
                    {/* Bottom 2 — 2-col always, centered on desktop */}
                    <div className="grid grid-cols-2 gap-4 md:gap-6 md:max-w-[calc(66.666%+0.75rem)] md:mx-auto">
                        {team.slice(3).map((member, idx) => <TeamCard key={idx + 3} member={member} idx={idx + 3} />)}
                    </div>
                </div>
            </section>

            {/* Transition orb */}
            <div className="absolute top-[190vh] left-[-10%] w-[800px] h-[800px] bg-[#d4af35] opacity-[0.025] rounded-full blur-[150px] pointer-events-none z-0" />

            {/* ══════════════════════════════════════════════════════════════════
                C. THE 10 DIVISIONS — Premium interactive exploration grid
            ══════════════════════════════════════════════════════════════════ */}
            <section id="divisions" className="relative z-10 py-32 px-6 md:px-16">

                {/* Section header */}
                <div className="reveal-up max-w-[90rem] mx-auto mb-20">
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
                            Click any card to open the enquiry form pre-filled for that division.
                        </p>
                    </div>
                </div>

                {/* Grid — 2-col on tablet, 3 on desktop, 4 on xl, 5 on 2xl */}
                <div className="hpg-biz-grid max-w-[90rem] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                    {businesses.map((biz, idx) => {
                        const Icon = biz.icon;
                        return (
                            <Link
                                key={idx}
                                href={`/hash-prime-groups/enquiry?field=${encodeURIComponent(biz.sub)}`}
                                className="hpg-biz group relative flex flex-col overflow-hidden rounded-3xl bg-[#0E0E0E] border border-white/[0.06]
                                    hover:border-[#d4af35]/40 hover:shadow-[0_20px_60px_rgba(212,175,53,0.12)]
                                    transition-all duration-700 ease-out hover:-translate-y-3 cursor-pointer"
                            >
                                {/* Image */}
                                <div className="relative h-52 shrink-0 overflow-hidden rounded-t-3xl">
                                    <div className="absolute inset-0 bg-cover bg-center grayscale-[50%] brightness-[0.55]
                                        group-hover:grayscale-0 group-hover:brightness-75 group-hover:scale-110
                                        transition-all duration-[1.6s] ease-out"
                                        style={{ backgroundImage: `url(${biz.img})` }} />
                                    {/* Image → card gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/30 to-transparent" />
                                    {/* Hover gold sweep across image */}
                                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#d4af35]/10 to-transparent
                                        group-hover:translate-x-full transition-transform duration-[1.5s] ease-out pointer-events-none" />
                                    {/* Icon chip */}
                                    <div className="absolute bottom-4 left-4 w-11 h-11 rounded-xl bg-[#0A0A0A]/90 backdrop-blur-sm border border-white/5
                                        flex items-center justify-center
                                        group-hover:bg-[#d4af35] group-hover:border-[#d4af35] transition-all duration-500">
                                        <Icon className="w-5 h-5 text-[#d4af35] group-hover:text-black transition-colors duration-500" />
                                    </div>
                                    {/* Index number */}
                                    <span className="absolute top-4 right-4 text-[10px] font-black text-white/20 tabular-nums tracking-widest">
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                </div>

                                {/* Body */}
                                <div className="relative flex flex-col flex-1 p-6">
                                    {/* Gold sweep bg on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#d4af35]/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-3xl pointer-events-none" />

                                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#d4af35]/70 mb-2 line-clamp-1 group-hover:text-[#d4af35] transition-colors duration-300">{biz.sub}</p>
                                    <h3 className="text-xl font-black text-white tracking-tight leading-tight mb-3">{biz.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-2 group-hover:text-slate-400 transition-colors duration-300">{biz.desc}</p>

                                    {/* CTA row */}
                                    <div className="flex items-center justify-between mt-auto pt-5 border-t border-white/5 group-hover:border-[#d4af35]/20 transition-colors duration-500">
                                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-600 group-hover:text-[#d4af35] transition-colors duration-500">For Enquiry</span>
                                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center
                                            group-hover:bg-[#d4af35] group-hover:border-[#d4af35] transition-all duration-500">
                                            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-black group-hover:rotate-45 transition-all duration-300" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Transition orb */}
            <div className="absolute top-[310vh] right-[-10%] w-[900px] h-[900px] bg-[#d4af35] opacity-[0.02] rounded-full blur-[150px] pointer-events-none z-0" />

            {/* ══════════════════════════════════════════════════════════════════
                D. CAREERS TEASER — full-bleed glass card
            ══════════════════════════════════════════════════════════════════ */}
            <section className="relative z-10 py-32 px-6 md:px-16">
                <div className="max-w-[90rem] mx-auto">
                    <div className="hpg-careers-card relative rounded-[2.5rem] bg-[#0E0E0E] border border-white/5
                        hover:border-[#d4af35]/25 transition-all duration-700 p-12 md:p-20 overflow-hidden group">

                        {/* Radial glow corner */}
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#d4af35]/8 rounded-full blur-[100px] pointer-events-none" />
                        {/* Bottom left accent */}
                        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#d4af35]/5 rounded-full blur-[80px] pointer-events-none" />

                        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-14">
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#121212] border border-[#d4af35]/20 mb-8">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af35] opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4af35]" />
                                    </span>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af35]">We&apos;re Hiring</span>
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[0.95] mb-6">
                                    Join <span className="text-[#d4af35]">Hash Prime</span><br />Groups
                                </h2>
                                <p className="text-slate-400 text-lg leading-relaxed max-w-lg mb-10">
                                    We have <span className="text-white font-semibold">2 active openings</span> in Tamil Nadu — apply on our dedicated careers page.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {['Front Office Executive', 'District Coordinator (Sales)'].map((r) => (
                                        <span key={r} className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest bg-[#d4af35]/10 border border-[#d4af35]/20 text-[#d4af35] px-5 py-2.5 rounded-full">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af35] animate-pulse shrink-0" />
                                            {r}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <Link href="/careers"
                                className="group/btn relative shrink-0 inline-flex items-center gap-4 px-12 py-6 bg-[#d4af35] text-black font-black uppercase tracking-[0.15em] text-sm rounded-full overflow-hidden
                                    hover:shadow-[0_0_50px_rgba(212,175,53,0.4)] hover:scale-105 transition-all duration-500 whitespace-nowrap">
                                <div className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/30 group-hover/btn:animate-shimmer" />
                                <span className="relative z-10">View All Roles</span>
                                <ArrowUpRight className="w-5 h-5 relative z-10 group-hover/btn:rotate-45 transition-transform duration-300" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Transition orb bottom */}
            <div className="absolute bottom-[35vh] left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-[#d4af35] opacity-[0.02] rounded-[100%] blur-[150px] pointer-events-none z-0" />

            {/* ══════════════════════════════════════════════════════════════════
                E. MONOLITHIC CONTACT FOOTER
            ══════════════════════════════════════════════════════════════════ */}
            <section className="relative z-10 py-40 px-6 flex flex-col items-center text-center">
                <div className="reveal-up mb-20 max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#121212] border border-[#d4af35]/20 mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af35] opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4af35]" />
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af35]">Get In Touch</span>
                    </div>
                    <p className="text-slate-400 text-xl leading-relaxed">
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
                    <p className="mt-10 text-sm text-[#d4af35] uppercase tracking-[0.4em] font-black opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300">
                        Initialize Contact →
                    </p>
                </Link>
            </section>

        </div>
    );
}
