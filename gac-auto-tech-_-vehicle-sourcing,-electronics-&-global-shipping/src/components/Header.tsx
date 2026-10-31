import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowUpRight,
  Sun,
  Moon,
  Search,
  X,
  ChevronDown,
  ShoppingCart,
  UserRound,
  CarFront,
  MonitorSmartphone,
  Container,
  Boxes,
  Tag,
  Users,
  Warehouse,
  Truck,
  CornerDownLeft,
} from 'lucide-react';
import { GacLogo } from './GacLogo';
import { WhatsAppIcon } from './WhatsAppIcon';
import { getWhatsAppUrl } from '../data/mockData';
import { ServiceType } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useEnquiryList } from '../context/EnquiryListContext';
import { EASE } from './Reveal';

interface HeaderProps {
  onRequestQuote: (service?: ServiceType, details?: string) => void;
  onNavigateAbout: () => void;
  onOpenSignIn: () => void;
  onSearch: (query: string) => void;
}

type MenuId = 'categories' | 'partners';

const categories = [
  { title: 'Vehicles', icon: CarFront, section: 'vehicles', service: 'vehicle_sourcing' as ServiceType, items: ['SUVs & 4x4s', 'Sedans & coupés', 'Electric & hybrid', 'Performance cars'] },
  { title: 'Electronics', icon: MonitorSmartphone, section: 'electronics', service: 'electronics_enquiry' as ServiceType, items: ['Laptops', 'Phones', 'Gaming consoles', 'Accessories'] },
  { title: 'Shipping', icon: Container, section: 'shipping', service: 'shipping_quote' as ServiceType, items: ['Vehicle RoRo', 'Container freight', 'Air cargo', 'Clearing documents'] },
  { title: 'General goods', icon: Boxes, section: 'services', service: 'general_merchandise' as ServiceType, items: ['Equipment', 'Spare parts', 'Personal effects', 'Custom sourcing'] },
];

const partners = [
  { title: 'Sell your vehicle', copy: 'Get an offer or list your car with us.', icon: Tag },
  { title: 'Become an affiliate', copy: 'Refer buyers and earn on every deal.', icon: Users },
  { title: 'Supply wholesale', copy: 'Stock electronics or parts for our buyers.', icon: Warehouse },
  { title: 'Delivery partner', copy: 'Haulage and last-mile delivery in Ghana.', icon: Truck },
];

const links = [
  { id: 'vehicles', label: 'Explore' },
  { id: 'faq', label: 'FAQ' },
  { id: 'quote-form', label: 'Contact' },
];

const spyIds = ['services', 'electronics', 'vehicles', 'quote-form', 'faq'];

const searchExamples = [
  '2021 Toyota Land Cruiser under $40,000 from Copart',
  'MacBook Pro 14", 10 units for wholesale',
  'Ship a 20ft container from Toronto to Tema',
  'iPhone 15 Pro, unlocked, 256GB',
];

