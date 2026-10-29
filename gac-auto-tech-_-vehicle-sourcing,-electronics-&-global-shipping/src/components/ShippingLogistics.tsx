import { Ship, Car, Laptop, Package, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ShippingLogisticsProps {
  onRequestShippingQuote: () => void;
}

export const ShippingLogistics: React.FC<ShippingLogisticsProps> = ({
  onRequestShippingQuote
}) => {
  const { theme } = useTheme();
  const shipmentCategories = [
    {
      title: 'Vehicles',
      description: 'Roll-on/Roll-off (RoRo) and secure containerized auto transport for auction and private vehicles.',
      icon: Car,
      tag: 'Auto Freight'
    },
    {
      title: 'Electronics',
      description: 'Dedicated air cargo and ocean shipping with protective packaging for high-value devices and bulk wholesale cartons.',
      icon: Laptop,
      tag: 'Tech Cargo'
    },
    {
      title: 'General Cargo',
      description: 'Commercial merchandise, consolidated barrels, equipment, and personal effects shipped with documentation assistance.',
      icon: Package,
      tag: 'General Freight'
    }
  ];

  return (
    <section id="shipping" className={`py-20 lg:py-28 border-b transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#0E0F13] border-[#1C1D24] text-white' : 'bg-white border-[#E4E6EB] text-[#18181B]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left: Content Panel */}
          <div className="lg:col-span-6 flex flex-col items-start">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D90816]" />
              <span className="text-xs font-bold tracking-[0.2em] text-[#8E939D] uppercase font-mono">
                INTERNATIONAL SHIPPING
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-5 text-balance">
              From Purchase to Destination.
            </h2>

            {/* Body */}
            <p className="text-base text-[#8E939D] leading-relaxed mb-8">
              Coordinate shipping for vehicles, electronics, and general merchandise from Canada, 
              the USA, the UK, and other supported locations to Ghana and other destinations.
            </p>

            {/* Three Shipment Categories */}
            <div className="space-y-4 w-full mb-8">
              {shipmentCategories.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl bg-[#F6F7F9] border border-[#E4E6EB] flex items-start gap-3.5 hover:border-[#D0D4DC] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white border border-[#E4E6EB] flex items-center justify-center text-[#D90816] shrink-0 mt-0.5">
                      <Icon className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-bold text-[#18181B]">
                          {cat.title}
                        </h3>
                        <span className="text-[10px] font-mono text-[#8E939D] uppercase">
                          {cat.tag}
                        </span>
                      </div>
                      <p className="text-xs text-[#606570] leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Primary CTA */}
            <button
              type="button"
              onClick={onRequestShippingQuote}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-[#D90816] hover:bg-[#B80713] rounded-xl transition-all shadow-sm shadow-[#D90816]/30 cursor-pointer mb-6"
            >
              <span>Request a Shipping Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Supporting Note */}
            <div className="p-3.5 bg-[#F6F7F9] rounded-xl border border-[#E4E6EB] text-xs text-[#606570] leading-relaxed w-full">
              <strong className="text-[#18181B] font-semibold">Shipping Notice: </strong>
              Routes, delivery estimates, charges, and documentation requirements are confirmed for each shipment.
            </div>

          </div>

          {/* Right: Cargo Imagery & Corridors */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-[#E4E6EB] bg-[#121316] shadow-xl group">
              
              {/* Image */}
              <div className="aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-[#17171C]">
                <img
                  src="/src/assets/images/shipping_freight_logistics_1793244792719.jpg"
                  alt="International container terminal and vessel dispatch to Ghana"
                  className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Verified Route Corridor Summary Panel */}
              <div className="p-5 bg-[#121316] border-t border-[#22232B] text-white">
                <div className="text-xs font-mono text-[#8E939D] uppercase tracking-wider mb-3">
                  Supported Logistics Corridors
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#191A21] border border-[#272832]">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#D90816]" />
                      <span className="font-semibold text-white">Canada / USA Ports</span>
                    </div>
                    <span className="text-[#8E939D]">➔</span>
                    <span className="text-white/90">Tema Port & Ghana Hubs</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#191A21] border border-[#272832]">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#D90816]" />
                      <span className="font-semibold text-white">UK Freight Consolidation</span>
                    </div>
                    <span className="text-[#8E939D]">➔</span>
                    <span className="text-white/90">West Africa Direct Lines</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#22232B] flex items-center gap-2 text-[11px] text-[#8E939D]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Customs paperwork assistance & bill of lading coordination</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
