import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Hashprime | The Apex of Crypto Trading',
  description: 'Experience next-generation speed, uncompromised security, and deep liquidity. Trade Bitcoin, Ethereum, Solana and 100+ cryptocurrencies on Hashprime.',
  keywords: ['crypto trading', 'bitcoin exchange', 'buy ethereum', 'solana trading', 'cryptocurrency platform', 'secure crypto wallet', 'Hashprime', 'crypto investment'],
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
    description: 'The elite platform for professional crypto traders. Secure, fast, and feature-rich.',
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
    title: 'Hashprime | The Apex of Crypto Trading',
    description: 'Elite cryptocurrency trading platform with advanced charts, deep liquidity, and institutional-grade security.',
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
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
