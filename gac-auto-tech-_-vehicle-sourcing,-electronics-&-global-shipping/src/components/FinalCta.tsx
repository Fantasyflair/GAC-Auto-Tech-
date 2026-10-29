import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../data/mockData';

interface FinalCtaProps {
  onRequestQuote: () => void;
}

export const FinalCta: React.FC<FinalCtaProps> = ({ onRequestQuote }) => {
  return (
    <section className="bg-[#09090B] text-white py-20 lg:py-28 relative overflow-hidden border-b border-[#1A1A22]">
      
      {/* Restrained red accent lighting */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#D90816]/12 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true" 
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Subtle accent emblem line */}
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="w-8 h-px bg-[#D90816]" />
          <span className="text-xs font-bold tracking-[0.2em] text-[#BFC2C8] uppercase font-mono">
            NEXT STEPS
          </span>
          <span className="w-8 h-px bg-[#D90816]" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-5 text-balance">
          Ready to Source, Buy, or Ship?
        </h2>

        {/* Supporting text */}
        <p className="text-base sm:text-lg text-[#BFC2C8] max-w-xl mx-auto leading-relaxed mb-9">
          Tell GAC Auto Tech what you need, and start with a clear enquiry.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={onRequestQuote}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-white bg-[#D90816] hover:bg-[#B80713] rounded-xl transition-all shadow-md shadow-[#D90816]/30 active:scale-[0.98] cursor-pointer"
          >
            <span>Request a Quote</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={getWhatsAppUrl('Hello GAC Auto Tech, I would like to start an enquiry.')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white/90 hover:text-white bg-[#141419] hover:bg-[#1C1D24] border border-[#2B2D38] hover:border-[#3E4050] rounded-xl transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366] fill-current" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
