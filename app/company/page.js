"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function CompanyPage() {
    const containerRef = useRef(null);

    useGSAP(() => {
        gsap.from(".reveal-text", {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            delay: 0.2
        });
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="min-h-screen bg-[#050505] text-slate-100 pt-32 pb-20 px-6 flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#d4af35]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#d4af35]/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="max-w-4xl mx-auto w-full text-center relative z-10">
                <div className="reveal-text inline-flex items-center space-x-2 bg-[#d4af35]/10 border border-[#d4af35]/20 py-2 px-4 rounded-full mb-8">
                    <span className="w-2 h-2 rounded-full bg-[#d4af35] animate-pulse"></span>
                    <span className="text-sm font-bold text-[#d4af35] uppercase tracking-widest">About Hashprime</span>
                </div>
                
                <h1 className="reveal-text text-6xl md:text-8xl font-black mb-12 tracking-tighter text-white leading-none">
                    Building the <br /> <span className="text-[#d4af35]">Future of Infrastructure</span>
                </h1>

                <div className="reveal-text space-y-6 text-slate-300 text-left text-base md:text-lg leading-relaxed mb-16 max-w-3xl mx-auto">
                    <p>
                        Hashprime is a multi-service engineering and infrastructure company dedicated to delivering reliable, innovative, and high-quality solutions across the telecom, electrical, construction, real estate, and technology sectors. We are committed to helping businesses and communities grow through professional expertise, technical excellence, and customer-focused service.
                    </p>
                    <p>
                        Our core expertise includes Telecom Operations & Maintenance (Electrical), New Site Deployment, Fiber Optic Solutions, Telecom Shelter Works, Generator Sales & Service, and ICT & SMC Trading. We also provide comprehensive Air Conditioning sales and maintenance, Private Construction, Real Estate solutions, and Legal Care support.
                    </p>
                    <p>
                        At Hashprime, every project is executed with a strong focus on quality, safety, efficiency, and timely delivery. Our experienced team works closely with clients to understand their requirements and deliver cost-effective solutions that meet the highest industry standards.
                    </p>
                    <p>
                        As we continue to grow, our vision is to become a trusted partner in engineering, infrastructure, and technology by building long-term relationships based on integrity, innovation, and excellence.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left mt-8 mb-16">
                    <div className="reveal-text p-8 rounded-3xl bg-[#0A0A0A] border border-[#d4af35]/15 shadow-2xl backdrop-blur-sm">
                        <h2 className="text-[#d4af35] text-2xl font-black mb-4 uppercase tracking-wider">Our Mission</h2>
                        <p className="text-slate-300 text-base leading-relaxed">
                            To deliver dependable engineering, infrastructure, and technology solutions that create lasting value for our clients through quality workmanship, innovation, and exceptional customer service.
                        </p>
                    </div>
                    <div className="reveal-text p-8 rounded-3xl bg-[#0A0A0A] border border-[#d4af35]/15 shadow-2xl backdrop-blur-sm">
                        <h2 className="text-[#d4af35] text-2xl font-black mb-4 uppercase tracking-wider">Our Vision</h2>
                        <p className="text-slate-300 text-base leading-relaxed">
                            To be recognized as one of India's most trusted engineering and technology companies, driving sustainable growth through excellence, reliability, and continuous innovation.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
