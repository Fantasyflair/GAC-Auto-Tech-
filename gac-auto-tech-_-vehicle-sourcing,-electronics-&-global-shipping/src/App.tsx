/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MotionConfig } from 'motion/react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { EnquiryListProvider } from './context/EnquiryListContext';
import { Header } from './components/Header';
import { EnquiryDrawer } from './components/EnquiryDrawer';
import { SignInModal } from './components/SignInModal';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { Reveal } from './components/Reveal';
import { BentoHome } from './components/BentoHome';
import { ElectronicsShop } from './components/ElectronicsShop';
import { FeaturedVehicles } from './components/FeaturedVehicles';
import { QuoteRequestSection } from './components/QuoteRequestSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { VehicleDetailModal } from './components/VehicleDetailModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AboutModal } from './components/AboutModal';
import { LegalModal } from './components/LegalModal';
import { VehicleListing, ElectronicProduct, ServiceType } from './types';

const guessService = (query: string): ServiceType => {
  const text = query.toLowerCase();
  if (/(laptop|macbook|iphone|phone|samsung|playstation|ps5|xbox|console|controller|tablet|ipad|airpods)/.test(text)) {
    return 'electronics_enquiry';
  }
  if (/(ship|container|freight|cargo|roro|clearing)/.test(text)) return 'shipping_quote';
  if (/(car|suv|sedan|truck|toyota|honda|lexus|bmw|audi|mercedes|porsche|benz|copart|iaai|vehicle)/.test(text)) {
    return 'vehicle_sourcing';
  }
  return 'general_merchandise';
};

function MainApp() {
  const { theme } = useTheme();

  // Modal states
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleListing | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ElectronicProduct | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  // Quote form pre-fill state
  const [quoteService, setQuoteService] = useState<ServiceType>('vehicle_sourcing');
  const [quoteItemTitle, setQuoteItemTitle] = useState<string>('');

  const scrollToQuote = (service: ServiceType = 'vehicle_sourcing', itemTitle: string = '') => {
    setQuoteService(service);
    setQuoteItemTitle(itemTitle);
    const element = document.getElementById('quote-form');
    if (element) {
      const headerOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div id="top" className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-[#E9DCDC] selection:text-[#1A1212] ${
      theme === 'dark' ? 'bg-[#09090B] text-white' : 'bg-white text-[#18181B]'
    }`}>
      
      <Header
        onRequestQuote={(service, details) => scrollToQuote(service || 'vehicle_sourcing', details || '')}
        onNavigateAbout={() => setIsAboutOpen(true)}
        onOpenSignIn={() => setIsSignInOpen(true)}
        onSearch={(query) => scrollToQuote(guessService(query), `Looking for: ${query}`)}
      />

      <main className="flex-1">
        {/* 3. HERO SECTION (Showroom Backdrop & Floating Search/Quote Bar) */}
        <Hero
          onRequestQuote={(service, details) => scrollToQuote(service || 'vehicle_sourcing', details || '')}
          onNavigate={scrollToSection}
        />

        <Marquee />

        {/* Vehicles lead the page: they are the service most visitors arrive for. */}
        <FeaturedVehicles
          onViewDetails={(vehicle) => setSelectedVehicle(vehicle)}
          onRequestPrice={(vehicle) => scrollToQuote('vehicle_sourcing', `${vehicle.year} ${vehicle.make} ${vehicle.model} (Ref: ${vehicle.listingRef})`)}
          onBrowseAll={() => scrollToQuote('vehicle_sourcing', 'All vehicle listings inquiry')}
        />

        <BentoHome
          onSelectService={(service) => scrollToQuote(service)}
          onExploreVehicles={() => scrollToSection('vehicles')}
        />

        <ElectronicsShop
          onViewProduct={(product) => setSelectedProduct(product)}
          onBuyNow={(product) => scrollToQuote('electronics_enquiry', `${product.title} (Ref: ${product.listingRef})`)}
          onRequestProduct={() => scrollToQuote('electronics_enquiry', '')}
        />

        <Reveal>
          <QuoteRequestSection
            initialService={quoteService}
            initialItemTitle={quoteItemTitle}
            onOpenPrivacy={() => setLegalModalType('privacy')}
          />
        </Reveal>

        <Reveal>
          <div id="faq">
            <FaqSection />
          </div>
        </Reveal>
      </main>

      {/* 16. FOOTER (Matching reference layout with email subscribe pill and 3 columns) */}
      <Footer
        onNavigateHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigateAbout={() => setIsAboutOpen(true)}
        onNavigateVehicles={() => scrollToSection('vehicles')}
        onNavigateElectronics={() => scrollToSection('electronics')}
        onSelectService={(service) => scrollToQuote(service)}
        onRequestQuote={() => scrollToQuote('vehicle_sourcing')}
        onOpenPrivacy={() => setLegalModalType('privacy')}
        onOpenTerms={() => setLegalModalType('terms')}
      />

      {/* FLOATING WHATSAPP BUTTON */}
      <FloatingWhatsApp />

      {/* MODALS */}
      <VehicleDetailModal
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        onRequestQuote={(v) => scrollToQuote('vehicle_sourcing', `${v.year} ${v.make} ${v.model} (Ref: ${v.listingRef})`)}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onEnquire={(p) => scrollToQuote('electronics_enquiry', `${p.title} (Ref: ${p.listingRef})`)}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onRequestQuote={() => scrollToQuote('vehicle_sourcing')}
      />

      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

      <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />

      <EnquiryDrawer onRequestQuote={(service, details) => scrollToQuote(service, details)} />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <EnquiryListProvider>
        <MotionConfig reducedMotion="user">
          <MainApp />
        </MotionConfig>
      </EnquiryListProvider>
    </ThemeProvider>
  );
}
