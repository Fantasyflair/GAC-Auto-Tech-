import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowUpRight,
  CarFront,
  ChevronLeft,
  ChevronRight,
  MonitorSmartphone,
  Container,
  Boxes,
  ClipboardList,
  SearchCheck,
  Handshake,
  Truck,
} from 'lucide-react';
import { ServiceType } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Reveal, rise, trackSpotlight } from './Reveal';

interface BentoHomeProps {
  onSelectService: (service: ServiceType) => void;
  onExploreVehicles: () => void;
}

const SHOW_MS = 6000;

const showSlides: {
  kicker: string;
  title: string;
  copy: string;
  icon: React.ElementType;
  image: string;
  cta: string;
  service: ServiceType;
}[] = [
  { kicker: 'General goods', title: 'Equipment, parts and personal goods', copy: 'Tell us what you need and we source it, then ship it with your other items in one consignment.', icon: Boxes, image: '/images/warehouse-boxes.jpg', cta: 'Request an item', service: 'general_merchandise' },
  { kicker: 'Step 01', title: 'Share what you need', copy: 'Send the vehicle, electronics, or cargo you want, plus your budget and destination.', icon: ClipboardList, image: '/images/macbook-pro.jpg', cta: 'Start an enquiry', service: 'vehicle_sourcing' },
  { kicker: 'Step 02', title: 'Review the options', copy: 'We confirm sourcing options, condition reports, and the full landed cost before anything is bought.', icon: SearchCheck, image: '/images/bmw.jpg', cta: 'Start an enquiry', service: 'vehicle_sourcing' },
  { kicker: 'Step 03', title: 'Agree the details', copy: 'Scope, payment, and timing are confirmed in writing before we proceed.', icon: Handshake, image: '/images/amg-gle-white.jpg', cta: 'Start an enquiry', service: 'vehicle_sourcing' },
  { kicker: 'Step 04', title: 'We coordinate it', copy: 'Purchase, export, and shipping are arranged through to collection in Ghana.', icon: Truck, image: '/images/port-aerial.jpg', cta: 'Get a shipping quote', service: 'shipping_quote' },
];

