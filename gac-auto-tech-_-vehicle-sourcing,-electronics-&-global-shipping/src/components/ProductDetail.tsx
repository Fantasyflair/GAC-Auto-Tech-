'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ShoppingCart } from 'lucide-react';
import { ElectronicProduct } from '../types';
import { getWhatsAppUrl } from '../data/mockData';
import { availabilityLabel, categoryLabel, productQuoteDetails } from '../data/catalog';
import { useEnquiryList } from '../context/EnquiryListContext';
import { useSite } from './SiteShell';
import { Breadcrumbs } from './Breadcrumbs';
import { ProductTile } from './ProductTile';
import { WhatsAppIcon } from './WhatsAppIcon';

export const ProductDetail: React.FC<{ product: ElectronicProduct; related: ElectronicProduct[] }> = ({ product, related }) => {
  const { requestQuote } = useSite();
  const cart = useEnquiryList();
  const inCart = cart.has(product.id);

  const toggleCart = () =>
    inCart
      ? cart.remove(product.id)
      : cart.add({
          id: product.id,
          title: product.title,
          reference: product.listingRef,
          imageUrl: product.imageUrl,
          service: 'electronics_enquiry',
        });

  return (
    <div className="ui-canvas pb-16 pt-24 text-[#111113] sm:pb-24 sm:pt-28 dark:text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'All products', href: '/products' },
            { label: categoryLabel(product.category), href: `/products?dept=electronics&category=elec:${product.category}` },
            { label: product.title },
          ]}
        />

        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="ui-well aspect-square overflow-hidden rounded-panel sm:aspect-[4/3]">
              <img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow text-muted">{categoryLabel(product.category)}</p>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl">{product.title}</h1>
            <p className="mt-3 text-base text-muted">
              {product.condition} · {availabilityLabel(product.availability)}
              {product.wholesaleEligible ? ' · Wholesale available' : ''}
            </p>

            <div className="mt-6 border-y ui-divider py-5">
              <p className="text-sm text-muted">Price</p>
              <p className="mt-0.5 font-display text-2xl font-bold">On request</p>
              <p className="mt-1 text-sm text-muted">Quoted with shipping to your destination before you pay.</p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => requestQuote('electronics_enquiry', productQuoteDetails(product))}
                className="btn-theme inline-flex w-full items-center justify-center gap-2 rounded-control px-5 py-3.5 text-sm font-bold cursor-pointer"
              >
                Buy now
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={toggleCart}
                  aria-pressed={inCart}
                  className="inline-flex items-center justify-center gap-2 rounded-control border border-black/20 px-4 py-3 text-sm font-bold transition-colors hover:bg-black/5 cursor-pointer dark:border-white/25 dark:hover:bg-white/10"
                >
                  {inCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                  {inCart ? 'In cart' : 'Add to cart'}
                </button>
                <a
                  href={getWhatsAppUrl(`Hello GAC Auto Tech, I'd like the price and availability for ${productQuoteDetails(product)}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-control border border-black/20 px-4 py-3 text-sm font-bold transition-colors hover:bg-black/5 dark:border-white/25 dark:hover:bg-white/10"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
            </div>

            <h2 className="eyebrow mt-8 text-muted">Key specifications</h2>
            <ul className="mt-3 space-y-2.5">
              {product.specs.map((spec) => (
                <li key={spec} className="flex items-start gap-2.5 text-base">
                  <Check className="mt-1 w-4 h-4 shrink-0 text-muted" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-base text-muted">{product.notes}</p>

            <dl className="mt-6 border-t ui-divider text-sm">
              {[
                ['Reference', product.listingRef],
                ['Wholesale', product.wholesaleEligible ? 'Available' : 'Single units only'],
                ['Ships from', 'Canada, USA or UK'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b ui-divider py-2.5">
                  <dt className="text-muted">{label}</dt>
                  <dd className="text-right font-bold">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <section className="mt-16 border-t ui-divider pt-10" aria-labelledby="related-heading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-muted">Related</p>
              <h2 id="related-heading" className="mt-2 font-display text-2xl sm:text-3xl">You may also like</h2>
            </div>
            <Link href="/products" className="group inline-flex items-center gap-1.5 text-sm font-bold">
              View all products
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-4 md:grid-cols-4">
            {related.map((item, i) => (
              <ProductTile key={item.id} product={item} index={i} />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href="/products"
              className="btn-theme inline-flex items-center gap-2 rounded-control px-6 py-3.5 text-sm font-bold"
            >
              View all products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
