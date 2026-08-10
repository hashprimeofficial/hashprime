"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Zap, Wind, HardHat, Landmark, Scale,
    Tent, Radio, BarChart3, MapPin, Wrench,
    Plane, ArrowUpRight, User, Briefcase, Clock
} from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// ─── Team ──────────────────────────────────────────────────────────────────────
const team = [
    { name: "Mr. Ravi Maarimuthu", title: "Managing Director", img: "/Mr. RAVI MAARIMUTHU.jpeg" },
    { name: "Mr. Naveenkumar Mayavan", title: "Co-Founder & CEO", img: "/NAVEENKUMAR MAYAVAN.jpeg" },
    { name: "Mrs. Hemalatha Kannan", title: "HR Manager", img: "/HEMALATHA KANNAN.png" },
    { name: "Mr. Kannan Thangavel", title: "Accounts Manager", img: "/Mr.KANNAN THANGAVEL.jpeg" },
    { name: "Mr. Murugaraj Elangovan", title: "Mayiladuthurai District Zonal Manager", img: "/MURUGARAJ ELANGOVAN.jpeg" },
    { name: "Mrs. Priyadharshini Ragupathi", title: "Salem District Zonal Manager", img: "/PRIYADHARSHINI RAGUPATHI.png" },
    { name: "Mrs. Sudha Sasikumar", title: "Thiruvarur District Zonal Manager", img: "/SUDHA SASIKUMAR.png" },
    { name: "Mr. S. Alljeen Jothimani, B.A., B.L.", title: "Advocate & Legal Counsel", img: "/S. ALLJEEN JOTHIMANI.jpg" },
    { name: "Mr. Manikandaprabu R", title: "Tourism Operations Head", img: "/MANIKANDAPRABU R.jpeg" },
    { name: "Mr. Naresh D", title: "Mechanical & Machinery Operations Head", img: "/NARESH D.jpeg" },
    { name: "Mr. Sathish S", title: "AC Sales & Service Operations Head", img: "/SATHISH S.jpg" },
];

// ─── Business Divisions ─────────────────────────────────────────────────────────
const businesses = [
    {
        icon: Zap,
        title: "Total Telecom Service",
        sub: "Total Telecom Service",
        img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=900",
        desc: "Ensuring 99.99% uptime for telecom architectures via turnkey civil works, tower shelter work, electrical O&M, and fibre deployment.",
        href: "/total-telecom-services",
        subItems: [
            "New Site Deployment",
            "Tower / Shelter Work",
            "Electrical Work",
            "Fibre Optical Work",
            "Site Operations / Maintenance",
        ],
        person: { name: "Mr. Ravi Maarimuthu", position: "Managing Director", experience: 15 },
    },
    {
        icon: Wind,
        title: "All Type AC - Sales and Service",
        sub: "All Type AC - Sales and Service",
        img: "https://images.unsplash.com/photo-1527689638836-411945a2b57c?q=80&w=900",
        desc: "Premium cooling solutions — end-to-end buy & sell, installation and professional maintenance for all AC brands.",
        href: "/ac-sales-and-service",
        subItems: ["Buy & Sell", "Service & Maintenance"],
        person: { name: "Mr. Sathish S", position: "AC Sales & Service Operations Head", experience: 6 },
    },
    {
        icon: HardHat,
        title: "All Type of Construction Service",
        sub: "All Type of Construction Service",
        img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=900",
        desc: "Structural masterpieces blending world-class aesthetics with monolithic durability, from foundations to finishing.",
        href: "/construction-and-works",
        subItems: ["Construct Buildings", "Interior & Exterior", "Painting", "Gardening"],
        person: { name: "Mr. Ravi Maarimuthu", position: "Managing Director", experience: 15 },
    },
    {
        icon: Landmark,
        title: "Real Estate Service",
        sub: "Real Estate Service",
        img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=900",
        desc: "Strategic property acquisitions, farmland investments, and premium multi-vertical leasing across Tamil Nadu.",
        href: "/real-estate-services",
        subItems: ["Land Buy & Sell", "Rental Land", "Farm Land"],
        person: { name: "Mr. Ravi Maarimuthu", position: "Managing Director", experience: 15 },
    },
    {
        icon: Scale,
        title: "All Type of Legal Service",
        sub: "All Type of Legal Service",
        img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=900",
        desc: "Expert legal advisory and dispute resolution for civil and criminal matters, handled by qualified advocates.",
        href: "/legal-services",
        subItems: ["Civil", "Criminal"],
        person: { name: "Mr. S. Alljeen Jothimani, B.A., B.L.", position: "Advocate & Legal Counsel", experience: 10 },
    },
    {
        icon: Tent,
        title: "All Type of Shelter Work",
        sub: "All Type of Shelter Work",
        img: "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?q=80&w=900",
        desc: "Secure, weather-resistant shelter infrastructure for industrial, generator, electrical and HVAC applications.",
        href: "/shelter-and-enclosure-works",
        subItems: [
            "Industrial Shelter Work",
            "Generator Shelter Work",
            "Electrical Shelter Work",
            "Warehouse / Storage Shelter Work",
            "Solar Equipment Shelter Work",
            "AC / HVAC Equipment Shelter Work",
        ],
        person: { name: "Mr. Ravi Maarimuthu", position: "Managing Director", experience: 15 },
    },
    {
        icon: BarChart3,
        title: "Trading Service",
        sub: "Trading Service",
        img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=900",
        desc: "Dynamic market trading spanning physical commodities and digital crypto assets with strategic research-driven execution.",
        href: "/trading-services",
        subItems: ["Commodities", "Crypto"],
        person: { name: "Mr. Ravi Maarimuthu", position: "Managing Director", experience: 15 },
    },
    {
        icon: MapPin,
        title: "Tourism Services",
        sub: "Tourism Services",
        img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=900",
        desc: "Curated spiritual and luxury travel experiences across India, including the Nava Graha Yatra pilgrim circuit.",
        href: "/tourism-services",
        subItems: ["Nava Graha Yatra", "Pilgrimage Tours", "Domestic Tour Packages"],
        person: { name: "Mr. Manikandaprabu R", position: "Tourism Operations Head", experience: 7 },
    },
    {
        icon: Wrench,
        title: "All Type of Machinery Service",
        sub: "All Type of Machinery Service",
        img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=900",
        desc: "Heavy-duty mechanical engineering, precision machinery operations, and fleet management for industrial projects.",
        href: "/mechanical-machinery-services",
        subItems: ["Industrial Machinery Services", "Machinery Buy & Sell", "All Type of Vehicle Services"],
        person: { name: "Mr. Naresh D", position: "Mechanical & Machinery Operations Head", experience: 6 },
    },
];

