import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  Anchor,
  Boxes,
  CarFront,
  CircleDollarSign,
  Container,
  Gavel,
  MapPin,
  MonitorSmartphone,
  PackageCheck,
  Route,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { ServiceType } from '../types';
import { getWhatsAppUrl } from '../data/mockData';
import { EASE } from './Reveal';

interface HeroProps {
  onRequestQuote: (service?: ServiceType, details?: string) => void;
  onNavigate: (sectionId: string) => void;
}

const SLIDE_MS = 7000;

interface Slide {
  service: ServiceType;
  tab: string;
  icon: React.ElementType;
  tag: string;
  title: string;
  accent: string;
  copy: string;
  image: string;
  alt: string;
  facts: { icon: React.ElementType; label: string; value: string }[];
  primary: string;
  secondary: { label: string; section?: string; whatsapp?: string };
}

const slides: Slide[] = [
  {
    service: 'vehicle_sourcing',
    tab: 'Vehicles',
    icon: CarFront,
    tag: 'Vehicle sourcing',
    title: 'Your next car,',
    accent: 'sourced and shipped.',
    copy: 'Auction and dealer vehicles from Canada, the USA, and the UK, checked and delivered to Ghana.',
    image: '/images/porsche-911.jpg',
    alt: 'Black Porsche Panamera on the highway',
    facts: [
      { icon: Gavel, label: 'Sourced from', value: 'Copart, IAAI and dealers' },
      { icon: Anchor, label: 'Delivered to', value: 'Tema, Ghana' },
    ],
    primary: 'Source a vehicle',
    secondary: { label: 'View vehicles', section: 'vehicles' },
  },
  {
    service: 'electronics_enquiry',
    tab: 'Electronics',
    icon: MonitorSmartphone,
    tag: 'Electronics',
    title: 'Phones, laptops',
    accent: 'and gaming gear.',
    copy: 'Brand-new Apple, Samsung, and Sony products for personal use, resale, or wholesale orders.',
    image: '/images/macbook-pro.jpg',
    alt: 'MacBook Pro on a desk',
    facts: [
      { icon: PackageCheck, label: 'Condition', value: 'Brand new and sealed' },
      { icon: Boxes, label: 'Order size', value: 'Single units or wholesale' },
    ],
    primary: 'Shop electronics',
    secondary: { label: 'Wholesale quote' },
  },
  {
    service: 'shipping_quote',
    tab: 'Shipping',
    icon: Container,
    tag: 'Shipping and freight',
    title: 'Cars and cargo,',
    accent: 'shipped to Tema.',
    copy: 'RoRo and container freight from North America and the UK, with export paperwork handled.',
    image: '/images/port-hamburg.jpg',
    alt: 'Container ships and cranes at a busy port',
    facts: [
      { icon: Container, label: 'Freight', value: 'RoRo and containers' },
      { icon: ShieldCheck, label: 'Paperwork', value: 'Export and clearing documents' },
    ],
    primary: 'Get a shipping quote',
    secondary: { label: 'How it works', section: 'services' },
  },
  {
    service: 'general_merchandise',
    tab: 'General goods',
    icon: Boxes,
    tag: 'General goods',
    title: 'Anything else?',
    accent: "We'll find it.",
    copy: 'Equipment, spare parts, and personal goods, combined with your other items in one shipment.',
    image: '/images/warehouse-boxes.jpg',
    alt: 'Boxes packed and ready in a warehouse',
    facts: [
      { icon: Boxes, label: 'We source', value: 'Equipment, parts and more' },
      { icon: Route, label: 'Shipping', value: 'One combined shipment' },
    ],
    primary: 'Request an item',
    secondary: { label: 'Chat with us', whatsapp: 'Hello GAC Auto Tech, I need help sourcing an item.' },
  },
];

const services: { id: ServiceType; title: string; copy: string; icon: React.ElementType; placeholder: string }[] = [
  { id: 'vehicle_sourcing', title: 'Source a vehicle', copy: 'Copart, IAAI and dealers', icon: CarFront, placeholder: 'e.g. 2021 Toyota Land Cruiser, Copart lot or listing link' },
  { id: 'electronics_enquiry', title: 'Electronics', copy: 'Retail and wholesale', icon: MonitorSmartphone, placeholder: 'e.g. MacBook Pro 14", 10 units for wholesale' },
  { id: 'shipping_quote', title: 'Ship cargo', copy: 'RoRo and containers', icon: Container, placeholder: 'e.g. One SUV and household items, Toronto to Tema' },
  { id: 'general_merchandise', title: 'General goods', copy: 'Anything else you need', icon: Boxes, placeholder: 'e.g. Workshop equipment and spare parts' },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: EASE },
});

