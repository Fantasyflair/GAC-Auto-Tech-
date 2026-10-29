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
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E4E6EB] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#F6F7F9] hover:bg-[#EAECEF] text-[#18181B] transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div className="bg-[#09090B] p-6 sm:p-8 text-white border-b border-[#22232B]">
          <div className="mb-4">
            <GacLogo size="md" />
          </div>
          <h2 id="about-modal-title" className="text-2xl font-extrabold tracking-tight">
            About GAC Auto Tech Canada Inc.
          </h2>
          <p className="text-xs sm:text-sm text-[#BFC2C8] mt-1">
            Connecting buyers with global auction sourcing, electronics procurement, and international logistics.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto space-y-6 text-sm text-[#606570] leading-relaxed">
          <div>
            <h3 className="text-base font-bold text-[#18181B] mb-2 flex items-center gap-2">
              <Car className="w-4 h-4 text-[#D90816]" />
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
            <h3 className="text-base font-bold text-[#18181B] mb-2 flex items-center gap-2">
              <Laptop className="w-4 h-4 text-[#D90816]" />
              <span>Technology & Electronics</span>
            </h3>
            <p>
              We supply laptops, desktop computers, iPhones, gaming consoles, controllers, and premium 
              accessories. We cater to individual retail shoppers seeking personal upgrades as well as 
              businesses and retail shops placing wholesale orders.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-[#18181B] mb-2 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#D90816]" />
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
            <h3 className="text-base font-bold text-[#18181B] mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#D90816]" />
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
        <div className="p-6 bg-[#F6F7F9] border-t border-[#E4E6EB] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-[#8E939D]">
            Official corporate entity: GAC AUTO TECH CANADA INC.
          </span>
          <button
            type="button"
            onClick={() => {
              onClose();
              onRequestQuote();
            }}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-[#D90816] hover:bg-[#B80713] rounded-xl transition-colors cursor-pointer"
          >
            Start Your Enquiry
          </button>
        </div>
      </div>
    </div>
  );
};
