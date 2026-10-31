import React from 'react';
import { ElectronicProduct } from '../types';
import { X, Check, ArrowRight, MessageCircle, Building2, ShieldCheck } from 'lucide-react';
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
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E4E6EB] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="relative aspect-[4/3] w-full bg-[#F6F7F9] p-6 flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-contain rounded-lg"
          />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white border border-[#E4E6EB] shadow-xs text-[#18181B]">
              {product.availability}
            </span>
            {product.wholesaleEligible && (
              <span className="px-2.5 py-1 rounded-md text-xs bg-accent-soft text-accent font-semibold">
                Wholesale Supported
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          
          <div className="text-xs text-muted uppercase tracking-wider mb-1">
            REF: {product.listingRef} · {product.category}
          </div>

          <h2 id="product-modal-title" className="text-xl sm:text-2xl font-bold text-[#18181B] mb-3">
            {product.title}
          </h2>

          <div className="flex items-center gap-4 py-2.5 px-3 bg-[#F6F7F9] rounded-xl border border-[#E4E6EB] text-xs text-[#18181B] mb-5">
            <div>
              <span className="text-muted block text-[11px]">Condition</span>
              <span className="font-semibold">{product.condition}</span>
            </div>
            <div className="h-6 w-px bg-[#E4E6EB]" />
            <div>
              <span className="text-muted block text-[11px]">Availability</span>
              <span className="font-semibold">{product.availability}</span>
            </div>
          </div>

          <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">
            Key Specifications
          </h3>
          <div className="space-y-2 mb-5">
            {product.specs.map((spec, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-[#606570]">
                <Check className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>{spec}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#606570] leading-relaxed mb-6">
            {product.notes}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-[#F0F2F5]">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEnquire(product);
              }}
              className="w-full sm:flex-1 py-3 px-5 text-xs sm:text-sm font-semibold btn-ink rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Enquire for Price & Sourcing</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={getWhatsAppUrl(whatsAppEnquiryMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3 px-5 text-xs sm:text-sm font-semibold text-[#18181B] bg-[#F6F7F9] hover:bg-[#EAECEF] border border-[#E4E6EB] rounded-xl transition-colors flex items-center justify-center gap-2"
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
