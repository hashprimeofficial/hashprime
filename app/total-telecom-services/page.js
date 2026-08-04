'use client';

import React, { useState } from 'react';
import { 
  MapPin, Phone, Mail, Building2, Wrench, Zap, 
  Activity, Shield, ArrowRight, HardHat, Settings, Network
} from 'lucide-react';

// We include it here to fulfill the requirements, but in production this should be moved to layout.js
// or a parent Server Component.
export default function TotalTelecomServices() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: '',
    projectLocation: '',
    details: ''
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      const res = await fetch('/api/business-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          fieldOfInquiry: `Telecom — ${formData.serviceType}`,
          source: 'telecom',
          details: `Location: ${formData.projectLocation}\n\nDetails: ${formData.details}`,
          contactDateTime: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error('Failed to submit enquiry');
      
      setStatus({ loading: false, success: true, error: null });
      setFormData({
        name: '', phone: '', email: '', serviceType: '', projectLocation: '', details: ''
      });
    } catch (error) {
      setStatus({ loading: false, success: false, error: 'Failed to submit request. Please try again.' });
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Hashprime Telecom Infrastructure",
    "image": "https://hashprime.com/logo.png",
    "url": "https://hashprime.com/total-telecom-services",
    "telephone": "+91-0000000000",
    "description": "Comprehensive telecom engineering by Hashprime: Land acquisition, site deployment, tower installation, electrical works, fiber optics, and 24/7 site operations.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "India",
      "addressCountry": "IN"
    },
    "category": "Telecommunications"
  };

  const services = [
    {
      title: "Land Acquisition",
      description: "Strategic site selection, landowner negotiations, legal title vetting, and lease execution for telecom towers.",
      icon: <MapPin className="w-8 h-8 text-[#d4af35]" />
    },
    {
      title: "New Site Deployment",
      description: "Turnkey civil construction, foundation layout, boundary fencing, and complete site readiness.",
      icon: <Building2 className="w-8 h-8 text-[#d4af35]" />
    },
    {
      title: "Tower & Shelter Installation",
      description: "Structural erection of self-supporting towers, monopoles, and weatherproof shelter units.",
      icon: <HardHat className="w-8 h-8 text-[#d4af35]" />
    },
    {
      title: "Electrical & Power Works",
      description: "Transformer installation, high-voltage EB line extensions, DG set integration, battery backup.",
      icon: <Zap className="w-8 h-8 text-[#d4af35]" />
    },
    {
      title: "Fiber Optical Works",
      description: "Precision trenching, ducting, fiber optic cable laying, fusion splicing, OTDR testing, commissioning.",
      icon: <Network className="w-8 h-8 text-[#d4af35]" />
    },
    {
      title: "Site O&M",
      description: "24/7 site uptime management, routine preventive maintenance, and rapid emergency field recovery.",
      icon: <Settings className="w-8 h-8 text-[#d4af35]" />
    }
  ];

  return (
    <main className="bg-[#0A0A0A] min-h-screen flex flex-col justify-between text-slate-300 font-sans selection:bg-[#d4af35]/30">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 lg:px-8 overflow-hidden border-b border-white/[0.06] bg-[#0A0A0A]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#d4af35]/10 via-[#0A0A0A] to-[#0A0A0A] opacity-40"></div>
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#d4af35] animate-pulse"></span>
              <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">Hashprime Enterprise Solutions</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
              <span className="bg-gradient-to-r from-[#d4af35] to-[#E5C158] bg-clip-text text-transparent">
                Turnkey Telecom Infrastructure
              </span>
              <br />& Network Deployment Solutions
            </h1>
            <p className="text-lg text-slate-400 mb-8 max-w-xl">
              End-to-end engineering, civil works, and technical deployment for robust, high-uptime telecommunications networks across India.
            </p>
            
          </div>
          <div className="lg:col-span-5 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af35] to-[#E5C158] rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-[#0E0E0E] border border-white/[0.06] rounded-3xl overflow-hidden aspect-[16/10] shadow-2xl">
              <img src="/hashprime-telecom.jpg" alt="Turnkey Telecom Infrastructure" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-6 lg:px-8 bg-[#0E0E0E]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Engineering Capabilities</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Comprehensive life-cycle solutions from site acquisition to round-the-clock maintenance operations.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <div key={idx} className="bg-[#0A0A0A] border border-white/[0.06] rounded-2xl p-8 hover:border-[#d4af35]/40 transition-all group">
                <div className="mb-6 p-4 rounded-xl bg-[#0E0E0E] border border-white/[0.06] inline-block group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-6 lg:px-8 border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Choose Hashprime Telecom?</h2>
              <p className="text-slate-400 mb-8 text-lg">We deliver industrial-grade execution with zero compromise on safety and compliance.</p>
              
              <div className="space-y-6">
                {[
                  { title: "99.9% Network Uptime", desc: "Rigorous SLA compliance and rapid fault response." },
                  { title: "Turnkey Execution", desc: "Single point of contact for end-to-end site delivery." },
                  { title: "Specialized Field Engineers", desc: "Highly trained deployment & optical fiber crews." },
                  { title: "Certified Safety Protocols", desc: "Strict adherence to height safety and electrical standards." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="mt-1">
                      <Shield className="w-6 h-6 text-[#d4af35]" />
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
              <h3 className="text-2xl font-bold text-white mb-6">Initiate a Project Enquiry</h3>
              
              {status.success ? (
                <div className="bg-[#111811] border border-green-900/50 rounded-xl p-6 text-center">
                  <div className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-green-900/30 text-green-500 mb-4">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-white mb-2">Request Submitted Successfully</h4>
                  <p className="text-slate-400">Our enterprise telecom team will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input type="text" name="name" required placeholder="Contact Name" value={formData.name} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors" />
                    </div>
                    <div>
                      <input type="tel" name="phone" required placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors" />
                    </div>
                  </div>
                  
                  <div>
                    <input type="email" name="email" required placeholder="Business Email" value={formData.email} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors" />
                  </div>
                  
                  <div>
                    <select name="serviceType" required value={formData.serviceType} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af35]/50 transition-colors appearance-none">
                      <option value="" disabled>Select Service Requirement</option>
                      <option value="Land Acquisition">Land Acquisition</option>
                      <option value="Site Deployment">New Site Deployment</option>
                      <option value="Tower & Shelter">Tower & Shelter Installation</option>
                      <option value="Electrical Works">Electrical & Power Works</option>
                      <option value="Fiber Optics">Fiber Optical Works</option>
                      <option value="O&M">Site Operations & Maintenance</option>
                    </select>
                  </div>
                  
                  <div>
                    <input type="text" name="projectLocation" required placeholder="Project Location / State" value={formData.projectLocation} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors" />
                  </div>
                  
                  <div>
                    <textarea name="details" required placeholder="Project Details & Scope..." rows="4" value={formData.details} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af35]/50 transition-colors resize-none"></textarea>
                  </div>

                  {status.error && (
                    <div className="p-3 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 text-sm">
                      {status.error}
                    </div>
                  )}
                  
                  <button type="submit" disabled={status.loading} className="w-full bg-gradient-to-r from-[#d4af35] to-[#b8941f] text-black font-bold py-4 px-8 rounded-xl hover:from-[#E5C158] hover:to-[#d4af35] transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                    {status.loading ? 'Submitting...' : 'Submit Request'}
                    {!status.loading && <ArrowRight className="w-5 h-5" />}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
