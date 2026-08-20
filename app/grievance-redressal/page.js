import Link from "next/link";
import { Scale, Mail, Phone, MapPin, Clock, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Grievance Redressal & Escalation Policy | Hashprime",
  description: "Official grievance redressal mechanism, nodal escalation matrix, and resolution timelines for Hashprime clients and stakeholders.",
  alternates: {
    canonical: "https://hashprime.in/grievance-redressal",
  },
};

export default function GrievancePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100 pt-32 pb-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#d4af35]/10 border border-[#d4af35]/20 py-2 px-4 rounded-full mb-6">
            <Scale className="w-4 h-4 text-[#d4af35]" />
            <span className="text-xs font-bold text-[#d4af35] uppercase tracking-widest">Formal Dispute Resolution</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
            Grievance Redressal & <span className="text-[#d4af35]">Escalation Matrix</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Hashprime is committed to swift, transparent, and fair resolution of all customer, vendor, and stakeholder concerns.
          </p>
        </div>

        {/* 3-Tier Escalation Matrix */}
        <div className="space-y-6 mb-16">
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-[#d4af35] font-mono text-sm">Level 1:</span> Customer Support Desk
              </h3>
              <span className="text-xs text-slate-400 bg-white/5 px-3 py-1 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#d4af35]" /> SLA: 24 - 48 Hours
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              For general inquiries, service updates, billing clarifications, or operational issues with ongoing contracts.
            </p>
            <p className="text-slate-400 text-sm">
              Email: <a href="mailto:support@hashprime.in" className="text-[#d4af35] hover:underline">support@hashprime.in</a> | Phone: +91 91500 81022
            </p>
          </div>

          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-[#d4af35] font-mono text-sm">Level 2:</span> Compliance & Operations Officer
              </h3>
              <span className="text-xs text-slate-400 bg-white/5 px-3 py-1 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#d4af35]" /> SLA: 3 - 5 Business Days
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              If your issue remains unresolved after Level 1 or relates to contractual disputes, compliance verification, or statutory inquiries.
            </p>
            <p className="text-slate-400 text-sm">
              Attn: Nodal Compliance Desk<br />
              Email: <a href="mailto:compliance@hashprime.in" className="text-[#d4af35] hover:underline">compliance@hashprime.in</a> (or <a href="mailto:support@hashprime.in" className="text-[#d4af35] hover:underline">support@hashprime.in</a> with subject &quot;COMPLIANCE ESCALATION&quot;)
            </p>
          </div>

          <div className="bg-[#121212] border border-[#d4af35]/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-[#d4af35] font-mono text-sm">Level 3:</span> Executive Management Desk
              </h3>
              <span className="text-xs text-slate-400 bg-white/5 px-3 py-1 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#d4af35]" /> SLA: 7 Business Days
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Final escalation to the Managing Director and Legal Counsel for formal arbitration or enterprise-level review.
            </p>
            <p className="text-slate-400 text-sm">
              Address for Formal Postal Communication:<br />
              Office of the Managing Director, Hashprime Groups<br />
              No.4/21, Ananthakudi Road, Anna Salai, Mappadukai, Mayiladuthurai, Nagapattinam, Tamil Nadu – 609003
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/company-facts" className="inline-flex items-center gap-2 text-[#d4af35] text-sm font-bold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Return to Company Facts
          </Link>
        </div>
      </div>
    </div>
  );
}
