import React, { useState } from 'react';
import { SAMPLE_ELECTRONICS } from '../data/mockData';
import { ProductCard } from './ProductCard';
import { ElectronicProduct } from '../types';
import { Layers, ArrowRight, AlertCircle, Building2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ElectronicsShowcaseProps {
  onEnquirePrice: (product: ElectronicProduct) => void;
  onViewDetails: (product: ElectronicProduct) => void;
  onRequestWholesale: () => void;
}

export const ElectronicsShowcase: React.FC<ElectronicsShowcaseProps> = ({
  onEnquirePrice,
  onViewDetails,
  onRequestWholesale
}) => {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Electronics' },
    { id: 'laptops', label: 'Laptops' },
    { id: 'phones', label: 'Phones' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'accessories', label: 'Accessories' }
  ];

  const filteredProducts = activeCategory === 'all'
    ? SAMPLE_ELECTRONICS
    : SAMPLE_ELECTRONICS.filter((item) => item.category === activeCategory);

  return (
    <section id="electronics" className={`py-20 lg:py-28 border-b transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#09090B] border-[#1C1D24] text-white' : 'bg-[#F6F7F9] border-[#E4E6EB] text-[#18181B]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D90816]" />
              <span className="text-xs font-bold tracking-[0.2em] text-[#8E939D] uppercase font-mono">
                TECH FOR WORK & PLAY
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              Your Next Upgrade Starts Here.
            </h2>

            <p className="text-base text-[#8E939D]">
              Enquire about electronics for personal use, business needs, or wholesale purchasing.
            </p>
          </div>

          <button
            type="button"
            onClick={onRequestWholesale}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D90816] hover:bg-[#B80713] text-white text-xs font-bold transition-all shadow-md shadow-[#D90816]/30 active:scale-95 cursor-pointer self-start md:self-auto shrink-0"
          >
            <span>Explore Electronics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Category Chips / Segmented Control Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#18181B] text-white shadow-sm'
                  : 'bg-white text-[#606570] hover:text-[#18181B] border border-[#E4E6EB]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Layout Preview Note */}
        <div className="mb-8 px-4 py-3 rounded-xl bg-white border border-[#E4E6EB] flex items-center gap-3 text-xs text-[#606570]">
          <AlertCircle className="w-4 h-4 text-[#8E939D] shrink-0" />
          <span>
            <strong className="text-[#18181B] font-semibold">Preview Note: </strong>
            Clearly labeled sample products shown for design preview. Stock and specifications confirmed upon enquiry.
          </span>
        </div>

        {/* Product Cards Grid: 4 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEnquirePrice={onEnquirePrice}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>

        {/* Wholesale Callout Banner */}
        <div className="bg-white rounded-2xl border border-[#E4E6EB] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F6F7F9] border border-[#E4E6EB] flex items-center justify-center text-[#D90816] shrink-0">
              <Building2 className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#18181B] mb-1">
                Buying in bulk?
              </h4>
              <p className="text-sm text-[#606570]">
                Send us your requirements for a wholesale enquiry on laptops, iPhones, and gaming hardware.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRequestWholesale}
            className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold text-white bg-[#D90816] hover:bg-[#B80713] rounded-xl transition-all shadow-sm shadow-[#D90816]/25 whitespace-nowrap cursor-pointer shrink-0"
          >
            <span>Submit Wholesale Enquiry</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
