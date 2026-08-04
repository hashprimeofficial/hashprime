'use client';

import React, { useState } from 'react';
import { Server, Radio, Wrench, ShieldCheck, Zap, Activity } from 'lucide-react';

export default function EricssonTelecomPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: 'OEM Equipment Installation',
    networkLocation: '',
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
          fieldOfInquiry: `Ericsson Telecom — ${formData.serviceType}`,
          source: 'ericsson-telecom',
          details: `Location: ${formData.networkLocation} | Details: ${formData.details}`,
          contactDateTime: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          phone: '',
          email: '',
          serviceType: 'OEM Equipment Installation',
          networkLocation: '',
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
    "name": "Hashprime",
    "image": "https://hashprime.com/logo.png",
    "description": "Certified OEM telecom deployment and field service for Ericsson hardware.",
    "category": "Telecommunications Equipment Supplier",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white font-sans selection:bg-[#d4af35] selection:text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#d4af35]/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8">
            <span className="bg-gradient-to-r from-[#d4af35] to-[#E5C158] bg-clip-text text-transparent">
              OEM-Grade Telecom Integration
            </span>
            <br className="hidden md:block" /> & Network Field Operations
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-12">
            Certified OEM telecom deployment and field service for Ericsson hardware, BTS stations, microwave links, radio frequency alignment, and optical networks.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto border-t border-white/[0.06]">
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-4">Our Specialized Services</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-[#d4af35] to-[#E5C158]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#0E0E0E] border border-white/[0.06] rounded-2xl p-8 hover:border-[#d4af35]/40 transition-all group">
            <Server className="w-12 h-12 text-[#d4af35] mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-4 text-slate-200">Ericsson Hardware Integration</h3>
            <p className="text-slate-400 leading-relaxed">
              Precision mounting, cabling, power connection, commissioning, and integration of 4G/5G radio systems ensuring optimal baseline performance.
            </p>
          </div>

          <div className="bg-[#0E0E0E] border border-white/[0.06] rounded-2xl p-8 hover:border-[#d4af35]/40 transition-all group">
            <Radio className="w-12 h-12 text-[#d4af35] mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-4 text-slate-200">Base Transceiver Station Swaps</h3>
            <p className="text-slate-400 leading-relaxed">
              Seamless equipment replacements, cabinet modernizations, power unit upgrades, and strict RF alignment procedures.
            </p>
          </div>

          <div className="bg-[#0E0E0E] border border-white/[0.06] rounded-2xl p-8 hover:border-[#d4af35]/40 transition-all group">
            <Wrench className="w-12 h-12 text-[#d4af35] mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-4 text-slate-200">Specialized Vendor Maintenance</h3>
            <p className="text-slate-400 leading-relaxed">
              High-tier diagnostic testing, circuit board replacements, microwave link tuning, and rapid emergency field response.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 bg-[#0E0E0E] border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Hashprime</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <ShieldCheck className="w-10 h-10 text-[#d4af35] mx-auto mb-4" />
              <h4 className="font-semibold mb-2">OEM-Trained Teams</h4>
              <p className="text-sm text-slate-400">Certified field operatives trained on proprietary Ericsson tech.</p>
            </div>
            <div className="text-center">
              <Activity className="w-10 h-10 text-[#d4af35] mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Strict SLA Adherence</h4>
              <p className="text-sm text-slate-400">Guaranteed response times and resolution windows.</p>
            </div>
            <div className="text-center">
              <ShieldCheck className="w-10 h-10 text-[#d4af35] mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Safety Compliance</h4>
              <p className="text-sm text-slate-400">Industry-leading safety protocols for high-voltage and tower operations.</p>
            </div>
            <div className="text-center">
              <Zap className="w-10 h-10 text-[#d4af35] mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Zero-Downtime Models</h4>
              <p className="text-sm text-slate-400">Execution strategies designed to keep critical networks online.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="py-24 px-6 sm:px-12 lg:px-24 max-w-4xl mx-auto">
        <div className="bg-[#0E0E0E] border border-white/[0.06] rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-2">Initiate Deployment</h2>
          <p className="text-slate-400 mb-8">Contact our specialized integration team.</p>

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
                <label className="block text-sm font-medium text-slate-400 mb-2">Service Type</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af35]/50 transition-colors appearance-none"
                >
                  <option value="OEM Equipment Installation">OEM Equipment Installation</option>
                  <option value="BTS System Swap">BTS System Swap</option>
                  <option value="Radio Frequency Tuning">Radio Frequency Tuning</option>
                  <option value="Emergency Field Maintenance">Emergency Field Maintenance</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Network Location / Site ID</label>
              <input
                type="text"
                name="networkLocation"
                required
                value={formData.networkLocation}
                onChange={handleInputChange}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors"
                placeholder="Site #1234, City/Region"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Deployment Details</label>
              <textarea
                name="details"
                required
                rows="4"
                value={formData.details}
                onChange={handleInputChange}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors resize-none"
                placeholder="Provide scope of work, technical requirements..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#d4af35] to-[#b8941f] text-black font-bold py-4 px-8 rounded-xl hover:from-[#E5C158] hover:to-[#d4af35] transition-all disabled:opacity-70"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>

            {submitStatus === 'success' && (
              <p className="text-green-500 text-center mt-4">Your request has been submitted successfully.</p>
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
