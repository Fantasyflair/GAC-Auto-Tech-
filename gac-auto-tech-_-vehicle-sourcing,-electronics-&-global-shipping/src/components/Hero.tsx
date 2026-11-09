import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Boxes, CarFront, Container, MonitorSmartphone } from 'lucide-react';
import { ServiceType } from '../types';
import { getWhatsAppUrl } from '../data/mockData';
import { EASE } from './Reveal';

interface HeroProps {
  onRequestQuote: (service?: ServiceType, details?: string) => void;
  onNavigate: (sectionId: string) => void;
}

interface Slide {
  service: ServiceType;
  tab: string;
  shortTab: string;
  icon: React.ElementType;
  eyebrow: string;
  title: string;
  copy: string;
  image: string;
  alt: string;
  primary: string;
  secondary: { label: string; section?: string; whatsapp?: string };
}

const slides: Slide[] = [
  {
    service: 'vehicle_sourcing',
    tab: 'Vehicles',
    shortTab: 'Cars',
    icon: CarFront,
    eyebrow: 'Copart · IAAI · Dealers',
    title: 'Auction cars, delivered to Ghana',
    copy: 'We bid, inspect, and ship from Canada, the USA, and the UK.',
    image: '/images/porsche-911.jpg',
    alt: 'Black Porsche Panamera on the highway',
    primary: 'Source a vehicle',
    secondary: { label: 'View vehicles', section: 'vehicles' },
  },
  {
    service: 'electronics_enquiry',
    tab: 'Electronics',
    shortTab: 'Tech',
    icon: MonitorSmartphone,
    eyebrow: 'Apple · Samsung · Sony',
    title: 'Sealed tech, retail or wholesale',
    copy: 'One unit or a full pallet, brand new and boxed.',
    image: '/images/macbook-pro.jpg',
    alt: 'MacBook Pro on a desk',
    primary: 'Shop electronics',
    secondary: { label: 'Wholesale quote' },
  },
  {
    service: 'shipping_quote',
    tab: 'Shipping',
    shortTab: 'Freight',
    icon: Container,
    eyebrow: 'RoRo · Containers',
    title: 'Canada, USA and UK to Tema',
    copy: 'Cars and cargo shipped, with export paperwork handled.',
    image: '/images/port-hamburg.jpg',
    alt: 'Container ships and cranes at a busy port',
    primary: 'Get a shipping quote',
    secondary: { label: 'How it works', section: 'services' },
  },
  {
    service: 'general_merchandise',
    tab: 'General goods',
    shortTab: 'Goods',
    icon: Boxes,
    eyebrow: 'Parts · Equipment · Goods',
    title: "If it exists, we'll source it",
    copy: 'Combined with your other items in one shipment.',
    image: '/images/warehouse-boxes.jpg',
    alt: 'Boxes packed and ready in a warehouse',
    primary: 'Request an item',
    secondary: { label: 'Chat with us', whatsapp: 'Hello GAC Auto Tech, I need help sourcing an item.' },
  },
];

export const Hero: React.FC<HeroProps> = ({ onRequestQuote, onNavigate }) => {
  // Vehicles lead; the banner only changes when the visitor picks another tab.
  const [slide, setSlide] = useState(0);
  const current = slides[slide];

  const primaryAction = () => {
    if (current.service === 'electronics_enquiry') {
      onNavigate('electronics');
      return;
    }
    onRequestQuote(current.service, '');
  };

  const secondaryClass =
    'group inline-flex items-center gap-2 py-3 text-sm font-bold text-white/85 transition-colors hover:text-white cursor-pointer';

  return (
    // Full-bleed from the top of the page; the fixed header floats over the photo.
    <section className="relative flex min-h-[max(600px,100svh)] flex-col overflow-hidden bg-[#0b0b0d] text-white">
      <h1 className="sr-only">GAC Auto Tech: vehicle sourcing, electronics, shipping, and general goods to Ghana</h1>

      <AnimatePresence initial={false}>
        <motion.img
          key={current.image}
          src={current.image}
          alt={current.alt}
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1, transition: { opacity: { duration: 0.6 }, scale: { duration: 6, ease: 'easeOut' } } }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
        />
      </AnimatePresence>

      {/* Scrims: the side and bottom keep the copy and tabs legible, the top seats the header. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-10 pt-32 sm:px-8 sm:pb-14 lg:px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="max-w-2xl"
          >
            <p className="eyebrow flex items-center gap-3 text-white/75">
              <span className="h-[2px] w-7 bg-signal" aria-hidden />
              {current.eyebrow}
            </p>

            <h2 className="mt-4 font-display text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-7xl">
              {current.title}
              <span className="text-signal">.</span>
            </h2>

            <p className="mt-4 max-w-md text-base font-medium text-white/75 sm:text-lg">{current.copy}</p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
              <button
                type="button"
                onClick={primaryAction}
                className="inline-flex items-center gap-2 rounded-control bg-white px-6 py-3.5 text-sm font-bold text-[#111113] transition-colors hover:bg-[#ececec] cursor-pointer"
              >
                {current.primary}
                <ArrowRight className="w-4 h-4" />
              </button>
              {current.secondary.whatsapp ? (
                <a href={getWhatsAppUrl(current.secondary.whatsapp)} target="_blank" rel="noopener noreferrer" className={secondaryClass}>
                  {current.secondary.label}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    current.secondary.section
                      ? onNavigate(current.secondary.section)
                      : onRequestQuote(current.service, 'Wholesale electronics order')
                  }
                  className={secondaryClass}
                >
                  {current.secondary.label}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Service tabs. Starts on vehicles and switches only on a tab press. */}
      <div className="relative z-10 border-t border-white/15 bg-black/35 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-4 sm:px-3 lg:px-5">
          {slides.map((s, i) => {
            const Icon = s.icon;
            const active = i === slide;
            return (
              <button
                key={s.tab}
                type="button"
                onClick={() => setSlide(i)}
                aria-pressed={active}
                className={`relative flex flex-col items-center gap-1.5 px-2 py-4 text-xs font-bold transition-colors cursor-pointer sm:flex-row sm:gap-3 sm:px-6 sm:py-5 sm:text-sm lg:px-8 ${
                  i > 0 ? 'border-l border-white/10' : ''
                } ${active ? 'text-white' : 'text-white/55 hover:text-white'}`}
              >
                {active && (
                  <motion.span
                    layoutId="hero-tab-marker"
                    className="absolute inset-x-0 top-0 h-[2px] bg-signal"
                    transition={{ duration: 0.35, ease: EASE }}
                  />
                )}
                <span className="hidden font-semibold tabular-nums text-white/40 lg:inline">0{i + 1}</span>
                <Icon className="w-4 h-4 shrink-0" strokeWidth={1.8} />
                <span className="sm:hidden">{s.shortTab}</span>
                <span className="hidden sm:inline">{s.tab}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
