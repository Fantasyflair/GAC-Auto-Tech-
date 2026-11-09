'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ServiceType } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Header } from './Header';
import { Footer } from './Footer';
import { FloatingWhatsApp } from './FloatingWhatsApp';
import { AboutModal } from './AboutModal';
import { LegalModal } from './LegalModal';
import { SignInModal } from './SignInModal';
import { EnquiryDrawer } from './EnquiryDrawer';

const HEADER_OFFSET = 84;

/** Smooth-scrolls to a section on the current page. Returns false when the section isn't on it. */
export const scrollToId = (id: string) => {
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return true;
  }
  const el = document.getElementById(id);
  if (!el) return false;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET, behavior: 'smooth' });
  return true;
};

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

interface QuotePrefill {
  service: ServiceType;
  details: string;
}

interface SiteContextValue {
  /** Pre-fills the enquiry form and takes the visitor to it, from any page. */
  requestQuote: (service?: ServiceType, details?: string) => void;
  /** Scrolls to a home-page section, navigating home first when needed. */
  goToSection: (id: string) => void;
  openPrivacy: () => void;
  quotePrefill: QuotePrefill;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export const useSite = () => {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used inside SiteShell');
  return ctx;
};

export const SiteShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const onHome = pathname === '/';

  const [quotePrefill, setQuotePrefill] = useState<QuotePrefill>({ service: 'vehicle_sourcing', details: '' });
  const [aboutOpen, setAboutOpen] = useState(false);
  const [legal, setLegal] = useState<'privacy' | 'terms' | null>(null);
  const [signInOpen, setSignInOpen] = useState(false);

  const goToSection = useCallback(
    (id: string) => {
      if (onHome && scrollToId(id)) return;
      router.push(id === 'top' ? '/' : `/#${id}`);
    },
    [onHome, router]
  );

  const requestQuote = useCallback(
    (service: ServiceType = 'vehicle_sourcing', details = '') => {
      setQuotePrefill({ service, details });
      goToSection('quote-form');
    },
    [goToSection]
  );

  const value = useMemo(
    () => ({ requestQuote, goToSection, openPrivacy: () => setLegal('privacy'), quotePrefill }),
    [requestQuote, goToSection, quotePrefill]
  );

  return (
    <SiteContext.Provider value={value}>
      <div
        id="top"
        className={`flex min-h-screen flex-col font-sans ${theme === 'dark' ? 'bg-[#09090B] text-white' : 'bg-white text-[#18181B]'}`}
      >
        <Header
          onRequestQuote={requestQuote}
          onNavigate={goToSection}
          onNavigateAbout={() => setAboutOpen(true)}
          onOpenSignIn={() => setSignInOpen(true)}
          onSearch={(query) => requestQuote(guessService(query), `Looking for: ${query}`)}
        />

        <main className="flex-1">{children}</main>

        <Footer
          onNavigate={goToSection}
          onNavigateAbout={() => setAboutOpen(true)}
          onSelectService={(service) => requestQuote(service)}
          onOpenPrivacy={() => setLegal('privacy')}
          onOpenTerms={() => setLegal('terms')}
        />

        <FloatingWhatsApp />

        <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} onRequestQuote={() => requestQuote('vehicle_sourcing')} />
        <LegalModal type={legal} onClose={() => setLegal(null)} />
        <SignInModal isOpen={signInOpen} onClose={() => setSignInOpen(false)} />
        <EnquiryDrawer onRequestQuote={requestQuote} />
      </div>
    </SiteContext.Provider>
  );
};
