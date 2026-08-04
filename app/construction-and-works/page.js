"use client";

import React, { useState } from 'react';
import { Building2, PaintBucket, TreePine, Hammer, MapPin, Building, Ruler, ArrowRight, ShieldCheck, Clock, CheckCircle } from 'lucide-react';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Hashprime",
  "category": "Construction Company",
  "description": "Turnkey civil construction services by Hashprime. Residential, commercial, and industrial construction, modern interior/exterior architecture, painting, and landscaping.",
  "url": "https://hashprime.com/construction-and-works"
};

export default function ConstructionWorksPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    projectCategory: '',
    plotArea: '',
    projectLocation: '',
    budget: '',
    details: ''
  });
  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    try {
      const res = await fetch('/api/business-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          fieldOfInquiry: `Construction — ${formData.projectCategory}`,
          source: 'construction',
          details: `Area: ${formData.plotArea} | Location: ${formData.projectLocation} | Budget: ${formData.budget} \nDetails: ${formData.details}`,
          contactDateTime: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error('Submission failed');
      
      setStatus({ loading: false, error: null, success: true });
      setFormData({
        name: '', phone: '', email: '', projectCategory: '', plotArea: '', projectLocation: '', budget: '', details: ''
      });
    } catch (err) {
      setStatus({ loading: false, error: 'Failed to submit enquiry. Please try again later.', success: false });
    }
  };

  const services = [
    {
      icon: <Building2 className="w-8 h-8 text-[#d4af35]" />,
      title: "Building Construction",
      description: "Turnkey civil construction for luxury villas, commercial complexes, multi-story buildings, industrial plants."
    },
    {
      icon: <Hammer className="w-8 h-8 text-[#d4af35]" />,
      title: "Interior & Exterior Design",
      description: "Modern modular kitchens, executive office interiors, architectural cladding, ceiling design, lighting."
    },
    {
      icon: <PaintBucket className="w-8 h-8 text-[#d4af35]" />,
      title: "Professional Painting & Finishes",
      description: "Weather-proof exterior coatings, textured luxury wall finishes, premium interior paints."
    },
    {
      icon: <TreePine className="w-8 h-8 text-[#d4af35]" />,
      title: "Gardening & Landscaping",
      description: "Landscape architecture, manicured lawns, automated drip irrigation, decorative green walls."
    }
  ];

  return (
    <main className="bg-[#0A0A0A] min-h-screen flex flex-col justify-between text-slate-300 font-sans selection:bg-[#d4af35] selection:text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 lg:px-8 overflow-hidden border-b border-white/[0.06] bg-[#0A0A0A]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#d4af35]/10 via-[#0A0A0A] to-[#0A0A0A] opacity-40"></div>
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#d4af35] animate-pulse"></span>
              <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">Hashprime Construction</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
              <span className="bg-gradient-to-r from-[#d4af35] to-[#E5C158] bg-clip-text text-transparent">
                Architectural Engineering Precision
              </span>
              <br />& Turnkey Construction Excellence
            </h1>
            <p className="text-lg text-slate-400 mb-8 max-w-xl">
              Integrating civil engineering rigor with contemporary architectural design. We deliver end-to-end building construction, custom interior architecture, and landscape design.
            </p>
            
          </div>
          <div className="lg:col-span-5 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af35] to-[#E5C158] rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-[#0E0E0E] border border-white/[0.06] rounded-3xl overflow-hidden aspect-[16/10] shadow-2xl">
              <img src="/hashprime-construction.jpg" alt="Architectural Engineering Precision" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Our Masterclass Offerings</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-[#d4af35] to-[#E5C158] mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <div key={idx} className="bg-[#0E0E0E] border border-white/[0.06] rounded-2xl p-8 hover:border-[#d4af35]/40 hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-xl bg-white/[0.02] flex items-center justify-center mb-6 border border-white/[0.05] group-hover:bg-[#d4af35]/10 transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-6 lg:px-12 bg-[#0E0E0E] border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Hashprime Construction?</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                We engineer legacy structures with an unwavering commitment to quality and transparency.
              </p>
            </div>
            <ul className="space-y-6">
              {[
                { title: "Strict Structural Quality Audits", desc: "Multi-stage inspections ensuring absolute durability and safety compliance." },
                { title: "Transparent Material Sourcing", desc: "Procuring only premium, certified materials with zero hidden markups." },
                { title: "Adhering to Timelines", desc: "Precision-driven project management ensuring on-time delivery, every time." },
                { title: "End-to-End Site Management", desc: "Seamless execution from soil testing to final bespoke finishes." }
              ].map((item, idx) => (
                <li key={idx} className="flex gap-4">
                  <div className="mt-1">
                    <CheckCircle className="w-6 h-6 text-[#d4af35]" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg">{item.title}</h4>
                    <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Enquiry Form */}
          <div className="bg-[#0A0A0A] border border-white/[0.10] rounded-2xl p-8 lg:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af35]/5 rounded-full blur-3xl -z-10"></div>
            <h3 className="text-2xl font-bold text-white mb-2">Initiate a Project</h3>
            <p className="text-slate-400 mb-8 text-sm">Consult with our lead architects and civil engineers.</p>
            
            {status.success ? (
              <div className="bg-[#121c12] border border-green-900/50 rounded-xl p-6 text-center space-y-4">
                <ShieldCheck className="w-12 h-12 text-green-500 mx-auto" />
                <h4 className="text-green-500 font-bold text-lg">Enquiry Received Successfully</h4>
                <p className="text-green-200/70 text-sm">Our project management team will contact you within 24 hours.</p>
                <button onClick={() => setStatus(prev => ({ ...prev, success: false }))} className="text-slate-400 hover:text-white text-sm mt-4 underline">Submit another enquiry</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <div className="grid md:grid-cols-2 gap-4">
                  <input required name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="Full Name *" className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors" />
                  <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="Phone Number *" className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors" />
                </div>
                
                <input required name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="Email Address *" className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors" />
                
                <select required name="projectCategory" value={formData.projectCategory} onChange={handleInputChange} className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-[#d4af35]/50 transition-colors appearance-none">
                  <option value="" disabled>Select Project Category *</option>
                  <option value="Civil Construction">Civil Construction</option>
                  <option value="Interior Design">Interior Design</option>
                  <option value="Exterior Work">Exterior Work</option>
                  <option value="Professional Painting">Professional Painting</option>
                  <option value="Landscaping">Landscaping</option>
                </select>

                <div className="grid md:grid-cols-2 gap-4">
                  <input name="plotArea" value={formData.plotArea} onChange={handleInputChange} type="text" placeholder="Plot Area (e.g., 2400 sq.ft)" className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors" />
                  <input name="budget" value={formData.budget} onChange={handleInputChange} type="text" placeholder="Estimated Budget" className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors" />
                </div>
                
                <input required name="projectLocation" value={formData.projectLocation} onChange={handleInputChange} type="text" placeholder="Project Location *" className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors" />

                <textarea name="details" value={formData.details} onChange={handleInputChange} rows="3" placeholder="Additional Details or Requirements" className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors resize-none"></textarea>

                {status.error && <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">{status.error}</div>}

                <button disabled={status.loading} type="submit" className="w-full bg-gradient-to-r from-[#d4af35] to-[#b8941f] text-black font-bold py-4 px-8 rounded-xl hover:from-[#E5C158] hover:to-[#d4af35] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                  {status.loading ? 'Submitting...' : 'Request Consultation'} <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
