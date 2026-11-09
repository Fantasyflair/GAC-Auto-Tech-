import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/mockData';
import { ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-14 text-[#111113] sm:py-20 lg:py-24 dark:bg-[#09090B] dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
          {/* Intro sits beside the list on desktop instead of leaving a centred gap. */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow text-muted">Common questions</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">Frequently asked questions</h2>
              <p className="mt-4 text-base text-muted">
                Clear answers about sourcing scope, auctions, wholesale, and destinations.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="border-t ui-divider">
              {FAQ_ITEMS.map((item, index) => {
                const isOpen = openIndex === index;
                const contentId = `faq-content-${index}`;
                const headerId = `faq-header-${index}`;

                return (
                  <div key={index} className="border-b ui-divider">
                    <h3>
                      <button
                        type="button"
                        id={headerId}
                        aria-expanded={isOpen}
                        aria-controls={contentId}
                        onClick={() => toggle(index)}
                        className="flex w-full items-center justify-between gap-4 py-5 text-left cursor-pointer"
                      >
                        <span className="font-display text-lg">{item.question}</span>
                        <span
                          className={`ui-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                          aria-hidden="true"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </span>
                      </button>
                    </h3>

                    {isOpen && (
                      <div
                        id={contentId}
                        role="region"
                        aria-labelledby={headerId}
                        className="max-w-2xl pb-6 text-base text-muted"
                      >
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
