'use client';

import React, { useState } from 'react';
import { Scale, ShieldAlert, FileSignature, Briefcase, ChevronRight, CheckCircle2, User, Phone, Mail, MapPin } from 'lucide-react';

/*
*/

export default function LegalServicesPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    practiceArea: '',
    details: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch('/api/business-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          fieldOfInquiry: `Legal Services — ${formData.practiceArea}`,
          source: 'legal',
          details: formData.details,
          contactDateTime: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setStatus({ type: 'success', message: 'Your legal enquiry has been submitted securely. We will contact you shortly.' });
        setFormData({ name: '', phone: '', email: '', practiceArea: '', details: '' });
      } else {
        setStatus({ type: 'error', message: 'There was an error submitting your enquiry. Please try again or contact us directly.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'A network error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "LegalService"],
    "name": "Hashprime Legal",
    "description": "Professional legal consultation and document drafting. Property title verification, civil litigation, corporate contracts, and criminal defense.",
    "url": "https://hashprime.com/legal-services",
    "telephone": "9629296179",
    "email": "salljeenjothimani@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "D/No. 50/114, Mariyamman Koil Street, Commercial Tax Dept Office Opp., Hasthampatty",
      "addressLocality": "Salem",
      "postalCode": "636007",
      "addressCountry": "IN"
    }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-slate-300 font-sans selection:bg-[#d4af35] selection:text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#d4af35]/10 via-[#0A0A0A] to-[#0A0A0A] -z-10"></div>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-white">
            <span className="bg-gradient-to-r from-[#d4af35] to-[#E5C158] bg-clip-text text-transparent">Strategic Legal Counsel</span> <br className="hidden md:block"/>
            & Corporate Risk Mitigation
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12">
            Professional legal consultation and document drafting by Hashprime Legal. Comprehensive expertise in civil litigation, criminal defense, and corporate contracts.
          </p>
        </div>
      </section>

      {/* Advocate Profile Section */}
      <section className="py-16 px-6 lg:px-8 bg-[#0E0E0E]/50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0E0E0E] border border-[#d4af35]/30 rounded-2xl p-8 relative overflow-hidden group hover:border-[#d4af35]/60 transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af35]/5 rounded-bl-full -z-10"></div>
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="w-24 h-24 bg-gradient-to-br from-[#d4af35] to-[#b8941f] rounded-full flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(212,175,53,0.2)]">
                <Scale className="w-12 h-12 text-black" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">Mr. S. Alljeen Jothimani, B.A., B.L.</h3>
                <p className="text-[#d4af35] font-medium mb-6 uppercase tracking-wider text-sm">Advocate & Legal Counsel</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="text-slate-300">D/No. 50/114, Mariyamman Koil Street, Commercial Tax Dept Office Opp., Hasthampatty, Salem - 636 007</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-slate-400 shrink-0" />
                      <span className="text-slate-300">96292 96179 / 81246 09750</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-slate-400 shrink-0" />
                      <span className="text-slate-300">salljeenjothimani@gmail.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Core Legal Expertise</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#d4af35] to-[#E5C158] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#0E0E0E] border border-white/[0.06] rounded-2xl p-8 hover:border-[#d4af35]/40 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#d4af35]/10 transition-colors">
                <Briefcase className="w-7 h-7 text-[#d4af35]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Civil Law Services</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Comprehensive handling of civil disputes and property matters with meticulous attention to legal frameworks.
              </p>
              <ul className="space-y-3">
                {['Property title checking', 'Boundary disputes', 'Contract negotiation', 'Legal notice issuance', 'Court representation'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <ChevronRight className="w-4 h-4 text-[#d4af35] shrink-0 mt-0.5" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#0E0E0E] border border-white/[0.06] rounded-2xl p-8 hover:border-[#d4af35]/40 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#d4af35]/10 transition-colors">
                <ShieldAlert className="w-7 h-7 text-[#d4af35]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Criminal Law Services</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Strategic defense and legal representation ensuring your rights are protected throughout the legal process.
              </p>
              <ul className="space-y-3">
                {['Legal defense advocacy', 'Bail applications', 'Petition filings', 'Legal representation'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <ChevronRight className="w-4 h-4 text-[#d4af35] shrink-0 mt-0.5" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#0E0E0E] border border-white/[0.06] rounded-2xl p-8 hover:border-[#d4af35]/40 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#d4af35]/10 transition-colors">
                <FileSignature className="w-7 h-7 text-[#d4af35]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Corporate & Drafting</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Ironclad corporate agreements and compliance structuring to safeguard your business interests.
              </p>
              <ul className="space-y-3">
                {['MoUs & Agreements', 'Commercial lease deeds', 'Vendor agreements', 'Partnership contracts', 'Employment compliance'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <ChevronRight className="w-4 h-4 text-[#d4af35] shrink-0 mt-0.5" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us & Form Section */}
      <section className="py-20 px-6 lg:px-8 bg-[#0E0E0E]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Why Choose Hashprime Legal</h2>
            <div className="space-y-6">
              {[
                { title: 'Highly Experienced Panel', desc: 'Guidance from seasoned advocates with a proven track record.' },
                { title: 'Client Confidentiality', desc: 'Absolute discretion and ironclad protection of sensitive information.' },
                { title: 'Thorough Document Scrutiny', desc: 'Meticulous review processes to prevent future legal liabilities.' },
                { title: 'Clear Strategic Guidance', desc: 'Transparent communication and actionable legal strategies.' }
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#d4af35] shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-white">{feature.title}</h4>
                    <p className="text-slate-400 text-sm mt-1">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-white/[0.06] rounded-2xl p-8 relative">
            <h3 className="text-2xl font-bold text-white mb-6">Request Legal Consultation</h3>
            
            {status.message && (
              <div className={`p-4 rounded-xl mb-6 text-sm ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35]/50 transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Phone Number</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35]/50 transition-colors" placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35]/50 transition-colors" placeholder="john@company.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Area of Practice</label>
                <select required name="practiceArea" value={formData.practiceArea} onChange={handleChange} className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af35]/50 transition-colors appearance-none">
                  <option value="" disabled>Select legal requirement...</option>
                  <option value="Civil Dispute">Civil Dispute</option>
                  <option value="Property Document Verification">Property Document Verification</option>
                  <option value="Corporate Contract">Corporate Contract</option>
                  <option value="Criminal Defense">Criminal Defense</option>
                  <option value="General Advice">General Advice</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Brief Details of Matter</label>
                <textarea required name="details" value={formData.details} onChange={handleChange} rows="4" className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35]/50 transition-colors resize-none" placeholder="Provide a brief summary of your legal matter..."></textarea>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-[#d4af35] to-[#b8941f] text-black font-bold py-4 px-8 rounded-xl hover:from-[#E5C158] hover:to-[#d4af35] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2">
                {isSubmitting ? 'Submitting...' : 'Request Consultation'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
