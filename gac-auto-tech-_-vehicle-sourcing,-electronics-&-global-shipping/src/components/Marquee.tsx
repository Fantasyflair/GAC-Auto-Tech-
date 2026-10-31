import React from 'react';

const items = [
  'Mercedes-Benz',
  'BMW',
  'Audi',
  'Porsche',
  'Lexus',
  'Toyota',
  'Copart',
  'IAAI',
  'Canada to Ghana',
  'USA to Ghana',
  'UK to West Africa',
  'Wholesale electronics',
];

export const Marquee: React.FC = () => (
  <div className="marquee surface-ink group relative overflow-hidden border-y border-white/10 py-4 text-white">
    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#0b0b0d] to-transparent" />
    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#0b0b0d] to-transparent" />
    <div className="marquee-track flex w-max items-center group-hover:[animation-play-state:paused]">
      {[...items, ...items].map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center whitespace-nowrap px-6 font-display text-base font-semibold uppercase tracking-[0.14em] text-white/85">
          {item}
          <span className="ml-12 h-1.5 w-1.5 rounded-full accent-bar" aria-hidden="true" />
        </span>
      ))}
    </div>
  </div>
);
