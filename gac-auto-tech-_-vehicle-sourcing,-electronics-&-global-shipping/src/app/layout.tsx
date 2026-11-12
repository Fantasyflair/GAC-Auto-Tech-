import type { Metadata, Viewport } from 'next';
import { Urbanist } from 'next/font/google';
import '../index.css';
import { Providers } from './providers';

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-urbanist',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gac-auto-tech.vercel.app'),
  title: {
    default: 'GAC Auto Tech | Vehicle Sourcing & Global Shipping',
    template: '%s | GAC Auto Tech',
  },
  description:
    'Vehicle sourcing from auctions and dealers, general merchandise, and international shipping from Canada, USA, and UK to Ghana and supported destinations.',
  openGraph: {
    title: 'GAC Auto Tech | Vehicle Sourcing & Global Shipping',
    description:
      'Sourcing auction vehicles and general goods, and coordinating international freight to Ghana and supported destinations.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${urbanist.variable}`}>
      <body className="bg-white text-[#18181B] antialiased selection:bg-[#E9DCDC] selection:text-[#1A1212]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
