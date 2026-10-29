import React, { useState } from 'react';
import { Search, MapPin, Globe, DollarSign, Layers } from 'lucide-react';
import { ServiceType } from '../types';

interface HeroProps {
  onRequestQuote: (service?: ServiceType, details?: string) => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRequestQuote, onExploreServices }) => {
  const [activeTab, setActiveTab] = useState<ServiceType>('vehicle_sourcing');
  const [origin, setOrigin] = useState('Canada / USA (Auctions)');
  const [destination, setDestination] = useState('Ghana (Tema Port)');
  const [itemKeyword, setItemKeyword] = useState('');
  const [budgetEst, setBudgetEst] = useState('');

  const handleSearchQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const details = `Origin: ${origin} · Destination: ${destination}${itemKeyword ? ` · Lot/Model: ${itemKeyword}` : ''}${budgetEst ? ` · Target Budget: $${budgetEst}` : ''}`;
    onRequestQuote(activeTab, details);
  };

  return (
    <section className="relative overflow-visible pb-16 sm:pb-24 bg-white">
      
      {/* Full-Bleed Showroom Hero Stage (Exact match to reference screenshot) */}
      <div className="relative w-full overflow-hidden bg-[#09090B]">
        
        {/* Cinematic Vehicle in Showroom */}
        <div className="relative aspect-[16/11] sm:aspect-[21/10] lg:aspect-[2.35/1] w-full overflow-hidden">
          <img
            src="/src/assets/images/hero_luxury_showroom_1793244740775.jpg"
            alt="Executive white luxury sports sedan inside contemporary glass architectural showroom"
            className="w-full h-full object-cover object-center brightness-[0.92] contrast-[1.05]"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          {/* Subtle gradient scrim at bottom to provide pristine contrast for white headline */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent pointer-events-none" />
        </div>

        {/* Foreground Content inside Hero (Exact match to reference screenshot) */}
        <div className="absolute inset-0 flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 lg:pb-24 z-10 pointer-events-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            
            {/* Left: Huge Bold White Headline (Mirrors 'Premium car rental' in reference) */}
            <div className="lg:col-span-7 pointer-events-auto">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.02] text-balance">
                Premium vehicle<br />
                sourcing
              </h1>
            </div>

            {/* Right: Paragraph Copy */}
            <div className="lg:col-span-5 lg:pl-6 pointer-events-auto">
              <p className="text-sm sm:text-base text-[#D4D7DE] leading-relaxed mb-2 font-normal">
                We make international vehicle purchasing and shipping seamless—providing Copart and IAAI auction bidding, wholesale electronics procurement, and reliable ocean freight to Ghana.
              </p>
              <div className="flex items-center gap-2 text-xs text-[#BFC2C8] font-mono">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse shrink-0"></span>
                <span>Copart & IAAI Auction Sourcing · Canada / USA / UK to Ghana</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Floating Booking & Quote Search Bar (Signature component from reference screenshot) */}
      <div className="relative -mt-10 sm:-mt-14 max-w-5xl mx-auto z-20 px-4 sm:px-6">
        
        {/* Segmented Mode Pills (like 'Distance | Hourly | Flat Rate') */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-[#18181F]/90 backdrop-blur-md border border-[#2B2D38] w-fit mx-auto mb-3 shadow-xl">
          <button
            type="button"
            onClick={() => setActiveTab('vehicle_sourcing')}
            className={`px-4 sm:px-5 py-1.5 text-xs font-semibold rounded-full transition-all duration-150 cursor-pointer ${
              activeTab === 'vehicle_sourcing'
                ? 'bg-white text-[#18181B] shadow-sm'
                : 'text-[#BFC2C8] hover:text-white'
            }`}
          >
            Vehicle Sourcing
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('electronics_enquiry')}
            className={`px-4 sm:px-5 py-1.5 text-xs font-semibold rounded-full transition-all duration-150 cursor-pointer ${
              activeTab === 'electronics_enquiry'
                ? 'bg-white text-[#18181B] shadow-sm'
                : 'text-[#BFC2C8] hover:text-white'
            }`}
          >
            Electronics & Tech
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('shipping_quote')}
            className={`px-4 sm:px-5 py-1.5 text-xs font-semibold rounded-full transition-all duration-150 cursor-pointer ${
              activeTab === 'shipping_quote'
                ? 'bg-white text-[#18181B] shadow-sm'
                : 'text-[#BFC2C8] hover:text-white'
            }`}
          >
            Shipping & Freight
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('general_merchandise')}
            className={`hidden md:inline-block px-4 sm:px-5 py-1.5 text-xs font-semibold rounded-full transition-all duration-150 cursor-pointer ${
              activeTab === 'general_merchandise'
                ? 'bg-white text-[#18181B] shadow-sm'
                : 'text-[#BFC2C8] hover:text-white'
            }`}
          >
            General Goods
          </button>
        </div>

        {/* White Search Card with 4 Input Cells & Red Submit Button */}
        <form 
          onSubmit={handleSearchQuote}
          className="rounded-2xl sm:rounded-full bg-white border border-[#E4E6EB] p-2.5 sm:p-3 shadow-2xl shadow-black/15 transition-all"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-0 sm:divide-x sm:divide-[#EAECEF] items-center">
            
            {/* Cell 1: Origin Market */}
            <div className="lg:col-span-3 px-4 py-1.5 text-left">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8E939D] font-bold">
                Origin Market
              </label>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#D90816] shrink-0" />
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-[#18181B] focus:outline-none cursor-pointer truncate"
                >
                  <option value="Canada / USA (Auctions)">Canada / USA (Auctions)</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Dealer Network">Dealer Network</option>
                </select>
              </div>
            </div>

            {/* Cell 2: Destination */}
            <div className="lg:col-span-3 px-4 py-1.5 text-left">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8E939D] font-bold">
                Destination
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Globe className="w-3.5 h-3.5 text-[#D90816] shrink-0" />
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-[#18181B] focus:outline-none cursor-pointer truncate"
                >
                  <option value="Ghana (Tema Port)">Ghana (Tema Port)</option>
                  <option value="Other Destination Port">Other Destination Port</option>
                </select>
              </div>
            </div>

            {/* Cell 3: Item or Keyword */}
            <div className="lg:col-span-3 px-4 py-1.5 text-left">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8E939D] font-bold">
                {activeTab === 'vehicle_sourcing' ? 'Make, Model or Lot #' : activeTab === 'electronics_enquiry' ? 'Model & Specs' : 'Cargo Description'}
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Layers className="w-3.5 h-3.5 text-[#8E939D] shrink-0" />
                <input
                  type="text"
                  value={itemKeyword}
                  onChange={(e) => setItemKeyword(e.target.value)}
                  placeholder={activeTab === 'vehicle_sourcing' ? 'e.g. Audi Q5 or Copart Lot' : 'e.g. MacBook Pro, iPhone'}
                  className="w-full bg-transparent text-xs font-bold text-[#18181B] placeholder:text-[#8E939D]/70 focus:outline-none truncate"
                />
              </div>
            </div>

            {/* Cell 4: Target Budget & Search Button */}
            <div className="lg:col-span-3 px-2 py-1 flex items-center justify-between gap-2">
              <div className="px-2 text-left flex-1 hidden xl:block">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8E939D] font-bold">
                  Target Budget
                </label>
                <div className="flex items-center gap-1 mt-1">
                  <DollarSign className="w-3 h-3 text-[#8E939D]" />
                  <input
                    type="number"
                    value={budgetEst}
                    onChange={(e) => setBudgetEst(e.target.value)}
                    placeholder="USD / CAD"
                    className="w-20 bg-transparent text-xs font-bold text-[#18181B] focus:outline-none placeholder:text-[#8E939D]/70"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full xl:w-auto px-6 py-3 rounded-full bg-[#D90816] hover:bg-[#B80713] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-[#D90816]/30 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </div>

          </div>
        </form>

      </div>
    </section>
  );
};
