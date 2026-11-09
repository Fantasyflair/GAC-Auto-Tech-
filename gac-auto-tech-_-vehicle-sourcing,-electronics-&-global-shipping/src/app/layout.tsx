import type { Metadata, Viewport } from 'next';
import { Urbanist } from 'next/font/google';
import '../index.css';

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-urbanist',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GAC Auto Tech | Vehicle Sourcing, Electronics & Global Shipping',
  description:
    'Vehicle sourcing through Copart & IAAI, electronics retail & wholesale, and international shipping from Canada, USA, and UK to Ghana and supported destinations.',
  openGraph: {
    title: 'GAC Auto Tech | Vehicle Sourcing, Electronics & Global Shipping',
    description:
      'Sourcing auction vehicles, personal and wholesale electronics, and coordinating international freight to Ghana and supported destinations.',
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
        {children}
      </body>
    </html>
  );
}