const ServiceSlideshow: React.FC<{ onSelectService: (service: ServiceType) => void }> = ({ onSelectService }) => {
  const [index, setIndex] = useState(0);
  const slide = showSlides[index];
  const Icon = slide.icon;

  useEffect(() => {
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % showSlides.length), SHOW_MS);
    return () => window.clearTimeout(timer);
  }, [index]);

  const go = (step: number) => setIndex((i) => (i + step + showSlides.length) % showSlides.length);

  return (
    <div className="ui-card overflow-hidden rounded-3xl">
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="flex flex-col justify-between p-6 sm:p-8 md:col-span-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                <span className="ui-icon flex h-9 w-9 items-center justify-center rounded-xl">
                  <Icon className="w-[18px] h-[18px]" strokeWidth={1.6} />
                </span>
                {slide.kicker}
              </span>
              <h3 className="mt-5 text-2xl font-semibold leading-tight sm:text-3xl">{slide.title}</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{slide.copy}</p>
              <button
                type="button"
                onClick={() => onSelectService(slide.service)}
                className="btn-theme mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold cursor-pointer"
              >
                {slide.cta}
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex flex-1 gap-1.5">
              {showSlides.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => setIndex(i)}
                  className="relative h-1 flex-1 overflow-hidden rounded-full bg-black/10 cursor-pointer dark:bg-white/15"
                  aria-label={`Show ${s.kicker}: ${s.title}`}
                  aria-current={i === index ? 'step' : undefined}
                >
                  {i < index && <span className="absolute inset-0 bg-[#111113] dark:bg-white" />}
                  {i === index && (
                    <motion.span
                      key={`bar-${index}`}
                      className="absolute inset-y-0 left-0 bg-[#111113] dark:bg-white"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: SHOW_MS / 1000, ease: 'linear' }}
                    />
                  )}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/15 hover:bg-black/5 cursor-pointer dark:border-white/20 dark:hover:bg-white/10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="btn-theme flex h-9 w-9 items-center justify-center rounded-full cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative min-h-[240px] overflow-hidden md:col-span-7 md:min-h-[380px]">
          <AnimatePresence initial={false}>
            <motion.img
              key={slide.image}
              src={slide.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1, transition: { opacity: { duration: 0.8 }, scale: { duration: SHOW_MS / 1000, ease: 'linear' } } }}
              exit={{ opacity: 0, transition: { duration: 0.8 } }}
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const SectionTitle: React.FC<{ title: string; copy?: string; muted: string }> = ({ title, copy, muted }) => (
  <Reveal className="mb-8">
    <h2 className="font-display text-3xl sm:text-4xl font-bold">{title}</h2>
    <motion.div
      className="mt-3 h-[3px] accent-bar"
      initial={{ width: 0 }}
      whileInView={{ width: 56 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
    />
    {copy && <p className={`mt-3 text-sm max-w-xl ${muted}`}>{copy}</p>}
  </Reveal>
);

export const BentoHome: React.FC<BentoHomeProps> = ({
  onSelectService,
  onExploreVehicles,
}) => {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const card = `ui-card border-transparent ${dark ? 'text-white' : 'text-[#111113]'}`;
  const muted = 'text-muted';
  const iconTile = 'ui-icon';

  return (
    <section id="services" className={`ui-canvas py-16 sm:py-24 ${dark ? 'text-white' : 'text-[#111113]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Services"
          copy="Four ways we help. Pick a service, or send one enquiry and we will route it."
          muted={muted}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6">
          <motion.button
            type="button"
            id="vehicle-sourcing"
            onClick={onExploreVehicles}
            {...rise(0)}
            className="group relative md:col-span-2 lg:col-span-8 lg:row-span-2 min-h-[360px] overflow-hidden rounded-3xl text-left cursor-pointer"
          >
            <img
              src="/images/g-wagon.jpg"
              alt="Luxury vehicle prepared for export sourcing"
              className="absolute inset-0 h-full w-full object-cover brightness-[0.55] transition-[transform,filter] duration-[1400ms] ease-out group-hover:scale-110 group-hover:brightness-[0.7]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#111113]/55 to-[#111113]/15" />
            <div className="relative flex h-full flex-col justify-between p-6 sm:p-8 text-white">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#E4D4D4] backdrop-blur">
                  <CarFront className="w-4 h-4" />
                  Vehicle sourcing
                </span>
                <span className="flex h-11 w-11 items-center justify-center pill-light rounded-full transition-transform duration-500 group-hover:rotate-45 group-hover:scale-110">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
              <div className="transition-transform duration-500 group-hover:-translate-y-1">
                <h3 className="font-display text-3xl sm:text-4xl font-bold">Copart and IAAI</h3>
                <p className="mt-2 max-w-md text-sm text-white/80">
                  Auction vehicles from Canada, the USA, and the UK, checked and prepared for export to Ghana.
                </p>
              </div>
            </div>
          </motion.button>

          {[
            { id: 'electronics_enquiry' as ServiceType, anchor: undefined, icon: MonitorSmartphone, title: 'Electronics', copy: 'Laptops, phones, consoles, and wholesale orders.' },
            { id: 'shipping_quote' as ServiceType, anchor: 'shipping', icon: Container, title: 'Shipping', copy: 'RoRo and container freight to Tema and other ports.' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                type="button"
                id={item.anchor}
                onClick={() => onSelectService(item.id)}
                onMouseMove={trackSpotlight}
                {...rise(i + 1)}
                className={`spotlight group lg:col-span-4 min-h-[180px] rounded-3xl border p-6 text-left cursor-pointer transition-colors duration-300 ${card}`}
              >
                <div className="flex items-start justify-between">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconTile}`}>
                    <Icon className="w-5 h-5" strokeWidth={1.6} />
                  </span>
                  <ArrowUpRight className={`w-4 h-4 ${muted} transition-transform duration-300 group-hover:rotate-45`} />
                </div>
                <h3 className="mt-6 font-display text-xl font-bold">{item.title}</h3>
                <p className={`mt-1 text-sm ${muted}`}>{item.copy}</p>
              </motion.button>
            );
          })}

          <motion.div {...rise(0)} className="md:col-span-2 lg:col-span-12">
            <ServiceSlideshow onSelectService={onSelectService} />
          </motion.div>
        </div>

      </div>
    </section>
  );
};
