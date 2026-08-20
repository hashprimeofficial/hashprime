'use client';

import React, { useState } from 'react';
import { Package, Shield, Globe, TrendingUp, Truck, CheckCircle2 } from 'lucide-react';

export default function TradingServicesPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    tradingSector: 'Industrial Commodities',
    details: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const res = await fetch('/api/business-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          fieldOfInquiry: `Trading & Supply — ${formData.tradingSector}`,
          source: 'trading',
          details: formData.details,
          contactDateTime: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          phone: '',
          email: '',
          tradingSector: 'Industrial Commodities',
          details: '',
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Hashprime Industrial Trading & Logistics",
    "image": "https://hashprime.in/logo.png",
    "description": "Strategic supply chain procurement, electrical components, and industrial commodity distribution.",
    "category": "Industrial Supply & Logistics",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen flex flex-col justify-between text-white font-sans selection:bg-[#d4af35] selection:text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 lg:px-8 overflow-hidden border-b border-white/[0.06] bg-[#0A0A0A]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#d4af35]/10 via-[#0A0A0A] to-[#0A0A0A] opacity-40"></div>
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#d4af35] animate-pulse"></span>
              <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">Hashprime Industrial Supply</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
              <span className="bg-gradient-to-r from-[#d4af35] to-[#E5C158] bg-clip-text text-transparent">
                Industrial Supplies &amp;
              </span>
              <br />Enterprise Commodity Logistics
            </h1>
            <p className="text-lg text-slate-400 mb-8 max-w-xl">
              Strategic procurement, industrial electrical materials, SMC hardware, and bulk commodity sourcing across regional distribution networks.
            </p>
          </div>
          <div className="lg:col-span-5 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af35] to-[#E5C158] rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-[#0E0E0E] border border-white/[0.06] rounded-3xl overflow-hidden aspect-[16/10] shadow-2xl">
              <img
                src="/hashprime-trading.jpg"
                alt="Industrial Trading & Logistics"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Package, title: 'Electrical & Telecom Materials', desc: 'Bulk procurement of optical cables, joint closures, distribution boxes, and substation components.' },
            { icon: Truck, title: 'Supply Chain Distribution', desc: 'Dedicated logistics networks delivering certified materials directly to infrastructure and civil sites.' },
            { icon: Shield, title: 'Quality & Regulatory Compliance', desc: 'Strict vendor vetting, standard material certification, and transparent procurement pricing.' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-8 rounded-2xl bg-[#121212] border border-white/10 hover:border-[#d4af35]/30 transition-all">
                <Icon className="w-10 h-10 text-[#d4af35] mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact & Inquiry Form */}
      <section className="py-20 px-6 lg:px-8 border-t border-white/5 bg-[#0D0D0D]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-4">Submit Procurement Inquiry</h2>
            <p className="text-slate-400 text-sm">Request bulk pricing, material specifications, or commercial supply agreements.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#d4af35] focus:outline-none"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#d4af35] focus:outline-none"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#d4af35] focus:outline-none"
                placeholder="corporate@company.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Supply Sector</label>
              <select
                name="tradingSector"
                value={formData.tradingSector}
                onChange={handleInputChange}
                className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#d4af35] focus:outline-none"
              >
                <option value="Industrial Commodities">Industrial Commodities</option>
                <option value="Electrical Hardware">Electrical Hardware &amp; Switchgear</option>
                <option value="Telecom & Fiber Materials">Telecom &amp; Fiber Materials</option>
                <option value="SMC & Protective Enclosures">SMC &amp; Protective Enclosures</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Inquiry Details</label>
              <textarea
                name="details"
                rows={4}
                required
                value={formData.details}
                onChange={handleInputChange}
                className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#d4af35] focus:outline-none"
                placeholder="Specify required quantities, delivery locations, and technical standards..."
              ></textarea>
            </div>

            {submitStatus === 'success' && (
              <div className="p-4 rounded-xl bg-[#d4af35]/10 border border-[#d4af35]/30 text-[#d4af35] text-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                Thank you! Your procurement inquiry has been submitted. Our team will contact you within 24 hours.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                Failed to submit inquiry. Please try again or email us directly at support@hashprime.in.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#d4af35] hover:bg-[#f5e0a3] text-[#0A0A0A] font-bold rounded-xl transition-colors duration-300 text-sm"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Procurement Request'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
