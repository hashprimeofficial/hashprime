'use client';

import Link from 'next/link';
import { ArrowLeft, ScrollText, ShieldAlert, Landmark, FileText, Scale } from 'lucide-react';

export default function TermsOfService() {
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
                        <ScrollText className="w-6 h-6 text-[#d4af35]" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Terms of Service</h1>
                    <p className="text-[#d4af35]/60 font-semibold text-sm">Last Updated: July 04, 2026</p>
                </div>

                {/* Agreement Warning */}
                <div className="p-6 bg-[#121212]/80 backdrop-blur-md border border-[#d4af35]/30 rounded-3xl mb-12 flex items-start gap-4">
                    <ShieldAlert className="w-6 h-6 text-[#d4af35] shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-black text-white text-base mb-1">Please Read Carefully</h4>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">
                            These Terms of Service govern your access to and use of the HashPrime platform. By registering an account, submitting KYC documentation, or funding an investment scheme, you enter into a legally binding agreement and agree to abide by all the rules and disclosures outlined below.
                        </p>
                    </div>
                </div>

                {/* Terms Sections */}
                <div className="space-y-12">
                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-white flex items-center gap-3">
                            <span className="text-[#d4af35] font-mono text-sm">01.</span> Account Registration & Referral Policy
                        </h2>
                        <div className="text-sm text-slate-400 leading-relaxed space-y-3 font-medium">
                            <p>
                                To access the HashPrime platform, registration is strictly restricted. You must provide a valid referral code or referral email address from an active member of the platform during sign-up. Registration without a valid referral code is not permitted.
                            </p>
                            <p>
                                You agree to provide accurate, current, and complete information. Any duplicate profiles or misrepresentations during sign-up will result in immediate suspension of account privileges and frozen wallet balances.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-white flex items-center gap-3">
                            <span className="text-[#d4af35] font-mono text-sm">02.</span> Identity Verification (KYC) & Nominee Details
                        </h2>
                        <div className="text-sm text-slate-400 leading-relaxed space-y-3 font-medium">
                            <p>
                                HashPrime operates in compliance with international anti-money laundering (AML) and counter-terrorist financing (CTF) protocols. Users must undergo identity verification (KYC), including the submission of government-issued identification cards.
                            </p>
                            <p>
                                <strong>Nominee Directives:</strong> To protect investor assets, you must link exactly one (1) nominee to your profile. This nomination requires a signed consent form and identity verification (Aadhaar Card). Once nominee details are saved, they become locked (view-only) and cannot be updated without official manual admin verification.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-white flex items-center gap-3">
                            <span className="text-[#d4af35] font-mono text-sm">03.</span> Investment Schemes & Fixed Returns
                        </h2>
                        <div className="text-sm text-slate-400 leading-relaxed space-y-3 font-medium">
                            <p>
                                HashPrime offers structured investment schemes tailored to both Indian Rupees (INR) and digital wallet deposits (USDT). These schemes carry predefined duration lockups (e.g., 3-month, 6-month, 1-year, or 5-year plans) and specified return percentages.
                            </p>
                            <p>
                                Upon scheme maturity, the initial investment principal along with accumulated interest yields are automatically calculated and credited directly to your platform wallet (INR or USDT, depending on the currency used). Early termination of active schemes is strictly subject to penalty fees and administrative lock periods.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-white flex items-center gap-3">
                            <span className="text-[#d4af35] font-mono text-sm">04.</span> Wallet Operations & Bank Withdrawals
                        </h2>
                        <div className="text-sm text-slate-400 leading-relaxed space-y-3 font-medium">
                            <p>
                                Platform balances can be settled via linked bank accounts (for INR settlements) or BEP20 digital wallets (for USDT settlements).
                            </p>
                            <p>
                                <strong>Bank Cappings:</strong> To reduce operational risks, each user account is capped at a maximum of five (5) linked bank accounts in their profile settings. All withdrawal claims are subject to offline manual review by HashPrime administrators to ensure compliance and prevent fraudulent transfers.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-white flex items-center gap-3">
                            <span className="text-[#d4af35] font-mono text-sm">05.</span> Referral Program & Commission Payments
                        </h2>
                        <div className="text-sm text-slate-400 leading-relaxed space-y-3 font-medium">
                            <p>
                                Members can earn referral bonuses when new users register using their referral link. The platform rewards the referrer with a 5% commission on the principal amount invested by their referrals.
                            </p>
                            <p>
                                <strong>Payout Claim Workflow:</strong> Referral commissions accumulate in the Referral Wallet. To request a payout, the member must manually submit a claim selecting a registered bank account. Claims are processed under a "Request" → "Pending" → "Approved" lifecycle. Payments are settled offline and marked completed by administrators upon verification.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-white flex items-center gap-3">
                            <span className="text-[#d4af35] font-mono text-sm">06.</span> Disclaimers & Risk Disclosures
                        </h2>
                        <div className="text-sm text-slate-400 leading-relaxed space-y-3 font-medium">
                            <p>
                                <strong>No Financial Advice:</strong> The contents of this platform do not constitute investment, financial, or tax advice. HashPrime manages asset portfolios across multiple industries, stocks, and global equities. Past performance is no guarantee of future returns.
                            </p>
                            <p>
                                <strong>Market Exposure:</strong> Structured plans are exposed to general financial market conditions. By investing, you acknowledge the risk of loss of principal and accept that returns may vary based on overall macroeconomic indicators.
                            </p>
                        </div>
                    </section>
                </div>

                {/* Footer divider */}
                <div className="mt-20 pt-8 border-t border-white/5 flex justify-between items-center text-xs text-slate-500 font-bold uppercase tracking-wider">
                    <span>© {new Date().getFullYear()} HashPrime.</span>
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                </div>
            </div>
        </div>
    );
}
