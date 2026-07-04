'use client';

import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Eye, Database, Lock, Globe } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#050505] text-slate-300 py-16 md:py-24 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#d4af35]/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#d4af35]/5 blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                {/* Back button */}
                <Link href="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#d4af35] hover:text-[#f8d76d] transition-colors mb-12">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                {/* Header */}
                <div className="mb-16">
                    <div className="w-12 h-12 bg-[#d4af35]/10 rounded-2xl flex items-center justify-center border border-[#d4af35]/20 mb-6">
                        <ShieldCheck className="w-6 h-6 text-[#d4af35]" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Privacy Policy</h1>
                    <p className="text-[#d4af35]/60 font-semibold text-sm">Last Updated: July 04, 2026</p>
                </div>

                {/* Intro */}
                <p className="text-base text-slate-400 font-medium leading-relaxed mb-12">
                    HashPrime Asset Management ("we", "our", or "us") is dedicated to protecting your privacy. This Privacy Policy details how we collect, store, encrypt, and process your personal and financial information when you use our platform.
                </p>

                {/* Privacy Sections */}
                <div className="space-y-12">
                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-white flex items-center gap-3">
                            <span className="text-[#d4af35] font-mono text-sm">01.</span> Information We Collect
                        </h2>
                        <div className="text-sm text-slate-400 leading-relaxed space-y-3 font-medium">
                            <p>
                                To maintain compliance with financial regulations and secure your investments, we collect the following:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-slate-400 font-semibold">
                                <li><strong>Identity Data:</strong> Full Name, Email Address, and encrypted Password.</li>
                                <li><strong>Verification Data:</strong> KYC documents, government-issued photo IDs, and residential details.</li>
                                <li><strong>Nominee Data:</strong> Full Name, date of birth, relationship, and uploaded Identity Proof (Aadhaar Card) of your designated beneficiary.</li>
                                <li><strong>Financial Data:</strong> Bank account numbers, IFSC codes, bank names, and digital wallet addresses (USDT BEP20).</li>
                                <li><strong>Referral Data:</strong> Linkages between referrers and referred users, tracking commissions and payout histories.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-white flex items-center gap-3">
                            <span className="text-[#d4af35] font-mono text-sm">02.</span> How We Use Your Data
                        </h2>
                        <div className="text-sm text-slate-400 leading-relaxed space-y-3 font-medium">
                            <p>
                                We utilize your personal and financial data to run the platform and ensure security audit standards:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-slate-400 font-semibold">
                                <li>To verify your identity and approve KYC verification.</li>
                                <li>To execute daily calculations of investment interest payouts and matured balances.</li>
                                <li>To process and settle withdrawal claims to your bank accounts or digital wallets.</li>
                                <li>To track, audit, and pay out the 5% referral program commissions upon admin approval.</li>
                                <li>To comply with legal obligations, prevent financial fraud, and manage platform security.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-white flex items-center gap-3">
                            <span className="text-[#d4af35] font-mono text-sm">03.</span> Security, Encryption & Digital Consent
                        </h2>
                        <div className="text-sm text-slate-400 leading-relaxed space-y-3 font-medium">
                            <p>
                                HashPrime deploys institutional-grade security measures. All document uploads, including nominee Aadhaar Cards and KYC proofs, are cryptographically encrypted at rest.
                            </p>
                            <p>
                                <strong>Digital Consent:</strong> In compliance with electronic verification standards, when you save nominee details, your explicit acceptance is timestamped and stored alongside the encrypted nominee records.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-white flex items-center gap-3">
                            <span className="text-[#d4af35] font-mono text-sm">04.</span> Sharing of Information
                        </h2>
                        <div className="text-sm text-slate-400 leading-relaxed space-y-3 font-medium">
                            <p>
                                We do not sell, rent, or trade your personal data to third parties. Information is shared strictly under the following scenarios:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-slate-400 font-semibold">
                                <li>With banking partners or payment processors to settle your INR/USDT withdrawal claims.</li>
                                <li>With official regulatory authorities or legal entities if required by law to comply with AML/CTF audits.</li>
                                <li>With cloud storage and verification service providers under strict non-disclosure agreements.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-white flex items-center gap-3">
                            <span className="text-[#d4af35] font-mono text-sm">05.</span> Data Retention & Rights
                        </h2>
                        <div className="text-sm text-slate-400 leading-relaxed space-y-3 font-medium">
                            <p>
                                We retain your personal and financial details as long as your account remains active or as required by regulatory compliance. You have the right to request access to your stored records, check your nominee configuration, and view your bank cappings.
                            </p>
                            <p>
                                To request account closure or data erasure, please submit a support ticket via the platform panel. Note that certain investment records must be retained for compliance audits.
                            </p>
                        </div>
                    </section>
                </div>

                {/* Footer divider */}
                <div className="mt-20 pt-8 border-t border-white/5 flex justify-between items-center text-xs text-slate-500 font-bold uppercase tracking-wider">
                    <span>© {new Date().getFullYear()} HashPrime.</span>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                </div>
            </div>
        </div>
    );
}
