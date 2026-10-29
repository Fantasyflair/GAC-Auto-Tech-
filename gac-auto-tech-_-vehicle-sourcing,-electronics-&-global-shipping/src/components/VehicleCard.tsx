import React from 'react';
import { VehicleListing } from '../types';
import { MessageCircle, Eye, ArrowUpRight, Gauge, Fuel, Cog } from 'lucide-react';
import { getWhatsAppUrl } from '../data/mockData';

interface VehicleCardProps {
  vehicle: VehicleListing;
  onViewDetails: (vehicle: VehicleListing) => void;
  onRequestPrice: (vehicle: VehicleListing) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onViewDetails,
  onRequestPrice
}) => {
  const availabilityColors: Record<VehicleListing['availability'], { bg: string; text: string; dot: string }> = {
    'Available': { bg: 'bg-[#18181B] text-white', text: 'text-white', dot: 'bg-[#25D366]' },
    'Incoming': { bg: 'bg-[#17171C] text-[#BFC2C8]', text: 'text-[#BFC2C8]', dot: 'bg-[#D90816]' },
    'On request': { bg: 'bg-[#242630] text-[#D0D4DC]', text: 'text-[#D0D4DC]', dot: 'bg-[#3B82F6]' },
    'Sold': { bg: 'bg-[#3F424E] text-[#BFC2C8]', text: 'text-[#8E939D]', dot: 'bg-[#6B7280]' }
  };

  const statusStyle = availabilityColors[vehicle.availability] || availabilityColors['Available'];

  const whatsAppEnquiryMessage = `Hello GAC Auto Tech, I would like to enquire about pricing and sourcing for this vehicle: ${vehicle.title} (Ref: ${vehicle.listingRef}).`;

  return (
    <div className="bg-white rounded-2xl border border-[#E4E6EB] hover:border-[#D0D4DC] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] transition-all duration-200 flex flex-col justify-between group">
      
      {/* Top Media Area */}
      <div>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#17171C]">
          <img
            src={vehicle.imageUrl}
            alt={vehicle.title}
            className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
            loading="lazy"
            referrerPolicy="no-referrer"
          />

          {/* Availability Status Tag (clean unboxed/structural style) */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide bg-[#09090B]/90 backdrop-blur-md text-white border border-white/10">
            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
            <span>{vehicle.availability}</span>
          </div>

          {/* Source Network Tag */}
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-black/60 text-white/80 backdrop-blur-sm">
            {vehicle.sourceType}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          
          {/* Metadata Row */}
          <div className="flex items-center justify-between text-xs text-[#606570] mb-2 font-mono">
            <span>{vehicle.category}</span>
            <span className="text-[11px] text-[#8E939D]">REF: {vehicle.listingRef}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-[#18181B] mb-3 group-hover:text-[#D90816] transition-colors leading-snug">
            {vehicle.title}
          </h3>

          {/* Short Specifications Row */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-[#F6F7F9] rounded-xl text-xs text-[#18181B] mb-3.5 border border-[#E4E6EB]/60">
            {vehicle.specs.mileage && (
              <div className="flex items-center gap-1.5 truncate">
                <Gauge className="w-3.5 h-3.5 text-[#8E939D] shrink-0" />
                <span className="truncate">{vehicle.specs.mileage}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 truncate">
              <Cog className="w-3.5 h-3.5 text-[#8E939D] shrink-0" />
              <span className="truncate">{vehicle.specs.transmission.split(' ')[0]}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Fuel className="w-3.5 h-3.5 text-[#8E939D] shrink-0" />
              <span className="truncate">{vehicle.specs.fuelType.split(' ')[0]}</span>
            </div>
          </div>

          {/* Condition Field */}
          <div className="text-xs text-[#606570] mb-4">
            <span className="text-[#8E939D] font-medium">Condition: </span>
            <span className="font-medium text-[#18181B]">{vehicle.condition}</span>
          </div>

        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-5 pt-0 border-t border-[#F0F2F5] mt-auto">
        <div className="flex items-center justify-between pt-4">
          
          {/* Request Price Action */}
          <button
            type="button"
            onClick={() => onRequestPrice(vehicle)}
            className="text-xs font-bold text-[#D90816] hover:text-[#B80713] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Request Price</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Action cluster: View Details + WhatsApp */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onViewDetails(vehicle)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#18181B] hover:text-[#D90816] bg-[#F6F7F9] hover:bg-[#EAECEF] border border-[#E4E6EB] rounded-lg transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#606570]" />
              <span>View Details</span>
            </button>

            <a
              href={getWhatsAppUrl(whatsAppEnquiryMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-[#25D366] hover:bg-[#25D366]/10 border border-[#E4E6EB] hover:border-[#25D366]/40 rounded-lg transition-colors"
              title="Enquire on WhatsApp"
              aria-label={`Enquire about ${vehicle.title} on WhatsApp`}
            >
              <MessageCircle className="w-4 h-4 fill-current" />
            </a>
          </div>

        </div>
      </div>

    </div>
  );
};
