import React from 'react';
import { VehicleListing } from '../types';
import { X, CheckCircle, ArrowRight, MessageCircle, Gauge, Cog, Fuel, Shield, AlertCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../data/mockData';

interface VehicleDetailModalProps {
  vehicle: VehicleListing | null;
  onClose: () => void;
  onRequestQuote: (vehicle: VehicleListing) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  onClose,
  onRequestQuote
}) => {
  if (!vehicle) return null;

  const whatsAppEnquiryMessage = `Hello GAC Auto Tech, I would like to enquire about vehicle pricing, auction history, and shipping for: ${vehicle.title} (Ref: ${vehicle.listingRef}).`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vehicle-modal-title"
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E4E6EB] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Vehicle Image Header */}
        <div className="relative aspect-[16/10] w-full bg-[#17171C] overflow-hidden">
          <img
            src={vehicle.imageUrl}
            alt={vehicle.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-black/80 text-white backdrop-blur-md border border-white/10">
              {vehicle.availability}
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-[#D90816] text-white font-semibold">
              {vehicle.category}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[65vh] overflow-y-auto">
          
          <div className="flex items-center justify-between text-xs text-[#8E939D] font-mono mb-2">
            <span>REFERENCE: {vehicle.listingRef}</span>
            <span>SOURCE: {vehicle.sourceType} AUCTION NETWORK</span>
          </div>

          <h2 id="vehicle-modal-title" className="text-2xl font-extrabold text-[#18181B] mb-4">
            {vehicle.title}
          </h2>

          {/* Condition note */}
          <div className="p-3.5 bg-[#F6F7F9] rounded-xl border border-[#E4E6EB] mb-6 flex items-start gap-3">
            <Shield className="w-4 h-4 text-[#D90816] shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-[#18181B] block">Condition Assessment:</span>
              <span className="text-[#606570]">{vehicle.condition}</span>
            </div>
          </div>

          {/* Detailed Specifications Grid */}
          <h3 className="text-xs font-bold text-[#8E939D] uppercase tracking-wider font-mono mb-3">
            Technical Specifications
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 text-xs">
            {vehicle.specs.mileage && (
              <div className="p-3 bg-[#F6F7F9] rounded-xl border border-[#E4E6EB]">
                <span className="text-[#8E939D] block text-[11px]">Mileage</span>
                <span className="font-bold text-[#18181B]">{vehicle.specs.mileage}</span>
              </div>
            )}
            <div className="p-3 bg-[#F6F7F9] rounded-xl border border-[#E4E6EB]">
              <span className="text-[#8E939D] block text-[11px]">Engine</span>
              <span className="font-bold text-[#18181B]">{vehicle.specs.engine || 'Standard'}</span>
            </div>
            <div className="p-3 bg-[#F6F7F9] rounded-xl border border-[#E4E6EB]">
              <span className="text-[#8E939D] block text-[11px]">Transmission</span>
              <span className="font-bold text-[#18181B]">{vehicle.specs.transmission}</span>
            </div>
            <div className="p-3 bg-[#F6F7F9] rounded-xl border border-[#E4E6EB]">
              <span className="text-[#8E939D] block text-[11px]">Drivetrain</span>
              <span className="font-bold text-[#18181B]">{vehicle.specs.drivetrain}</span>
            </div>
            <div className="p-3 bg-[#F6F7F9] rounded-xl border border-[#E4E6EB]">
              <span className="text-[#8E939D] block text-[11px]">Fuel Type</span>
              <span className="font-bold text-[#18181B]">{vehicle.specs.fuelType}</span>
            </div>
            <div className="p-3 bg-[#F6F7F9] rounded-xl border border-[#E4E6EB]">
              <span className="text-[#8E939D] block text-[11px]">Model Year</span>
              <span className="font-bold text-[#18181B]">{vehicle.year}</span>
            </div>
          </div>

          {/* Overview Notes */}
          <h3 className="text-xs font-bold text-[#8E939D] uppercase tracking-wider font-mono mb-2">
            Vehicle Overview
          </h3>
          <p className="text-sm text-[#606570] leading-relaxed mb-6">
            {vehicle.notes}
          </p>

          <div className="p-3 bg-white rounded-xl border border-[#E4E6EB] text-xs text-[#606570] flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 text-[#8E939D] shrink-0" />
            <span>Sample vehicle listing shown for layout preview. Final pricing depends on auction bids, fees, and destination shipping.</span>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-[#F0F2F5]">
            <button
              type="button"
              onClick={() => {
                onClose();
                onRequestQuote(vehicle);
              }}
              className="w-full sm:flex-1 py-3 px-5 text-xs sm:text-sm font-bold text-white bg-[#D90816] hover:bg-[#B80713] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Request Price & Sourcing Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={getWhatsAppUrl(whatsAppEnquiryMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3 px-5 text-xs sm:text-sm font-semibold text-[#18181B] bg-[#F6F7F9] hover:bg-[#EAECEF] border border-[#E4E6EB] rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366] fill-current" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
