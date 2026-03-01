"use client";

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Twitter, Github, Linkedin, MessageCircle, Send } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const socials = [
    { name: 'Twitter', icon: <Twitter size={20} />, link: '#' },
    { name: 'Discord', icon: <MessageCircle size={20} />, link: '#' },
    { name: 'Telegram', icon: <Send size={20} />, link: '#' },
    { name: 'GitHub', icon: <Github size={20} />, link: '#' },
    { name: 'LinkedIn', icon: <Linkedin size={20} />, link: '#' },
];

const avatars = [
    { id: 1, src: 'https://i.pravatar.cc/100?img=33', top: '20%', left: '15%', size: 'w-12 h-12' },
    { id: 2, src: 'https://i.pravatar.cc/100?img=47', top: '30%', left: '80%', size: 'w-16 h-16' },
    { id: 3, src: 'https://i.pravatar.cc/100?img=12', top: '75%', left: '10%', size: 'w-20 h-20' },
    { id: 4, src: 'https://i.pravatar.cc/100?img=5', top: '60%', left: '85%', size: 'w-14 h-14' },
];

export default function Community() {
    const containerRef = useRef(null);

    useGSAP(() => {
        // Ultra-smooth hardware accelerated floating
        gsap.to(".comm-avatar-min", {
            y: "random(-40, 40)",
            x: "random(-20, 20)",
            duration: "random(5, 8)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        gsap.fromTo(".comm-min-reveal",
            { y: 20, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out",
                scrollTrigger: { trigger: containerRef.current, start: "top 85%" }
            }
        );
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-24 md:py-40 relative overflow-hidden bg-white" id="community">

            {/* Minimal Background Aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#39FF14]/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Floating Avatars (Simplified/Hardware Accelerated) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
                {avatars.map((avatar) => (
                    <div
                        key={avatar.id}
                        className={`comm-avatar-min absolute ${avatar.size} rounded-full border-2 border-slate-100 bg-white shadow-sm overflow-hidden will-change-transform opacity-40`}
                        style={{ top: avatar.top, left: avatar.left }}
                    >
                        <Image src={avatar.src} alt="Member" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" unoptimized />
                    </div>
                ))}
            </div>

            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">

                {/* Minimal Header */}
                <div className="mb-16">
                    <div className="comm-min-reveal inline-flex items-center gap-2 mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Join the Collective</span>
                    </div>

                    <h2 className="comm-min-reveal text-4xl md:text-6xl font-black text-[#0B1120] tracking-tighter leading-tight mb-8">
                        OUR GLOBAL<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B1120] to-[#39FF14]">NETWORK</span>
                    </h2>

                    <p className="comm-min-reveal text-lg text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                        Connect with the forward-thinkers building the future of finance. Transparent, collaborative, and entirely decentralised.
                    </p>
                </div>

                {/* Minimal Social Links */}
                <div className="comm-min-reveal flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
                    {socials.map((social) => (
                        <Link
                            key={social.name}
                            href={social.link}
                            className="group flex items-center gap-3 text-slate-400 hover:text-[#0B1120] transition-colors duration-300"
                        >
                            <span className="p-2 rounded-xl bg-slate-50 group-hover:bg-[#39FF14]/10 group-hover:text-[#39FF14] transition-all duration-300">
                                {social.icon}
                            </span>
                            <span className="text-xs font-black uppercase tracking-widest">{social.name}</span>
                        </Link>
                    ))}
                </div>



            </div>
        </section>
    );
}
