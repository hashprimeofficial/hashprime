import './globals.css';
import { DM_Sans, Space_Grotesk } from 'next/font/google';
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
  metadataBase: new URL('https://hashprime.com'),
  title: 'Hashprime | Intelligent Asset Management for the Modern Investor',
  description: 'Experience next-generation speed and uncompromised security. Invest in stocks, global businesses, and various industries on Hashprime.',
  keywords: ['business investments', 'stock exchange', 'global business', 'industry investments', 'investment platform', 'secure wallet', 'Hashprime', 'asset management'],
  authors: [{ name: 'Hashprime' }],
  creator: 'Hashprime',
  publisher: 'Hashprime',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Hashprime | Intelligent Asset Management for the Modern Investor',
    description: 'The elite platform for professional business and stock investors. Secure, fast, and feature-rich.',
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
    title: 'Hashprime | Intelligent Asset Management for the Modern Investor',
    description: 'Elite asset management platform with advanced analytics and institutional-grade security.',
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
      <body className={`${dmSans.variable} ${spaceGrotesk.variable} font-sans bg-[#121212] text-white antialiased min-h-screen flex flex-col`}>
        <NavbarWrapper />
        <main className="flex-grow">
          {children}
        </main>
        <FooterWrapper />
      </body>
    </html>
  );
}
