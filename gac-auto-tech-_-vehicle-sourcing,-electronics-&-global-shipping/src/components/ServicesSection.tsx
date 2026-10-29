import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ServiceType } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ServicesSectionProps {
  onSelectService: (service: ServiceType) => void;
  onExploreElectronics: () => void;
  onExploreVehicles: () => void;
  onExploreShipping: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectService,
  onExploreElectronics,
  onExploreVehicles,
  onExploreShipping
}) => {
  const { theme } = useTheme();
  const [activeView, setActiveView] = React.useState<'brands' | 'services'>('brands');

  const brandCategories = [
    {
      id: 'mercedes',
      title: 'Mercedes-Benz',
      subtitle: 'Copart & IAAI Sourcing',
      description: 'G-Class, GLE, GLC, and executive sedans sourced directly from North American auctions.',
      imageUrl: '/src/assets/images/cat_mercedes_gwagon_1793244756367.jpg',
      fallbackUrl: '/src/assets/images/cat_mercedes_gwagon_1793244756367.jpg',
      onClick: () => onSelectService('vehicle_sourcing'),
      isPrimaryAccent: true
    },
    {
      id: 'audi',
      title: 'Audi',
      subtitle: 'Quattro AWD & SUVs',
      description: 'R8, Q5, Q7, and A7 models inspected for run & drive condition before dispatch to Ghana.',
      imageUrl: '/src/assets/images/cat_audi_performance_1793244756953.jpg',
      fallbackUrl: '/src/assets/images/cat_audi_performance_1793244756953.jpg',
      onClick: () => onSelectService('vehicle_sourcing'),
      isPrimaryAccent: false
    },
    {
      id: 'bmw',
      title: 'BMW',
      subtitle: 'M-Sport & Executive Series',
      description: 'X5, X6, 4 Series, and M-Sport performance models with verified auction inspection reports.',
      imageUrl: '/src/assets/images/cat_bmw_mperformance_1793244757579.jpg',
      fallbackUrl: '/src/assets/images/cat_bmw_mperformance_1793244757579.jpg',
      onClick: () => onSelectService('vehicle_sourcing'),
      isPrimaryAccent: false
    },
    {
      id: 'porsche',
      title: 'Porsche',
      subtitle: 'Specialty & High-Value Export',
      description: '911, Cayenne, and Macan sourcing with expert container stuffing and export clearance.',
      imageUrl: '/src/assets/images/cat_porsche_coupe_1793244757708.jpg',
      fallbackUrl: '/src/assets/images/cat_porsche_coupe_1793244757708.jpg',
      onClick: () => onSelectService('vehicle_sourcing'),
      isPrimaryAccent: false
    }
  ];

  const coreServices = [
    {
      id: 'vehicle_sourcing' as ServiceType,
      title: 'Vehicle Sourcing',
      subtitle: 'Auctions · Copart & IAAI',
      description: 'Find auction vehicles matching your budget with bidding and export coordination.',
      imageUrl: '/src/assets/images/cat_mercedes_gwagon_1793244756367.jpg',
      fallbackUrl: '/src/assets/images/cat_mercedes_gwagon_1793244756367.jpg',
      onClick: onExploreVehicles,
      isPrimaryAccent: true
    },
    {
      id: 'electronics_enquiry' as ServiceType,
      title: 'Electronics & Tech',
      subtitle: 'Retail & Wholesale',
      description: 'Laptops, computers, iPhones, gaming consoles, and accessories with bulk pricing.',
      imageUrl: '/src/assets/images/electronics_tech_collection_1793244792880.jpg',
      fallbackUrl: '/src/assets/images/electronics_tech_collection_1793244792880.jpg',
      onClick: onExploreElectronics,
      isPrimaryAccent: false
    },
    {
      id: 'shipping_quote' as ServiceType,
      title: 'Shipping & Logistics',
      subtitle: 'Canada / USA / UK ➔ Ghana',
      description: 'Coordinating vehicle, electronics, and container shipping across supported routes.',
      imageUrl: '/src/assets/images/shipping_freight_logistics_1793244792719.jpg',
      fallbackUrl: '/src/assets/images/shipping_freight_logistics_1793244792719.jpg',
      onClick: onExploreShipping,
      isPrimaryAccent: false
    },
    {
      id: 'general_merchandise' as ServiceType,
      title: 'General Merchandise',
      subtitle: 'International Sourcing',
      description: 'Enquire about sourcing products and specialty equipment from global markets.',
      imageUrl: '/src/assets/images/cat_bmw_mperformance_1793244757579.jpg',
      fallbackUrl: '/src/assets/images/cat_bmw_mperformance_1793244757579.jpg',
      onClick: () => onSelectService('general_merchandise'),
      isPrimaryAccent: false
    }
  ];

  const currentCards = activeView === 'brands' ? brandCategories : coreServices;

  return (
    <section id="services" className={`py-16 lg:py-24 border-b transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#09090B] border-[#1C1D24] text-white' : 'bg-white border-[#E4E6EB] text-[#18181B]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Exact match to 'Car Category' heading in reference image) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-2">
              Car Category
            </h2>
            <p className="text-sm sm:text-base text-[#8E939D]">
              Explore top-requested vehicle brands for auction sourcing, or view our core global capabilities.
            </p>
          </div>

          {/* Toggle Pills */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-[#F2F3F6] dark:bg-[#181920] border border-[#E4E6EB] dark:border-[#272832] w-fit">
            <button
              type="button"
              onClick={() => setActiveView('brands')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                activeView === 'brands'
                  ? 'bg-white dark:bg-[#262734] text-[#18181B] dark:text-white shadow-xs'
                  : 'text-[#8E939D] hover:text-[#18181B] dark:hover:text-white'
              }`}
            >
              Popular Makes
            </button>
            <button
              type="button"
              onClick={() => setActiveView('services')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                activeView === 'services'
                  ? 'bg-white dark:bg-[#262734] text-[#18181B] dark:text-white shadow-xs'
                  : 'text-[#8E939D] hover:text-[#18181B] dark:hover:text-white'
              }`}
            >
              All 4 Services
            </button>
          </div>
        </div>

        {/* 4 Tall Editorial Cards Grid (Exact match to reference UI 'Car Category') */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentCards.map((card) => {
            return (
              <div
                key={card.id}
                onClick={card.onClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.onClick();
                  }
                }}
                className={`group relative rounded-3xl overflow-hidden aspect-[3/4] sm:aspect-[2.75/4] border transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between p-6 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D90816]
                  /* Desktop Hover Effects */
                  [@media(hover:hover)]:hover:-translate-y-2
                  [@media(hover:hover)]:hover:shadow-[0_20px_40px_rgba(0,0,0,0.35)]
                  ${card.isPrimaryAccent 
                    ? 'border-[#D90816]/40 [@media(hover:hover)]:hover:border-[#D90816]' 
                    : 'border-[#E4E6EB] dark:border-[#272832] [@media(hover:hover)]:hover:border-[#D90816]/60'
                  }
                  active:scale-[0.985] active:border-[#D90816]
                `}
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0 bg-[#121316]">
                  <img
                    src={card.imageUrl}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = card.fallbackUrl;
                    }}
                    alt={card.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out brightness-[0.82] contrast-[1.08]"
                    loading="lazy"
                  />
                  {/* Atmospheric Scrim Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/30 pointer-events-none" />
                </div>

                {/* Top: Category Title & Subtitle (Like reference screenshot) */}
                <div className="relative z-10 text-white">
                  <h3 className="text-2xl font-black tracking-tight leading-tight mb-1 text-balance">
                    {card.title}
                  </h3>
                  <p className="text-xs font-mono font-medium text-white/70 tracking-wide">
                    {card.subtitle}
                  </p>
                </div>

                {/* Bottom Row: Description & Signature Round Arrow Button (↗) */}
                <div className="relative z-10 flex items-end justify-between gap-3 pt-6 border-t border-white/10">
                  <p className="text-xs text-white/80 leading-relaxed max-w-[70%] line-clamp-2">
                    {card.description}
                  </p>

                  {/* Circular Action Button from reference screenshot */}
                  <div 
                    className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 shadow-lg ${
                      card.isPrimaryAccent
                        ? 'bg-[#D90816] text-white group-hover:bg-[#B80713] group-hover:scale-110 shadow-[#D90816]/40'
                        : 'bg-white text-[#18181B] group-hover:bg-[#D90816] group-hover:text-white group-hover:scale-110'
                    }`}
                    aria-hidden="true"
                  >
                    <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
