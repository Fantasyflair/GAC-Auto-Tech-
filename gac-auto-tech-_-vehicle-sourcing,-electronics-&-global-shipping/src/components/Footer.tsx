import React, { useState } from 'react';
import Link from 'next/link';
import { GacLogo } from './GacLogo';
import { SocialIcons } from './SocialIcons';
import { getWhatsAppUrl } from '../data/mockData';
import { ServiceType } from '../types';
import { ArrowRight, MessageCircle, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onNavigateAbout: () => void;
  onSelectService: (service: ServiceType) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onNavigateAbout,
  onSelectService,
  onOpenPrivacy,
  onOpenTerms
}) => {
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
    <footer className="border-t ui-divider bg-white pt-14 pb-10 text-[#52525b] dark:bg-[#09090B] dark:text-[#b1b1ba]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b ui-divider">

          {/* Brand & Subscribe Column */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="mb-4">
              <GacLogo size="lg" />
            </div>

            <p className="text-base text-muted max-w-sm mb-6">
              Vehicle sourcing, electronics, international shipping, and general merchandise support from Canada, the USA, and the UK to Ghana.
            </p>

            <div className="mb-7">
              <span className="mb-3 block text-sm font-bold text-[#111113] dark:text-white">Follow us</span>
              <SocialIcons />
            </div>

            <div className="w-full max-w-sm">
              <span className="mb-2.5 block text-sm font-bold text-[#111113] dark:text-white">
                Stay updated on incoming inventory
              </span>

              {isSubscribed ? (
                <div className="flex items-center gap-2 rounded-full bg-black/5 p-3 text-sm font-bold dark:bg-white/10">
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
                    placeholder="Email address"
                    aria-label="Email address"
                    className="w-full rounded-full border ui-divider bg-transparent py-3 pl-4 pr-14 text-base text-[#111113] placeholder:text-[#78787f] transition-colors focus:border-black/50 focus:outline-none dark:text-white dark:focus:border-white/55"
                  />
                  <button
                    type="submit"
                    className="btn-theme absolute right-1.5 flex h-9 w-9 items-center justify-center rounded-full transition-transform active:scale-95 cursor-pointer"
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
              <h4 className="eyebrow mb-4 text-[#111113] dark:text-white">
                Services
              </h4>
              <ul className="space-y-3 text-base">
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
              <h4 className="eyebrow mb-4 text-[#111113] dark:text-white">
                Explore
              </h4>
              <ul className="space-y-3 text-base">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('top')}
                    className="hover:text-accent transition-colors cursor-pointer"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <Link href="/products" className="hover:text-accent transition-colors">
                    All products
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('vehicles')}
                    className="hover:text-accent transition-colors cursor-pointer"
                  >
                    Featured Vehicles
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('electronics')}
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
              <h4 className="eyebrow mb-4 text-[#111113] dark:text-white">
                Supported corridors
              </h4>
              <ul className="space-y-3 text-base text-muted">
                <li>Canada ➔ Ghana (Tema Port)</li>
                <li>USA ➔ Ghana Direct</li>
                <li>UK Consolidation ➔ West Africa</li>
                <li>Custom International Sourcing</li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <div>
            © {currentYear} GAC Auto Tech Canada Inc. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/admin" className="hover:text-black dark:hover:text-white transition-colors">
              Admin
            </Link>
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