export const Hero: React.FC<HeroProps> = ({ onRequestQuote, onNavigate }) => {
  const [slide, setSlide] = useState(0);
  const [service, setService] = useState<ServiceType>('vehicle_sourcing');
  const [origin, setOrigin] = useState('Canada / USA (Auctions)');
  const [destination, setDestination] = useState('Ghana (Tema Port)');
  const [request, setRequest] = useState('');
  const [budget, setBudget] = useState('');

  const current = slides[slide];
  const activeService = services.find((s) => s.id === service) ?? services[0];

  useEffect(() => {
    const timer = window.setTimeout(() => setSlide((s) => (s + 1) % slides.length), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [slide]);

  const chooseSlide = (index: number) => {
    setSlide(index);
    setService(slides[index].service);
  };

  const primaryAction = () => {
    if (current.service === 'electronics_enquiry') {
      onNavigate('electronics');
      return;
    }
    onRequestQuote(current.service, '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = [`Origin: ${origin}`, `Destination: ${destination}`];
    if (request.trim()) parts.push(`Request: ${request.trim()}`);
    if (budget.trim()) parts.push(`Budget: $${budget.trim()}`);
    onRequestQuote(service, parts.join(' · '));
  };

  const chip = 'inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-white/[0.07] px-3 py-1.5 text-xs font-medium';
  const secondaryClass =
    'inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white/60 px-5 py-3 text-sm font-semibold text-[#111113] backdrop-blur transition-colors hover:bg-white cursor-pointer dark:border-white/15 dark:bg-white/[0.05] dark:text-white dark:hover:bg-white/10';

  return (
    <section className="ui-canvas pt-[92px] sm:pt-[100px] pb-12 sm:pb-16">
      <h1 className="sr-only">GAC Auto Tech: vehicle sourcing, electronics, shipping, and general goods to Ghana</h1>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        {/* Rotating showcase across every service */}
        <motion.div
          {...fadeUp(0.1)}
          className="relative overflow-hidden rounded-[28px] bg-[#d9d9d9] p-5 sm:p-7 dark:bg-[#151517] lg:col-span-8 lg:min-h-[580px]"
        >
          <div className="relative z-10 flex flex-col lg:h-full lg:max-w-[44%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.tab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#111113] dark:bg-white/10 dark:text-white">
                  <current.icon className="w-3.5 h-3.5" strokeWidth={1.8} />
                  {current.tag}
                </span>

                <h2 className="mt-5 text-[34px] font-semibold leading-[1.06] text-[#111113] sm:text-[44px] dark:text-white">
                  {current.title}
                  <span className="block text-[#6b6b72] dark:text-white/55">{current.accent}</span>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#4f4f56] dark:text-white/65">{current.copy}</p>

                <div className="mt-5 space-y-2.5 sm:max-w-[280px]">
                  {current.facts.map(({ icon: Icon, label, value }, i) => (
                    <div key={label} className="flex items-center gap-3 rounded-2xl bg-white/55 p-2.5 backdrop-blur dark:bg-white/[0.05]">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          i === 0 ? 'bg-[#111113] text-white dark:bg-white dark:text-[#111113]' : 'bg-white text-[#111113] dark:bg-white/10 dark:text-white'
                        }`}
                      >
                        <Icon className="w-[18px] h-[18px]" strokeWidth={1.6} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] text-[#55555c] dark:text-white/55">{label}</p>
                        <p className="truncate text-sm font-semibold text-[#111113] dark:text-white">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={primaryAction}
                    className="btn-theme inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold cursor-pointer"
                  >
                    {current.primary}
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  {current.secondary.whatsapp ? (
                    <a href={getWhatsAppUrl(current.secondary.whatsapp)} target="_blank" rel="noopener noreferrer" className={secondaryClass}>
                      {current.secondary.label}
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
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Photo: masked on the right on desktop, stacked below on mobile */}
          <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-2xl lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:aspect-auto lg:w-[62%] lg:rounded-none lg:[mask-image:linear-gradient(to_right,transparent,black_32%)]">
            <AnimatePresence initial={false}>
              <motion.img
                key={current.image}
                src={current.image}
                alt={current.alt}
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.08, x: '3%' }}
                animate={{
                  opacity: 1,
                  scale: 1.02,
                  x: '-2%',
                  transition: { opacity: { duration: 1 }, default: { duration: SLIDE_MS / 1000 + 1, ease: 'linear' } },
                }}
                exit={{ opacity: 0, transition: { duration: 1 } }}
              />
            </AnimatePresence>
          </div>

          {/* Service tabs */}
          <div className="relative z-10 mt-5 grid grid-cols-2 gap-1.5 rounded-2xl bg-white/70 p-1.5 backdrop-blur-md sm:grid-cols-4 dark:bg-black/45 lg:absolute lg:bottom-6 lg:left-7 lg:right-7 lg:mt-0">
            {slides.map((s, i) => {
              const Icon = s.icon;
              const active = i === slide;
              return (
                <button
                  key={s.tab}
                  type="button"
                  onClick={() => chooseSlide(i)}
                  aria-pressed={active}
                  className={`relative flex items-center gap-2 overflow-hidden rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors cursor-pointer ${
                    active ? 'bg-[#111113] text-white dark:bg-white dark:text-[#111113]' : 'text-[#111113] hover:bg-white dark:text-white dark:hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" strokeWidth={1.7} />
                  <span className="truncate">{s.tab}</span>
                  {active && (
                    <motion.span
                      key={`progress-${slide}`}
                      className="absolute bottom-0 left-0 h-[2px] bg-white/70 dark:bg-black/40"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Concierge panel */}
        <motion.div
          {...fadeUp(0.2)}
          className="flex flex-col rounded-[28px] bg-[#f8f8f8] p-5 text-[#111113] sm:p-6 dark:bg-[#151517] dark:text-white lg:col-span-4"
        >
          <div className="flex items-center gap-3">
            <span className="ui-icon flex h-10 w-10 items-center justify-center rounded-xl">
              <Sparkles className="w-[18px] h-[18px]" strokeWidth={1.6} />
            </span>
            <div>
              <p className="text-base font-semibold">Sourcing concierge</p>
              <p className="text-xs text-muted">Tell us what you need and where it's going</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            {services.map((item) => {
              const Icon = item.icon;
              const selected = item.id === service;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setService(item.id)}
                  aria-pressed={selected}
                  className={`rounded-2xl p-3.5 text-left transition-colors cursor-pointer ${
                    selected
                      ? 'bg-[#111113] text-white dark:bg-white dark:text-[#111113]'
                      : 'bg-[#ececec] hover:bg-[#e2e2e2] dark:bg-white/[0.06] dark:hover:bg-white/[0.1]'
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" strokeWidth={1.6} />
                  <p className="mt-6 text-sm font-semibold leading-tight">{item.title}</p>
                  <p className={`mt-0.5 text-[11px] ${selected ? 'opacity-70' : 'text-muted'}`}>{item.copy}</p>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="ui-well mt-4 flex flex-1 flex-col rounded-2xl p-4">
            <label htmlFor="hero-request" className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              What are you looking for?
            </label>
            <textarea
              id="hero-request"
              rows={3}
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              placeholder={activeService.placeholder}
              className="mt-2 w-full flex-1 resize-none bg-transparent text-sm leading-relaxed placeholder:text-[#8e8e95] focus:outline-none"
            />

            <div className="mt-3 grid grid-cols-2 gap-2">
              <label className={chip}>
                <MapPin className="w-3.5 h-3.5 shrink-0 text-muted" />
                <span className="sr-only">Origin market</span>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full min-w-0 appearance-none bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="Canada / USA (Auctions)">Canada / USA</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Dealer Network">Dealer network</option>
                </select>
              </label>
              <label className={chip}>
                <Anchor className="w-3.5 h-3.5 shrink-0 text-muted" />
                <span className="sr-only">Destination</span>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full min-w-0 appearance-none bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="Ghana (Tema Port)">Tema, Ghana</option>
                  <option value="Other Destination Port">Other port</option>
                </select>
              </label>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <label className={`${chip} flex-1`}>
                <CircleDollarSign className="w-3.5 h-3.5 shrink-0 text-muted" />
                <span className="sr-only">Target budget</span>
                <input
                  type="number"
                  min="0"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Budget (optional)"
                  className="w-full min-w-0 bg-transparent placeholder:text-[#8e8e95] focus:outline-none"
                />
              </label>
              <button
                type="submit"
                className="btn-theme inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold cursor-pointer"
              >
                Find it
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
