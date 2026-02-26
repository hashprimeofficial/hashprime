import './globals.css';
import { Inter } from 'next/font/google';
import NavbarWrapper from '@/components/NavbarWrapper'; // Create this component
import FooterWrapper from '@/components/FooterWrapper';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Hashprime | The Apex of Crypto Investments',
  description: 'Experience next-generation speed, uncompromised security, and deep liquidity. Invest in Bitcoin, Ethereum, Solana and 100+ cryptocurrencies on Hashprime.',
  keywords: ['crypto investments', 'bitcoin exchange', 'buy ethereum', 'solana investments', 'cryptocurrency platform', 'secure crypto wallet', 'Hashprime', 'crypto investment'],
  authors: [{ name: 'Hashprime' }],
  creator: 'Hashprime',
  publisher: 'Hashprime',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Hashprime | Premium Cryptocurrency Exchange',
    description: 'The elite platform for professional crypto investors. Secure, fast, and feature-rich.',
    url: 'https://hashprime.com',
    siteName: 'Hashprime',
    images: [
      {
        url: '/logo.png', // Fallback to our logo if no specific OG image
        width: 800,
        height: 600,
        alt: 'Hashprime Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hashprime | The Apex of Crypto Investments',
    description: 'Elite cryptocurrency investment platform with advanced analytics, deep liquidity, and institutional-grade security.',
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-navy antialiased min-h-screen flex flex-col`}>
        <NavbarWrapper />
        <main className="flex-grow">
          {children}
        </main>
        <FooterWrapper />
      </body>
    </html>
  );
}
