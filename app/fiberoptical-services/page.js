'use client';

import React, { useState } from 'react';
import { Network, Cable, Shield, ArrowRight, CheckCircle2, Search, Settings, Cpu } from 'lucide-react';

export default function FiberopticalServicesPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: '',
    location: '',
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
          fieldOfInquiry: `Fiberoptical — ${formData.serviceType} | Location: ${formData.location || 'N/A'}`,
          source: 'fiberoptical-services',
          details: formData.details,
          contactDateTime: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setStatus({ type: 'success', message: 'Your optical network enquiry has been received. Our fiber-optics team will connect with you shortly.' });
        setFormData({ name: '', phone: '', email: '', serviceType: '', location: '', details: '' });
      } else {
        setStatus({ type: 'error', message: 'There was an error submitting your request. Please try again.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'A network error occurred. Please verify your connection.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Hashprime Fiberoptic Services",
    "description": "High-speed dark fiber layouts and telecommunication network splicing. Trenching, ducting, low-loss fusion splicing, and OTDR network testing.",
    "url": "https://hashprime.com/fiberoptical-services",
    "image": "https://hashprime.com/hashprime-fiberoptical.jpg",
    "category": "Telecommunications"
  };

  const offerings = [
    {
      title: "Underground Trenching & Ducting",
      description: "Excavation, HDD (Horizontal Directional Drilling) road crossings, PLB HDPE duct laying, and protective chamber installations.",
      icon: <Settings className="w-8 h-8 text-[#d4af35]" />
    },
    {
      title: "Pneumatic Cable Blowing & Laying",
      description: "High-precision blowing of armored and unarmored fiber cables through ducts using high-capacity air compressors and blower rigs.",
      icon: <Cable className="w-8 h-8 text-[#d4af35]" />
    },
    {
      title: "Low-Loss Fusion Splicing",
      description: "Microscope-aligned splicing for single-mode and multi-mode fibers, joint closure installation, and optical distribution panel terminations.",
      icon: <Cpu className="w-8 h-8 text-[#d4af35]" />
    },
    {
      title: "OTDR Testing & Network Audit",
      description: "Comprehensive trace diagnostics, loss measurements, link margin calculation, fault detection, and detailed site commissioning reports.",
      icon: <Search className="w-8 h-8 text-[#d4af35]" />
    }
  ];

  return (
    <div className="bg-[#0A0A0A] min-h-screen flex flex-col justify-between text-slate-300 font-sans selection:bg-[#d4af35]/30">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 lg:px-8 overflow-hidden border-b border-white/[0.06] bg-[#0A0A0A]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#d4af35]/10 via-[#0A0A0A] to-[#0A0A0A] opacity-40"></div>
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#d4af35] animate-pulse"></span>
              <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">Hashprime Fiber Networks</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
              <span className="bg-gradient-to-r from-[#d4af35] to-[#E5C158] bg-clip-text text-transparent">
                Light-Speed Data Layouts
              </span>
              <br />& Fiberoptic Infrastructure
            </h1>
            <p className="text-lg text-slate-400 mb-8 max-w-xl">
              High-durability optical fiber laying, joint chamber construction, fusion splicing, and full-spectrum OTDR diagnostics for national backbones and enterprise networks.
            </p>
          </div>
          <div className="lg:col-span-5 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af35] to-[#E5C158] rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-[#0E0E0E] border border-white/[0.06] rounded-3xl overflow-hidden aspect-[16/10] shadow-2xl">
              <img src="/hashprime-fiberoptical.jpg" alt="Fiberoptic Cable Solutions" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-6 lg:px-8 bg-[#0E0E0E]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Optical Splicing & Infrastructure Capabilities</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Complete end-to-end fiber solutions from trenching and horizontal drilling to diagnostic audits.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offerings.map((service, idx) => (
              <div key={idx} className="bg-[#0A0A0A] border border-white/[0.06] rounded-2xl p-8 hover:border-[#d4af35]/40 transition-all group flex gap-6 items-start">
                <div className="p-4 rounded-xl bg-[#0E0E0E] border border-white/[0.06] group-hover:scale-110 transition-transform shrink-0">
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us & Form */}
      <section className="py-24 px-6 lg:px-8 border-y border-white/[0.06] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Partner on Fiberoptic Laying?</h2>
              <p className="text-slate-400 mb-8 text-lg">We combine specialized blowing machineries with low loss splicing standards to deliver robust optical links.</p>

              <div className="space-y-6">
                {[
                  { title: "Low Insertion Loss Standard", desc: "Our splicing work adheres to strict decibel loss limits (under 0.02 dB per splice) ensuring high signal budget headroom." },
                  { title: "HDD Trenchless Crossings", desc: "Avoid structural damage on roads and railways using Horizontal Directional Drilling utilities." },
                  { title: "OTDR Trace Vetting", desc: "Detailed link profile audits with distance, attenuation, splice loss, reflectance, and total link budget reports." },
                  { title: "Emergency Spares & Recovery", desc: "Fiber cut restoration squads equipped with splicing kits and optical time-domain reflectometers." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="mt-1">
                      <CheckCircle2 className="w-6 h-6 text-[#d4af35] shrink-0" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-lg">{item.title}</h4>
                      <p className="text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0E0E0E] p-8 md:p-12 rounded-2xl border border-white/[0.06]">
              <h3 className="text-2xl font-bold text-white mb-6">Request Fiberoptic Consultation</h3>

              {status.message && (
                <div className={`p-4 rounded-xl mb-6 text-center text-sm font-medium ${
                  status.type === 'success' 
                    ? 'bg-green-950/30 border border-green-900/50 text-green-400' 
                    : 'bg-red-950/30 border border-red-900/50 text-red-400'
                }`}>
                  {status.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" name="name" required placeholder="Your Name" value={formData.name} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors" />
                  <input type="tel" name="phone" required placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors" />
                </div>
                <input type="email" name="email" required placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors" />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select name="serviceType" required value={formData.serviceType} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af35]/50 transition-colors appearance-none">
                    <option value="" disabled>Select Splicing/Fiber Service</option>
                    <option value="Ducting and Trenching">Underground Ducting & Trenching</option>
                    <option value="Cable Blowing">Pneumatic Cable Blowing</option>
                    <option value="Fusion Splicing">Fusion Splicing & Splicing Audit</option>
                    <option value="Link Testing and Commissioning">OTDR Link Testing & Commissioning</option>
                  </select>
                  <input type="text" name="location" required placeholder="Project Location (e.g. Salem)" value={formData.location} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors" />
                </div>

                <textarea name="details" required placeholder="Project details or scope of fiber work..." rows="4" value={formData.details} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors resize-none"></textarea>

                <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-[#d4af35] to-[#b8941f] text-black font-bold py-4 px-8 rounded-xl hover:from-[#E5C158] hover:to-[#d4af35] transition-all disabled:opacity-75 flex items-center justify-center gap-2">
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
