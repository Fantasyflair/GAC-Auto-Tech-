import React from 'react';
import { X, ShieldCheck, Globe, Truck, Laptop, Car } from 'lucide-react';
import { GacLogo } from './GacLogo';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestQuote: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onRequestQuote }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      <div 
        className="relative my-8 w-full max-w-2xl overflow-hidden rounded-panel bg-white text-[#111113] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/10 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div className="bg-[#09090B] p-6 text-white sm:p-8">
          <div className="mb-4">
            <GacLogo size="md" />
          </div>
          <h2 id="about-modal-title" className="font-display text-2xl">
            About GAC Auto Tech Canada Inc.
          </h2>
          <p className="mt-1.5 text-base text-white/80">
            Connecting buyers with global auction sourcing, electronics procurement, and international logistics.
          </p>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] space-y-6 overflow-y-auto p-6 text-base text-[#52525b] sm:p-8">
          <div>
            <h3 className="mb-2 flex items-center gap-2 font-display text-lg text-[#111113]">
              <Car className="w-4 h-4 text-accent" />
              <span>Automotive Sourcing</span>
            </h3>
            <p>
              We help customers source, bid on, and purchase vehicles across leading North American 
              auction channels including Copart and IAAI. Based on each customer’s specific budget and 
              mileage preferences, our team assists in locating prospective vehicles, verifying available 
              documentation, and coordinating necessary land transport to consolidation export ports.
            </p>
          </div>

          <div>
            <h3 className="mb-2 flex items-center gap-2 font-display text-lg text-[#111113]">
              <Laptop className="w-4 h-4 text-accent" />
              <span>Technology & Electronics</span>
            </h3>
            <p>
              We supply laptops, desktop computers, iPhones, gaming consoles, controllers, and premium 
              accessories. We cater to individual retail shoppers seeking personal upgrades as well as 
              businesses and retail shops placing wholesale orders.
            </p>
          </div>

          <div>
            <h3 className="mb-2 flex items-center gap-2 font-display text-lg text-[#111113]">
              <Truck className="w-4 h-4 text-accent" />
              <span>International Shipping & Logistics</span>
            </h3>
            <p>
              Operating across Canada, the USA, and the UK, we coordinate ocean and air freight for 
              vehicles, consumer electronics, and general merchandise bound for Ghana and other supported 
              destinations. We ensure clear bills of lading, dispatch tracking references, and smooth 
              port coordination.
            </p>
          </div>

          <div>
            <h3 className="mb-2 flex items-center gap-2 font-display text-lg text-[#111113]">
              <Globe className="w-4 h-4 text-accent" />
              <span>General Merchandise & Custom Sourcing</span>
            </h3>
            <p>
              Need products or specialty equipment that are hard to obtain locally? GAC Auto Tech helps 
              customers identify verified suppliers overseas, coordinate procurement, and integrate the 
              purchase with our consolidated freight pipelines.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-black/10 p-6 sm:flex-row">
          <span className="text-sm text-[#52525b]">
            Official corporate entity: GAC Auto Tech Canada Inc.
          </span>
          <button
            type="button"
            onClick={() => {
              onClose();
              onRequestQuote();
            }}
            className="btn-ink w-full rounded-full px-5 py-3 text-sm font-bold transition-colors cursor-pointer sm:w-auto"
          >
            Start your enquiry
          </button>
        </div>
      </div>
    </div>
  );
};
