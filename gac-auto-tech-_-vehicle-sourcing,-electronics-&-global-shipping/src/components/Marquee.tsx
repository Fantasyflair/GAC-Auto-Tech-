import React from 'react';

const items = [
  'Mercedes-Benz',
  'BMW',
  'Audi',
  'Porsche',
  'Lexus',
  'Toyota',
  'Apple',
  'Samsung',
  'Sony',
];

// Repeated so one row is always wider than the widest screen and the loop never shows a gap.
const rowItems = [...items, ...items];

const Row: React.FC<{ hidden?: boolean }> = ({ hidden }) => (
  <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
    {rowItems.map((item, i) => (
      <li key={`${item}-${i}`} aria-hidden={i >= items.length || undefined} className="flex items-center whitespace-nowrap">
        <span className="px-6 font-display text-lg font-bold tracking-tight sm:px-8 sm:text-2xl">{item}</span>
        <span className="h-1.5 w-1.5 rotate-45 bg-white/30" aria-hidden />
      </li>
    ))}
  </ul>
);

/* The list is rendered twice and shifted by half its width, so the loop has no visible seam. */
export const Marquee: React.FC = () => (
  <div className="marquee overflow-hidden border-y border-white/10 bg-[#0b0b0d] py-5 text-white sm:py-6" aria-label="Brands we source">
    <div className="marquee-track flex w-max">
      <Row />
      <Row hidden />
    </div>
  </div>
);
