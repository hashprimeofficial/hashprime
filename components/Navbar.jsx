"use client";

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import useSWR from 'swr';

gsap.registerPlugin(useGSAP);

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Navbar() {
    const ctaRef = useRef(null);
    const containerRef = useRef(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => { setMounted(true); }, []);

    // Lightweight auth check for showing Dashboard button
    const { data: authData } = useSWR('/api/auth/me', fetcher, {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
    });
    const isLoggedIn = !!authData?.user;

    const navLinks = [
        { href: '/features', label: 'Features' },
        { href: '/schemes', label: 'Schemes' },
        { href: '/hash-prime-groups', label: 'Our Business' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            gsap.fromTo('.offcanvas-link',
                { x: -30, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.15 }
            );
        }
    }, [isMobileMenuOpen]);

    useGSAP(() => {
        gsap.fromTo(
            containerRef.current,
            { y: -30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.2 }
        );

        const xTo = gsap.quickTo(ctaRef.current, "x", { duration: 0.4, ease: "power3" });
        const yTo = gsap.quickTo(ctaRef.current, "y", { duration: 0.4, ease: "power3" });

        const mouseMove = (e) => {
            if (!ctaRef.current) return;
            const { clientX, clientY } = e;
            const { height, width, left, top } = ctaRef.current.getBoundingClientRect();
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);
            xTo(x * 0.3);
            yTo(y * 0.3);
        };

        const mouseLeave = () => { xTo(0); yTo(0); };

        if (ctaRef.current) {
            ctaRef.current.addEventListener("mousemove", mouseMove);
            ctaRef.current.addEventListener("mouseleave", mouseLeave);
        }

        return () => {
            if (ctaRef.current) {
                ctaRef.current.removeEventListener("mousemove", mouseMove);
                ctaRef.current.removeEventListener("mouseleave", mouseLeave);
            }
        };
    }, { scope: containerRef });

    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 w-full pointer-events-none">
            <header
                ref={containerRef}
                className={`pointer-events-auto w-full max-w-5xl transition-all duration-500 rounded-full px-6 py-1 ${scrolled
                    ? 'bg-[#0A0A0A]/80 backdrop-blur-2xl border border-[#d4af35]/20 shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(212,175,53,0.1)]'
                    : 'bg-[#121212]/40 backdrop-blur-md border border-white/5 shadow-2xl'
                    }`}
            >
                <div className="flex justify-between items-center h-14 md:h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center group relative overflow-hidden">
                            <Image
                                src="/textonly.png"
                                alt="Hashprime Logo"
                                width={140}
                                height={40}
                                className="object-contain relative z-10 brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af35]/20 to-transparent -translate-x-full group-hover:animate-shimmer z-0" />
                        </Link>
                    </div>

                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`relative text-xs uppercase tracking-widest font-bold transition-all duration-300 group ${pathname === href ? 'text-[#d4af35]' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {label}
                                <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] bg-[#d4af35] rounded-t-full transition-all duration-300 ${pathname === href ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-100'
                                    }`} />
                            </Link>
                        ))}


                    </nav>

                    <div className="flex items-center space-x-6">
                        {isLoggedIn ? (
                            <div ref={ctaRef} className="hidden md:inline-block p-2 -m-2">
                                <Link
                                    href="/dashboard"
                                    className="relative flex items-center gap-2 bg-[#d4af35] text-[#0A0A0A] px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-black overflow-hidden group hover:shadow-[0_0_20px_rgba(212,175,53,0.4)] transition-all duration-500"
                                >
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                    <LayoutDashboard className="w-4 h-4 relative z-10 text-[#0A0A0A]" />
                                    <span className="relative z-10">Dashboard</span>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <Link href="/login" className="hidden md:block text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-white transition-colors">
                                    Login
                                </Link>
                                <div ref={ctaRef} className="hidden md:inline-block p-2 -m-2">
                                    <Link
                                        href="/register"
                                        className="relative flex items-center gap-2 bg-[#d4af35] text-[#0A0A0A] px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-black overflow-hidden group hover:shadow-[0_0_20px_rgba(212,175,53,0.4)] transition-all duration-500"
                                    >
                                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                        <span className="relative z-10">Get Started</span>
                                    </Link>
                                </div>
                            </>
                        )}

                        <button
                            className="md:hidden p-2 text-white hover:text-[#d4af35] transition-colors"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Offcanvas Menu */}
            <div className={`fixed inset-0 bg-[#0A0A0A] z-[100] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col pointer-events-auto ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
                {/* Decorative Background */}
                <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#d4af35] opacity-[0.05] rounded-full blur-[100px] pointer-events-none" />

                <div className="flex justify-between items-center p-6 border-b border-white/5 relative z-10">
                    <Link href="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                        <Image
                            src="/textonly.png"
                            alt="Hashprime Logo"
                            width={120}
                            height={32}
                            className="object-contain brightness-0 invert opacity-90"
                        />
                    </Link>
                    <button className="p-2 text-slate-400 hover:text-[#d4af35] transition-colors bg-[#121212]/50 rounded-full border border-white/5" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-grow flex flex-col px-8 py-16 space-y-10 overflow-y-auto relative z-10">
                    {navLinks.map(({ href, label }, i) => (
                        <Link
                            key={href}
                            href={href}
                            className={`offcanvas-link text-4xl font-black transition-colors duration-300 ${pathname === href ? 'text-[#d4af35]' : 'text-slate-300 hover:text-white'}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="text-sm font-bold text-[#d4af35]/50 mr-4">0{i + 1}</span>
                            {label}
                        </Link>
                    ))}

                </div>

                <div className="p-8 mt-auto border-t border-white/5 flex flex-col space-y-4 bg-[#121212]/50 relative z-10">
                    {isLoggedIn ? (
                        <Link href="/dashboard" className="w-full text-center py-4 rounded-xl text-sm uppercase tracking-widest font-black text-[#0A0A0A] bg-[#d4af35] shadow-[0_0_30px_rgba(212,175,53,0.2)]" onClick={() => setIsMobileMenuOpen(false)}>
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="w-full text-center py-4 rounded-xl text-sm uppercase tracking-widest font-bold text-white bg-[#121212] border border-white/10 hover:border-[#d4af35]/50 transition-colors mb-2" onClick={() => setIsMobileMenuOpen(false)}>Client Login</Link>
                            <Link href="/register" className="w-full text-center py-4 rounded-xl text-sm uppercase tracking-widest font-black text-[#0A0A0A] bg-[#d4af35] shadow-[0_0_30px_rgba(212,175,53,0.2)]" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
