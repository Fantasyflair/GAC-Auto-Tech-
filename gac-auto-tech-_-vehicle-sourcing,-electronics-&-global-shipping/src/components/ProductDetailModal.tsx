import React from 'react';
import { ElectronicProduct } from '../types';
import { X, Check, ArrowRight, MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../data/mockData';

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
  if (!product) return null;

  const whatsAppEnquiryMessage = `Hello GAC Auto Tech, I would like to enquire about pricing and availability for ${product.title} (Ref: ${product.listingRef}).`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div
        className="relative my-8 w-full max-w-lg overflow-hidden rounded-panel bg-white text-[#111113] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex aspect-[4/3] w-full items-center justify-center bg-[#f1f1f1] p-6">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-full w-full rounded-media object-contain"
          />
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-6 sm:p-8">
          <p className="text-sm font-semibold text-[#52525b]">
            {product.category} · Ref {product.listingRef}
          </p>

          <h2 id="product-modal-title" className="mt-1.5 font-display text-2xl">
            {product.title}
          </h2>

          {/* Condition, availability and wholesale read as one plain line. */}
          <p className="mt-2 text-base text-[#52525b]">
            {product.condition} · {product.availability}
            {product.wholesaleEligible ? ' · Wholesale supported' : ''}
          </p>

          <h3 className="eyebrow mt-7 text-[#52525b]">Key specifications</h3>
          <ul className="mt-3 space-y-2.5">
            {product.specs.map((spec, i) => (
              <li key={i} className="flex items-start gap-2.5 text-base text-[#52525b]">
                <Check className="mt-1 w-4 h-4 shrink-0 text-accent" />
                <span>{spec}</span>
              </li>
            ))}
          </ul>

          <p className="mt-5 text-base text-[#52525b]">{product.notes}</p>

          <div className="mt-6 flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEnquire(product);
              }}
              className="btn-ink flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold transition-colors cursor-pointer sm:flex-1"
            >
              <span>Enquire for price</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={getWhatsAppUrl(whatsAppEnquiryMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-black/20 px-5 py-3.5 text-sm font-bold text-[#111113] transition-colors hover:bg-black/5 sm:w-auto"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
