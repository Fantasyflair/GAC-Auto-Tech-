import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/mockData';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const FaqSection: React.FC = () => {
  const { theme } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={`py-20 lg:py-28 border-b transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#0E0F13] border-[#1C1D24] text-white' : 'bg-white border-[#E4E6EB] text-[#18181B]'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D90816]" />
            <span className="text-xs font-bold tracking-[0.2em] text-[#8E939D] uppercase font-mono">
              COMMON QUESTIONS
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Frequently Asked Questions
          </h2>

          <p className="text-base text-[#8E939D]">
            Clear answers about sourcing scope, auctions, wholesale, and destinations.
          </p>
        </div>

        {/* Accessible Accordion List */}
        <div className="space-y-3.5">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            const contentId = `faq-content-${index}`;
            const headerId = `faq-header-${index}`;

            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-[#D90816]/40 shadow-md'
                    : theme === 'dark'
                      ? 'border-[#262732] bg-[#141419] hover:border-[#333544]'
                      : 'border-[#E4E6EB] bg-[#F6F7F9] hover:border-[#D0D4DC]'
                } ${
                  theme === 'dark' ? 'bg-[#141419]' : isOpen ? 'bg-white' : 'bg-[#F6F7F9]'
                }`}
              >
                <h3>
                  <button
                    type="button"
                    id={headerId}
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    onClick={() => toggle(index)}
                    className="w-full px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D90816]"
                  >
                    <span className="text-base sm:text-lg font-bold">
                      {item.question}
                    </span>
                    <span 
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-200 ${
                        isOpen 
                          ? 'rotate-180 bg-[#D90816] text-white border-[#D90816]' 
                          : theme === 'dark'
                            ? 'bg-[#1D1E26] text-[#BFC2C8] border-[#2E303D]'
                            : 'bg-white text-[#606570] border-[#E4E6EB]'
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
                    className={`px-6 pb-5 pt-1 text-sm sm:text-base leading-relaxed border-t ${
                      theme === 'dark' ? 'border-[#262732] text-[#BFC2C8]' : 'border-[#E4E6EB]/60 text-[#606570]'
                    }`}
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