// ─── Division Card ──────────────────────────────────────────────────────────────
function DivisionCard({ biz, idx }) {
    const Icon = biz.icon;
    return (
        <Link
            href={biz.href}
            className="hpg-biz group relative flex flex-col overflow-hidden rounded-3xl bg-[#0E0E0E]
                border border-white/[0.06] hover:border-[#d4af35]/40
                hover:shadow-[0_20px_60px_rgba(212,175,53,0.12)]
                transition-all duration-700 ease-out md:hover:-translate-y-2 cursor-pointer"
        >
            {/* ── Image banner ── */}
            <div className="relative h-48 overflow-hidden shrink-0">
                <img
                    src={biz.img}
                    alt={biz.title}
                    className="absolute inset-0 w-full h-full object-cover
                        brightness-[0.55] group-hover:brightness-[0.7] group-hover:scale-[1.06]
                        transition-all duration-[1.4s] ease-out"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/40 to-transparent" />
                {/* Gold hover tint */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#d4af35]/0 to-[#d4af35]/0
                    group-hover:from-[#d4af35]/10 group-hover:to-transparent
                    transition-all duration-700 pointer-events-none" />

                {/* Index + Icon row */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="text-[11px] font-black tracking-[0.25em] tabular-nums text-white/40
                        group-hover:text-[#d4af35]/70 transition-colors duration-500">
                        {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10
                        flex items-center justify-center
                        group-hover:bg-[#d4af35] group-hover:border-[#d4af35]
                        transition-all duration-500">
                        <Icon className="w-5 h-5 text-[#d4af35] group-hover:text-black transition-colors duration-500" />
                    </div>
                </div>

                {/* Gold scan line */}
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#d4af35]/50 to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>

            {/* ── Content body ── */}
            <div className="flex flex-col flex-1 p-6 gap-4">

                {/* Title */}
                <h3 className="text-lg font-black text-white/90 group-hover:text-white
                    tracking-tight leading-snug transition-colors duration-400">
                    {biz.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 group-hover:text-slate-400
                    transition-colors duration-400">
                    {biz.desc}
                </p>

                {/* Sub-services pills */}
                <div className="flex flex-wrap gap-1.5">
                    {biz.subItems.slice(0, 4).map((item, i) => (
                        <span key={i}
                            className="text-[10px] font-bold px-2.5 py-1 rounded-full
                                bg-white/[0.04] border border-white/[0.07] text-slate-500
                                group-hover:border-[#d4af35]/20 group-hover:text-slate-400
                                transition-all duration-400">
                            {item}
                        </span>
                    ))}
                    {biz.subItems.length > 4 && (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full
                            bg-[#d4af35]/[0.06] border border-[#d4af35]/20 text-[#d4af35]/70">
                            +{biz.subItems.length - 4} more
                        </span>
                    )}
                </div>


                {/* Separator + Division head bio — only if person data exists */}
                {biz.person && (
                    <>
                        <div className="h-px bg-white/[0.05] group-hover:bg-[#d4af35]/15 transition-colors duration-500" />

                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#d4af35]/10 border border-[#d4af35]/20
                                flex items-center justify-center shrink-0">
                                <User className="w-3.5 h-3.5 text-[#d4af35]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-black text-white/80 leading-snug truncate">
                                    {biz.person.name}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <Briefcase className="w-3 h-3 text-[#d4af35]/50 shrink-0" />
                                    <p className="text-[10px] text-slate-600 truncate">{biz.person.position}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <Clock className="w-3 h-3 text-[#d4af35]/50" />
                                <span className="text-[10px] font-black text-[#d4af35]">{biz.person.experience}+</span>
                                <span className="text-[10px] text-slate-600">yrs</span>
                            </div>
                        </div>
                    </>
                )}


                {/* CTA row */}
                <div className="flex items-center justify-between mt-auto pt-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-700
                        group-hover:text-[#d4af35] transition-colors duration-500">
                        View Services
                    </span>
                    <div className="w-8 h-8 rounded-full border border-white/[0.08]
                        flex items-center justify-center
                        group-hover:bg-[#d4af35] group-hover:border-[#d4af35]
                        transition-all duration-500">
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-black
                            group-hover:rotate-45 transition-all duration-300" />
                    </div>
                </div>
            </div>
        </Link>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HashPrimeGroupsPage() {
    const pageRef = useRef(null);

    useGSAP(() => {
        // Hero entrance
        gsap.timeline({ defaults: { ease: 'power3.out' } })
            .fromTo('.hpg-h1', { y: 80, opacity: 0, skewY: 4 }, { y: 0, opacity: 1, skewY: 0, duration: 1 }, 0.3)
            .fromTo('.hpg-sub', { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.6)
            .fromTo('.hpg-badge', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.5);

        // Reveal on scroll
        gsap.utils.toArray('.reveal-up').forEach((el) => {
            gsap.fromTo(el, { y: 60, opacity: 0 }, {
                y: 0, opacity: 1, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 88%', once: true }
            });
        });

        // Division cards stagger
        gsap.fromTo('.hpg-biz', { y: 70, opacity: 0, scale: 0.95 }, {
            y: 0, opacity: 1, scale: 1, duration: 0.75, stagger: 0.07, ease: 'power3.out',
            scrollTrigger: { trigger: '.hpg-biz-grid', start: 'top 82%', once: true }
        });

        // Team cards
        gsap.fromTo('.hpg-card', { y: 80, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.9, stagger: 0.09, ease: 'back.out(1.1)',
            scrollTrigger: { trigger: '.hpg-team-grid', start: 'top 80%', once: true }
        });
    }, { scope: pageRef });

    return (
        <div ref={pageRef} className="relative bg-[#050505] overflow-x-hidden">

            {/* Global dot-grid */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]"
                style={{ backgroundImage: 'radial-gradient(#d4af35 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

            {/* ══ HERO ══════════════════════════════════════════════════════ */}
            <section className="relative z-10 py-36 px-6 flex flex-col items-center text-center overflow-hidden">
                <div className="absolute -left-40 top-0 w-[600px] h-[600px] bg-[#d4af35] rounded-full blur-[200px] opacity-[0.05] pointer-events-none" />
                <div className="absolute -right-40 bottom-0 w-[500px] h-[500px] bg-[#d4af35] rounded-full blur-[180px] opacity-[0.03] pointer-events-none" />

                <div className="hpg-badge inline-flex items-center gap-2 px-4 py-2 rounded-full
                    bg-[#121212] border border-[#d4af35]/20 mb-8">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af35] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4af35]" />
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af35]">Multi Business Verticals</span>
                </div>

                <div className="relative overflow-hidden leading-none">
                    <h1 className="hpg-h1 text-[15vw] md:text-[10vw] lg:text-[8vw] font-black tracking-[-0.03em] uppercase leading-[0.9] text-shine">
                        Hash Prime
                    </h1>
                </div>

                <div className="hpg-sub my-6 h-px w-20 bg-gradient-to-r from-transparent via-[#d4af35] to-transparent mx-auto" />

                <p className="hpg-sub text-base md:text-lg text-slate-400 leading-relaxed max-w-lg mx-auto">
                    We operate{" "}
                    <span className="text-white font-semibold relative inline-block">
                        Multi Business Divisions
                        <span className="absolute -bottom-px left-0 right-0 h-px bg-[#d4af35]/60" />
                    </span>
                    {" "}all over Tamil Nadu.
                </p>
            </section>

            <div className="absolute top-[85vh] right-[-12%] w-[700px] h-[700px] bg-[#d4af35] opacity-[0.03] rounded-full blur-[150px] pointer-events-none z-0" />

            {/* ══ DIVISIONS GRID ══════════════════════════════════════════ */}
            <section id="divisions" className="relative z-10 py-4 pb-24 px-6 md:px-16">

                {/* Section header */}
                <div className="reveal-up max-w-[90rem] mx-auto mb-14">
                    <div className="flex flex-col md:flex-row md:items-end gap-8 justify-between">
                        <div>
                            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[0.95]">
                                Our Business<br /><span className="text-[#d4af35]">Divisions</span>
                            </h2>
                        </div>
                        <p className="text-slate-500 text-base max-w-sm leading-relaxed md:text-right">
                            Click any division to view detailed services and submit an enquiry.
                        </p>
                    </div>
                </div>

                {/* Card grid */}
                <div className="hpg-biz-grid max-w-[90rem] mx-auto
                    grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {businesses.map((biz, idx) => (
                        <DivisionCard key={idx} biz={biz} idx={idx} />
                    ))}
                </div>
            </section>

            {/* ══ EXECUTIVE DIRECTORS — 3D flip cards ═══════════════════ */}
            <section className="relative z-10 py-24 px-6 md:px-16">
                <div className="reveal-up max-w-[90rem] mx-auto">

                    <div className="flex items-center gap-5 mb-14">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af35] animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af35]/60">Executive Directors</span>
                        </div>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#d4af35]/20 to-transparent" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">Hash Prime Groups</span>
                    </div>

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
                                <style>{`
                                    @media (min-width: 640px) {
                                        .hpg-card { flex-basis: calc(33.333% - 11px) !important; max-width: calc(33.333% - 11px) !important; }
                                    }
                                    @media (min-width: 1024px) {
                                        .hpg-card { flex-basis: 200px !important; max-width: 200px !important; }
                                    }
                                `}</style>

                                <div
                                    className="flip-inner relative w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
                                    style={{ transformStyle: 'preserve-3d' }}
                                >
                                    {/* FRONT */}
                                    <div
                                        className="absolute inset-0 rounded-2xl overflow-hidden border border-white/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                                        style={{ backfaceVisibility: 'hidden' }}
                                    >
                                        <img src={member.img} alt={member.name} className="w-full h-full object-cover object-top" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/10" />
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af35]/10 blur-[40px] rounded-full" />
                                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#d4af35]/30 to-transparent" />
                                    </div>

                                    {/* BACK */}
                                    <div
                                        className="absolute inset-0 rounded-2xl bg-[#0A0A0A] border border-[#d4af35]/30
                                            flex flex-col items-center justify-center gap-4 px-5
                                            [box-shadow:inset_0_0_60px_rgba(212,175,53,0.06),0_4px_40px_rgba(0,0,0,0.6)]"
                                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                    >
                                        <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-[#d4af35]/40" />
                                        <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-[#d4af35]/40" />
                                        <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-[#d4af35]/40" />
                                        <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-[#d4af35]/40" />

                                        <div className="w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-[#d4af35]/40 shrink-0
                                            shadow-[0_0_20px_rgba(212,175,53,0.2)]">
                                            <img src={member.img} alt={member.name} className="w-full h-full object-cover object-top" />
                                        </div>

                                        <div className="text-center">
                                            <p className="text-[13px] font-black text-white leading-snug tracking-tight mb-2.5">
                                                {member.name}
                                            </p>
                                            <div className="w-10 h-px bg-[#d4af35]/50 mx-auto mb-2.5" />
                                            <p className="text-[9.5px] font-bold text-[#d4af35] uppercase tracking-wider leading-snug">
                                                {member.title}
                                            </p>
                                        </div>

                                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4af35] animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ CONTACT FOOTER ════════════════════════════════════════ */}
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
