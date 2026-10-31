import React from 'react';
import { ClipboardList, Search, CheckSquare, Truck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Share Your Requirements',
      description: 'Tell us what you want to buy or ship, your budget, and your destination.',
      icon: ClipboardList
    },
    {
      num: '02',
      title: 'Review Your Options',
      description: 'We discuss suitable sourcing or shipping options and the relevant costs.',
      icon: Search
    },
    {
      num: '03',
      title: 'Confirm the Details',
      description: 'Review the agreed scope, payment arrangements, and next steps before proceeding.',
      icon: CheckSquare
    },
    {
      num: '04',
      title: 'Coordinate Your Order or Shipment',
      description: 'We help arrange the agreed purchase, sourcing, or logistics service.',
      icon: Truck
    }
  ];

  return (
    <section className="bg-[#F6F7F9] text-[#18181B] py-20 lg:py-28 border-b border-[#E4E6EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full dot-accent" />
            <span className="text-xs font-bold tracking-[0.2em] text-[#606570] uppercase">
              PROCESS
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#18181B] mb-4 text-balance">
            Tell Us What You Need. We’ll Help With the Next Steps.
          </h2>

          <p className="text-base text-[#606570]">
            A clear, straightforward coordination process from initial enquiry to final delivery.
          </p>
        </div>

        {/* 4 Steps Grid: 4 columns on desktop, clean vertical sequence on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E4E6EB] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#D0D4DC] transition-all relative flex flex-col justify-between group"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-bold text-accent tracking-tight">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#F6F7F9] border border-[#E4E6EB] flex items-center justify-center text-[#18181B] group-hover:text-accent group-hover:bg-[#F4F4F5] transition-colors">
                      <Icon className="w-5 h-5 stroke-[1.8]" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#18181B] mb-3 leading-snug">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#606570] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Subtle bottom progress bar highlight */}
                <div className="mt-6 pt-4 border-t border-[#F0F2F5]">
                  <div className="w-8 h-1 bg-[#E4E6EB] rounded-full group-hover:w-full group-hover:bg-[#111113] transition-all duration-300" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
