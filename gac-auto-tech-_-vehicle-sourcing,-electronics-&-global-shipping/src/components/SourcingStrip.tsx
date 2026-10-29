import React from 'react';
import { Globe, ArrowRight, Anchor } from 'lucide-react';

export const SourcingStrip: React.FC = () => {
  return (
    <div className="bg-[#121316] border-b border-[#22232B] py-4 px-4 sm:px-6 lg:px-8 text-xs text-[#BFC2C8]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        
        {/* Left origin markets */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[#1B1C23] border border-[#2B2D38] flex items-center justify-center shrink-0 text-[#D90816]">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <span className="font-medium text-white/95">
            Sourcing from Canada, the USA, the UK, and other supported markets.
          </span>
        </div>

        {/* Route connector icon (hidden on small screens) */}
        <div className="hidden lg:flex items-center text-[#555864]" aria-hidden="true">
          <span className="w-12 h-px bg-[#262832]" />
          <ArrowRight className="w-3.5 h-3.5 mx-1" />
          <span className="w-12 h-px bg-[#262832]" />
        </div>

        {/* Right destination markets */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[#1B1C23] border border-[#2B2D38] flex items-center justify-center shrink-0 text-[#BFC2C8]">
            <Anchor className="w-3.5 h-3.5" />
          </div>
          <span className="text-[#A2A6B0]">
            Shipping to Ghana and other destinations, subject to service availability.
          </span>
        </div>

      </div>
    </div>
  );
};
