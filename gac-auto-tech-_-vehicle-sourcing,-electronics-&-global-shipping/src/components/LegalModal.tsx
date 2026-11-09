import React, { useRef } from 'react';
import { Shield } from 'lucide-react';
import { ModalShell } from './ModalShell';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  // Keeps the last document on screen while the closing animation plays.
  const lastType = useRef(type);
  if (type) lastType.current = type;
  if (!lastType.current) return null;

  const isPrivacy = lastType.current === 'privacy';

  return (
    <ModalShell open={!!type} onClose={onClose} labelledBy="legal-modal-title">
        <div className="flex items-center gap-2.5 border-b border-black/10 p-6 pr-16">
          <Shield className="w-5 h-5 text-accent" />
          <h2 id="legal-modal-title" className="font-display text-lg">
            {isPrivacy ? 'Privacy policy' : 'Terms of service'}
          </h2>
        </div>

        <div className="space-y-4 p-6 text-base text-[#52525b] sm:p-8">
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

        <div className="border-t border-black/10 p-5 text-right">
          <button
            type="button"
            onClick={onClose}
            className="btn-ink rounded-control px-5 py-2.5 text-sm font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
    </ModalShell>
  );
};
