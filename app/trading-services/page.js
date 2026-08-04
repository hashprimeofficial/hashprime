'use client';

import React, { useState } from 'react';
import { BarChart3, Bitcoin, Shield, Globe, TrendingUp, Coins } from 'lucide-react';

export default function TradingServicesPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    tradingSector: 'Physical Commodities',
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
          fieldOfInquiry: `Trading — ${formData.tradingSector}`,
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
          tradingSector: 'Physical Commodities',
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
    "name": "Hashprime Trading Services",
    "image": "https://hashprime.com/logo.png",
    "description": "Strategic market research and trade execution across physical commodities and digital assets/crypto.",
    "category": "Financial & Trading Advisor",
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
              <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">Hashprime Trading Services</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
              <span className="bg-gradient-to-r from-[#d4af35] to-[#E5C158] bg-clip-text text-transparent">
                Strategic Commodities
              </span>
              <br />& Digital Asset Trading Solutions
            </h1>
            <p className="text-lg text-slate-400 mb-8 max-w-xl">
              Providing market analytical depth and transaction support spanning physical bulk commodities and digital asset networks.
            </p>
            
          </div>
          <div className="lg:col-span-5 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af35] to-[#E5C158] rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-[#0E0E0E] border border-white/[0.06] rounded-3xl overflow-hidden aspect-[16/10] shadow-2xl">
              <img src="/hashprime-trading.jpg" alt="Strategic Commodities" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto border-t border-white/[0.06]">
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-4">Core Trading Competencies</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-[#d4af35] to-[#E5C158]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0E0E0E] border border-white/[0.06] rounded-2xl p-8 hover:border-[#d4af35]/40 transition-all group">
            <Globe className="w-12 h-12 text-[#d4af35] mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold mb-4 text-slate-200">Physical Commodities Trading</h3>
            <p className="text-slate-400 leading-relaxed text-lg">
              Strategic sourcing, supply chain logistics, market intelligence, and comprehensive trade execution for bulk global commodities.
            </p>
          </div>

          <div className="bg-[#0E0E0E] border border-white/[0.06] rounded-2xl p-8 hover:border-[#d4af35]/40 transition-all group">
            <Bitcoin className="w-12 h-12 text-[#d4af35] mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold mb-4 text-slate-200">Crypto & Digital Financial Assets</h3>
            <p className="text-slate-400 leading-relaxed text-lg">
              Data-driven market analytics, innovative portfolio structuring concepts, risk management, and secure asset transactional workflows.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 bg-[#0E0E0E] border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">The Hashprime Advantage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <BarChart3 className="w-10 h-10 text-[#d4af35] mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Advanced Analytics</h4>
              <p className="text-sm text-slate-400">Deep market intelligence and quantitative research tools.</p>
            </div>
            <div className="text-center">
              <Shield className="w-10 h-10 text-[#d4af35] mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Disciplined Risk Frameworks</h4>
              <p className="text-sm text-slate-400">Robust hedging strategies and exposure management.</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-10 h-10 text-[#d4af35] mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Transparent Transactions</h4>
              <p className="text-sm text-slate-400">Clear pricing structures and verifiable trade execution.</p>
            </div>
            <div className="text-center">
              <Coins className="w-10 h-10 text-[#d4af35] mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Established Networks</h4>
              <p className="text-sm text-slate-400">Direct access to institutional liquidity and major supply chains.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="py-24 px-6 sm:px-12 lg:px-24 max-w-4xl mx-auto">
        <div className="bg-[#0E0E0E] border border-white/[0.06] rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-2">Open a Dialogue</h2>
          <p className="text-slate-400 mb-8">Discuss strategic trading partnerships and market access.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Trading Sector</label>
                <select
                  name="tradingSector"
                  value={formData.tradingSector}
                  onChange={handleInputChange}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af35]/50 transition-colors appearance-none"
                >
                  <option value="Physical Commodities">Physical Commodities</option>
                  <option value="Digital Assets & Crypto">Digital Assets & Crypto</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Query / Requirement Details</label>
              <textarea
                name="details"
                required
                rows="4"
                value={formData.details}
                onChange={handleInputChange}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors resize-none"
                placeholder="Describe your trading requirements..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#d4af35] to-[#b8941f] text-black font-bold py-4 px-8 rounded-xl hover:from-[#E5C158] hover:to-[#d4af35] transition-all disabled:opacity-70"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
            </button>

            {submitStatus === 'success' && (
              <p className="text-green-500 text-center mt-4">Your inquiry has been submitted successfully.</p>
            )}
            {submitStatus === 'error' && (
              <p className="text-red-500 text-center mt-4">An error occurred. Please try again later.</p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
