import React from 'react';
import { GacLogo } from './GacLogo';
import { ArrowRight, Compass, Shield, ArrowUpRight } from 'lucide-react';

interface AboutPreviewProps {
  onOpenAboutModal: () => void;
}

export const AboutPreview: React.FC<AboutPreviewProps> = ({ onOpenAboutModal }) => {
  return (
    <section className="bg-[#121316] text-white py-16 lg:py-24 border-b border-[#22232B] relative overflow-hidden">
      
      {/* Background ambient detail */}
      <div 
        className="absolute -right-20 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#D90816]/10 rounded-full blur-[100px] pointer-events-none"
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left: Editorial Content */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D90816]" />
              <span className="text-xs font-bold tracking-[0.2em] text-[#8E939D] uppercase font-mono">
                COMPANY BACKGROUND
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-6">
              Meet GAC Auto Tech.
            </h2>

            <p className="text-base sm:text-lg text-[#BFC2C8] leading-relaxed mb-8 max-w-2xl">
              GAC Auto Tech brings together automotive sourcing, electronics, international shipping, 
              and general merchandise support. We work with individual and business customers to understand 
              their requirements and help coordinate the right next steps.
            </p>

            <button
              type="button"
              onClick={onOpenAboutModal}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-bold text-white bg-[#1C1D24] hover:bg-[#252630] border border-[#2B2D38] hover:border-[#3E4050] rounded-xl transition-colors cursor-pointer"
            >
              <span>About Our Business</span>
              <ArrowRight className="w-4 h-4 text-[#D90816]" />
            </button>
          </div>

          {/* Right: Restrained Branded Graphic & Identity Plaque */}
          <div className="lg:col-span-5">
            <div className="p-8 sm:p-10 rounded-2xl bg-[#09090B] border border-[#272832] shadow-2xl relative">
              
              {/* Subtle metallic hairline corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-[#D90816]/40 rounded-tr-2xl pointer-events-none" />

              <div className="mb-6">
                <GacLogo size="lg" />
              </div>

              <div className="space-y-4 pt-6 border-t border-[#1C1D24] text-xs text-[#BFC2C8]">
                <div className="flex items-start gap-3">
                  <Compass className="w-4 h-4 text-[#D90816] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-semibold block">North American & UK Origin Support</span>
                    <span className="text-[#8E939D]">Direct coordination with leading vehicle auctions and technology distributors.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="w-4 h-4 text-[#D90816] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-semibold block">Transparent Next Steps</span>
                    <span className="text-[#8E939D]">Clear breakdowns of sourcing criteria, freight scope, and transit procedures.</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#1C1D24] flex items-center justify-between text-[11px] font-mono text-[#8E939D]">
                <span>Registered Trade Entity</span>
                <span className="text-[#BFC2C8]">Canada Inc.</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
