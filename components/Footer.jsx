"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowUp } from 'lucide-react';

function BackToTop() {
    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white hover:bg-[#39FF14] hover:text-navy transition-all duration-300 shadow-md hover:-translate-y-1"
            aria-label="Back to top"
        >
            <ArrowUp className="w-5 h-5" />
        </button>
    );
}

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 w-full pt-20 pb-10 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    <div className="lg:col-span-2">
                        {/* Logo: icon + wordmark */}
                        <Link href="/" className="flex items-center space-x-3 mb-6">
                            <Image src="/logoonly.png" alt="Hashprime icon" width={40} height={40} className="object-contain" />
                            <Image src="/textonly.png" alt="Hashprime" width={130} height={32} className="object-contain" />
                        </Link>

                        <p className="text-slate-500 text-sm leading-relaxed max-w-sm mb-8 font-medium">
                            The apex of crypto investments. Built for speed, uncompromised security, and the ultimate user experience. Join the next generation of finance.
                        </p>
                        <div className="flex flex-col space-y-4 max-w-sm">
                            <span className="text-sm font-bold text-navy uppercase tracking-wider">Subscribe to our Newsletter</span>
                            <div className="flex items-center shadow-sm rounded-lg">
                                <div className="relative flex-grow">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="email"
                                        className="block w-full pl-10 pr-4 py-3.5 border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#39FF14] text-sm font-medium"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <button className="bg-[#39FF14] text-navy font-bold py-3.5 px-8 rounded-r-lg hover:opacity-90 transition-opacity text-sm whitespace-nowrap">
                                    Join Now
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-navy font-bold mb-6 text-sm uppercase tracking-wider">Platform</h3>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-slate-500 hover:text-navy text-sm font-medium transition-colors">Spot Trading</Link></li>
                            <li><Link href="#" className="text-slate-500 hover:text-navy text-sm font-medium transition-colors">Margin Trading</Link></li>
                            <li><Link href="/markets" className="text-slate-500 hover:text-navy text-sm font-medium transition-colors">Live Markets</Link></li>
                            <li><Link href="#" className="text-slate-500 hover:text-navy text-sm font-medium transition-colors">Fees</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-navy font-bold mb-6 text-sm uppercase tracking-wider">Support</h3>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-slate-500 hover:text-navy text-sm font-medium transition-colors">24/7 Help Center</Link></li>
                            <li><Link href="#" className="text-slate-500 hover:text-navy text-sm font-medium transition-colors">API Documentation</Link></li>
                            <li><Link href="#" className="text-slate-500 hover:text-navy text-sm font-medium transition-colors">Investment Rules</Link></li>
                            <li><Link href="#" className="text-slate-500 hover:text-navy text-sm font-medium transition-colors">Submit Ticket</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-navy font-bold mb-6 text-sm uppercase tracking-wider">Company</h3>
                        <ul className="space-y-4">
                            <li><Link href="/company" className="text-slate-500 hover:text-navy text-sm font-medium transition-colors">About Us</Link></li>
                            <li><Link href="#" className="text-slate-500 hover:text-navy text-sm font-medium transition-colors">Careers</Link></li>
                            <li><Link href="#" className="text-slate-500 hover:text-navy text-sm font-medium transition-colors">Press</Link></li>
                            <li><Link href="/security" className="text-slate-500 hover:text-navy text-sm font-medium transition-colors">Security</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 text-sm font-medium">
                        &copy; {new Date().getFullYear()} Hashprime. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-6">
                        <Link href="#" className="text-slate-400 hover:text-navy text-sm font-medium transition-colors">Privacy Policy</Link>
                        <Link href="#" className="text-slate-400 hover:text-navy text-sm font-medium transition-colors">Terms of Service</Link>
                        <BackToTop />
                    </div>
                </div>
            </div>
        </footer>
    );
}
