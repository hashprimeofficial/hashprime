'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Code2, Cpu, Bot, Search, Globe, Layout, 
  Server, Wrench, Sparkles, ArrowRight, Shield, 
  CheckCircle2, User, Briefcase, Clock, Layers
} from 'lucide-react';

export default function SoftwareDigitalAiSolutionsPage() {
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
          fieldOfInquiry: `Software & AI Solutions — ${formData.serviceType || 'General Consultation'}`,
          source: 'software-digital-ai',
          details: `Location: ${formData.projectLocation}\n\nScope / Requirements: ${formData.details}`,
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
    "@type": "ProfessionalService",
    "name": "Hashprime Software, Digital & AI Solutions",
    "image": "https://hashprime.in/logo.png",
    "url": "https://hashprime.in/software-digital-ai-solutions",
    "description": "Building modern digital infrastructure for businesses through software engineering, intelligent automation, digital growth, and reliable technology solutions.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "India",
      "addressCountry": "IN"
    },
    "category": "Software Engineering & AI Solutions"
  };

  const services = [
    {
      title: "Web Development",
      description: "Modern, responsive and high-performance corporate websites, landing pages, portals and custom web applications designed around business requirements.",
      icon: <Globe className="w-8 h-8 text-[#d4af35]" />,
      tag: "Web & Portals"
    },
    {
      title: "Custom Software Solutions",
      description: "Business-specific software systems, dashboards, admin panels, CMS platforms, internal tools and workflow applications.",
      icon: <Code2 className="w-8 h-8 text-[#d4af35]" />,
      tag: "Enterprise Apps"
    },
    {
      title: "AI & Workflow Automation",
      description: "AI-assisted systems and automation solutions designed to reduce repetitive tasks, improve operational efficiency and simplify business processes.",
      icon: <Bot className="w-8 h-8 text-[#d4af35]" />,
      tag: "Intelligent AI"
    },
    {
      title: "SEO & GEO",
      description: "Search Engine Optimization and Generative Engine Optimization strategies to strengthen business visibility across Google, search engines and AI-powered discovery platforms.",
      icon: <Search className="w-8 h-8 text-[#d4af35]" />,
      tag: "Search Visibility"
    },
    {
      title: "Google Business & Local Digital Presence",
      description: "Google Business Profile optimization, local search readiness and structured business information management to improve local discoverability.",
      icon: <Layers className="w-8 h-8 text-[#d4af35]" />,
      tag: "Local Presence"
    },
    {
      title: "UI/UX & Digital Experience",
      description: "Modern interface design, responsive layouts, information architecture and user-focused digital experiences for websites and software platforms.",
      icon: <Layout className="w-8 h-8 text-[#d4af35]" />,
      tag: "Interface Design"
    },
    {
      title: "Hosting, Domain & Deployment",
      description: "Domain configuration, SSL implementation, hosting setup, production deployment, troubleshooting and ongoing website infrastructure support.",
      icon: <Server className="w-8 h-8 text-[#d4af35]" />,
      tag: "Infrastructure"
    },
    {
      title: "Digital Systems & Technical Support",
      description: "Technical support for websites, software systems, digital assets, integrations and business technology infrastructure.",
      icon: <Wrench className="w-8 h-8 text-[#d4af35]" />,
      tag: "Maintenance"
    },
    {
      title: "Technology Consultation",
      description: "Planning and implementation support for businesses looking to modernize existing systems, introduce automation or build new digital products.",
      icon: <Sparkles className="w-8 h-8 text-[#d4af35]" />,
      tag: "Advisory"
    }
  ];

  return (
    <main className="bg-[#050505] min-h-screen flex flex-col justify-between text-slate-300 font-sans selection:bg-[#d4af35]/30">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Global dot-grid background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]"
        style={{ backgroundImage: 'radial-gradient(#d4af35 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

      {/* ── Hero Section ── */}
      <section className="relative pt-36 pb-24 px-6 lg:px-8 overflow-hidden border-b border-white/[0.06] bg-[#050505]">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#d4af35] opacity-[0.04] rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#d4af35] opacity-[0.03] rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#121212] border border-[#d4af35]/20 mb-6 shadow-[0_0_20px_rgba(212,175,53,0.1)]">
              <span className="w-2 h-2 rounded-full bg-[#d4af35] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#d4af35]">
                Hash Prime Technology Division
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-white leading-tight">
              Software, Digital &amp; <br />
              <span className="bg-gradient-to-r from-[#d4af35] via-[#f5e0a3] to-[#d4af35] bg-clip-text text-transparent">
                AI Solutions
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-400 mb-8 max-w-2xl leading-relaxed">
              Building modern digital infrastructure for businesses through software engineering, intelligent automation, digital growth, and reliable technology solutions.
            </p>

            {/* Division Head Badge */}
            <div className="inline-flex items-center gap-4 p-3 pr-6 rounded-2xl bg-[#0E0E0E] border border-[#d4af35]/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#d4af35]/40 shrink-0">
                <Image
                  src="/T_MOHAMMED_ARIF.jpg"
                  alt="Mr. T Mohammed Arif"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#d4af35]">Division Head</div>
                <div className="text-sm font-black text-white">Mr. T Mohammed Arif</div>
                <div className="text-[11px] font-medium text-slate-400">Technology &amp; Digital Solutions Head</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af35]/30 to-[#f5e0a3]/20 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000" />
            <div className="relative bg-[#0E0E0E] border border-white/[0.08] rounded-3xl overflow-hidden aspect-[4/3] shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
              <img 
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=900" 
                alt="Software, Digital & AI Solutions" 
                className="w-full h-full object-cover brightness-[0.75] group-hover:scale-105 transition-all duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#d4af35]">Enterprise Grade</div>
                  <div className="text-base font-black text-white">Full-Stack &amp; AI Engineering</div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="py-24 px-6 lg:px-8 bg-[#0A0A0A] relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#d4af35]/20 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af35]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#d4af35]">Capabilities Matrix</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
              Comprehensive Technology Services
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              End-to-end technology solutions tailored for business scale, speed, security, and digital discoverability.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <div 
                key={idx} 
                className="bg-[#0E0E0E] border border-white/[0.06] rounded-3xl p-8 hover:border-[#d4af35]/40 hover:shadow-[0_15px_40px_rgba(212,175,53,0.08)] transition-all duration-500 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3.5 rounded-2xl bg-[#050505] border border-white/[0.08] inline-block group-hover:border-[#d4af35]/40 group-hover:scale-110 transition-all duration-300">
                      {service.icon}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[#d4af35]">
                      {service.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white mb-3 tracking-tight group-hover:text-[#d4af35] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-500 group-hover:text-white transition-colors">
                  <span>Available for Deployment</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#d4af35] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Partner & Form Section ── */}
      <section className="py-24 px-6 lg:px-8 border-t border-white/[0.06] bg-[#050505] relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Column: Why Choose */}
            <div className="lg:col-span-6 space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#d4af35]/20 mb-3">
                  <Shield className="w-3.5 h-3.5 text-[#d4af35]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#d4af35]">Standards &amp; Reliability</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                  Why Build with Hash Prime Tech?
                </h2>
                <p className="text-slate-400 mt-4 text-base leading-relaxed">
                  We combine clean software architecture, modern AI capabilities, and algorithmic search visibility to create tangible digital assets for enterprises.
                </p>
              </div>
              
              <div className="space-y-4">
                {[
                  { title: "Modern Technology Stack", desc: "Built with Next.js, React, Node.js, Cloudflare, AWS, and cutting-edge web frameworks." },
                  { title: "Intelligent Workflow Automation", desc: "Eliminating manual data bottlenecks through custom scripts, APIs, and AI integrations." },
                  { title: "Algorithmic GEO & SEO Visibility", desc: "Structured data and semantic authority for Google, Bing, Perplexity, and generative AI search engines." },
                  { title: "High-Availability Deployment", desc: "Zero-downtime architecture, SSL certification, DNS configuration, and automated backups." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-[#0E0E0E] border border-white/[0.05] hover:border-[#d4af35]/30 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-[#d4af35] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-white font-bold text-sm">{item.title}</h4>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Leadership Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121212] to-[#0A0A0A] border border-[#d4af35]/30 flex items-center gap-5">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#d4af35] shrink-0 shadow-[0_0_20px_rgba(212,175,53,0.3)]">
                  <Image
                    src="/T_MOHAMMED_ARIF.jpg"
                    alt="Mr. T Mohammed Arif"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.25em] text-[#d4af35]">Leadership &amp; Execution</div>
                  <h4 className="text-base font-black text-white">Mr. T Mohammed Arif</h4>
                  <p className="text-xs text-slate-400">Technology &amp; Digital Solutions Head &bull; Hash Prime Groups</p>
                </div>
              </div>
            </div>
            
            {/* Right Column: Project Enquiry Form */}
            <div className="lg:col-span-6 bg-[#0E0E0E] p-8 md:p-10 rounded-3xl border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
              <h3 className="text-2xl font-black text-white tracking-tight mb-2">Initiate a Technology Enquiry</h3>
              <p className="text-slate-400 text-xs mb-6">Describe your software, website, automation, or growth requirement. We analyze and respond within 24 hours.</p>
              
              {status.success ? (
                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-8 text-center space-y-3">
                  <div className="inline-flex justify-center items-center w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-black text-white">Enquiry Submitted Successfully</h4>
                  <p className="text-slate-400 text-xs max-w-sm mx-auto">Our technology and digital solutions engineering lead will review your project scope and contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Contact Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        required 
                        placeholder="Your full name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35] transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        required 
                        placeholder="+91 98765 43210" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35] transition-colors" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      placeholder="business@example.com" 
                      value={formData.email} 
                      onChange={handleChange} 
                      className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35] transition-colors" 
                    />
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Service Requirement</label>
                    <select 
                      name="serviceType" 
                      required 
                      value={formData.serviceType} 
                      onChange={handleChange} 
                      className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af35] transition-colors"
                    >
                      <option value="" disabled>Select Technology Domain</option>
                      <option value="Web Development">Web &amp; Custom Web Application</option>
                      <option value="Custom Software">Custom Software / ERP / Dashboard</option>
                      <option value="AI & Automation">AI &amp; Workflow Automation</option>
                      <option value="SEO & GEO Growth">SEO / GEO &amp; Search Visibility</option>
                      <option value="UI/UX Design">UI/UX &amp; Digital Experience</option>
                      <option value="Hosting & Cloud">Hosting, Domain &amp; Cloud Deployment</option>
                      <option value="Technical Consultation">General Technology Consultation</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">City / State</label>
                    <input 
                      type="text" 
                      name="projectLocation" 
                      required 
                      placeholder="e.g. Chennai, Mayiladuthurai, Bangalore" 
                      value={formData.projectLocation} 
                      onChange={handleChange} 
                      className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35] transition-colors" 
                    />
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Project Requirements &amp; Scope</label>
                    <textarea 
                      name="details" 
                      required 
                      placeholder="Describe the software, features, timeline, or business challenge..." 
                      rows="4" 
                      value={formData.details} 
                      onChange={handleChange} 
                      className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35] transition-colors resize-none"
                    />
                  </div>

                  {status.error && (
                    <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 text-xs">
                      {status.error}
                    </div>
                  )}
                  
                  <button 
                    type="submit" 
                    disabled={status.loading} 
                    className="w-full bg-[#d4af35] hover:bg-[#f5e0a3] text-black font-black uppercase tracking-widest text-xs py-4 px-8 rounded-xl transition-all shadow-[0_4px_20px_rgba(212,175,53,0.25)] hover:shadow-[0_6px_30px_rgba(212,175,53,0.4)] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {status.loading ? 'Submitting Enquiry...' : 'Submit Technology Enquiry'}
                    {!status.loading && <ArrowRight className="w-4 h-4" />}
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
