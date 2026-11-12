import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Boxes, CarFront, Container } from 'lucide-react';
import { HeroSlide, ServiceType } from '../types';
import { useSite } from './SiteShell';
import { EASE } from './Reveal';

interface HeroProps {
  slides: HeroSlide[];
  onRequestQuote: (service?: ServiceType, details?: string) => void;
  onNavigate: (sectionId: string) => void;
}

/* The admin edits each slide's photo and wording; the tab, icon and buttons stay tied to the service. */
const SERVICE_CHROME: Record<
  ServiceType,
  { tab: string; shortTab: string; icon: React.ElementType; primary: string; secondary: { label: string; section?: string; whatsapp?: string } }
> = {
  vehicle_sourcing: {
    tab: 'Vehicles',
    shortTab: 'Cars',
    icon: CarFront,
    primary: 'Source a vehicle',
    secondary: { label: 'View vehicles', section: 'vehicles' },
  },
  shipping_quote: {
    tab: 'Shipping',
    shortTab: 'Freight',
    icon: Container,
    primary: 'Get a shipping quote',
    secondary: { label: 'How it works', section: 'services' },
  },
  general_merchandise: {
    tab: 'General goods',
    shortTab: 'Goods',
    icon: Boxes,
    primary: 'Request an item',
    secondary: { label: 'Chat with us', whatsapp: 'Hello GAC Auto Tech, I need help sourcing an item.' },
  },
};

const SLIDE_MS = 8000;

export const Hero: React.FC<HeroProps> = ({ slides: slideContent, onRequestQuote, onNavigate }) => {
  const { whatsappUrl } = useSite();
  const slides = slideContent.filter((s) => SERVICE_CHROME[s.service]).map((s) => ({ ...s, ...SERVICE_CHROME[s.service] }));
  const [slide, setSlide] = useState(0);
  // Pauses while the visitor is reading or about to click, so the copy doesn't change under them.
  const [paused, setPaused] = useState(false);
  const current = slides[Math.min(slide, slides.length - 1)];

  const imageKey = slides.map((s) => s.image).join('|');
  useEffect(() => {
    imageKey.split('|').forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [imageKey]);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = window.setTimeout(() => setSlide((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [slide, paused, slides.length]);

  const pauseHandlers = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocus: () => setPaused(true),
    onBlur: (e: React.FocusEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
    },
  };

  if (!current) return null;

  const secondaryClass =
    'group inline-flex items-center gap-2 py-3 text-sm font-bold text-white/85 transition-colors hover:text-white cursor-pointer';

  return (
    // Full-bleed from the top of the page; the fixed header floats over the photo.
    <section className="relative flex min-h-[max(600px,100svh)] flex-col overflow-hidden bg-[#0b0b0d] text-white">
      <h1 className="sr-only">GAC Auto Tech: vehicle sourcing, shipping, and general goods to Ghana</h1>

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
            {...pauseHandlers}
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
                onClick={() => onRequestQuote(current.service, '')}
                className="inline-flex items-center gap-2 rounded-control bg-white px-6 py-3.5 text-sm font-bold text-[#111113] transition-colors hover:bg-[#ececec] cursor-pointer"
              >
                {current.primary}
                <ArrowRight className="w-4 h-4" />
              </button>
              {current.secondary.whatsapp ? (
                <a href={whatsappUrl(current.secondary.whatsapp)} target="_blank" rel="noopener noreferrer" className={secondaryClass}>
                  {current.secondary.label}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate(current.secondary.section ?? 'quote-form')}
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

      {/* Service tabs. Advance every few seconds; the red bar on the active tab shows the countdown. */}
      <div className="relative z-10 border-t border-white/15 bg-black/35 backdrop-blur-md" {...pauseHandlers}>
        <div
          className="mx-auto grid max-w-7xl sm:px-3 lg:px-5"
          style={{ gridTemplateColumns: `repeat(${slides.length}, minmax(0, 1fr))` }}
        >
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
                  <span className="absolute inset-x-0 top-0 h-[2px] overflow-hidden bg-white/15" aria-hidden>
                    <motion.span
                      key={`${slide}-${paused}`}
                      className="block h-full origin-left bg-signal"
                      initial={{ scaleX: paused ? 1 : 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: paused ? 0 : SLIDE_MS / 1000, ease: 'linear' }}
                    />
                  </span>
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
