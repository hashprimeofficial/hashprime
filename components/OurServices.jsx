"use client";

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
    Zap, Wind, HardHat, Globe, Wrench, Radio
} from 'lucide-react';
import LightPillar from './LightPillar';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const services = [
    { num: '01', Icon: Radio, title: 'Telecom Infrastructure', tag: 'Telecom', desc: 'Turnkey civil works, tower shelters, electrical O&M, and carrier-grade 99.99% uptime operations.' },
    { num: '02', Icon: Zap, title: 'Optical Fiber Splicing', tag: 'Fiber', desc: 'Microscope-aligned low-loss fusion splicing, blowing, ducting, and comprehensive OTDR diagnostics.' },
    { num: '03', Icon: Wind, title: 'Commercial HVAC Solutions', tag: 'Cooling', desc: 'End-to-end sales, installation, preventive jet servicing, and AMC contracts for all major AC brands.' },
    { num: '04', Icon: HardHat, title: 'Civil Construction', tag: 'Infrastructure', desc: 'Commercial developments, utility pipelines, foundation laying, and smart city infrastructure works.' },
    { num: '05', Icon: Wrench, title: 'Heavy Machinery & Generators', tag: 'Mechanical', desc: 'DG set sales, scheduled overhauls, electrical grid connectivity, and industrial machinery maintenance.' },
    { num: '06', Icon: Globe, title: 'Enterprise Trading & Supply', tag: 'Logistics', desc: 'Bulk procurement, industrial electrical components, SMC materials, and structured supply chain delivery.' },
];

export default function OurServices() {
    const sectionRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo('.os-header-content',
            { y: 60, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1.2, ease: 'power4.out',
                scrollTrigger: { trigger: '.os-header-content', start: 'top 90%' }
            }
        );

        gsap.fromTo('.os-row',
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.15,
                scrollTrigger: { trigger: '.os-rows', start: 'top 85%' }
            }
        );

        // Subtle background elements parallax
        gsap.to('.os-pill-bg', {
            y: -100,
            ease: 'none',
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative bg-[#0A0A0A] py-16 md:py-24 overflow-hidden text-white border-t border-white/5">

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="os-header-content text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d4af35]/20 bg-[#d4af35]/5 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4af35] animate-pulse"></span>
                        <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#d4af35]">Capabilities</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-6">
                        Core Engineering <br />
                        <span className="text-[#d4af35]">Capabilities & Verticals</span>
                    </h2>
                    <p className="text-slate-400 text-base md:text-lg">
                        Delivering technical excellence, rigorous safety compliance, and dependable execution across every project vertical.
                    </p>
                </div>

                <div className="os-rows grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((item) => {
                        const Icon = item.Icon;
                        return (
                            <div key={item.num} className="os-row group bg-[#121212] border border-white/10 hover:border-[#d4af35]/40 rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center group-hover:bg-[#d4af35] transition-colors duration-300">
                                            <Icon className="w-6 h-6 text-[#d4af35] group-hover:text-[#0A0A0A] transition-colors duration-300" />
                                        </div>
                                        <span className="text-xs font-mono font-bold text-slate-500 uppercase">{item.tag}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-6">{item.desc}</p>
                                </div>
                                <div className="text-xs font-mono font-bold text-[#d4af35]">{item.num} / VERTICAL</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
