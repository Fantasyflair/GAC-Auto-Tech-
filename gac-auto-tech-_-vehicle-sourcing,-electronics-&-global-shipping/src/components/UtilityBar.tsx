import React from 'react';

export const UtilityBar: React.FC = () => {
  return (
    <div className="bg-[#09090B] border-b border-[#1E1E24] text-xs py-2 px-4 sm:px-6 lg:px-8 text-[#BFC2C8]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4">
        {/* Left copy */}
        <div className="flex items-center gap-2 font-medium tracking-wide">
          <span>Vehicle sourcing</span>
          <span className="text-[#D90816]" aria-hidden="true">•</span>
          <span>Electronics</span>
          <span className="text-[#D90816]" aria-hidden="true">•</span>
          <span>International shipping</span>
        </div>

        {/* Right copy */}
        <div className="flex items-center gap-3 text-white/90 font-medium">
          <span className="hover:text-white transition-colors">
            Retail & Wholesale Enquiries
          </span>
        </div>
      </div>
    </div>
  );
};
