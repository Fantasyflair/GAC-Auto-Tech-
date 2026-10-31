import React, { useState } from 'react';
import { GacLogo } from './GacLogo';
import { SocialIcons } from './SocialIcons';
import { getWhatsAppUrl } from '../data/mockData';
import { ServiceType } from '../types';
import { ArrowRight, MessageCircle, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface FooterProps {
  onNavigateHome: () => void;
  onNavigateAbout: () => void;
  onNavigateVehicles: () => void;
  onNavigateElectronics: () => void;
  onSelectService: (service: ServiceType) => void;
  onRequestQuote: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateHome,
  onNavigateAbout,
  onNavigateVehicles,
  onNavigateElectronics,
  onSelectService,
  onRequestQuote,
  onOpenPrivacy,
  onOpenTerms
}) => {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();
  const [quickEmail, setQuickEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickEmail.trim()) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 4000);
      setQuickEmail('');
    }
  };

  return (
    <footer className={`border-t transition-colors duration-200 pt-16 pb-12 ${
      theme === 'dark' ? 'bg-[#09090B] border-[#26262A] text-[#BFC2C8]' : 'bg-white border-[#E4E6EB] text-[#606570]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid (Matches reference screenshot's footer layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-14 border-b border-[#26262A] dark:border-[#26262A] border-slate-200">
          
          {/* Brand & Subscribe Column (Left side of reference screenshot) */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="mb-4">
              <GacLogo size="lg" />
            </div>

            <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-sm mb-5">
              Vehicle sourcing, electronics, international shipping, and general merchandise support from Canada, the USA, and the UK to Ghana.
            </p>

            <div className="mb-7">
              <span className="block text-xs font-semibold text-[#18181B] dark:text-white mb-2.5">Follow us</span>
              <SocialIcons />
            </div>

            {/* Quick Email Inquiry / Subscribe Form (Exact match to reference screenshot) */}
            <div className="w-full max-w-sm">
              <span className="block text-xs font-bold text-[#18181B] dark:text-white mb-2">
                Stay updated on incoming inventory
              </span>
              
              {isSubscribed ? (
                <div className="flex items-center gap-2 p-2.5 rounded-full bg-black/5 dark:bg-white/10 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Thank you for subscribing!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="relative flex items-center">
                  <input
                    type="email"
                    required
                    value={quickEmail}
                    onChange={(e) => setQuickEmail(e.target.value)}
                    placeholder="Email address..."
                    className={`w-full py-2.5 pl-4 pr-12 text-xs rounded-full border focus:outline-none focus:border-[#09090B] transition-colors ${
                      theme === 'dark' 
                        ? 'bg-[#141416] border-[#26262A] text-white placeholder:text-[#606570]' 
                        : 'bg-[#F6F7F9] border-[#E4E6EB] text-[#18181B] placeholder:text-muted'
                    }`}
                  />
                  <button
                    type="submit"
                    className="absolute right-1 w-8 h-8 rounded-full btn-theme flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-xs"
                    aria-label="Submit email"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* 3 Right-Side Columns (Matches reference screenshot's 3 columns) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            
            {/* Column 1: Services */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-[#18181B] dark:text-white">
                Services
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => onSelectService('vehicle_sourcing')}
                    className="hover:text-accent transition-colors cursor-pointer text-left"
                  >
                    Vehicle Sourcing
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onSelectService('shipping_quote')}
                    className="hover:text-accent transition-colors cursor-pointer text-left"
                  >
                    Shipping & Logistics
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onSelectService('electronics_enquiry')}
                    className="hover:text-accent transition-colors cursor-pointer text-left"
                  >
                    Electronics & Tech
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onSelectService('general_merchandise')}
                    className="hover:text-accent transition-colors cursor-pointer text-left"
                  >
                    General Merchandise
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: Explore */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-[#18181B] dark:text-white">
                Explore
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li>
                  <button
                    type="button"
                    onClick={onNavigateHome}
                    className="hover:text-accent transition-colors cursor-pointer"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onNavigateVehicles}
                    className="hover:text-accent transition-colors cursor-pointer"
                  >
                    Featured Vehicles
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onNavigateElectronics}
                    className="hover:text-accent transition-colors cursor-pointer"
                  >
                    Electronics Showcase
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onNavigateAbout}
                    className="hover:text-accent transition-colors cursor-pointer"
                  >
                    About GAC Auto Tech
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Shipping Corridors */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-[#18181B] dark:text-white">
                Supported Corridors
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-muted">
                <li>Canada ➔ Ghana (Tema Port)</li>
                <li>USA ➔ Ghana Direct</li>
                <li>UK Consolidation ➔ West Africa</li>
                <li>Custom International Sourcing</li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal Links (Matches reference screenshot) */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div>
            © {currentYear} GAC Auto Tech Canada Inc. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={onOpenTerms}
              className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              Terms
            </button>
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              Privacy policy
            </button>
            <button
              type="button"
              onClick={onNavigateAbout}
              className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              Legal notice
            </button>
            <a
              href={getWhatsAppUrl('Hello GAC Auto Tech, I would like to make an enquiry.')}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
