'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Check, ShoppingCart } from 'lucide-react';
import { ElectronicProduct } from '../types';
import { useEnquiryList } from '../context/EnquiryListContext';
import { productQuoteDetails } from '../data/catalog';
import { useSite } from './SiteShell';
import { rise } from './Reveal';

export const ProductTile: React.FC<{ product: ElectronicProduct; index?: number }> = ({ product, index = 0 }) => {
  const cart = useEnquiryList();
  const { requestQuote } = useSite();
  const inCart = cart.has(product.id);
  const href = `/products/${product.id}`;

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
    <motion.article {...rise(index % 4)} className="group flex flex-col">
      <Link
        href={href}
        className="ui-well relative block aspect-square w-full overflow-hidden rounded-media"
        aria-label={`View ${product.title}`}
      >
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      <div className="flex flex-1 flex-col pt-3">
        <h3 className="clamp-2 min-h-[2.7em] text-sm leading-snug sm:text-base">
          <Link href={href} className="underline-offset-4 hover:underline">
            {product.title}
          </Link>
        </h3>

        <div className="mt-auto flex gap-2 pt-3">
          <button
            type="button"
            onClick={() => requestQuote('electronics_enquiry', productQuoteDetails(product))}
            className="btn-theme min-w-0 flex-1 rounded-control px-3 py-2.5 text-sm font-bold cursor-pointer"
          >
            Buy now
          </button>
          <button
            type="button"
            onClick={toggleCart}
            aria-pressed={inCart}
            aria-label={inCart ? `Remove ${product.title} from cart` : `Add ${product.title} to cart`}
            title={inCart ? 'In cart' : 'Add to cart'}
            className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-control border transition-colors cursor-pointer ${
              inCart
                ? 'border-transparent bg-[#111113] text-white dark:bg-white dark:text-[#111113]'
                : 'border-black/20 hover:bg-black/5 dark:border-white/25 dark:hover:bg-white/10'
            }`}
          >
            {inCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </motion.article>
  );
};
