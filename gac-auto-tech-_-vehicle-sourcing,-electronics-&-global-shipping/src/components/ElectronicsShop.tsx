import React, { useMemo, useState } from 'react';
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
        className="ui-well relative block aspect-square w-full overflow-hidden rounded-media cursor-pointer"
        aria-label={`View details for ${product.title}`}
      >
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {product.availability !== 'Available' && (
          <span className="absolute left-3 top-3 rounded-full bg-[#111113] px-3 py-1 text-xs font-bold text-white">
            {product.availability === 'Incoming' ? 'Arriving soon' : 'Sourced to order'}
          </span>
        )}
      </button>

      <div className={`flex flex-1 flex-col ${compact ? 'pt-3' : 'pt-4'}`}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="clamp-2 text-base leading-snug">{product.title}</h3>
          <span className="shrink-0 text-sm font-bold">On request</span>
        </div>
        <p className="mt-1.5 text-sm text-muted">
          {product.condition}
          {product.wholesaleEligible ? ' · Wholesale available' : ''}
        </p>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
          <button
            type="button"
            onClick={toggleCart}
            aria-pressed={inCart}
            className={`inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-2.5 text-sm font-bold transition-colors cursor-pointer ${
              inCart
                ? 'border-transparent bg-[#ececec] dark:bg-white/10'
                : 'border-black/20 hover:bg-black/5 dark:border-white/25 dark:hover:bg-white/10'
            }`}
          >
            {inCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            {inCart ? 'In cart' : 'Add to cart'}
          </button>
          <button
            type="button"
            onClick={onBuy}
            className="btn-theme rounded-full px-3 py-2.5 text-sm font-bold cursor-pointer"
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
  const pickCategory = (id: CategoryId) => {
    setCategory(id);
    setPage(1);
  };

  const toggleFilter = (id: FilterId) => {
    setActiveFilters((current) => (current.includes(id) ? current.filter((f) => f !== id) : [...current, id]));
    setPage(1);
  };

  const sidebarItem = (selected: boolean) =>
    `flex w-full items-center gap-2.5 rounded-control px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
      selected ? 'bg-[#111113] font-bold text-white dark:bg-white dark:text-[#111113]' : 'hover:bg-black/5 dark:hover:bg-white/[0.06]'
    }`;

  return (
    <section id="electronics" className="bg-white py-14 text-[#111113] sm:py-20 lg:py-24 dark:bg-[#09090B] dark:text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col gap-5 border-b ui-divider pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-muted">Electronics store</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">Everything you need, shipped to Ghana</h2>
            <p className="mt-3 max-w-xl text-base text-muted">
              Laptops, phones, audio, and gaming. Buy one or order wholesale. Every price is quoted to your destination.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full items-center gap-2 rounded-full border ui-divider p-1.5 pl-4 md:w-80"
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
              className="min-w-0 flex-1 bg-transparent text-sm placeholder:text-[#78787f] focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-black/5 cursor-pointer dark:hover:bg-white/10"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button type="submit" className="btn-theme rounded-full px-4 py-2.5 text-sm font-bold cursor-pointer">
              Search
            </button>
          </form>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <p className="text-base font-bold">Category</p>
              <ul className="mt-3 flex gap-1.5 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible">
                {categories.map(({ id, label, icon: Icon }) => (
                  <li key={id} className="shrink-0">
                    <button type="button" onClick={() => pickCategory(id)} className={sidebarItem(category === id)} aria-pressed={category === id}>
                      <Icon className="w-4 h-4 shrink-0" strokeWidth={1.6} />
                      <span className="whitespace-nowrap">{label}</span>
                      <span className={`ml-auto text-xs font-bold ${category === id ? 'opacity-70' : 'text-muted'}`}>
                        {counts[id] ?? 0}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-base font-bold">Shop by</p>
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

              {/* Fills the space under the filters with the next useful step. */}
              <div className="mt-8 hidden rounded-panel border ui-divider p-5 lg:block">
                <p className="font-display text-base font-bold">Not listed here?</p>
                <p className="mt-1.5 text-sm text-muted">
                  We source to order. Send the model and quantity and we'll quote it to your destination.
                </p>
                <button
                  type="button"
                  onClick={onRequestProduct}
                  className="btn-theme mt-4 w-full rounded-full px-4 py-2.5 text-sm font-bold cursor-pointer"
                >
                  Request a product
                </button>
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <div className="lg:col-span-9">
            <div className="mb-5 flex items-center justify-between text-sm text-muted">
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
                  className="ui-well flex flex-col items-center rounded-panel px-6 py-14 text-center"
                >
                  <Search className="w-6 h-6 text-muted" />
                  <p className="mt-3 font-display text-lg">No products match</p>
                  <p className="mt-1.5 max-w-sm text-base text-muted">We source to order, so tell us the exact model and we'll find it for you.</p>
                  <button type="button" onClick={onRequestProduct} className="btn-theme mt-5 rounded-full px-5 py-3 text-sm font-bold cursor-pointer">
                    Request a product
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {pageCount > 1 && (
              <nav className="mt-10 flex items-center justify-between border-t ui-divider pt-5 text-sm" aria-label="Product pages">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1.5 font-bold disabled:opacity-30 cursor-pointer disabled:cursor-default"
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
                      className={`h-9 w-9 rounded-full text-sm font-bold transition-colors cursor-pointer ${
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
                  className="inline-flex items-center gap-1.5 font-bold disabled:opacity-30 cursor-pointer disabled:cursor-default"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              </nav>
            )}
          </div>
        </div>

        <Reveal className="mt-14">
          <div className="grid grid-cols-1 items-end gap-8 rounded-panel bg-[#111113] p-7 text-white sm:p-10 md:grid-cols-2 dark:bg-[#151517] dark:ring-1 dark:ring-white/10">
            <div>
              <h3 className="font-display text-3xl sm:text-4xl">Ready to get new stock first?</h3>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={getWhatsAppUrl('Hello GAC Auto Tech, please add me to your electronics stock updates.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-on-dark inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Get stock alerts
                </a>
                <button
                  type="button"
                  onClick={onRequestProduct}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-bold hover:bg-white/10 cursor-pointer"
                >
                  Request a product
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="md:justify-self-end md:max-w-xs">
              <p className="font-display text-base font-bold">Electronics for homes and businesses</p>
              <p className="mt-2 text-sm text-white/75">
                Tell us the model, quantity, and destination. We confirm availability, the landed price, and the shipping time before you pay.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
