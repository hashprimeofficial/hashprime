"use client";

import React, { useState } from 'react';
import { Map, Hotel, Users, Bus, ShieldCheck, Star, Clock, AlertTriangle, Send, Phone } from 'lucide-react';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "TouristInformationCenter"],
  "name": "Hashprime Tourism",
  "description": "Experience Tamil Nadu's premier Navagraha Yatra with Hashprime Tourism (5+ years experience). Dedicated pilgrimage packages, domestic family tours, and AC transport.",
  "foundingDate": "2018",
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "Tamil Nadu",
    "addressCountry": "IN"
  }
};

export default function TourismServicesPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    tourType: '',
    numberOfTravellers: '',
    travelDate: '',
    details: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Submitting your enquiry...' });

    try {
      const res = await fetch('/api/business-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          fieldOfInquiry: `Tourism — ${formData.tourType} | Travellers: ${formData.numberOfTravellers} | Date: ${formData.travelDate}`,
          source: 'tourism',
          details: formData.details,
          contactDateTime: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setStatus({ type: 'success', message: 'Your enquiry has been submitted successfully. Our tourism team will contact you shortly.' });
        setFormData({ name: '', phone: '', email: '', tourType: '', numberOfTravellers: '', travelDate: '', details: '' });
      } else {
        setStatus({ type: 'error', message: 'Failed to submit enquiry. Please try again later.' });
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
              <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">Hashprime Tourism (5+ Years Exp)</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
              <span className="bg-gradient-to-r from-[#d4af35] to-[#E5C158] bg-clip-text text-transparent">
                Spiritual Pilgrimages
              </span>
              <br />& Curated Domestic Travel
            </h1>
            <p className="text-lg text-slate-400 mb-8 max-w-xl">
              Curated spiritual journeys and domestic packages across South India. Led by Operations Head Mr. Manikandaprabu R, ensuring seamless execution.
            </p>
            
          </div>
          <div className="lg:col-span-5 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af35] to-[#E5C158] rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-[#0E0E0E] border border-white/[0.06] rounded-3xl overflow-hidden aspect-[16/10] shadow-2xl">
              <img src="/hashprime-tourism.jpg" alt="Spiritual Pilgrimages" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/[0.06]">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our <span className="text-[#d4af35]">Services</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Comprehensive domestic travel solutions engineered for comfort and reliability.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: Map,
              title: "Navagraha Pilgrimage Package",
              desc: "Tailored and scheduled itineraries covering all 9 temples with dedicated travel guides."
            },
            {
              icon: Users,
              title: "Domestic Family & Group Packages",
              desc: "Customized tour packages across South India and pan-India destinations."
            },
            {
              icon: Bus,
              title: "Corporate & Outing Tours",
              desc: "Managed corporate retreats, team bonding trips, and business travel logistics."
            },
            {
              icon: Hotel,
              title: "End-to-End Travel Logistics",
              desc: "Dedicated cab bookings, luxury hotel reservations, and local itinerary planning."
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
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <Star className="w-12 h-12 text-[#d4af35] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">5+ Years Experience</h3>
            <p className="text-slate-400">Proven track record in delivering travel management excellence.</p>
          </div>
          <div className="p-6">
            <ShieldCheck className="w-12 h-12 text-[#d4af35] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Personally Supervised</h3>
            <p className="text-slate-400">Every tour is monitored by our dedicated Operations Head for quality.</p>
          </div>
          <div className="p-6">
            <Clock className="w-12 h-12 text-[#d4af35] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Premium Transport</h3>
            <p className="text-slate-400">Comfortable AC vehicles ensuring a smooth, safe, and relaxing journey.</p>
          </div>
        </div>
      </section>

      {/* Enquiry Form Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="bg-[#0E0E0E] border border-white/[0.06] rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Plan Your Journey</h2>
            <p className="text-slate-400">Request a callback and itinerary details from our travel experts.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium">Full Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35]/50 transition-colors" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium">Phone Number</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35]/50 transition-colors" placeholder="+91 98765 43210" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium">Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35]/50 transition-colors" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium">Tour Type</label>
                <select required name="tourType" value={formData.tourType} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af35]/50 transition-colors appearance-none">
                  <option value="">Select a package...</option>
                  <option value="Navagraha Yatra Special">Navagraha Yatra Special</option>
                  <option value="Domestic Family Package">Domestic Family Package</option>
                  <option value="Corporate Outing">Corporate Outing</option>
                  <option value="Tailor-Made Pilgrimage">Tailor-Made Pilgrimage</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium">Number of Travellers</label>
                <input required type="number" name="numberOfTravellers" value={formData.numberOfTravellers} onChange={handleChange} min="1" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35]/50 transition-colors" placeholder="e.g. 4" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium">Expected Travel Date</label>
                <input required type="date" name="travelDate" value={formData.travelDate} onChange={handleChange} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35]/50 transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300 font-medium">Special Requirements / Details</label>
              <textarea required name="details" value={formData.details} onChange={handleChange} rows="4" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af35]/50 transition-colors" placeholder="Tell us about any specific accommodations, dietary needs, or preferences..."></textarea>
            </div>

            {status.message && (
              <div className={`p-4 rounded-xl text-sm ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : status.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                {status.message}
              </div>
            )}

            <button type="submit" disabled={status.type === 'loading'} className="w-full bg-gradient-to-r from-[#d4af35] to-[#b8941f] text-black font-bold py-4 px-8 rounded-xl hover:from-[#E5C158] hover:to-[#d4af35] transition-all flex justify-center items-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed">
              <span>{status.type === 'loading' ? 'Sending...' : 'Submit Enquiry'}</span>
              {!status.type && <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
