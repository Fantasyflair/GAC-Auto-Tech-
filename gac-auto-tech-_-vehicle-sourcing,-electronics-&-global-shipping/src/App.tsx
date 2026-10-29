/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { UtilityBar } from './components/UtilityBar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SourcingStrip } from './components/SourcingStrip';
import { ServicesSection } from './components/ServicesSection';
import { VehicleSourcingFeature } from './components/VehicleSourcingFeature';
import { FeaturedVehicles } from './components/FeaturedVehicles';
import { ElectronicsShowcase } from './components/ElectronicsShowcase';
import { ShippingLogistics } from './components/ShippingLogistics';
import { HowItWorks } from './components/HowItWorks';
import { WhyGacAutoTech } from './components/WhyGacAutoTech';
import { AboutPreview } from './components/AboutPreview';
import { QuoteRequestSection } from './components/QuoteRequestSection';
import { FaqSection } from './components/FaqSection';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { VehicleDetailModal } from './components/VehicleDetailModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AboutModal } from './components/AboutModal';
import { LegalModal } from './components/LegalModal';
import { VehicleListing, ElectronicProduct, ServiceType } from './types';

function MainApp() {
  const { theme } = useTheme();

  // Modal states
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleListing | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ElectronicProduct | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

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
    <div id="top" className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-[#D90816] selection:text-white ${
      theme === 'dark' ? 'bg-[#09090B] text-white' : 'bg-white text-[#18181B]'
    }`}>
      
      {/* 1. STICKY MAIN HEADER (Matching reference top bar layout) */}
      <Header
        onRequestQuote={() => scrollToQuote('vehicle_sourcing')}
        onNavigateAbout={() => setIsAboutOpen(true)}
      />

      <main className="flex-1">
        {/* 3. HERO SECTION (Showroom Backdrop & Floating Search/Quote Bar) */}
        <Hero
          onRequestQuote={(service, details) => scrollToQuote(service || 'vehicle_sourcing', details || '')}
          onExploreServices={() => scrollToSection('services')}
        />

        {/* 4. INTERNATIONAL SOURCING STRIP */}
        <SourcingStrip />

        {/* 5. SERVICES SECTION (4 Tall Editorial Cards with ↗ Circular Buttons matching reference UI) */}
        <ServicesSection
          onSelectService={(service) => scrollToQuote(service)}
          onExploreElectronics={() => scrollToSection('electronics')}
          onExploreVehicles={() => scrollToSection('vehicle-sourcing')}
          onExploreShipping={() => scrollToSection('shipping')}
        />

        {/* 6. FEATURED VEHICLES ('Trend vehicles' columnar grid matching reference UI) */}
        <FeaturedVehicles
          onViewDetails={(vehicle) => setSelectedVehicle(vehicle)}
          onRequestPrice={(vehicle) => scrollToQuote('vehicle_sourcing', `${vehicle.year} ${vehicle.make} ${vehicle.model} (Ref: ${vehicle.listingRef})`)}
          onBrowseAll={() => scrollToQuote('vehicle_sourcing', 'All vehicle listings inquiry')}
        />

        {/* 7. WHY GAC AUTO TECH (4-icon dark benefit bar matching reference UI) */}
        <WhyGacAutoTech />

        {/* 8. VEHICLE SOURCING FEATURE (Tesla-style spotlight banner with Copart & IAAI support) */}
        <VehicleSourcingFeature
          onRequestSourcing={() => scrollToQuote('vehicle_sourcing')}
          onViewAvailable={() => scrollToSection('vehicles')}
        />

        {/* 9. ELECTRONICS SHOWCASE */}
        <ElectronicsShowcase
          onEnquirePrice={(product) => scrollToQuote('electronics_enquiry', `${product.title} (Ref: ${product.listingRef})`)}
          onViewDetails={(product) => setSelectedProduct(product)}
          onRequestWholesale={() => scrollToQuote('electronics_enquiry', 'Wholesale Electronics Bulk Order Enquiry')}
        />

        {/* 10. SHIPPING AND LOGISTICS */}
        <ShippingLogistics
          onRequestShippingQuote={() => scrollToQuote('shipping_quote')}
        />

        {/* 11. HOW IT WORKS */}
        <HowItWorks />

        {/* 12. ABOUT PREVIEW */}
        <AboutPreview
          onOpenAboutModal={() => setIsAboutOpen(true)}
        />

        {/* 13. QUOTE REQUEST SECTION */}
        <QuoteRequestSection
          initialService={quoteService}
          initialItemTitle={quoteItemTitle}
          onOpenPrivacy={() => setLegalModalType('privacy')}
        />

        {/* 14. FAQ ACCORDION */}
        <div id="faq">
          <FaqSection />
        </div>

        {/* 15. FINAL CALL TO ACTION */}
        <FinalCta
          onRequestQuote={() => scrollToQuote('vehicle_sourcing')}
        />
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

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
