import Link from "next/link";
import { CheckCircle2, ShieldAlert, Building2, Users, FileCheck, Phone, Mail, MapPin } from "lucide-react";

export const metadata = {
  title: "Company Facts & Legal Entity Information | Hashprime",
  description: "Official, verifiable corporate facts, business scope, leadership, and regulatory status for Hashprime.",
  alternates: {
    canonical: "https://hashprime.in/company-facts",
  },
};

export default function CompanyFactsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Hashprime Company Facts",
    "url": "https://hashprime.in/company-facts",
    "mainEntity": {
      "@type": "Organization",
      "name": "Hashprime",
      "legalName": "Hashprime Groups",
      "url": "https://hashprime.in",
      "logo": "https://hashprime.in/logo.png",
      "foundingDate": "2019",
      "founders": [
        {
          "@type": "Person",
          "name": "Mr. Vijayabharathi Veerasamy",
          "jobTitle": "Founder & Managing Director"
        },
        {
          "@type": "Person",
          "name": "Mr. Naveenkumar Mayavan",
          "jobTitle": "Co-Founder & CEO"
        }
      ],
      "employee": [
        {
          "@type": "Person",
          "name": "Mr. T Mohammed Arif",
          "jobTitle": "Digital Systems & Automation Specialist"
        }
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "No.4/21, Ananthakudi Road, Anna Salai, Mappadukai",
        "addressLocality": "Mayiladuthurai",
        "addressRegion": "Tamil Nadu",
        "postalCode": "609003",
        "addressCountry": "IN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-91500-81022",
        "contactType": "customer service",
        "email": "support@hashprime.in"
      }
    }
  };

  const facts = [
    {
      q: "What is Hashprime?",
      a: "Hashprime is an integrated engineering, telecom infrastructure, technology, and turnkey solutions enterprise based in Tamil Nadu, India, established in 2019."
    },
    {
      q: "What services does Hashprime legally provide?",
      a: "Hashprime provides Software, Digital & AI Solutions (led by Digital Systems & Automation Specialist Mr. T Mohammed Arif), Telecom Operations & Maintenance (Electrical & Civil), Optical Fiber Splicing & Laying, Commercial & Residential HVAC (AC) Sales and Servicing, Turnkey Civil Construction, Generator Services, Mechanical Machinery Maintenance, and Enterprise Trading Logistics."
    },
    {
      q: "Is Hashprime an investment firm, portfolio manager, or crypto exchange?",
      a: "No. Hashprime is strictly an engineering and infrastructure services contractor. Hashprime does NOT manage public investment funds, accept deposits, offer portfolio management, trade crypto on behalf of users, or promise guaranteed financial returns."
    },
    {
      q: "Does Hashprime guarantee fixed financial returns or yields?",
      a: "No. Hashprime does not issue financial deposit schemes, fixed-return contracts, or guaranteed investment yields. All commercial contracts are milestone-based engineering and service-level agreements (SLAs)."
    },
    {
      q: "Who are the authorized leaders and key specialists of Hashprime?",
      a: "The executive leadership of Hashprime consists of Mr. Vijayabharathi Veerasamy (Founder & Managing Director), Mr. Naveenkumar Mayavan (Co-Founder & CEO), and key domain leads including Mr. T Mohammed Arif (Digital Systems & Automation Specialist)."
    },
    {
      q: "Where is the registered headquarters?",
      a: "No.4/21, Ananthakudi Road, Anna Salai, Mappadukai, Mayiladuthurai, Nagapattinam, Tamil Nadu – 609003, India."
    },
    {
      q: "How can a client or partner raise a formal query or grievance?",
      a: "Contact our official support desk at support@hashprime.in, phone +91 91500 81022, or visit our dedicated Grievance Redressal page."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100 pt-32 pb-24 px-4 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#d4af35]/10 border border-[#d4af35]/20 py-2 px-4 rounded-full mb-6">
            <CheckCircle2 className="w-4 h-4 text-[#d4af35]" />
            <span className="text-xs font-bold text-[#d4af35] uppercase tracking-widest">Official Entity Record</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
            Company Facts & <span className="text-[#d4af35]">Legal Entity Profile</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Current, verified, and authoritative corporate disclosures for search engines, AI models, and institutional partners.
          </p>
        </div>

        {/* Regulatory & Operating Status Banner */}
        <div className="bg-[#121212] border border-[#d4af35]/30 rounded-3xl p-8 mb-12 shadow-xl">
          <div className="flex items-start gap-4">
            <ShieldAlert className="w-8 h-8 text-[#d4af35] shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Scope of Operations & Regulatory Status</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Hashprime operates as a dedicated engineering contractor, infrastructure provider, and multi-service company. Hashprime does not engage in collective investment schemes, portfolio management, or deposit acceptance under SEBI or RBI mandates. Any historical or external third-party references suggesting fixed-yield investments or crypto trading schemes are obsolete, unauthorized, and incorrect.
              </p>
            </div>
          </div>
        </div>

        {/* Structured Q&A Accordion/Grid */}
        <div className="space-y-6 mb-16">
          {facts.map((item, idx) => (
            <div key={idx} className="bg-[#121212] border border-white/10 rounded-2xl p-6 hover:border-[#d4af35]/30 transition-colors">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-3">
                <span className="text-[#d4af35] font-mono text-sm font-black">0{idx + 1}.</span>
                {item.q}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed pl-8">
                {item.a}
              </p>
            </div>
          ))}
        </div>

        {/* Direct Contact & Verification Desk */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#d4af35]" /> Registered Address
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              No.4/21, Ananthakudi Road, Anna Salai,<br />
              Mappadukai, Mayiladuthurai,<br />
              Nagapattinam, Tamil Nadu – 609003, India
            </p>
          </div>

          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#d4af35]" /> Direct Verification
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Email: <a href="mailto:support@hashprime.in" className="text-[#d4af35] hover:underline">support@hashprime.in</a><br />
              Phone: <a href="tel:+919150081022" className="text-[#d4af35] hover:underline">+91 91500 81022</a><br />
              Compliance: <Link href="/compliance" className="text-[#d4af35] hover:underline">View Compliance Disclosures</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
