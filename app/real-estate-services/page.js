"use client";

import React, { useState } from 'react';
import { Map, Home, Building2, TowerControl, FileSignature, TrendingUp, HandCoins, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Hashprime",
  "category": "Real Estate Agency",
  "description": "Trusted real estate services by Hashprime. Buy, sell, or lease commercial plots, residential layouts, farm land, and telecom land with guaranteed legal title verification.",
  "url": "https://hashprime.com/real-estate-services"
};

export default function RealEstateServicesPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    intent: '',
    propertyType: '',
    location: '',
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
          fieldOfInquiry: `Real Estate — ${formData.intent} / ${formData.propertyType}`,
          source: 'real-estate',
          details: `Location: ${formData.location} | Budget/Value: ${formData.budget} \nDetails: ${formData.details}`,
          contactDateTime: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error('Submission failed');
      
      setStatus({ loading: false, error: null, success: true });
      setFormData({
        name: '', phone: '', email: '', intent: '', propertyType: '', location: '', budget: '', details: ''
      });
    } catch (err) {
      setStatus({ loading: false, error: 'Failed to submit enquiry. Please try again later.', success: false });
    }
  };

  const services = [
    {
      icon: <Map className="w-8 h-8 text-[#d4af35]" />,
      title: "Land Buy & Sell",
      description: "Verified commercial land, residential layout plots, and industrial corridors."
    },
    {
      icon: <HandCoins className="w-8 h-8 text-[#d4af35]" />,
      title: "Rental & Long-Term Leases",
      description: "Lease land solutions for telecom towers, solar farms, industrial warehouses, commercial spaces."
    },
    {
      icon: <Home className="w-8 h-8 text-[#d4af35]" />,
      title: "Agricultural & Farm Land",
      description: "Clear-title agricultural lands, farmhouses, eco-resort plots."
    },
    {
      icon: <FileSignature className="w-8 h-8 text-[#d4af35]" />,
      title: "Title Verification & Legal Support",
      description: "Document scrutiny, ownership chain verification, registration assistance, encumbrance checks."
    }
  ];

  return (
    <main className="bg-[#0A0A0A] min-h-screen text-slate-300 font-sans selection:bg-[#d4af35] selection:text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-12 overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#d4af35]/10 via-[#0A0A0A] to-[#0A0A0A] -z-10"></div>
        <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0E0E0E] border border-[#d4af35]/30 text-[#d4af35] text-sm font-medium tracking-wide">
            <TrendingUp className="w-4 h-4" /> Hashprime Real Estate Advisory
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Verified Real Estate Solutions & <br className="hidden md:block"/>
            <span className="bg-gradient-to-r from-[#d4af35] to-[#E5C158] bg-clip-text text-transparent">Strategic Land Advisory</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Navigate the real estate market with absolute certainty. We offer uncompromised legal verification and elite advisory for high-value asset acquisition, disposition, and leasing.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Our Real Estate Portfolio Services</h2>
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Trust Hashprime?</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                We eliminate ambiguity in real estate transactions, offering structured advisory backed by intensive market intelligence and legal rigor.
              </p>
            </div>
            <ul className="space-y-6">
              {[
                { title: "100% Legally Verified Titles", desc: "Rigorous legal checks to ensure entirely non-disputed, clear-title properties." },
                { title: "Localized Market Pricing Knowledge", desc: "Data-driven valuation ensuring optimal acquisition or liquidation prices." },
                { title: "Transparent Deal Structuring", desc: "End-to-end facilitation with absolute financial transparency and ethical negotiation." },
                { title: "Zero Hidden Costs", desc: "Direct deals with straightforward advisory structures. No unexpected fees." }
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
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#d4af35]/5 rounded-full blur-3xl -z-10"></div>
            <h3 className="text-2xl font-bold text-white mb-2">Engage Our Advisory</h3>
            <p className="text-slate-400 mb-8 text-sm">Connect with our senior real estate consultants for discrete advisory.</p>
            
            {status.success ? (
              <div className="bg-[#121c12] border border-green-900/50 rounded-xl p-6 text-center space-y-4">
                <ShieldCheck className="w-12 h-12 text-green-500 mx-auto" />
                <h4 className="text-green-500 font-bold text-lg">Enquiry Received Successfully</h4>
                <p className="text-green-200/70 text-sm">Our advisory desk will establish contact with you shortly.</p>
                <button onClick={() => setStatus(prev => ({ ...prev, success: false }))} className="text-slate-400 hover:text-white text-sm mt-4 underline">Submit another enquiry</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <div className="grid md:grid-cols-2 gap-4">
                  <input required name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="Full Name *" className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors" />
                  <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="Phone Number *" className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors" />
                </div>
                
                <input required name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="Email Address *" className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors" />
                
                <div className="grid md:grid-cols-2 gap-4">
                  <select required name="intent" value={formData.intent} onChange={handleInputChange} className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-[#d4af35]/50 transition-colors appearance-none">
                    <option value="" disabled>Intent *</option>
                    <option value="Buy Property">Buy Property</option>
                    <option value="Sell Property">Sell Property</option>
                    <option value="Rent or Lease">Rent or Lease</option>
                  </select>

                  <select required name="propertyType" value={formData.propertyType} onChange={handleInputChange} className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-[#d4af35]/50 transition-colors appearance-none">
                    <option value="" disabled>Property Type *</option>
                    <option value="Commercial Land">Commercial Land</option>
                    <option value="Residential Plot">Residential Plot</option>
                    <option value="Agricultural Farm">Agricultural Farm</option>
                    <option value="Telecom Lease Land">Telecom Lease Land</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <input required name="location" value={formData.location} onChange={handleInputChange} type="text" placeholder="Desired/Property Location *" className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors" />
                  <input name="budget" value={formData.budget} onChange={handleInputChange} type="text" placeholder="Budget / Expected Value" className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors" />
                </div>

                <textarea name="details" value={formData.details} onChange={handleInputChange} rows="3" placeholder="Additional Details or Requirements" className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors resize-none"></textarea>

                {status.error && <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">{status.error}</div>}

                <button disabled={status.loading} type="submit" className="w-full bg-gradient-to-r from-[#d4af35] to-[#b8941f] text-black font-bold py-4 px-8 rounded-xl hover:from-[#E5C158] hover:to-[#d4af35] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                  {status.loading ? 'Submitting...' : 'Request Advisory Session'} <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
