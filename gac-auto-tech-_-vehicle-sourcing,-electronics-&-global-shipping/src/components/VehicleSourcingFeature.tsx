import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface VehicleSourcingFeatureProps {
  onRequestSourcing: () => void;
  onViewAvailable: () => void;
}

export const VehicleSourcingFeature: React.FC<VehicleSourcingFeatureProps> = ({
  onRequestSourcing,
  onViewAvailable
}) => {
  const { theme } = useTheme();

  const featureBullets = [
    'Budget-led vehicle search',
    'Support with Copart and IAAI sourcing',
    'Vehicle details and condition information',
    'Shipping and export coordination'
  ];

  return (
    <section id="vehicle-sourcing" className="bg-[#09090B] text-white py-20 lg:py-28 border-b border-[#1C1D24] relative overflow-hidden">
      
      {/* Background glow */}
      <div 
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-accent-soft rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Feature Split Layout (Matches 'Book Tesla with a big discount' in reference screenshot) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
          
          {/* Left: Big Headline & Action */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <span className="text-xs font-bold tracking-[0.2em] text-accent uppercase mb-2">
              AUCTION SOURCING & EXPORT
            </span>

            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4 text-balance">
              Source Auction Vehicles<br />
              with Heavy Savings
            </h2>

            <p className="text-sm sm:text-base text-[#BFC2C8] leading-relaxed mb-6">
              Tell us your preferred make, model, budget, and destination. We give you direct access to 
              Copart and IAAI auction inventory with verified condition reports and turnkey ocean shipping.
            </p>

            <div className="flex items-center gap-3 mb-6">
              <button
                type="button"
                onClick={onRequestSourcing}
                className="px-6 py-3 rounded-full btn-on-dark font-semibold text-xs transition-all shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
              >
                Enquire Now
              </button>

              <button
                type="button"
                onClick={onViewAvailable}
                className="px-5 py-3 rounded-full bg-[#181920] hover:bg-[#22242E] text-white font-semibold text-xs border border-[#2B2D38] transition-all cursor-pointer whitespace-nowrap"
              >
                View Trend Vehicles
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#BFC2C8]">
              {featureBullets.map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Center Image: Vehicle in Spotlight */}
          <div className="lg:col-span-4">
            <div className="relative rounded-3xl overflow-hidden border border-[#2B2D38] shadow-2xl group bg-black/40">
              <img
                src="/src/assets/images/spotlight_luxury_suv_1793244757834.jpg"
                alt="Auction vehicle inspection and export showcase"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Right: Accent Callout Block (Exact match to '50% For everyone Tesla cars' in reference) */}
          <div className="lg:col-span-3">
            <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-[#121214] text-white flex flex-col justify-between shadow-xl shadow-black/30 h-full min-h-[220px] border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-[#c4a0a0]/30 via-transparent to-transparent pointer-events-none" aria-hidden="true" />
              <div className="relative">
                <span className="text-4xl sm:text-5xl font-bold tracking-tight block mb-1">
                  50%
                </span>
                <span className="text-xs uppercase tracking-wider text-white/90 block mb-2 font-bold">
                  Potential Savings
                </span>
                <p className="text-xs text-white/95 leading-relaxed">
                  Save substantially compared to local retail dealership pricing by sourcing direct from Copart & IAAI auctions.
                </p>
              </div>

              <div className="relative pt-4 border-t border-white/15 text-[11px] text-white/75">
                Canada · USA · UK ➔ Ghana
              </div>
            </div>
          </div>

        </div>

        {/* Discreet Pricing & Variation Disclaimer */}
        <div className="p-4 rounded-2xl bg-[#121316] border border-[#22232B] text-xs text-[#8E939D] flex items-center justify-between gap-4">
          <div>
            <strong className="text-white font-semibold">Important Note: </strong>
            Vehicle condition, auction fees, shipping charges, and import costs vary. Request a quote for the details relevant to your purchase.
          </div>
          <span className="font-mono text-[11px] text-[#BFC2C8] shrink-0 hidden sm:inline">
            Copart & IAAI Plain-Text Coordination
          </span>
        </div>

      </div>
    </section>
  );
};
