import React, { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Cable,
  Check,
  Clock,
  Gamepad2,
  Headphones,
  Laptop,
  LayoutGrid,
  PackageCheck,
  Search,
  ShoppingCart,
  Smartphone,
  Tablet,
  Watch,
  X,
} from 'lucide-react';
import { ElectronicProduct } from '../types';
import { SAMPLE_ELECTRONICS, getWhatsAppUrl } from '../data/mockData';
import { useEnquiryList } from '../context/EnquiryListContext';
import { WhatsAppIcon } from './WhatsAppIcon';
import { Reveal, rise } from './Reveal';

interface ElectronicsShopProps {
  onViewProduct: (product: ElectronicProduct) => void;
  onBuyNow: (product: ElectronicProduct) => void;
  onRequestProduct: () => void;
}

type CategoryId = 'all' | ElectronicProduct['category'];
type FilterId = 'available' | 'incoming' | 'wholesale';

const PAGE_SIZE = 6;

const categories: { id: CategoryId; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All products', icon: LayoutGrid },
  { id: 'laptops', label: 'Laptops', icon: Laptop },
  { id: 'phones', label: 'Phones', icon: Smartphone },
  { id: 'tablets', label: 'Tablets', icon: Tablet },
  { id: 'audio', label: 'Audio', icon: Headphones },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'wearables', label: 'Wearables', icon: Watch },
  { id: 'accessories', label: 'Accessories', icon: Cable },
];

const filters: { id: FilterId; label: string; icon: React.ElementType; test: (p: ElectronicProduct) => boolean }[] = [
  { id: 'available', label: 'In stock', icon: PackageCheck, test: (p) => p.availability === 'Available' },
  { id: 'incoming', label: 'Arriving soon', icon: Clock, test: (p) => p.availability === 'Incoming' },
  { id: 'wholesale', label: 'Wholesale ready', icon: Boxes, test: (p) => p.wholesaleEligible },
];

const categoryLabel = (id: ElectronicProduct['category']) => categories.find((c) => c.id === id)?.label ?? id;

