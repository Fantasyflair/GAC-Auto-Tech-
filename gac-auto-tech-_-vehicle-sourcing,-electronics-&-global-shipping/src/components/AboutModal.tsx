import React from 'react';
import { Globe, Truck, Laptop, Car } from 'lucide-react';
import { GacLogo } from './GacLogo';
import { ModalShell } from './ModalShell';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestQuote: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onRequestQuote }) => {
  return (
    <ModalShell open={isOpen} onClose={onClose} labelledBy="about-modal-title" closeLabel="Close about">
        {/* Header Banner */}
        <div className="bg-[#09090B] p-6 pr-16 text-white sm:p-8 sm:pr-16">
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
        <div className="space-y-6 p-6 text-base text-[#52525b] sm:p-8">
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
            className="btn-ink w-full rounded-control px-5 py-3 text-sm font-bold transition-colors cursor-pointer sm:w-auto"
          >
            Start your enquiry
          </button>
        </div>
    </ModalShell>
  );
};