export const Header: React.FC<HeaderProps> = ({ onRequestQuote, onNavigateAbout, onOpenSignIn, onSearch }) => {
  const { theme, toggleTheme } = useTheme();
  const enquiryList = useEnquiryList();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState('top');
  const [hovered, setHovered] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [exampleIndex, setExampleIndex] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastY = useRef(0);
  const searchInput = useRef<HTMLInputElement>(null);

  const panelOpen = searchOpen || openMenu !== null || mobileOpen;

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > 240 && y > lastY.current + 4) {
        setHidden(true);
        setOpenMenu(null);
      }
      if (y < lastY.current - 4) setHidden(false);
      lastY.current = y;

      let current = 'top';
      for (const id of spyIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    searchInput.current?.focus();
    const timer = window.setInterval(() => setExampleIndex((i) => (i + 1) % searchExamples.length), 3200);
    return () => window.clearInterval(timer);
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const closeAll = () => {
    setOpenMenu(null);
    setSearchOpen(false);
    setMobileOpen(false);
  };

  const go = (id: string) => {
    closeAll();
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 84, behavior: 'smooth' });
  };

  const quote = (service: ServiceType, details: string) => {
    closeAll();
    onRequestQuote(service, details);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const text = query.trim();
    if (!text) return;
    closeAll();
    setQuery('');
    onSearch(text);
  };

  const categoriesActive = active === 'services' || active === 'electronics';
  const indicator = hovered ?? openMenu ?? (categoriesActive ? 'categories' : active === 'vehicles' ? 'vehicles' : active);

  const pill = (id: string) =>
    indicator === id && (
      <motion.span
        layoutId="nav-pill"
        className="pill-light absolute inset-0 rounded-full"
        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
      />
    );

  const navText = (id: string) =>
    `relative flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium cursor-pointer transition-colors duration-300 ${
      indicator === id ? 'text-[#111113]' : 'text-white/80 hover:text-white'
    }`;

  const iconButton =
    'relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition-colors hover:bg-white/10 cursor-pointer';

  return (
    <>
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: hidden && !panelOpen ? -96 : 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50 px-3 sm:px-5 pt-3"
        onMouseLeave={() => {
          setOpenMenu(null);
          setHovered(null);
        }}
      >
        <div
          className={`relative mx-auto max-w-7xl rounded-2xl text-white transition-[background-color,border-color,box-shadow] duration-500 ${
            scrolled || panelOpen
              ? 'bg-[#09090B]/90 backdrop-blur-xl border border-white/10 shadow-[0_14px_40px_rgba(0,0,0,0.3)]'
              : 'bg-[#09090B] border border-white/5'
          }`}
        >
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-5">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                go('top');
              }}
              className="shrink-0"
              aria-label="GAC Auto Tech home"
            >
              <GacLogo size="sm" className="h-8" />
            </a>

            <nav className="hidden xl:flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1">
              <button type="button" onClick={() => go('top')} onMouseEnter={() => { setHovered('top'); setOpenMenu(null); }} className={navText('top')}>
                {pill('top')}
                <span className="relative">Home</span>
              </button>

              <button
                type="button"
                onClick={() => setOpenMenu((m) => (m === 'categories' ? null : 'categories'))}
                onMouseEnter={() => { setHovered('categories'); setOpenMenu('categories'); setSearchOpen(false); }}
                className={navText('categories')}
                aria-expanded={openMenu === 'categories'}
              >
                {pill('categories')}
                <span className="relative">Categories</span>
                <ChevronDown className={`relative w-3.5 h-3.5 transition-transform duration-300 ${openMenu === 'categories' ? 'rotate-180' : ''}`} />
              </button>

              <button type="button" onClick={() => go('vehicles')} onMouseEnter={() => { setHovered('vehicles'); setOpenMenu(null); }} className={navText('vehicles')}>
                {pill('vehicles')}
                <span className="relative">Explore</span>
              </button>

              <button
                type="button"
                onClick={() => setOpenMenu((m) => (m === 'partners' ? null : 'partners'))}
                onMouseEnter={() => { setHovered('partners'); setOpenMenu('partners'); setSearchOpen(false); }}
                className={navText('partners')}
                aria-expanded={openMenu === 'partners'}
              >
                {pill('partners')}
                <span className="relative">Partners</span>
                <ChevronDown className={`relative w-3.5 h-3.5 transition-transform duration-300 ${openMenu === 'partners' ? 'rotate-180' : ''}`} />
              </button>

              {links.slice(1).map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => go(link.id)}
                  onMouseEnter={() => { setHovered(link.id); setOpenMenu(null); }}
                  className={navText(link.id)}
                >
                  {pill(link.id)}
                  <span className="relative">{link.label}</span>
                </button>
              ))}

              <button
                type="button"
                onClick={() => { closeAll(); onNavigateAbout(); }}
                onMouseEnter={() => { setHovered('about'); setOpenMenu(null); }}
                className={navText('about')}
              >
                {pill('about')}
                <span className="relative">About</span>
              </button>
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => { setOpenMenu(null); setSearchOpen((open) => !open); }}
                className={iconButton}
                aria-label={searchOpen ? 'Close search' : 'Search'}
                aria-expanded={searchOpen}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={searchOpen ? 'close' : 'search'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {searchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
                  </motion.span>
                </AnimatePresence>
              </button>

              <button
                type="button"
                onClick={() => { closeAll(); onOpenSignIn(); }}
                className="hidden lg:inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <UserRound className="w-4 h-4" />
                Sign in
              </button>

              <button
                type="button"
                onClick={() => { closeAll(); enquiryList.open(); }}
                className={iconButton}
                aria-label={`Cart, ${enquiryList.items.length} item${enquiryList.items.length === 1 ? '' : 's'}`}
                title="Cart"
              >
                <ShoppingCart className="w-4 h-4" />
                <AnimatePresence>
                  {enquiryList.items.length > 0 && (
                    <motion.span
                      key={enquiryList.items.length}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d9c4c4] px-1 text-[10px] font-bold text-[#111113]"
                    >
                      {enquiryList.items.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className={`${iconButton} hidden sm:flex overflow-hidden`}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={theme}
                    initial={{ y: 18, rotate: -90, opacity: 0 }}
                    animate={{ y: 0, rotate: 0, opacity: 1 }}
                    exit={{ y: -18, rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </motion.span>
                </AnimatePresence>
              </button>

              <motion.button
                type="button"
                onClick={() => quote('vehicle_sourcing', '')}
                whileTap={{ scale: 0.96 }}
                className="group hidden lg:inline-flex items-center gap-2 rounded-full btn-on-dark py-2 pl-4 pr-1.5 text-[13px] font-semibold cursor-pointer"
              >
                Get a quote
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#111113] text-white transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </motion.button>

              <button
                type="button"
                onClick={() => { setSearchOpen(false); setOpenMenu(null); setMobileOpen((open) => !open); }}
                className={`${iconButton} xl:hidden`}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                <motion.span
                  className="absolute h-[1.5px] w-4 rounded bg-white"
                  animate={mobileOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -3.5 }}
                  transition={{ duration: 0.3, ease: EASE }}
                />
                <motion.span
                  className="absolute h-[1.5px] w-4 rounded bg-white"
                  animate={mobileOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 3.5 }}
                  transition={{ duration: 0.3, ease: EASE }}
                />
              </button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {searchOpen && (
              <motion.div
                key="search"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="border-t border-white/10 px-4 pb-5 pt-4 sm:px-5">
                  <p className="mb-2 text-xs text-white/60">Add all the details you can. We'll find what you need.</p>
                  <form onSubmit={submitSearch} className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 w-5 h-5 -translate-y-1/2 text-white/50" />
                    <input
                      ref={searchInput}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      aria-label="Search vehicles, electronics, or shipping"
                      className="w-full rounded-2xl border border-white/15 bg-white/[0.06] py-4 pl-12 pr-28 text-base text-white placeholder:text-transparent focus:border-white/40 focus:outline-none"
                      placeholder={searchExamples[exampleIndex]}
                    />
                    {!query && (
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={exampleIndex}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.3 }}
                          className="pointer-events-none absolute left-12 right-28 top-1/2 -translate-y-1/2 truncate text-base text-white/40"
                        >
                          {searchExamples[exampleIndex]}
                        </motion.span>
                      </AnimatePresence>
                    )}
                    <button
                      type="submit"
                      className="btn-on-dark absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold cursor-pointer"
                    >
                      Find it
                      <CornerDownLeft className="w-4 h-4" />
                    </button>
                  </form>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.title}
                          type="button"
                          onClick={() => go(category.section)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/80 transition-colors hover:bg-white hover:text-[#111113] cursor-pointer"
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {category.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {openMenu === 'categories' && (
              <motion.div
                key="categories"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="hidden xl:block overflow-hidden"
              >
                <div className="grid grid-cols-12 gap-6 border-t border-white/10 px-5 pb-6 pt-5">
                  <div className="col-span-9 grid grid-cols-4 gap-6">
                    {categories.map((category, i) => {
                      const Icon = category.icon;
                      return (
                        <motion.div
                          key={category.title}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, delay: 0.05 + i * 0.05 }}
                        >
                          <button
                            type="button"
                            onClick={() => go(category.section)}
                            className="group flex items-center gap-2 font-display text-base font-semibold cursor-pointer"
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.08] transition-colors group-hover:bg-white group-hover:text-[#111113]">
                              <Icon className="w-4 h-4" />
                            </span>
                            {category.title}
                          </button>
                          <ul className="mt-3 space-y-1.5">
                            {category.items.map((item) => (
                              <li key={item}>
                                <button
                                  type="button"
                                  onClick={() => quote(category.service, `${category.title}: ${item}`)}
                                  className="text-sm text-white/65 transition-colors hover:text-white cursor-pointer"
                                >
                                  {item}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => { setOpenMenu(null); setSearchOpen(true); }}
                    className="group relative col-span-3 overflow-hidden rounded-2xl text-left cursor-pointer"
                  >
                    <img src="/images/g-wagon.jpg" alt="" className="absolute inset-0 h-full w-full object-cover brightness-[0.45] transition-transform duration-700 group-hover:scale-105" />
                    <div className="relative flex h-full min-h-[170px] flex-col justify-end p-4">
                      <p className="font-display text-lg font-semibold">Can't find it?</p>
                      <p className="mt-1 text-xs text-white/75">Describe what you need and we'll source it.</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold">
                        Search by description <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:rotate-45" />
                      </span>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {openMenu === 'partners' && (
              <motion.div
                key="partners"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="hidden xl:block overflow-hidden"
              >
                <div className="grid grid-cols-4 gap-3 border-t border-white/10 px-5 pb-5 pt-4">
                  {partners.map((partner, i) => {
                    const Icon = partner.icon;
                    return (
                      <motion.button
                        key={partner.title}
                        type="button"
                        onClick={() => quote('general_merchandise', `Partner enquiry: ${partner.title}`)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.05 + i * 0.05 }}
                        className="group rounded-2xl border border-white/10 p-4 text-left transition-colors hover:bg-white/[0.06] cursor-pointer"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.08] transition-colors group-hover:bg-white group-hover:text-[#111113]">
                          <Icon className="w-4 h-4" />
                        </span>
                        <p className="mt-3 font-display text-sm font-semibold">{partner.title}</p>
                        <p className="mt-1 text-xs text-white/60">{partner.copy}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 overflow-y-auto bg-[#09090B] px-6 pt-28 pb-10 text-white xl:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <form onSubmit={submitSearch} className="relative mb-6">
              <Search className="pointer-events-none absolute left-4 top-1/2 w-4 h-4 -translate-y-1/2 text-white/50" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search vehicles, electronics, shipping"
                className="w-full rounded-2xl border border-white/15 bg-white/[0.06] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none"
              />
            </form>

            <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Categories</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.title}
                    type="button"
                    onClick={() => go(category.section)}
                    className="flex items-center gap-2 rounded-2xl border border-white/10 px-3 py-3 text-left text-sm font-semibold cursor-pointer"
                  >
                    <Icon className="w-4 h-4" />
                    {category.title}
                  </button>
                );
              })}
            </div>

            <nav className="mt-6 flex flex-col">
              {[
                { id: 'top', label: 'Home' },
                ...links,
              ].map((link, i) => (
                <motion.button
                  key={link.id}
                  type="button"
                  onClick={() => go(link.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.15 + i * 0.05, ease: EASE }}
                  className="flex items-center justify-between border-b border-white/10 py-3.5 text-left font-display text-2xl font-semibold cursor-pointer"
                >
                  {link.label}
                  <ArrowUpRight className="w-5 h-5 text-white/40" />
                </motion.button>
              ))}
              <button
                type="button"
                onClick={() => { closeAll(); onNavigateAbout(); }}
                className="flex items-center justify-between border-b border-white/10 py-3.5 text-left font-display text-2xl font-semibold cursor-pointer"
              >
                About
                <ArrowUpRight className="w-5 h-5 text-white/40" />
              </button>
            </nav>

            <p className="mt-8 text-[11px] uppercase tracking-[0.18em] text-white/45">Partners</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {partners.map((partner) => {
                const Icon = partner.icon;
                return (
                  <button
                    key={partner.title}
                    type="button"
                    onClick={() => quote('general_merchandise', `Partner enquiry: ${partner.title}`)}
                    className="flex items-center gap-2 rounded-2xl border border-white/10 px-3 py-3 text-left text-sm cursor-pointer"
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {partner.title}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { closeAll(); onOpenSignIn(); }}
                className="flex items-center justify-center gap-2 rounded-full border border-white/15 py-3 text-sm font-semibold cursor-pointer"
              >
                <UserRound className="w-4 h-4" />
                Sign in
              </button>
              <button
                type="button"
                onClick={() => quote('vehicle_sourcing', '')}
                className="rounded-full btn-on-dark py-3 text-sm font-semibold cursor-pointer"
              >
                Get a quote
              </button>
              <a
                href={getWhatsAppUrl('Hello GAC Auto Tech, I would like to chat regarding an enquiry.')}
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-2 flex items-center justify-center gap-2 rounded-full border border-white/15 py-3 text-sm font-semibold"
              >
                <WhatsAppIcon className="w-4 h-4" />
                Chat on WhatsApp
              </a>
              <button
                type="button"
                onClick={toggleTheme}
                className="col-span-2 flex items-center justify-center gap-2 rounded-full border border-white/15 py-3 text-sm font-semibold cursor-pointer sm:hidden"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
