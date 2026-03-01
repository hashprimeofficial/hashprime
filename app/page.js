import Hero from '@/components/Hero';
import HowToStart from '@/components/HowToStart';
import BentoFeatures from '@/components/BentoFeatures';
import SalientFeatures from '@/components/SalientFeatures';
import Community from '@/components/Community';
import OurProjects from '@/components/OurProjects';

export const metadata = {
  alternates: {
    canonical: 'https://hashprime.com/',
  },
};

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: 'Hashprime',
    url: 'https://hashprime.com',
    logo: 'https://hashprime.com/logo.png',
    description: 'Elite cryptocurrency investment platform with advanced analytics, deep liquidity, and institutional-grade security.',
  };

  return (
    <div className="relative bg-white overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative z-20"><Hero /></div>

      {/* Transition Orb 1 (Between Hero and HowToStart) */}
      <div className="absolute top-[800px] left-0 w-[800px] h-[800px] bg-gradient-to-r from-[#39FF14]/10 to-transparent rounded-full blur-[120px] pointer-events-none -translate-x-1/2 z-0"></div>

      <div className="relative z-20"><HowToStart /></div>

      {/* Transition Orb 2 (Between HowToStart and OurProjects) */}
      <div className="absolute top-[2000px] right-0 w-[1000px] h-[1000px] bg-gradient-to-l from-emerald-400/10 to-transparent rounded-full blur-[150px] pointer-events-none translate-x-1/3 z-0"></div>

      <div className="relative z-20"><OurProjects /></div>

      {/* Transition Orb 3 (Between OurProjects and BentoFeatures) */}
      <div className="absolute top-[3400px] left-0 w-[800px] h-[800px] bg-gradient-to-r from-blue-100/30 to-transparent rounded-full blur-[120px] pointer-events-none -translate-x-1/2 z-0"></div>



      {/* Transition Orb 4 (Between SalientFeatures and Community) */}
      <div className="absolute bottom-[800px] left-1/2 w-[1200px] h-[600px] bg-[#39FF14]/5 rounded-[100%] blur-[120px] pointer-events-none -translate-x-1/2 z-0"></div>

      <div className="relative z-20"><SalientFeatures /></div>
      <div className="relative z-20"><Community /></div>
    </div>
  );
}
