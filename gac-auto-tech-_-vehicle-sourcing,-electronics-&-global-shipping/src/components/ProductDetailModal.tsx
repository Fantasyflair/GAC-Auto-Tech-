import React, { useRef } from 'react';
import { ElectronicProduct } from '../types';
import { Check, ArrowRight, MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../data/mockData';
import { ModalShell } from './ModalShell';

interface ProductDetailModalProps {
  product: ElectronicProduct | null;
  onClose: () => void;
  onEnquire: (product: ElectronicProduct) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onEnquire
}) => {
  // Keeps the last product on screen while the closing animation plays.
  const lastProduct = useRef(product);
  if (product) lastProduct.current = product;
  const shown = lastProduct.current;
  if (!shown) return null;

  const whatsAppEnquiryMessage = `Hello GAC Auto Tech, I would like to enquire about pricing and availability for ${shown.title} (Ref: ${shown.listingRef}).`;

  return (
    <ModalShell open={!!product} onClose={onClose} labelledBy="product-modal-title" width="max-w-lg" closeLabel="Close product details">
      <div className="flex aspect-[4/3] w-full items-center justify-center bg-[#f1f1f1] p-6">
        <img
          src={shown.imageUrl}
          alt={shown.title}
          className="h-full w-full rounded-media object-contain"
        />
      </div>

      <div className="p-6 sm:p-8">
        <p className="text-sm font-semibold capitalize text-[#52525b]">
          {shown.category} · Ref {shown.listingRef}
        </p>

        <h2 id="product-modal-title" className="mt-1.5 font-display text-2xl">
          {shown.title}
        </h2>

        {/* Condition, availability and wholesale read as one plain line. */}
        <p className="mt-2 text-base text-[#52525b]">
          {shown.condition} · {shown.availability}
          {shown.wholesaleEligible ? ' · Wholesale supported' : ''}
        </p>

        <h3 className="eyebrow mt-7 text-[#52525b]">Key specifications</h3>
        <ul className="mt-3 space-y-2.5">
          {shown.specs.map((spec, i) => (
            <li key={i} className="flex items-start gap-2.5 text-base text-[#52525b]">
              <Check className="mt-1 w-4 h-4 shrink-0 text-accent" />
              <span>{spec}</span>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-base text-[#52525b]">{shown.notes}</p>

        <div className="mt-6 flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              onClose();
              onEnquire(shown);
            }}
            className="btn-ink flex w-full items-center justify-center gap-2 rounded-control px-5 py-3.5 text-sm font-bold transition-colors cursor-pointer sm:flex-1"
          >
            <span>Enquire for price</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={getWhatsAppUrl(whatsAppEnquiryMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-control border border-black/20 px-5 py-3.5 text-sm font-bold text-[#111113] transition-colors hover:bg-black/5 sm:w-auto"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </ModalShell>
  );
};
