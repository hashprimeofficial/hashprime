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
    <div className="bg-[#0A0A0A] min-h-screen text-white font-sans selection:bg-[#d4af35] selection:text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/[0.06]">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-[#d4af35] to-[#E5C158] bg-clip-text text-transparent">Spiritual Pilgrimages &</span>
            <br />Curated Domestic Travel
          </h1>
          <p className="text-xl text-slate-400 mb-10">
            Expertly crafted journeys with over 5+ years of travel management excellence across India.
          </p>
        </div>

        {/* Notice Alert */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-[#1a1505] border border-[#d4af35]/50 rounded-xl p-6 flex items-start space-x-4 shadow-[0_0_15px_rgba(212,175,53,0.1)]">
            <AlertTriangle className="text-[#d4af35] w-8 h-8 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-[#E5C158] font-bold text-lg mb-1">Important Notice</h3>
              <p className="text-slate-300">
                International tour packages are currently suspended. Hashprime Tourism is focused exclusively on domestic travel excellence and spiritual tour packages at this time.
              </p>
            </div>
          </div>
        </div>

        {/* Featured Package */}
        <div className="bg-[#0E0E0E] border border-[#d4af35]/30 rounded-3xl p-8 md:p-12 max-w-5xl mx-auto relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af35] opacity-5 blur-[100px] rounded-full group-hover:opacity-10 transition-opacity duration-700"></div>
          <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
            <div className="flex-1">
              <div className="inline-block bg-[#d4af35]/10 border border-[#d4af35]/30 text-[#d4af35] px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                Featured Package
              </div>
              <h2 className="text-3xl font-bold mb-4">Navagraha Yatra Pilgrimage Special</h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                A complete hassle-free pilgrimage journey covering all 9 sacred Navagraha temples in Tamil Nadu. Experience spiritual fulfillment without logistical stress.
              </p>
              <ul className="space-y-3">
                {[
                  "Comfortable AC vehicle transport",
                  "Verified premium hotel stays",
                  "VIP temple visit assistance",
                  "Scheduled & tailored itineraries"
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-slate-300">
                    <ShieldCheck className="w-5 h-5 text-[#d4af35] mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full md:w-1/3 flex flex-col items-center border border-white/[0.06] rounded-2xl p-6 bg-[#0A0A0A]">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#d4af35]/50 mb-4">
                <img src="/MANIKANDAPRABU R.jpeg" alt="Mr. Manikandaprabu R" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              </div>
              <h3 className="font-bold text-lg text-white">Mr. Manikandaprabu R</h3>
              <p className="text-[#d4af35] text-sm font-medium mb-4">Tourism Operations Head</p>
              <p className="text-slate-500 text-xs text-center">Personally supervising operations to ensure your spiritual journey is seamless.</p>
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
