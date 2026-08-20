'use client';

import Link from 'next/link';
import { ArrowLeft, ScrollText, ShieldCheck, FileCheck, Scale, AlertCircle } from 'lucide-react';

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
                    <p className="text-[#d4af35]/60 font-semibold text-sm">Last Updated: August 2026</p>
                </div>

                {/* Agreement Banner */}
                <div className="p-6 bg-[#121212]/80 backdrop-blur-md border border-[#d4af35]/30 rounded-3xl mb-12 flex items-start gap-4">
                    <ShieldCheck className="w-6 h-6 text-[#d4af35] shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-black text-white text-base mb-1">Commercial Contracting Terms</h4>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">
                            These Terms of Service govern your access to Hashprime websites, client portals, and commercial engineering service engagements. By requesting engineering quotations, entering into service agreements, or accessing our platforms, you agree to comply with these terms.
                        </p>
                    </div>
                </div>

                {/* Terms Sections */}
                <div className="space-y-12">
                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-white flex items-center gap-3">
                            <span className="text-[#d4af35] font-mono text-sm">01.</span> Nature of Services & Operating Scope
                        </h2>
                        <div className="text-sm text-slate-400 leading-relaxed space-y-3 font-medium">
                            <p>
                                Hashprime operates as an integrated multi-service engineering and infrastructure contractor. Our services include Turnkey Telecom Civil & Electrical Operations & Maintenance (O&M), Optical Fiber Splicing & Laying, Commercial & Residential HVAC Sales and Servicing, Turnkey Civil Construction, Heavy Machinery Maintenance, Generator Services, and Industrial Procurement Logistics.
                            </p>
                            <p>
                                Hashprime does not provide financial services, investment schemes, portfolio management, or deposit products. All commercial transactions represent bona fide commercial contracts, service level agreements (SLAs), or hardware procurement orders.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-white flex items-center gap-3">
                            <span className="text-[#d4af35] font-mono text-sm">02.</span> Project Quotations, SLAs & Milestones
                        </h2>
                        <div className="text-sm text-slate-400 leading-relaxed space-y-3 font-medium">
                            <p>
                                All engineering works are executed under mutually agreed work orders detailing project scopes, milestone deliverables, technical specifications, and delivery timelines.
                            </p>
                            <p>
                                Payment terms, mobilization advances, and milestone release schedules are governed exclusively by the individual bilateral contract executed between the client and Hashprime.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-white flex items-center gap-3">
                            <span className="text-[#d4af35] font-mono text-sm">03.</span> Site Safety, Quality Assurance & Compliance
                        </h2>
                        <div className="text-sm text-slate-400 leading-relaxed space-y-3 font-medium">
                            <p>
                                Field operations comply strictly with the National Building Code of India, the Indian Electricity Rules, and telecom industry standard operating procedures.
                            </p>
                            <p>
                                Clients and site owners agree to provide safe physical access, necessary statutory permissions, and environmental clearances required for field teams to execute contracted works safely.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-white flex items-center gap-3">
                            <span className="text-[#d4af35] font-mono text-sm">04.</span> Client Portal & Confidentiality
                        </h2>
                        <div className="text-sm text-slate-400 leading-relaxed space-y-3 font-medium">
                            <p>
                                Access to Hashprime enterprise portals is restricted to authorized partners, corporate clients, and internal personnel. Users must maintain the confidentiality of their credentials.
                            </p>
                            <p>
                                All engineering blueprints, technical drawings, proprietary methodologies, and corporate pricing shared during engagement are protected under strict non-disclosure obligations.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-white flex items-center gap-3">
                            <span className="text-[#d4af35] font-mono text-sm">05.</span> Limitation of Liability & Warranties
                        </h2>
                        <div className="text-sm text-slate-400 leading-relaxed space-y-3 font-medium">
                            <p>
                                Hashprime warrants that all services will be performed with professional diligence in accordance with industry best practices. Equipment warranties (HVAC units, generators, optical hardware) are backed by the respective original equipment manufacturers (OEMs).
                            </p>
                            <p>
                                Hashprime shall not be liable for indirect, incidental, or consequential damages resulting from force majeure events, grid power failures, natural disasters, or unauthorized modifications made by third parties.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-white flex items-center gap-3">
                            <span className="text-[#d4af35] font-mono text-sm">06.</span> Governing Law & Dispute Resolution
                        </h2>
                        <div className="text-sm text-slate-400 leading-relaxed space-y-3 font-medium">
                            <p>
                                These Terms and all service contracts are governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in Tamil Nadu, India.
                            </p>
                            <p>
                                For grievances or contract clarifications, refer to our <Link href="/grievance-redressal" className="text-[#d4af35] underline">Grievance Redressal Mechanism</Link> or email <a href="mailto:support@hashprime.in" className="text-[#d4af35] underline">support@hashprime.in</a>.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
