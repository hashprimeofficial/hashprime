'use client';

import React, { useState } from 'react';
import { Factory, Wind, Zap, ThermometerSnowflake, CheckCircle2, ChevronRight, HardHat, ShieldCheck } from 'lucide-react';

/*
*/

export default function ShelterEnclosurePage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    shelterCategory: '',
    dimensions: '',
    installationLocation: '',
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
          fieldOfInquiry: `Shelters & Enclosures — ${formData.shelterCategory}`,
          source: 'shelter',
          details: `Dimensions: ${formData.dimensions} | Location: ${formData.installationLocation} | Requirements: ${formData.details}`,
          contactDateTime: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setStatus({ type: 'success', message: 'Your enclosure enquiry has been submitted. Our engineering team will contact you soon.' });
        setFormData({ name: '', phone: '', email: '', shelterCategory: '', dimensions: '', installationLocation: '', details: '' });
      } else {
        setStatus({ type: 'error', message: 'There was an error submitting your enquiry. Please try again.' });
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
    "@type": ["LocalBusiness", "IndustrialEquipmentSupplier"],
    "name": "Hashprime Shelters & Enclosures",
    "description": "High-durability custom equipment shelters. Weatherproof, acoustic, and solar enclosures for industrial machinery, generators, and HVAC systems.",
    "url": "https://hashprime.com/shelter-and-enclosure-works",
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-slate-300 font-sans selection:bg-[#d4af35] selection:text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#d4af35]/10 via-[#0A0A0A] to-[#0A0A0A] -z-10"></div>
        <div className="absolute top-40 right-10 opacity-5">
          <Factory className="w-96 h-96" />
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#d4af35] text-sm font-medium mb-6">
            <ShieldCheck className="w-4 h-4" /> Industrial Grade Protection
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-white leading-tight">
            Heavy-Duty Industrial & <br className="hidden md:block"/>
            <span className="bg-gradient-to-r from-[#d4af35] to-[#E5C158] bg-clip-text text-transparent">Equipment Protective Enclosures</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
            Engineered durability for your critical assets. Weatherproof, acoustic, and thermally insulated shelters custom-built for any industrial environment.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 lg:px-8 bg-[#0E0E0E]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Engineered Enclosure Solutions</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#d4af35] to-[#E5C158] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0A0A0A] border border-white/[0.06] rounded-2xl p-8 hover:border-[#d4af35]/40 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#d4af35]/10 transition-colors">
                <Factory className="w-7 h-7 text-[#d4af35]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Industrial & Warehouse Shelters</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Prefabricated structural steel shelters optimized for industrial plants, storage units, and heavy manufacturing yards. Engineered for extreme wind and structural loads.
              </p>
            </div>

            <div className="bg-[#0A0A0A] border border-white/[0.06] rounded-2xl p-8 hover:border-[#d4af35]/40 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#d4af35]/10 transition-colors">
                <Zap className="w-7 h-7 text-[#d4af35]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Acoustic Generator Enclosures</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Sound-attenuated, fire-retardant enclosures specifically designed for diesel generator sets. Superior noise reduction while maintaining optimal airflow.
              </p>
            </div>

            <div className="bg-[#0A0A0A] border border-white/[0.06] rounded-2xl p-8 hover:border-[#d4af35]/40 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#d4af35]/10 transition-colors">
                <Wind className="w-7 h-7 text-[#d4af35]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Electrical & Solar Equipment</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Thermally insulated, dust-proof enclosures protecting sensitive solar inverters, transformers, and electrical control panels from harsh environmental conditions.
              </p>
            </div>

            <div className="bg-[#0A0A0A] border border-white/[0.06] rounded-2xl p-8 hover:border-[#d4af35]/40 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#d4af35]/10 transition-colors">
                <ThermometerSnowflake className="w-7 h-7 text-[#d4af35]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">HVAC & AC Unit Enclosures</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Custom protective housing for outdoor condenser units and industrial chillers. Prevents vandalism and weather damage while preserving efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us & Form Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <div className="sticky top-24">
            <h2 className="text-3xl font-bold text-white mb-8">The Hashprime Advantage</h2>
            <div className="grid gap-6">
              {[
                { title: 'Weather-Resistant Materials', desc: 'Premium graded steel and specialized anti-corrosive coatings for maximum longevity.' },
                { title: 'Custom Modular Dimensions', desc: 'Precision-engineered to fit your exact machinery requirements and footprint.' },
                { title: 'Acoustic Dampening', desc: 'Advanced insulation materials to meet stringent industrial noise compliance standards.' },
                { title: 'Fast Installation', desc: 'Prefabricated components allow for rapid deployment with minimal site disruption.' }
              ].map((feature, i) => (
                <div key={i} className="bg-[#0E0E0E] p-6 rounded-2xl border border-white/[0.04]">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-[#d4af35]" />
                    <h4 className="text-lg font-semibold text-white">{feature.title}</h4>
                  </div>
                  <p className="text-slate-400 text-sm pl-8">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0E0E0E] border border-white/[0.06] rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <HardHat className="w-6 h-6 text-[#d4af35]" />
              <h3 className="text-2xl font-bold text-white">Project Enquiry</h3>
            </div>
            
            {status.message && (
              <div className={`p-4 rounded-xl mb-6 text-sm ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Full Name / Company</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35]/50 transition-colors" placeholder="Company Name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Contact Number</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35]/50 transition-colors" placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35]/50 transition-colors" placeholder="procurement@company.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Shelter Category</label>
                <select required name="shelterCategory" value={formData.shelterCategory} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af35]/50 transition-colors appearance-none">
                  <option value="" disabled>Select enclosure type...</option>
                  <option value="Industrial Warehouse">Industrial Warehouse</option>
                  <option value="Acoustic Generator Shelter">Acoustic Generator Shelter</option>
                  <option value="Electrical Enclosure">Electrical Enclosure</option>
                  <option value="Solar Inverter Housing">Solar Inverter Housing</option>
                  <option value="HVAC Unit Enclosure">HVAC Unit Enclosure</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Approx. Dimensions</label>
                  <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35]/50 transition-colors" placeholder="e.g., L: 20ft x W: 10ft" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Installation Location</label>
                  <input required type="text" name="installationLocation" value={formData.installationLocation} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35]/50 transition-colors" placeholder="City / State" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Specific Requirements</label>
                <textarea required name="details" value={formData.details} onChange={handleChange} rows="3" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35]/50 transition-colors resize-none" placeholder="Describe environmental conditions, equipment type, etc..."></textarea>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-[#d4af35] to-[#b8941f] text-black font-bold py-4 px-8 rounded-xl hover:from-[#E5C158] hover:to-[#d4af35] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2">
                {isSubmitting ? 'Submitting Details...' : 'Request Quotation'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
