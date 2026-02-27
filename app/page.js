import Hero from '@/components/Hero';
import HowToStart from '@/components/HowToStart';
import BentoFeatures from '@/components/BentoFeatures';
import SalientFeatures from '@/components/SalientFeatures';
import Community from '@/components/Community';

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <HowToStart />
      <BentoFeatures />
      <SalientFeatures />
      <Community />
    </>
  );
}
