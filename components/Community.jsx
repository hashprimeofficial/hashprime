"use client";

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Twitter, Github, Linkedin, MessageCircle, Send } from 'lucide-react';
import Link from 'next/link';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Community() {
    const containerRef = useRef(null);

    const socials = [
        { name: 'Twitter', icon: <Twitter className="w-6 h-6" />, color: 'hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2]', link: '#' },
        { name: 'Discord', icon: <MessageCircle className="w-6 h-6" />, color: 'hover:bg-[#5865F2] hover:text-white hover:border-[#5865F2]', link: '#' },
        { name: 'Telegram', icon: <Send className="w-6 h-6" />, color: 'hover:bg-[#229ED9] hover:text-white hover:border-[#229ED9]', link: '#' },
        { name: 'GitHub', icon: <Github className="w-6 h-6" />, color: 'hover:bg-[#333] hover:text-white hover:border-[#333]', link: '#' },
        { name: 'LinkedIn', icon: <Linkedin className="w-6 h-6" />, color: 'hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]', link: '#' },
    ];

    useGSAP(() => {
        gsap.fromTo(
            ".comm-element",
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            }
        );
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-20 bg-white border-t border-gray-100" id="community">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="comm-element text-3xl md:text-4xl font-black text-navy mb-4 tracking-tight">
                    Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-green-500">Hashprime</span> Community
                </h2>
                <p className="comm-element text-lg text-slate-500 font-medium max-w-2xl mx-auto mb-12">
                    Connect with millions of traders worldwide. Stay updated, share strategies, and grow together.
                </p>

                <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                    {socials.map((social) => (
                        <Link
                            key={social.name}
                            href={social.link}
                            className={`comm-element flex items-center justify-center w-16 h-16 rounded-2xl border-2 border-gray-100 text-slate-400 bg-white shadow-sm transition-all duration-300 transform hover:-translate-y-1 ${social.color}`}
                            aria-label={`Join our ${social.name}`}
                        >
                            {social.icon}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
