import './globals.css';
import { DM_Sans, Space_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import NavbarWrapper from '@/components/NavbarWrapper';
import FooterWrapper from '@/components/FooterWrapper';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://hashprime.in'),
  title: 'Hashprime | Engineering & Infrastructure Solutions',
  description: 'Hashprime is a multi-service engineering and infrastructure company delivering reliable, innovative, and high-quality solutions across telecom, electrical, construction, real estate, and technology sectors.',
  keywords: ['telecom infrastructure', 'electrical engineering', 'construction services', 'real estate development', 'technology solutions', 'Hashprime', 'infrastructure company India', 'engineering services'],
  authors: [{ name: 'Hashprime' }],
  creator: 'Hashprime',
  publisher: 'Hashprime',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: './',
    languages: {
      'en-IN': './',
    },
  },
  openGraph: {
    title: 'Hashprime | Engineering & Infrastructure Solutions',
    description: 'Reliable, innovative, and high-quality solutions across telecom, electrical, construction, real estate, and technology sectors.',
    url: 'https://hashprime.in',
    siteName: 'Hashprime',
    images: [
      {
        url: '/logo.png', // Fallback to our logo if no specific OG image
        width: 800,
        height: 600,
        alt: 'Hashprime Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hashprime | Engineering & Infrastructure Solutions',
    description: 'Reliable, innovative, and high-quality solutions across telecom, electrical, construction, real estate, and technology sectors.',
    images: ['/logo.png'], // Fallback
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'geo.region': 'IN',
    'geo.position': '20.593684;78.96288',
    ICBM: '20.593684, 78.96288',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${spaceGrotesk.variable} font-sans bg-[#0A0A0A] text-white antialiased min-h-screen flex flex-col`}>
        <NavbarWrapper />
        <main className="flex-grow">
          {children}
        </main>
        <FooterWrapper />
        <Analytics />
      </body>
    </html>
  );
}
