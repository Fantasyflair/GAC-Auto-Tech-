import React from 'react';

const brands = ['Mercedes-Benz', 'BMW', 'Audi', 'Porsche', 'Lexus', 'Toyota'];

const sources = ['Copart', 'IAAI', 'Dealer network'];

const routes = ['Canada to Ghana', 'USA to Ghana', 'UK to West Africa'];

const Group: React.FC<{ label: string; items: string[] }> = ({ label, items }) => (
  <div>
    <p className="eyebrow text-muted">{label}</p>
    <p className="mt-2 font-display text-base font-semibold text-[#111113] dark:text-white">
      {items.join(' · ')}
    </p>
  </div>
);

export const Marquee: React.FC = () => (
  <div className="border-y ui-divider bg-white dark:bg-[#09090B]">
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-7 sm:grid-cols-3 sm:gap-8 sm:px-6 lg:px-8">
      <Group label="Makes we source" items={brands} />
      <Group label="Auctions and dealers" items={sources} />
      <Group label="Shipping routes" items={routes} />
    </div>
  </div>
);
