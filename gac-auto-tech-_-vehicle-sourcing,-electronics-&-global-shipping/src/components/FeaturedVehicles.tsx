import React from 'react';
import { SAMPLE_VEHICLES } from '../data/mockData';
import { VehicleListing } from '../types';
import { ArrowRight, Eye, MessageCircle, AlertCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

interface FeaturedVehiclesProps {
  onViewDetails: (vehicle: VehicleListing) => void;
  onRequestPrice: (vehicle: VehicleListing) => void;
  onBrowseAll: () => void;
}

export const FeaturedVehicles: React.FC<FeaturedVehiclesProps> = ({
  onViewDetails,
  onRequestPrice,
  onBrowseAll
}) => {
  const { theme } = useTheme();

  return (
    <section id="vehicles" className={`py-16 lg:py-24 border-b transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#0E0F13] border-[#1C1D24] text-white' : 'bg-[#F8F9FB] border-[#E4E6EB] text-[#18181B]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block (Matches 'Trend vehicles' and 'View all ➔' in reference screenshot) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-1">
              Trend vehicles
            </h2>
            <p className="text-sm text-[#8E939D]">
              Popular luxury sedans, electrics, and performance SUVs requested for Copart/IAAI auction sourcing.
            </p>
          </div>

          <button
            type="button"
            onClick={onBrowseAll}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D90816] hover:bg-[#B80713] text-white text-xs font-bold transition-all shadow-md shadow-[#D90816]/30 active:scale-95 cursor-pointer self-start sm:self-auto shrink-0"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4-Column Grid with hairline vertical borders (Exact match to reference screenshot's table layout) */}
        <div className={`rounded-3xl border overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x ${
          theme === 'dark' 
            ? 'bg-[#121316] border-[#262732] divide-[#262732]' 
            : 'bg-white border-[#E4E6EB] divide-[#E4E6EB] shadow-sm'
        }`}>
          {SAMPLE_VEHICLES.map((vehicle, idx) => {
            const isFeatured = idx === 0;
            const whatsAppMsg = `Hello GAC Auto Tech, I would like to enquire about this vehicle: ${vehicle.title} (Ref: ${vehicle.listingRef}).`;

            return (
              <div 
                key={vehicle.id}
                className={`p-6 sm:p-7 flex flex-col justify-between transition-colors duration-200 group ${
                  isFeatured 
                    ? theme === 'dark' 
                      ? 'bg-[#181922]' 
                      : 'bg-[#EBF1FA]' 
                    : theme === 'dark'
                      ? 'hover:bg-[#15161C]'
                      : 'hover:bg-[#FAFAFC]'
                }`}
              >
                <div>
                  {/* Vehicle Model Title (Bold, left-aligned like reference) */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-lg sm:text-xl font-black tracking-tight leading-snug group-hover:text-[#D90816] transition-colors">
                      {vehicle.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8E939D] mb-4">
                    <span>{vehicle.sourceType}</span>
                    <span>·</span>
                    <span className="text-[#D90816] font-semibold">{vehicle.availability}</span>
                  </div>

                  {/* Vehicle Image (Matches clean studio angle in screenshot) */}
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden my-4 bg-transparent group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                    <img
                      src={vehicle.imageUrl}
                      alt={vehicle.title}
                      className="w-full h-full object-contain object-center"
                      loading="lazy"
                    />
                  </div>

                  {/* Specifications snippet */}
                  <div className="text-[11px] text-[#8E939D] space-y-1 mb-6">
                    <div className="flex items-center justify-between">
                      <span>Transmission</span>
                      <span className={theme === 'dark' ? 'text-white' : 'text-[#18181B] font-medium'}>{vehicle.specs.transmission}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Condition</span>
                      <span className={theme === 'dark' ? 'text-white' : 'text-[#18181B] font-medium'}>{vehicle.condition.split('·')[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Price Status & Pill Button (Exact match to screenshot's '$150/day  [Book Now]') */}
                <div className="pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-[#8E939D] block uppercase">Pricing</span>
                    <span className="text-sm font-black text-[#D90816]">Price on Enquiry</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onViewDetails(vehicle)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-[#1F2028] hover:bg-[#282933] border-[#30323E] text-white'
                          : 'bg-white hover:bg-[#EAECEF] border-[#D0D4DC] text-[#18181B]'
                      }`}
                    >
                      Details
                    </button>

                    <button
                      type="button"
                      onClick={() => onRequestPrice(vehicle)}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#D90816] hover:bg-[#B80713] rounded-full transition-all shadow-xs cursor-pointer whitespace-nowrap"
                    >
                      Book Now
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