const ProductTile: React.FC<{
  product: ElectronicProduct;
  index: number;
  onView: () => void;
  onBuy: () => void;
  compact?: boolean;
}> = ({ product, index, onView, onBuy, compact }) => {
  const cart = useEnquiryList();
  const inCart = cart.has(product.id);

  const toggleCart = () => {
    if (inCart) {
      cart.remove(product.id);
      return;
    }
    cart.add({
      id: product.id,
      title: product.title,
      reference: product.listingRef,
      imageUrl: product.imageUrl,
      service: 'electronics_enquiry',
    });
  };

  return (
    <motion.article {...rise(index % 3)} className="group flex flex-col">
      <button
        type="button"
        onClick={onView}
        className="ui-well relative block aspect-square w-full overflow-hidden rounded-2xl cursor-pointer"
        aria-label={`View details for ${product.title}`}
      >
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute right-3 top-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#111113] shadow-sm">
          {categoryLabel(product.category)}
        </span>
        {product.availability !== 'Available' && (
          <span className="absolute left-3 top-3 rounded-full bg-[#111113] px-2.5 py-1 text-[11px] font-semibold text-white">
            {product.availability === 'Incoming' ? 'Arriving soon' : 'Sourced to order'}
          </span>
        )}
      </button>

      <div className={`flex flex-1 flex-col ${compact ? 'pt-3' : 'pt-4'}`}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-semibold leading-snug">{product.title}</h3>
          <span className="shrink-0 text-sm font-semibold">On request</span>
        </div>
        <p className="mt-1 text-xs text-muted">
          {product.condition}
          {product.wholesaleEligible ? ' · Wholesale available' : ''}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={toggleCart}
            aria-pressed={inCart}
            className={`inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
              inCart
                ? 'border-transparent bg-[#ececec] dark:bg-white/10'
                : 'border-black/15 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10'
            }`}
          >
            {inCart ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
            {inCart ? 'In cart' : 'Add to cart'}
          </button>
          <button
            type="button"
            onClick={onBuy}
            className="btn-theme rounded-full px-3 py-2 text-xs font-semibold cursor-pointer"
          >
            Buy now
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export const ElectronicsShop: React.FC<ElectronicsShopProps> = ({ onViewProduct, onBuyNow, onRequestProduct }) => {
  const [category, setCategory] = useState<CategoryId>('all');
  const [activeFilters, setActiveFilters] = useState<FilterId[]>([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const railRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: SAMPLE_ELECTRONICS.length };
    SAMPLE_ELECTRONICS.forEach((p) => {
      map[p.category] = (map[p.category] ?? 0) + 1;
    });
    return map;
  }, []);

  const results = useMemo(() => {
    const text = query.trim().toLowerCase();
    return SAMPLE_ELECTRONICS.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (activeFilters.some((id) => !filters.find((f) => f.id === id)!.test(p))) return false;
      if (text && !`${p.title} ${p.specs.join(' ')} ${p.category}`.toLowerCase().includes(text)) return false;
      return true;
    });
  }, [category, activeFilters, query]);

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const recommendations = SAMPLE_ELECTRONICS.filter((p) => p.wholesaleEligible || p.availability === 'Available');

  const pickCategory = (id: CategoryId) => {
    setCategory(id);
    setPage(1);
  };

  const toggleFilter = (id: FilterId) => {
    setActiveFilters((current) => (current.includes(id) ? current.filter((f) => f !== id) : [...current, id]));
    setPage(1);
  };

  const scrollRail = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.8, behavior: 'smooth' });
  };

  const sidebarItem = (selected: boolean) =>
    `flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-colors cursor-pointer ${
      selected ? 'bg-[#111113] text-white dark:bg-white dark:text-[#111113]' : 'hover:bg-black/5 dark:hover:bg-white/[0.06]'
    }`;

  return (
    <section id="electronics" className="bg-white py-16 text-[#111113] sm:py-24 dark:bg-[#09090B] dark:text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col gap-5 border-b border-black/10 pb-6 md:flex-row md:items-end md:justify-between dark:border-white/10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Electronics store</p>
            <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">Everything you need, shipped to Ghana</h2>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Laptops, phones, audio, and gaming. Buy one or order wholesale. Every price is quoted to your destination.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full items-center gap-2 rounded-full border border-black/10 bg-[#f4f4f4] p-1.5 pl-4 md:w-80 dark:border-white/10 dark:bg-white/[0.05]"
            role="search"
          >
            <Search className="w-4 h-4 shrink-0 text-muted" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search electronics"
              aria-label="Search electronics"
              className="min-w-0 flex-1 bg-transparent text-sm placeholder:text-[#8e8e95] focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-black/5 cursor-pointer dark:hover:bg-white/10"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button type="submit" className="btn-theme rounded-full px-4 py-2 text-xs font-semibold cursor-pointer">
              Search
            </button>
          </form>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <p className="text-sm font-semibold">Category</p>
              <ul className="mt-3 flex gap-1.5 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible">
                {categories.map(({ id, label, icon: Icon }) => (
                  <li key={id} className="shrink-0">
                    <button type="button" onClick={() => pickCategory(id)} className={sidebarItem(category === id)} aria-pressed={category === id}>
                      <Icon className="w-4 h-4 shrink-0" strokeWidth={1.6} />
                      <span className="whitespace-nowrap">{label}</span>
                      <span
                        className={`ml-auto rounded-full px-1.5 text-[11px] font-semibold ${
                          category === id ? 'bg-white/15 dark:bg-black/10' : 'bg-black/5 text-muted dark:bg-white/[0.08]'
                        }`}
                      >
                        {counts[id] ?? 0}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-sm font-semibold">Shop by</p>
              <ul className="mt-3 flex gap-1.5 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible">
                {filters.map(({ id, label, icon: Icon }) => {
                  const on = activeFilters.includes(id);
                  return (
                    <li key={id} className="shrink-0">
                      <button type="button" onClick={() => toggleFilter(id)} className={sidebarItem(on)} aria-pressed={on}>
                        <Icon className="w-4 h-4 shrink-0" strokeWidth={1.6} />
                        <span className="whitespace-nowrap">{label}</span>
                        {on && <Check className="ml-auto w-3.5 h-3.5" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* Product grid */}
          <div className="lg:col-span-9">
            <div className="mb-5 flex items-center justify-between text-xs text-muted">
              <span>
                Showing {visible.length} of {results.length} product{results.length === 1 ? '' : 's'}
              </span>
              {(category !== 'all' || activeFilters.length > 0 || query) && (
                <button
                  type="button"
                  onClick={() => {
                    setCategory('all');
                    setActiveFilters([]);
                    setQuery('');
                    setPage(1);
                  }}
                  className="font-semibold underline-offset-4 hover:underline cursor-pointer"
                >
                  Clear filters
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {visible.length > 0 ? (
                <motion.div
                  key={`${category}-${activeFilters.join()}-${query}-${currentPage}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {visible.map((product, i) => (
                    <ProductTile
                      key={product.id}
                      product={product}
                      index={i}
                      onView={() => onViewProduct(product)}
                      onBuy={() => onBuyNow(product)}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="ui-well flex flex-col items-center rounded-3xl px-6 py-14 text-center"
                >
                  <Search className="w-6 h-6 text-muted" />
                  <p className="mt-3 text-base font-semibold">No products match</p>
                  <p className="mt-1 max-w-sm text-sm text-muted">We source to order, so tell us the exact model and we'll find it for you.</p>
                  <button type="button" onClick={onRequestProduct} className="btn-theme mt-5 rounded-full px-5 py-2.5 text-sm font-semibold cursor-pointer">
                    Request a product
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {pageCount > 1 && (
              <nav className="mt-10 flex items-center justify-between border-t border-black/10 pt-5 text-sm dark:border-white/10" aria-label="Product pages">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1.5 font-medium disabled:opacity-30 cursor-pointer disabled:cursor-default"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPage(n)}
                      aria-current={n === currentPage ? 'page' : undefined}
                      className={`h-8 w-8 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                        n === currentPage ? 'bg-[#111113] text-white dark:bg-white dark:text-[#111113]' : 'hover:bg-black/5 dark:hover:bg-white/10'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={currentPage === pageCount}
                  className="inline-flex items-center gap-1.5 font-medium disabled:opacity-30 cursor-pointer disabled:cursor-default"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              </nav>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-20">
          <div className="flex items-end justify-between gap-4">
            <h3 className="text-2xl font-semibold sm:text-3xl">Explore our recommendations</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollRail(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 hover:bg-black/5 cursor-pointer dark:border-white/20 dark:hover:bg-white/10"
                aria-label="Scroll recommendations left"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollRail(1)}
                className="btn-theme flex h-10 w-10 items-center justify-center rounded-full cursor-pointer"
                aria-label="Scroll recommendations right"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div
            ref={railRef}
            className="mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {recommendations.map((product, i) => (
              <div key={product.id} className="w-[72%] shrink-0 snap-start sm:w-[42%] lg:w-[23.5%]">
                <ProductTile product={product} index={i} compact onView={() => onViewProduct(product)} onBuy={() => onBuyNow(product)} />
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <Reveal className="mt-20">
          <div className="grid grid-cols-1 items-end gap-8 rounded-[28px] bg-[#111113] p-8 text-white sm:p-10 md:grid-cols-2 dark:bg-[#151517] dark:ring-1 dark:ring-white/10">
            <div>
              <h3 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Ready to get new
                <br />
                stock first?
              </h3>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={getWhatsAppUrl('Hello GAC Auto Tech, please add me to your electronics stock updates.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-on-dark inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Get stock alerts
                </a>
                <button
                  type="button"
                  onClick={onRequestProduct}
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold hover:bg-white/10 cursor-pointer"
                >
                  Request a product
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="md:justify-self-end md:max-w-xs">
              <p className="text-sm font-semibold">Electronics for homes and businesses</p>
              <p className="mt-2 text-sm text-white/60">
                Tell us the model, quantity, and destination. We confirm availability, the landed price, and the shipping time before you pay.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
