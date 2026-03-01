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
    const pathname = usePathname();

    // Lightweight auth check for showing Dashboard button
    const { data: authData } = useSWR('/api/auth/me', fetcher, {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
    });
    const isLoggedIn = !!authData?.user;

    const navLinks = [
        { href: '/services', label: 'Services' },
        { href: '/markets', label: 'Markets' },
        { href: '/features', label: 'Features' },
    ];

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
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );

        const xTo = gsap.quickTo(ctaRef.current, "x", { duration: 0.4, ease: "power3" });
        const yTo = gsap.quickTo(ctaRef.current, "y", { duration: 0.4, ease: "power3" });

        const mouseMove = (e) => {
            const { clientX, clientY } = e;
            const { height, width, left, top } = ctaRef.current.getBoundingClientRect();
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);
            xTo(x * 0.2);
            yTo(y * 0.2);
        };

        const mouseLeave = () => { xTo(0); yTo(0); };

        ctaRef.current.addEventListener("mousemove", mouseMove);
        ctaRef.current.addEventListener("mouseleave", mouseLeave);

        return () => {
            if (ctaRef.current) {
                ctaRef.current.removeEventListener("mousemove", mouseMove);
                ctaRef.current.removeEventListener("mouseleave", mouseLeave);
            }
        };
    }, { scope: containerRef });

    const isDarkPage = pathname === '/services';

    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 w-full pointer-events-none">
            <header ref={containerRef} className={`pointer-events-auto w-full max-w-4xl backdrop-blur-xl border rounded-full px-6 transition-all duration-300 ${isDarkPage ? 'bg-[#0B1120]/40 border-white/10 shadow-none' : 'bg-white/50 border-white/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]'}`}>
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center group">
                            <span className="text-2xl font-black tracking-tighter text-[#39FF14] relative overflow-hidden flex items-center drop-shadow-[0_0_8px_rgba(57,255,20,0.3)]">
                                Hashprime
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            </span>
                        </Link>
                    </div>
                    <nav className="hidden md:flex space-x-8">
                        {navLinks.map(({ href, label }) => (
                            <Link key={href} href={href} className={`relative text-sm font-bold transition-all group ${pathname === href ? 'text-[#39FF14]' : (isDarkPage ? 'text-white/70 hover:text-[#39FF14]' : 'text-slate-500 hover:text-navy')}`}>
                                {label}
                                <span className={`absolute -bottom-1.5 left-0 right-0 h-[2px] bg-[#39FF14] rounded-full transition-all duration-300 ${pathname === href ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`} />
                            </Link>
                        ))}
                    </nav>
                    <div className="flex items-center space-x-4">
                        {isLoggedIn ? (
                            <div ref={ctaRef} className="hidden md:inline-block p-2 -m-2">
                                <Link href="/dashboard" className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all ${isDarkPage ? 'bg-[#39FF14] text-[#0B1120]' : 'bg-navy text-white'}`}>
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </Link>
                            </div>
                        ) : (
                            <>
                                <Link href="/login" className={`hidden md:block text-sm font-bold transition-colors ${isDarkPage ? 'text-white/70 hover:text-[#39FF14]' : 'text-slate-500 hover:text-navy'}`}>
                                    Log In
                                </Link>
                                <div ref={ctaRef} className="hidden md:inline-block p-2 -m-2">
                                    <Link href="/register" className={`px-5 py-2 rounded-full text-sm font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all ${isDarkPage ? 'bg-[#39FF14] text-[#0B1120]' : 'bg-navy text-white'}`}>
                                        Get Started
                                    </Link>
                                </div>
                            </>
                        )}

                        <button className={`md:hidden p-2 ${isDarkPage ? 'text-white' : 'text-navy'}`} onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Offcanvas Menu */}
            <div className={`fixed inset-0 bg-white z-[60] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col pointer-events-auto ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <Link href="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                        <Image src="/textonly.png" alt="Hashprime" width={140} height={35} />
                    </Link>
                    <button className="p-2 text-slate-500 hover:text-navy transition-colors bg-slate-50 rounded-full" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-grow flex flex-col px-8 py-12 space-y-8 overflow-y-auto">
                    {navLinks.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`offcanvas-link text-3xl font-black border-b pb-4 transition-colors duration-300 ${pathname === href ? 'text-[#39FF14] border-[#39FF14]/20' : 'text-navy border-slate-50 hover:text-[#39FF14]'}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >{label}</Link>
                    ))}
                </div>

                <div className="p-8 mt-auto border-t border-slate-100 flex flex-col space-y-4">
                    {isLoggedIn ? (
                        <Link href="/dashboard" className="w-full text-center py-4 rounded-xl text-lg font-bold text-white bg-navy shadow-lg" onClick={() => setIsMobileMenuOpen(false)}>
                            My Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="w-full text-center py-4 rounded-xl text-lg font-bold text-navy bg-slate-50 mb-2" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
                            <Link href="/register" className="w-full text-center py-4 rounded-xl text-lg font-bold text-white bg-navy shadow-lg" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
