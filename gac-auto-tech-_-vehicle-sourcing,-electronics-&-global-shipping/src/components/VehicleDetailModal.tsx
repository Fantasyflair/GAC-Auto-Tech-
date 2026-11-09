import React, { useRef } from 'react';
import { VehicleListing } from '../types';
import { ArrowRight, MessageCircle, AlertCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../data/mockData';
import { ModalShell } from './ModalShell';

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
  // Keeps the last vehicle on screen while the closing animation plays.
  const lastVehicle = useRef(vehicle);
  if (vehicle) lastVehicle.current = vehicle;
  const shown = lastVehicle.current;
  if (!shown) return null;

  const whatsAppEnquiryMessage = `Hello GAC Auto Tech, I would like to enquire about vehicle pricing, auction history, and shipping for: ${shown.title} (Ref: ${shown.listingRef}).`;

  return (
    <ModalShell open={!!vehicle} onClose={onClose} labelledBy="vehicle-modal-title" closeLabel="Close vehicle details">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#17171C]">
        <img
          src={shown.imageUrl}
          alt={shown.title}
          className="h-full w-full object-cover object-center"
        />
        {shown.availability !== 'Available' && (
          <span className="absolute bottom-4 left-4 rounded-control bg-[#111113] px-2.5 py-1 text-xs font-bold text-white">
            {shown.availability}
          </span>
        )}
      </div>

      <div className="p-6 sm:p-8">
        <p className="text-sm font-semibold text-[#52525b]">
          {shown.sourceType} · {shown.year} · Ref {shown.listingRef}
        </p>

        <h2 id="vehicle-modal-title" className="mt-1.5 font-display text-2xl">
          {shown.title}
        </h2>

        <p className="mt-3 text-base text-[#52525b]">{shown.notes}</p>

        {/* One flat list rather than a grid of tinted boxes inside the card. */}
        <h3 className="eyebrow mt-7 text-[#52525b]">Specifications</h3>
        <dl className="mt-3 border-t border-black/10">
          {shown.specs.mileage && <Row label="Mileage" value={shown.specs.mileage} />}
          <Row label="Engine" value={shown.specs.engine || 'Standard'} />
          <Row label="Transmission" value={shown.specs.transmission} />
          <Row label="Drivetrain" value={shown.specs.drivetrain} />
          <Row label="Fuel type" value={shown.specs.fuelType} />
          <Row label="Category" value={shown.category} />
          <Row label="Condition" value={shown.condition} />
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
              onRequestQuote(shown);
            }}
            className="btn-ink flex w-full items-center justify-center gap-2 rounded-control px-5 py-3.5 text-sm font-bold transition-colors cursor-pointer sm:flex-1"
          >
            <span>Request price and sourcing quote</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={getWhatsAppUrl(whatsAppEnquiryMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-control border border-black/20 px-5 py-3.5 text-sm font-bold text-[#111113] transition-colors hover:bg-black/5 sm:w-auto"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </ModalShell>
  );
};
