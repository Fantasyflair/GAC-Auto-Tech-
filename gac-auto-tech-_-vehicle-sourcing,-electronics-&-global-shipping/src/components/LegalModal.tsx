import React from 'react';
import { X, Shield } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const isPrivacy = type === 'privacy';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E4E6EB] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#E4E6EB] bg-[#F6F7F9]">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-bold text-[#18181B]">
              {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#EAECEF] text-[#606570] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto space-y-4 text-xs sm:text-sm text-[#606570] leading-relaxed">
          {isPrivacy ? (
            <>
              <p>
                <strong>1. Information Collection:</strong> GAC Auto Tech Canada Inc. collects information 
                voluntarily submitted via our quote enquiry forms and direct WhatsApp communications, 
                including your name, email address, contact numbers, and requested specifications.
              </p>
              <p>
                <strong>2. Use of Information:</strong> Contact information is used exclusively to respond 
                to your vehicle sourcing, electronics procurement, shipping quote, or general merchandise 
                requests. We do not sell or rent personal information to external marketers.
              </p>
              <p>
                <strong>3. Communications:</strong> By submitting an enquiry with your contact details, you 
                consent to our team reaching out via email or WhatsApp regarding the specific scope of your 
                request.
              </p>
              <p>
                <strong>4. Data Security:</strong> We implement administrative and technical safeguards to 
                protect submitted personal records.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>1. Scope of Services:</strong> GAC Auto Tech coordinates auction sourcing, electronics 
                resale, and international logistics. Inventory displayed on this website is for illustrative 
                preview purposes unless confirmed in an active transaction agreement.
              </p>
              <p>
                <strong>2. Sourcing & Auction Quotations:</strong> Vehicle auction purchases (via Copart, IAAI, 
                or dealer networks) are subject to auction house buyer fees, local taxes, condition report 
                disclosures, and currency exchange rates. Final purchase agreements are agreed upon in writing 
                before bidding or purchasing.
              </p>
              <p>
                <strong>3. International Shipping:</strong> Ocean and air freight timelines are subject to port 
                schedules, customs clearance procedures, and ocean carrier availability. Specific route terms 
                are provided per individual bill of lading.
              </p>
              <p>
                <strong>4. Jurisdiction:</strong> GAC Auto Tech Canada Inc. operates under the applicable laws 
                of Canada.
              </p>
            </>
          )}
        </div>

        <div className="p-4 bg-[#F6F7F9] border-t border-[#E4E6EB] text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#18181B] hover:bg-black rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
