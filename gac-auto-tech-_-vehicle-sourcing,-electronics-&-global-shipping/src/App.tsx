'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Hero } from './components/Hero';
import { Reveal } from './components/Reveal';
import { Marquee } from './components/Marquee';
import { BentoHome } from './components/BentoHome';
import { ElectronicsShop } from './components/ElectronicsShop';
import { FeaturedVehicles } from './components/FeaturedVehicles';
import { QuoteRequestSection } from './components/QuoteRequestSection';
import { FaqSection } from './components/FaqSection';
import { scrollToId, useSite } from './components/SiteShell';

export default function App() {
  const { requestQuote, goToSection, openPrivacy, quotePrefill } = useSite();

  // Arriving from another page with a section in the URL (e.g. /#quote-form): scroll once it has rendered.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const timer = window.setTimeout(() => scrollToId(id), 150);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <Hero onRequestQuote={requestQuote} onNavigate={goToSection} />

      {/* Vehicles lead the page: they are the service most visitors arrive for. */}
      <FeaturedVehicles />

      <Marquee />

      <BentoHome
        onSelectService={(service) => requestQuote(service)}
        onExploreVehicles={() => goToSection('vehicles')}
      />

      <ElectronicsShop onRequestProduct={() => requestQuote('electronics_enquiry', '')} />

      <Reveal>
        <QuoteRequestSection
          initialService={quotePrefill.service}
          initialItemTitle={quotePrefill.details}
          onOpenPrivacy={openPrivacy}
        />
      </Reveal>

      <Reveal>
        <div id="faq">
          <FaqSection />
        </div>
      </Reveal>
    </>
  );
}
