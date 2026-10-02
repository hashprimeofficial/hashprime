import './globals.css';
import { DM_Sans, Space_Grotesk } from 'next/font/google';

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
  title: 'Under Scheduled Updates & Enhancements | Hashprime',
  description: 'Our website is currently undergoing scheduled updates and enhancements. We’ll be back online on 21 October 2026. Thank you for your patience and understanding.',
  icons: {
    icon: '/icon.png',
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${spaceGrotesk.variable} font-sans bg-[#050505] text-white antialiased min-h-screen flex flex-col`}>
        <main className="flex-grow flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
