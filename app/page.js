import Hero from '@/components/Hero';
import HowToStart from '@/components/HowToStart';
import BentoFeatures from '@/components/BentoFeatures';
import SalientFeatures from '@/components/SalientFeatures';
import Community from '@/components/Community';

export default function Home() {
  return (
    <>
      <Hero />
      <HowToStart />
      <BentoFeatures />
      <SalientFeatures />
      <Community />
    </>
  );
}
