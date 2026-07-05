import Hero from '@/components/Hero';
import HowToStart from '@/components/HowToStart';
import BentoFeatures from '@/components/BentoFeatures';
import AboutHashPrime from '@/components/AboutHashPrime';
import Community from '@/components/Community';
import OurProjects from '@/components/OurProjects';
import InvestmentSchemes from '@/components/InvestmentSchemes';
import CryptoMarquee from '@/components/CryptoMarquee';

export const metadata = {
  alternates: {
    canonical: './',
  },
};

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Hashprime',
    url: 'https://hashprime.in',
    logo: 'https://hashprime.in/logo.png',
    description: 'Hashprime is a multi-service engineering and infrastructure company dedicated to delivering reliable, innovative, and high-quality solutions.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: {
        '@type': 'Country',
        name: 'India',
      },
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
  };

  return (
    <div className="relative bg-[#050505] overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative z-20"><Hero /></div>
      <div className="relative z-30"><CryptoMarquee /></div>
      <div className="relative z-20"><AboutHashPrime /></div>

      {/* Transition Orb 1 */}
      <div className="absolute top-[800px] left-[-10%] w-[800px] h-[800px] bg-[#d4af35] opacity-[0.03] rounded-full blur-[150px] pointer-events-none z-0"></div>

      <div className="relative z-20"><HowToStart /></div>

      {/* Transition Orb 2 */}
      <div className="absolute top-[2000px] right-[-10%] w-[1000px] h-[1000px] bg-[#d4af35] opacity-[0.02] rounded-full blur-[150px] pointer-events-none z-0"></div>

      <div className="relative z-20"><OurProjects /></div>

      {/* Transition Orb 3 */}
      <div className="absolute top-[3400px] left-[-10%] w-[800px] h-[800px] bg-[#d4af35] opacity-[0.03] rounded-full blur-[150px] pointer-events-none z-0"></div>

      {/* Transition Orb 4 */}
      <div className="absolute bottom-[800px] left-1/2 w-[1200px] h-[600px] bg-[#d4af35] opacity-[0.02] rounded-[100%] blur-[150px] pointer-events-none -translate-x-1/2 z-0"></div>

      <div className="relative z-20"><InvestmentSchemes /></div>
      <div className="relative z-20"><Community /></div>
    </div>
  );
}
