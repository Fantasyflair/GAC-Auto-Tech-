import React from 'react';
import { Target, Users, GitFork, MessageSquare } from 'lucide-react';

export const WhyGacAutoTech: React.FC = () => {
  const benefits = [
    {
      title: 'Budget-Focused Sourcing',
      description: 'Start with your requirements and spending priorities.',
      icon: Target
    },
    {
      title: 'Retail & Wholesale Support',
      description: 'Enquiries welcome from individuals and businesses.',
      icon: Users
    },
    {
      title: 'Connected Services',
      description: 'Source vehicles, electronics, and goods with direct shipping.',
      icon: GitFork
    },
    {
      title: 'Direct Communication',
      description: 'Ask questions and discuss requirements through WhatsApp.',
      icon: MessageSquare
    }
  ];

  return (
    <section className="bg-[#09090B] text-white py-12 border-b border-[#1C1D24]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Line-Art Benefit Blocks in Horizontal Row (Exact match to reference UI) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#22232B]">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={idx}
                className="flex items-start gap-4 pt-6 sm:pt-0 sm:px-4 first:px-0 group"
              >
                <div className="w-10 h-10 rounded-full border border-[#272832] flex items-center justify-center text-white/90 group-hover:text-accent group-hover:border-[#d9c4c4] transition-colors shrink-0">
                  <Icon className="w-5 h-5 stroke-[1.5]" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white mb-1 leading-snug">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-[#8E939D] leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
