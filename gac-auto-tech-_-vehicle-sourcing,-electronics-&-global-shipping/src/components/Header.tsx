import React, { useState, useEffect, useRef } from 'react';
import { GacLogo } from './GacLogo';
import { getWhatsAppUrl } from '../data/mockData';
import { ChevronDown, MessageCircle, Menu, X, ArrowRight, Car, Laptop, Ship, Package, Search, Sun, Moon } from 'lucide-react';
import { ServiceType } from '../types';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onRequestQuote: (service?: ServiceType) => void;
  onNavigateAbout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onRequestQuote, onNavigateAbout }) => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 76;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleServicesSelect = (serviceType: ServiceType, sectionId: string) => {
    setIsServicesOpen(false);
    setIsMobileMenuOpen(false);
    scrollToSection(sectionId);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      scrollToSection('vehicles');
    }
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out backdrop-blur-md ${
        theme === 'dark'
          ? isScrolled 
            ? 'bg-[#09090B]/95 border-b border-[#22232B] shadow-md shadow-black/40 py-2.5 sm:py-3'
            : 'bg-[#09090B]/95 border-b border-[#1C1D24] py-3.5 sm:py-4'
          : isScrolled 
            ? 'bg-white/95 border-b border-[#E4E6EB] shadow-md shadow-black/5 py-2.5 sm:py-3' 
            : 'bg-white/95 border-b border-[#ECEEF2] py-3.5 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo in intentional dark emblem pill (matches reference UI's black logo mark) */}
          <div className="shrink-0 flex items-center">
            <a 
              href="#top" 
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center bg-[#09090B] hover:bg-black px-3 py-1.5 rounded-xl border border-[#22232B] shadow-sm transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D90816]"
              aria-label="GAC Auto Tech Home"
            >
              <GacLogo size="sm" className="h-7 sm:h-8" />
            </a>
          </div>

          {/* Center: Desktop Navigation Links (Clean black text like reference UI) */}
          <nav className={`hidden lg:flex items-center gap-7 xl:gap-9 text-sm font-semibold ${
            theme === 'dark' ? 'text-[#D4D7DE]' : 'text-[#18181B]'
          }`}>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-[#D90816] transition-colors cursor-pointer whitespace-nowrap py-1"
            >
              Home
            </button>

            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className={`flex items-center gap-1 hover:text-[#D90816] transition-colors cursor-pointer whitespace-nowrap py-1 ${
                  isServicesOpen ? 'text-[#D90816]' : 'text-[#18181B]'
                }`}
                aria-expanded={isServicesOpen}
              >
                <span>Services</span>
                <ChevronDown 
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isServicesOpen ? 'rotate-180 text-[#D90816]' : 'text-[#8E939D]'
                  }`} 
                />
              </button>

              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-3 w-76 bg-white border border-[#E4E6EB] rounded-2xl shadow-xl shadow-black/10 p-2 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                  <button
                    onClick={() => handleServicesSelect('vehicle_sourcing', 'vehicle-sourcing')}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F6F7F9] text-left transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#D90816]/10 flex items-center justify-center text-[#D90816] group-hover:bg-[#D90816] group-hover:text-white transition-colors shrink-0">
                      <Car className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#18181B]">Vehicle Sourcing</div>
                      <div className="text-[11px] text-[#606570]">Copart, IAAI & auction purchasing</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleServicesSelect('electronics_enquiry', 'electronics')}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F6F7F9] text-left transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#D90816]/10 flex items-center justify-center text-[#D90816] group-hover:bg-[#D90816] group-hover:text-white transition-colors shrink-0">
                      <Laptop className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#18181B]">Electronics & Tech</div>
                      <div className="text-[11px] text-[#606570]">Laptops, iPhones & gaming consoles</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleServicesSelect('shipping_quote', 'shipping')}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F6F7F9] text-left transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#D90816]/10 flex items-center justify-center text-[#D90816] group-hover:bg-[#D90816] group-hover:text-white transition-colors shrink-0">
                      <Ship className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#18181B]">Shipping & Logistics</div>
                      <div className="text-[11px] text-[#606570]">Canada, USA, UK to Ghana routes</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleServicesSelect('general_merchandise', 'services')}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F6F7F9] text-left transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#D90816]/10 flex items-center justify-center text-[#D90816] group-hover:bg-[#D90816] group-hover:text-white transition-colors shrink-0">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#18181B]">General Merchandise</div>
                      <div className="text-[11px] text-[#606570]">Custom international goods sourcing</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => scrollToSection('vehicles')}
              className="hover:text-[#D90816] transition-colors cursor-pointer whitespace-nowrap py-1"
            >
              Vehicles
            </button>

            <button
              onClick={() => scrollToSection('electronics')}
              className="hover:text-[#D90816] transition-colors cursor-pointer whitespace-nowrap py-1"
            >
              Electronics
            </button>

            <button
              onClick={onNavigateAbout}
              className="hover:text-[#D90816] transition-colors cursor-pointer whitespace-nowrap py-1"
            >
              About Us
            </button>

            <button
              onClick={() => scrollToSection('faq')}
              className="hover:text-[#D90816] transition-colors cursor-pointer whitespace-nowrap py-1"
            >
              FAQ
            </button>

            <button
              onClick={() => scrollToSection('quote-form')}
              className="hover:text-[#D90816] transition-colors cursor-pointer whitespace-nowrap py-1"
            >
              Contact
            </button>
          </nav>

          {/* Right: Search Pill, WhatsApp, and Quote Actions (Matches reference UI's right-side controls) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Minimalist Search Pill (Direct match to reference UI) */}
            <form onSubmit={handleSearchSubmit} className="hidden xl:flex items-center relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-36 focus:w-48 transition-all duration-200 py-1.5 pl-8 pr-3 text-xs rounded-full border border-[#E4E6EB] bg-[#F6F7F9] text-[#18181B] placeholder:text-[#8E939D] focus:outline-none focus:border-[#D90816] focus:bg-white"
              />
              <Search className="w-3.5 h-3.5 text-[#8E939D] absolute left-2.5 pointer-events-none" />
            </form>

            {/* WhatsApp "Chat With Us" Rounded Pill */}
            <a
              href={getWhatsAppUrl('Hello GAC Auto Tech, I would like to enquire about your sourcing and shipping services.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-full border border-[#E4E6EB] hover:border-[#D0D4DC] bg-white text-[#18181B] hover:text-black shadow-xs transition-all active:scale-95 whitespace-nowrap"
              aria-label="Chat With Us on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-current shrink-0" />
              <span className="hidden sm:inline">Chat With Us</span>
              <span className="sm:hidden text-[11px]">Chat</span>
            </a>

            {/* Primary Red "Request a Quote" Button */}
            <button
              type="button"
              onClick={() => onRequestQuote()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#D90816] hover:bg-[#B80713] rounded-full transition-all shadow-sm shadow-[#D90816]/30 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <span className="hidden sm:inline">Request a Quote</span>
              <span className="sm:hidden text-xs">Quote</span>
              <ArrowRight className="w-3.5 h-3.5 hidden xs:inline" />
            </button>

            {/* Light / Dark Mode Toggle Pill (Matching reference UI right icon button) */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-full border transition-all cursor-pointer shadow-xs active:scale-95 ${
                theme === 'dark'
                  ? 'bg-[#181920] border-[#2A2B36] text-amber-400 hover:text-amber-300'
                  : 'bg-[#F6F7F9] border-[#E4E6EB] text-[#606570] hover:text-[#18181B]'
              }`}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full border border-[#E4E6EB] dark:border-[#2A2B36] bg-[#F6F7F9] dark:bg-[#181920] text-[#18181B] dark:text-white hover:bg-[#EAECEF] transition-colors"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-[#D90816]" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen 
              ? 'max-h-[560px] opacity-100 mt-3 pt-3 pb-3 border-t border-[#EAECEF]' 
              : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex flex-col gap-1 text-sm font-semibold text-[#18181B]">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left py-2 px-3 rounded-xl hover:bg-[#F6F7F9] transition-colors cursor-pointer"
            >
              Home
            </button>

            {/* Mobile Services Accordion */}
            <div className="rounded-xl overflow-hidden bg-[#F6F7F9] border border-[#E4E6EB]">
              <button
                type="button"
                onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                className="w-full text-left py-2.5 px-3 font-bold flex items-center justify-between cursor-pointer"
              >
                <span className="text-xs uppercase tracking-wider font-mono text-[#8E939D]">Our 4 Services</span>
                <ChevronDown className={`w-4 h-4 text-[#8E939D] transition-transform duration-200 ${isMobileServicesOpen ? 'rotate-180 text-[#D90816]' : ''}`} />
              </button>

              {isMobileServicesOpen && (
                <div className="px-2 pb-2 space-y-1">
                  <button
                    onClick={() => handleServicesSelect('vehicle_sourcing', 'vehicle-sourcing')}
                    className="w-full flex items-center gap-2.5 p-2 rounded-lg text-left text-xs text-[#18181B] hover:bg-white transition-colors cursor-pointer"
                  >
                    <Car className="w-3.5 h-3.5 text-[#D90816] shrink-0" />
                    <span>Vehicle Sourcing (Copart & IAAI)</span>
                  </button>
                  <button
                    onClick={() => handleServicesSelect('electronics_enquiry', 'electronics')}
                    className="w-full flex items-center gap-2.5 p-2 rounded-lg text-left text-xs text-[#18181B] hover:bg-white transition-colors cursor-pointer"
                  >
                    <Laptop className="w-3.5 h-3.5 text-[#D90816] shrink-0" />
                    <span>Electronics & Tech (Retail & Wholesale)</span>
                  </button>
                  <button
                    onClick={() => handleServicesSelect('shipping_quote', 'shipping')}
                    className="w-full flex items-center gap-2.5 p-2 rounded-lg text-left text-xs text-[#18181B] hover:bg-white transition-colors cursor-pointer"
                  >
                    <Ship className="w-3.5 h-3.5 text-[#D90816] shrink-0" />
                    <span>Shipping & Logistics (Ghana Freight)</span>
                  </button>
                  <button
                    onClick={() => handleServicesSelect('general_merchandise', 'services')}
                    className="w-full flex items-center gap-2.5 p-2 rounded-lg text-left text-xs text-[#18181B] hover:bg-white transition-colors cursor-pointer"
                  >
                    <Package className="w-3.5 h-3.5 text-[#D90816] shrink-0" />
                    <span>General Merchandise Sourcing</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => scrollToSection('vehicles')}
              className="text-left py-2 px-3 rounded-xl hover:bg-[#F6F7F9] transition-colors cursor-pointer"
            >
              Vehicles
            </button>

            <button
              onClick={() => scrollToSection('electronics')}
              className="text-left py-2 px-3 rounded-xl hover:bg-[#F6F7F9] transition-colors cursor-pointer"
            >
              Electronics
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigateAbout();
              }}
              className="text-left py-2 px-3 rounded-xl hover:bg-[#F6F7F9] transition-colors cursor-pointer"
            >
              About Us
            </button>

            <button
              onClick={() => scrollToSection('faq')}
              className="text-left py-2 px-3 rounded-xl hover:bg-[#F6F7F9] transition-colors cursor-pointer"
            >
              FAQ
            </button>

            <button
              onClick={() => scrollToSection('quote-form')}
              className="text-left py-2 px-3 rounded-xl hover:bg-[#F6F7F9] transition-colors cursor-pointer"
            >
              Contact
            </button>

            <div className="pt-2.5 mt-1 border-t border-[#EAECEF] grid grid-cols-2 gap-2">
              <a
                href={getWhatsAppUrl('Hello GAC Auto Tech, I would like to chat regarding an enquiry.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-semibold rounded-full border border-[#E4E6EB] bg-white text-[#18181B]"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] fill-current" />
                <span>WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onRequestQuote();
                }}
                className="py-2.5 px-3 text-xs font-bold text-white bg-[#D90816] hover:bg-[#B80713] rounded-full text-center shadow-sm"
              >
                Request Quote
              </button>
            </div>

          </div>
        </div>

      </div>
    </header>
  );
};
