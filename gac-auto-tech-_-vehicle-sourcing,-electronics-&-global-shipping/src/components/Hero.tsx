import React, { useState } from 'react';
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

interface Slide {
  service: ServiceType;
  tab: string;
  icon: React.ElementType;
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
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: EASE },
});

export const Hero: React.FC<HeroProps> = ({ onRequestQuote, onNavigate }) => {
  // Vehicles lead; the panel only changes when the visitor picks another tab.
  const [slide, setSlide] = useState(0);
  const [service, setService] = useState<ServiceType>('vehicle_sourcing');
  const [origin, setOrigin] = useState('Canada / USA (Auctions)');
  const [destination, setDestination] = useState('Ghana (Tema Port)');
  const [request, setRequest] = useState('');
  const [budget, setBudget] = useState('');

  const current = slides[slide];
  const activeService = services.find((s) => s.id === service) ?? services[0];

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

  const field =
    'flex items-center gap-2 rounded-control border ui-divider px-3 py-2.5 text-sm font-medium';
  const secondaryClass =
    'inline-flex items-center justify-center gap-2 rounded-full border border-black/20 px-5 py-3 text-sm font-bold text-[#111113] transition-colors hover:bg-black/5 cursor-pointer dark:border-white/25 dark:text-white dark:hover:bg-white/10';

  return (
    <section className="ui-canvas pt-[88px] pb-10 sm:pt-[104px] sm:pb-16">
      <h1 className="sr-only">GAC Auto Tech: vehicle sourcing, electronics, shipping, and general goods to Ghana</h1>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        {/* Showcase. Starts on vehicles and switches only on a tab press. */}
        <motion.div
          {...fadeUp(0.05)}
          className="relative overflow-hidden rounded-panel bg-white p-5 sm:p-7 dark:bg-[#151517] lg:col-span-8 lg:min-h-[560px]"
        >
          <div className="relative z-10 flex flex-col lg:h-full lg:max-w-[52%] xl:max-w-[44%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <h2 className="font-display text-4xl text-[#111113] sm:text-5xl dark:text-white">
                  {current.title}
                  <span className="block text-muted">{current.accent}</span>
                </h2>
                <p className="mt-4 max-w-md text-base font-medium text-muted">{current.copy}</p>

                {/* Facts read as a labelled list, not as cards stacked inside a card. */}
                <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4 border-t ui-divider pt-5">
                  {current.facts.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-2.5">
                      <Icon className="mt-0.5 w-5 h-5 shrink-0 text-accent" strokeWidth={1.8} />
                      <div className="min-w-0">
                        <dt className="text-xs font-semibold text-muted">{label}</dt>
                        <dd className="text-base font-bold text-[#111113] dark:text-white">{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <button
                    type="button"
                    onClick={primaryAction}
                    className="btn-theme inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold cursor-pointer"
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
          <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-media lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:aspect-auto lg:w-[52%] lg:rounded-none lg:[mask-image:linear-gradient(to_right,transparent,black_40%)] xl:w-[58%]">
            <AnimatePresence initial={false}>
              <motion.img
                key={current.image}
                src={current.image}
                alt={current.alt}
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.45 } }}
                exit={{ opacity: 0, transition: { duration: 0.45 } }}
              />
            </AnimatePresence>
          </div>

          {/* Service tabs */}
          <div className="relative z-10 mt-5 grid grid-cols-2 gap-1.5 rounded-media bg-black/[0.04] p-1.5 sm:grid-cols-4 dark:bg-white/[0.06] lg:absolute lg:bottom-7 lg:left-7 lg:right-7 lg:mt-0 lg:bg-white/80 lg:backdrop-blur-md lg:dark:bg-black/55">
            {slides.map((s, i) => {
              const Icon = s.icon;
              const active = i === slide;
              return (
                <button
                  key={s.tab}
                  type="button"
                  onClick={() => chooseSlide(i)}
                  aria-pressed={active}
                  className={`flex items-center justify-center gap-2 rounded-control px-3 py-3 text-sm font-bold transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#111113] text-white dark:bg-white dark:text-[#111113]'
                      : 'text-[#111113] hover:bg-black/5 dark:text-white dark:hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" strokeWidth={1.8} />
                  <span className="truncate">{s.tab}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Concierge panel */}
        <motion.div
          {...fadeUp(0.12)}
          className="flex flex-col rounded-panel bg-white p-5 text-[#111113] sm:p-6 dark:bg-[#151517] dark:text-white lg:col-span-4"
        >
          <div className="flex items-center gap-3">
            <span className="ui-icon flex h-11 w-11 items-center justify-center rounded-media">
              <Sparkles className="w-5 h-5" strokeWidth={1.7} />
            </span>
            <div>
              <p className="font-display text-lg font-bold">Sourcing concierge</p>
              <p className="text-sm text-muted">Tell us what you need and where it's going</p>
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
                  className={`rounded-media border p-3.5 text-left transition-colors cursor-pointer ${
                    selected
                      ? 'border-transparent bg-[#111113] text-white dark:bg-white dark:text-[#111113]'
                      : 'ui-divider hover:bg-black/[0.04] dark:hover:bg-white/[0.07]'
                  }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.7} />
                  <p className="mt-4 text-sm font-bold leading-tight">{item.title}</p>
                  <p className={`mt-0.5 text-xs font-medium ${selected ? 'opacity-75' : 'text-muted'}`}>{item.copy}</p>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-1 flex-col border-t ui-divider pt-5">
            <label htmlFor="hero-request" className="eyebrow text-muted">
              What are you looking for?
            </label>
            <textarea
              id="hero-request"
              rows={3}
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              placeholder={activeService.placeholder}
              className="mt-2 w-full flex-1 resize-none rounded-control border ui-divider bg-transparent p-3 text-sm leading-relaxed placeholder:text-[#78787f] focus:border-black/40 focus:outline-none dark:focus:border-white/50"
            />

            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <label className={field}>
                <MapPin className="w-4 h-4 shrink-0 text-muted" />
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
              <label className={field}>
                <Anchor className="w-4 h-4 shrink-0 text-muted" />
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

            <label className={`${field} mt-2`}>
              <CircleDollarSign className="w-4 h-4 shrink-0 text-muted" />
              <span className="sr-only">Target budget</span>
              <input
                type="number"
                min="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Budget (optional)"
                className="w-full min-w-0 bg-transparent placeholder:text-[#78787f] focus:outline-none"
              />
            </label>

            <button
              type="submit"
              className="btn-theme mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold cursor-pointer"
            >
              Find it
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
