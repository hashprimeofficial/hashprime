"use client";

import React, { useState } from 'react';
import { Wrench, Truck, ShieldAlert, Zap, Cog, Activity, ShieldCheck, Send } from 'lucide-react';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Hashprime Mechanical Services",
  "description": "Professional mechanical engineering and fleet maintenance by Hashprime. Preventive maintenance, hydraulic repairs, engine overhauls.",
  "category": "Mechanical Engineering Service"
};

export default function MechanicalServicesPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceCategory: '',
    vehicleModel: '',
    siteLocation: '',
    details: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Submitting your service request...' });

    try {
      const res = await fetch('/api/business-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          fieldOfInquiry: `Mechanical — ${formData.serviceCategory} | Model: ${formData.vehicleModel} | Location: ${formData.siteLocation}`,
          source: 'mechanical',
          details: formData.details,
          contactDateTime: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setStatus({ type: 'success', message: 'Service request submitted successfully. Our mechanical team will contact you shortly.' });
        setFormData({ name: '', phone: '', email: '', serviceCategory: '', vehicleModel: '', siteLocation: '', details: '' });
      } else {
        setStatus({ type: 'error', message: 'Failed to submit request. Please try again later.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'An error occurred. Please check your connection and try again.' });
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
              <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">Hashprime Mechanical Services</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
              <span className="bg-gradient-to-r from-[#d4af35] to-[#E5C158] bg-clip-text text-transparent">
                Heavy Industrial Machinery
              </span>
              <br />& Multi-Vehicle Fleet Maintenance
            </h1>
            <p className="text-lg text-slate-400 mb-8 max-w-xl">
              Delivering mechanical engineering maintenance, emergency repairs, and heavy equipment overhauls. Led by Operations Head Mr. Naresh D.
            </p>
            
          </div>
          <div className="lg:col-span-5 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af35] to-[#E5C158] rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-[#0E0E0E] border border-white/[0.06] rounded-3xl overflow-hidden aspect-[16/10] shadow-2xl">
              <img src="/hashprime-mechanical.jpg" alt="Heavy Industrial Machinery" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/[0.06]">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Core <span className="text-[#d4af35]">Capabilities</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Specialized mechanical engineering services for industrial and commercial sectors.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Wrench,
              title: "Industrial Machinery Servicing",
              desc: "Factory equipment overhauls, hydraulic system repair, pneumatic maintenance, and rapid breakdown response."
            },
            {
              icon: Truck,
              title: "Vehicle Servicing",
              desc: "Complete maintenance for commercial trucks, heavy utility vehicles, passenger fleets, and construction equipment."
            },
            {
              icon: ShieldAlert,
              title: "Preventive Fleet Maintenance",
              desc: "Computerized engine diagnostics, oil changes, brake system overhauls, gearbox inspection, and performance tuning."
            }
          ].map((srv, idx) => (
            <div key={idx} className="bg-[#0E0E0E] border border-white/[0.06] rounded-2xl p-8 hover:border-[#d4af35]/40 transition-all group">
              <div className="w-14 h-14 bg-[#1a1a1a] border border-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <srv.icon className="w-7 h-7 text-[#d4af35]" />
              </div>
              <h3 className="text-xl font-bold mb-3">{srv.title}</h3>
              <p className="text-slate-400 leading-relaxed">{srv.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/[0.06]">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">The Hashprime <span className="text-[#d4af35]">Advantage</span></h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-4">
            <ShieldCheck className="w-10 h-10 text-[#d4af35] mx-auto mb-4" />
            <h3 className="font-bold mb-2">Certified Engineers</h3>
            <p className="text-sm text-slate-400">Expert mechanical professionals</p>
          </div>
          <div className="p-4">
            <Zap className="w-10 h-10 text-[#d4af35] mx-auto mb-4" />
            <h3 className="font-bold mb-2">Advanced Diagnostics</h3>
            <p className="text-sm text-slate-400">State-of-the-art diagnostic tools</p>
          </div>
          <div className="p-4">
            <Activity className="w-10 h-10 text-[#d4af35] mx-auto mb-4" />
            <h3 className="font-bold mb-2">Quick Turnaround</h3>
            <p className="text-sm text-slate-400">Minimized operational downtime</p>
          </div>
          <div className="p-4">
            <Wrench className="w-10 h-10 text-[#d4af35] mx-auto mb-4" />
            <h3 className="font-bold mb-2">Heavy-Duty Workshop</h3>
            <p className="text-sm text-slate-400">Dedicated facilities for heavy machinery</p>
          </div>
        </div>
      </section>

      {/* Enquiry Form Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="bg-[#0E0E0E] border border-white/[0.06] rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#d4af35] opacity-5 blur-[100px] rounded-full"></div>
          
          <div className="text-center mb-10 relative z-10">
            <h2 className="text-3xl font-bold mb-4">Request Service or Overhaul</h2>
            <p className="text-slate-400">Provide details about your machinery or fleet to get started.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium">Full Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35]/50 transition-colors" placeholder="Contact Person" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium">Phone Number</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35]/50 transition-colors" placeholder="+91 98765 43210" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium">Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35]/50 transition-colors" placeholder="company@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium">Service Category</label>
                <select required name="serviceCategory" value={formData.serviceCategory} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af35]/50 transition-colors appearance-none">
                  <option value="">Select a service...</option>
                  <option value="Industrial Machinery Repair">Industrial Machinery Repair</option>
                  <option value="Heavy Vehicle Servicing">Heavy Vehicle Servicing</option>
                  <option value="Commercial Fleet Maintenance">Commercial Fleet Maintenance</option>
                  <option value="Hydraulic Systems">Hydraulic Systems</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium">Machine / Vehicle Model</label>
                <input required type="text" name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35]/50 transition-colors" placeholder="e.g. CAT Excavator / Tata Prima" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium">Site / Workshop Location</label>
                <input required type="text" name="siteLocation" value={formData.siteLocation} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35]/50 transition-colors" placeholder="City or area name" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300 font-medium">Issue Description / Details</label>
              <textarea required name="details" value={formData.details} onChange={handleChange} rows="4" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35]/50 transition-colors" placeholder="Describe the maintenance required or the symptoms of the breakdown..."></textarea>
            </div>

            {status.message && (
              <div className={`p-4 rounded-xl text-sm ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : status.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                {status.message}
              </div>
            )}

            <button type="submit" disabled={status.type === 'loading'} className="w-full bg-gradient-to-r from-[#d4af35] to-[#b8941f] text-black font-bold py-4 px-8 rounded-xl hover:from-[#E5C158] hover:to-[#d4af35] transition-all flex justify-center items-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed">
              <span>{status.type === 'loading' ? 'Submitting...' : 'Submit Service Request'}</span>
              {!status.type && <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
