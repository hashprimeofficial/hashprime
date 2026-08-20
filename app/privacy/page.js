'use client';

import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Database, Lock, Globe, FileText } from 'lucide-react';

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
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Privacy & Data Protection Policy</h1>
                    <p className="text-[#d4af35]/60 font-semibold text-sm">Last Updated: August 2026</p>
                </div>

                {/* Intro */}
                <p className="text-base text-slate-400 font-medium leading-relaxed mb-12">
                    Hashprime Groups (&quot;Hashprime&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to safeguarding personal and corporate information. This Privacy Policy explains how we collect, store, process, and protect information when you visit our website, submit business inquiries, or engage our engineering and infrastructure services.
                </p>

                {/* Privacy Sections */}
                <div className="space-y-12">
                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-white flex items-center gap-3">
                            <span className="text-[#d4af35] font-mono text-sm">01.</span> Information We Collect
                        </h2>
                        <div className="text-sm text-slate-400 leading-relaxed space-y-3 font-medium">
                            <p>
                                We collect information necessary to facilitate business inquiries, execute engineering contracts, and maintain secure portal communications:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-slate-400 font-medium">
                                <li><strong>Business Contact Information:</strong> Name, professional email address, corporate phone number, company name, and project location.</li>
                                <li><strong>Project &amp; Service Inquiries:</strong> Technical specifications, site requirements, RFPs, and blueprints submitted for engineering assessments.</li>
                                <li><strong>Careers &amp; Employment Data:</strong> Resumes, educational background, work history, and contact details submitted through our careers portal.</li>
                                <li><strong>Technical &amp; Analytics Data:</strong> IP addresses, browser types, and standard telemetry used to optimize website performance and prevent malicious access.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-white flex items-center gap-3">
                            <span className="text-[#d4af35] font-mono text-sm">02.</span> How We Use Your Information
                        </h2>
                        <div className="text-sm text-slate-400 leading-relaxed space-y-3 font-medium">
                            <p>
                                We use collected data strictly for legitimate business and operational purposes:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-slate-400 font-medium">
                                <li>To respond to service inquiries, prepare project estimates, and schedule site audits.</li>
                                <li>To execute and administer commercial contracts, invoices, and service level agreements (SLAs).</li>
                                <li>To recruit qualified personnel for open engineering, administrative, and operations roles.</li>
                                <li>To ensure digital security, prevent unauthorized system access, and comply with applicable statutory laws.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-white flex items-center gap-3">
                            <span className="text-[#d4af35] font-mono text-sm">03.</span> Data Security &amp; Encryption Standards
                        </h2>
                        <div className="text-sm text-slate-400 leading-relaxed space-y-3 font-medium">
                            <p>
                                Hashprime maintains technical and administrative safeguards to protect client data:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-slate-400 font-medium">
                                <li>All website traffic is encrypted using modern TLS/HTTPS protocols.</li>
                                <li>Client documents and project records are stored in secure environments with restricted access controls.</li>
                                <li>We implement regular vulnerability assessments, secure session management, and CSRF/XSS hardening.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-white flex items-center gap-3">
                            <span className="text-[#d4af35] font-mono text-sm">04.</span> Information Sharing &amp; Third Parties
                        </h2>
                        <div className="text-sm text-slate-400 leading-relaxed space-y-3 font-medium">
                            <p>
                                We do not sell, rent, or trade your personal or business data to third parties. Information is shared only:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-slate-400 font-medium">
                                <li>With certified subcontracting partners strictly on a need-to-know basis to execute on-site project deliverables.</li>
                                <li>With enterprise cloud hosting and infrastructure service providers bound by strict confidentiality terms.</li>
                                <li>When required by Indian law enforcement, statutory bodies, or court orders.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-white flex items-center gap-3">
                            <span className="text-[#d4af35] font-mono text-sm">05.</span> Statutory Rights &amp; Privacy Contact
                        </h2>
                        <div className="text-sm text-slate-400 leading-relaxed space-y-3 font-medium">
                            <p>
                                In accordance with the Digital Personal Data Protection (DPDP) Act and the Information Technology Act, 2000, you have the right to request access to, correction of, or deletion of your personal data held by Hashprime.
                            </p>
                            <p>
                                For any data privacy inquiries, contact our compliance desk at <a href="mailto:support@hashprime.in" className="text-[#d4af35] underline">support@hashprime.in</a> or write to:
                            </p>
                            <p className="text-slate-400 text-xs">
                                Nodal Privacy Officer, Hashprime Groups<br />
                                No.4/21, Ananthakudi Road, Anna Salai, Mappadukai,<br />
                                Mayiladuthurai, Nagapattinam, Tamil Nadu – 609003, India
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
