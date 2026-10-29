import React from 'react';
import { ElectronicProduct } from '../types';
import { MessageCircle, ArrowUpRight, Check } from 'lucide-react';
import { getWhatsAppUrl } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

interface ProductCardProps {
  product: ElectronicProduct;
  onEnquirePrice: (product: ElectronicProduct) => void;
  onViewDetails: (product: ElectronicProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEnquirePrice,
  onViewDetails
}) => {
  const { theme } = useTheme();
  const whatsAppEnquiryMessage = `Hello GAC Auto Tech, I would like to enquire about pricing and availability for ${product.title} (Ref: ${product.listingRef}).`;

  return (
    <div className={`rounded-3xl border overflow-hidden transition-all duration-300 flex flex-col justify-between group ${
      theme === 'dark'
        ? 'bg-[#121316] border-[#272832] hover:border-[#D90816]/50 shadow-md shadow-black/40'
        : 'bg-white border-[#E4E6EB] hover:border-[#D0D4DC] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-xl'
    }`}>
      
      <div>
        {/* Product Image Tile */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F6F7F9] p-4 flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover object-center rounded-lg group-hover:scale-[1.03] transition-transform duration-500 ease-out"
            loading="lazy"
            referrerPolicy="no-referrer"
          />

          {/* Availability Badge */}
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide bg-white/95 text-[#18181B] border border-[#E4E6EB] shadow-xs">
            {product.availability}
          </div>

          {/* Wholesale Indicator if eligible */}
          {product.wholesaleEligible && (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono text-[#D90816] bg-[#D90816]/10 border border-[#D90816]/20 font-semibold">
              Wholesale Ready
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-5">
          {/* Category & Ref */}
          <div className="flex items-center justify-between text-xs text-[#8E939D] mb-1.5 font-mono">
            <span className="uppercase text-[11px]">{product.category}</span>
            <span className="text-[10px]">REF: {product.listingRef}</span>
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => onViewDetails(product)}
            className={`text-base font-bold group-hover:text-[#D90816] transition-colors leading-snug mb-3 cursor-pointer ${
              theme === 'dark' ? 'text-white' : 'text-[#18181B]'
            }`}
          >
            {product.title}
          </h3>

          {/* Specs List */}
          <div className="space-y-1.5 mb-4 text-xs text-[#8E939D]">
            {product.specs.slice(0, 3).map((spec, i) => (
              <div key={i} className="flex items-start gap-1.5 line-clamp-1">
                <Check className="w-3.5 h-3.5 text-[#D90816] shrink-0 mt-0.5" />
                <span className="truncate">{spec}</span>
              </div>
            ))}
          </div>

          {/* Condition and Availability Fields */}
          <div className={`pt-3 border-t grid grid-cols-2 gap-2 text-xs ${
            theme === 'dark' ? 'border-[#262732]' : 'border-[#F0F2F5]'
          }`}>
            <div>
              <span className="text-[#8E939D] block text-[11px]">Condition</span>
              <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#18181B]'}`}>{product.condition}</span>
            </div>
            <div>
              <span className="text-[#8E939D] block text-[11px]">Status</span>
              <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#18181B]'}`}>{product.availability}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-5 pt-0">
        <div className="flex items-center justify-between pt-3 border-t border-[#F0F2F5]">
          <button
            type="button"
            onClick={() => onEnquirePrice(product)}
            className="text-xs font-bold text-[#D90816] hover:text-[#B80713] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Enquire for Price</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <a
            href={getWhatsAppUrl(whatsAppEnquiryMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#25D366] hover:bg-[#25D366]/10 border border-[#E4E6EB] hover:border-[#25D366]/40 rounded-lg transition-colors"
            aria-label={`Enquire about ${product.title} on WhatsApp`}
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span className="text-[11px]">WhatsApp</span>
          </a>
        </div>
      </div>

    </div>
  );
};
