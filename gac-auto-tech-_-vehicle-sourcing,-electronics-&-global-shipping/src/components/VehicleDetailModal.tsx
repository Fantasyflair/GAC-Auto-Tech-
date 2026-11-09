import React from 'react';
import { VehicleListing } from '../types';
import { X, ArrowRight, MessageCircle, AlertCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../data/mockData';

interface VehicleDetailModalProps {
  vehicle: VehicleListing | null;
  onClose: () => void;
  onRequestQuote: (vehicle: VehicleListing) => void;
}

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-baseline justify-between gap-4 border-b border-black/10 py-2.5">
    <dt className="text-sm text-[#52525b]">{label}</dt>
    <dd className="text-right text-sm font-bold text-[#111113]">{value}</dd>
  </div>
);

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
        className="relative my-8 w-full max-w-2xl overflow-hidden rounded-panel bg-white text-[#111113] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#17171C]">
          <img
            src={vehicle.imageUrl}
            alt={vehicle.title}
            className="h-full w-full object-cover object-center"
          />
          {vehicle.availability !== 'Available' && (
            <span className="absolute bottom-4 left-4 rounded-full bg-[#111113] px-3 py-1 text-xs font-bold text-white">
              {vehicle.availability}
            </span>
          )}
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-6 sm:p-8">
          <p className="text-sm font-semibold text-[#52525b]">
            {vehicle.sourceType} · {vehicle.year} · Ref {vehicle.listingRef}
          </p>

          <h2 id="vehicle-modal-title" className="mt-1.5 font-display text-2xl">
            {vehicle.title}
          </h2>

          <p className="mt-3 text-base text-[#52525b]">{vehicle.notes}</p>

          {/* One flat list rather than a grid of tinted boxes inside the card. */}
          <h3 className="eyebrow mt-7 text-[#52525b]">Specifications</h3>
          <dl className="mt-3 border-t border-black/10">
            {vehicle.specs.mileage && <Row label="Mileage" value={vehicle.specs.mileage} />}
            <Row label="Engine" value={vehicle.specs.engine || 'Standard'} />
            <Row label="Transmission" value={vehicle.specs.transmission} />
            <Row label="Drivetrain" value={vehicle.specs.drivetrain} />
            <Row label="Fuel type" value={vehicle.specs.fuelType} />
            <Row label="Category" value={vehicle.category} />
            <Row label="Condition" value={vehicle.condition} />
          </dl>

          <p className="mt-5 flex items-start gap-2 text-sm text-[#52525b]">
            <AlertCircle className="mt-0.5 w-4 h-4 shrink-0" />
            <span>Sample vehicle listing shown for layout preview. Final pricing depends on auction bids, fees, and destination shipping.</span>
          </p>

          <div className="mt-6 flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                onClose();
                onRequestQuote(vehicle);
              }}
              className="btn-ink flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold transition-colors cursor-pointer sm:flex-1"
            >
              <span>Request price and sourcing quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={getWhatsAppUrl(whatsAppEnquiryMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-black/20 px-5 py-3.5 text-sm font-bold text-[#111113] transition-colors hover:bg-black/5 sm:w-auto"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
