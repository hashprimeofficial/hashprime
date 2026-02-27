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
    { name: 'Twitter', icon: <Twitter className="w-6 h-6" />, color: 'hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2]', link: '#' },
    { name: 'Discord', icon: <MessageCircle className="w-6 h-6" />, color: 'hover:bg-[#5865F2] hover:text-white hover:border-[#5865F2]', link: '#' },
    { name: 'Telegram', icon: <Send className="w-6 h-6" />, color: 'hover:bg-[#229ED9] hover:text-white hover:border-[#229ED9]', link: '#' },
    { name: 'GitHub', icon: <Github className="w-6 h-6" />, color: 'hover:bg-[#333] hover:text-white hover:border-[#333]', link: '#' },
    { name: 'LinkedIn', icon: <Linkedin className="w-6 h-6" />, color: 'hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]', link: '#' },
];

const avatars = [
    { id: 1, src: 'https://i.pravatar.cc/100?img=33', top: '15%', left: '10%', delay: '0s', size: 'w-12 h-12' },
    { id: 2, src: 'https://i.pravatar.cc/100?img=47', top: '25%', left: '85%', delay: '-2s', size: 'w-14 h-14' },
    { id: 3, src: 'https://i.pravatar.cc/100?img=12', top: '70%', left: '15%', delay: '-4s', size: 'w-16 h-16' },
    { id: 4, src: 'https://i.pravatar.cc/100?img=5', top: '65%', left: '80%', delay: '-6s', size: 'w-12 h-12' },
    { id: 5, src: 'https://i.pravatar.cc/100?img=68', top: '40%', left: '5%', delay: '-1s', size: 'w-10 h-10' },
    { id: 6, src: 'https://i.pravatar.cc/100?img=59', top: '80%', left: '50%', delay: '-3s', size: 'w-12 h-12' }
];

export default function Community() {
    const containerRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo(
            ".comm-element",
            { y: 30, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out",
                scrollTrigger: { trigger: containerRef.current, start: "top 80%" }
            }
        );
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-32 relative overflow-hidden bg-white border-t border-gray-100" id="community">

            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none"></div>

            {/* Glowing Orb */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 mx-auto h-[400px] w-[400px] rounded-full bg-[#39FF14] opacity-[0.05] blur-[100px] pointer-events-none z-0"></div>

            {/* Floating Avatars */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden md:block">
                {avatars.map((avatar) => (
                    <div
                        key={avatar.id}
                        className={`absolute ${avatar.size} rounded-full border-2 border-white shadow-xl shadow-navy/5 bg-slate-100 flex items-center justify-center overflow-hidden animate-float`}
                        style={{
                            top: avatar.top,
                            left: avatar.left,
                            animationDelay: avatar.delay,
                            animationDuration: '6s'
                        }}
                    >
                        <Image src={avatar.src} alt="Community Member" fill className="object-cover" unoptimized />
                    </div>
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes float {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-20px) scale(1.05); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <div className="comm-element inline-flex items-center space-x-2 bg-slate-50 border border-slate-200 py-2 px-4 rounded-full mb-8">
                    <span className="w-2 h-2 rounded-full bg-navy animate-pulse"></span>
                    <span className="text-sm font-bold text-navy tracking-widest uppercase">Global Network</span>
                </div>

                <h2 className="comm-element text-4xl md:text-6xl font-black text-navy mb-6 tracking-tight leading-tight">
                    Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-emerald-500">Hashprime</span> Community
                </h2>
                <p className="comm-element text-lg text-slate-500 font-medium max-w-2xl mx-auto mb-16 leading-relaxed">
                    Connect with millions of investors worldwide. Stay updated on market trends, share winning strategies, and grow your portfolio together.
                </p>

                {/* Social Cards */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-6 relative z-10">
                    {socials.map((social) => (
                        <Link
                            key={social.name}
                            href={social.link}
                            className={`comm-element flex flex-col items-center justify-center w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-[2rem] border border-gray-100 text-slate-400 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 transform hover:-translate-y-3 hover:shadow-2xl gap-3 ${social.color}`}
                            aria-label={`Join our ${social.name}`}
                        >
                            {social.icon}
                            <span className="text-sm font-bold">{social.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
