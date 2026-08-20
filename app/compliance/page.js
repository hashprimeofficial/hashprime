import Link from "next/link";
import { FileCheck, Shield, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Regulatory Compliance & Standards | Hashprime",
  description: "Official compliance policies, statutory standards, quality certifications, and risk governance for Hashprime operations.",
  alternates: {
    canonical: "https://hashprime.in/compliance",
  },
};

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100 pt-32 pb-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#d4af35]/10 border border-[#d4af35]/20 py-2 px-4 rounded-full mb-6">
            <Shield className="w-4 h-4 text-[#d4af35]" />
            <span className="text-xs font-bold text-[#d4af35] uppercase tracking-widest">Statutory & Operational Standards</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
            Regulatory & <span className="text-[#d4af35]">Compliance Framework</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Our adherence to Indian statutory requirements, workplace safety protocols, client confidentiality, and fair contracting standards.
          </p>
        </div>

        <div className="space-y-8 mb-16">
          {/* Engineering & Infrastructure Scope */}
          <div className="bg-[#121212] border border-white/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <FileCheck className="w-6 h-6 text-[#d4af35]" />
              Commercial & Engineering Operating Scope
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Hashprime provides B2B and institutional engineering, civil contracting, fiber-optic deployment, and electrical maintenance services. All engagements are executed under formal, legally binding bilateral service agreements, milestone schedules, and service level agreements (SLAs).
            </p>
            <ul className="space-y-2 text-slate-400 text-sm list-disc list-inside">
              <li>Adherence to National Building Code (NBC) standards in civil construction works.</li>
              <li>Strict electrical safety compliance per Indian Electricity Rules for substation and generator maintenance.</li>
              <li>Low-loss optical network standards and calibrated OTDR compliance for telecom carrier contracts.</li>
            </ul>
          </div>

          {/* Financial Clarification */}
          <div className="bg-[#121212] border border-[#d4af35]/30 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-[#d4af35]" />
              Non-Financial Service Declaration
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              To avoid any ambiguity for consumers, algorithmic search bots, and regulatory authorities:
            </p>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#d4af35] shrink-0 mt-0.5" />
                <span>Hashprime is <strong>not</strong> a SEBI-registered Portfolio Management Service (PMS), Alternative Investment Fund (AIF), or Mutual Fund.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#d4af35] shrink-0 mt-0.5" />
                <span>Hashprime is <strong>not</strong> an RBI-registered Non-Banking Financial Company (NBFC) or deposit-taking entity.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#d4af35] shrink-0 mt-0.5" />
                <span>Hashprime does <strong>not</strong> accept public investment deposits, operate collective investment schemes, or offer guaranteed return contracts.</span>
              </div>
            </div>
          </div>

          {/* Data Protection & Anti-Fraud */}
          <div className="bg-[#121212] border border-white/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Shield className="w-6 h-6 text-[#d4af35]" />
              Data Security & Anti-Fraud Protocols
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              We uphold strict data security practices per the Information Technology Act, 2000 and the Digital Personal Data Protection (DPDP) Act. All customer records, enterprise blueprints, and billing data are encrypted at rest and in transit.
            </p>
            <p className="text-slate-400 text-xs leading-relaxed">
              If you receive any communication claiming to be from Hashprime offering high-yield financial schemes or asking for cryptocurrency transfers to private wallets, report it immediately to our compliance desk at <a href="mailto:support@hashprime.in" className="text-[#d4af35] underline">support@hashprime.in</a>.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/grievance-redressal" className="inline-flex items-center gap-2 bg-[#d4af35] text-[#0A0A0A] font-bold px-8 py-4 rounded-xl hover:bg-[#f5e0a3] transition-colors">
            Grievance Redressal Matrix <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
