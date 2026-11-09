'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { VehicleListing } from '../types';
import { vehicleQuoteDetails } from '../data/catalog';
import { useSite } from './SiteShell';
import { AddToListButton } from './AddToListButton';
import { rise, trackSpotlight } from './Reveal';

const Spec: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="min-w-0">
    <dt className="text-xs text-muted">{label}</dt>
    <dd className="truncate text-sm font-semibold">{value}</dd>
  </div>
);

/* Auction listings spell drivetrains a dozen ways; the card only has room for one word. */
const shortDrivetrain = (value: string) => {
  if (/all-wheel|awd|quattro|4matic|xdrive|4wd/i.test(value)) return 'All-wheel';
  if (/rear-wheel|rwd/i.test(value)) return 'Rear-wheel';
  if (/front-wheel|fwd/i.test(value)) return 'Front-wheel';
  return value.split(' ')[0];
};

/* Condition strings carry a headline plus notes; the card shows only the headline. */
const shortCondition = (value: string) => {
  const headline = value.split('·')[0].trim();
  if (/clean title/i.test(headline)) return 'Clean';
  if (/run ?(&|and) ?drive/i.test(headline)) return 'Run & drive';
  if (/pristine/i.test(headline)) return 'Pristine';
  return headline.split(' ')[0];
};

export const VehicleTile: React.FC<{ vehicle: VehicleListing; index?: number }> = ({ vehicle, index = 0 }) => {
  const { requestQuote } = useSite();
  const href = `/vehicles/${vehicle.id}`;

  return (
    <motion.article
      onMouseMove={trackSpotlight}
      {...rise(index % 4)}
      className="spotlight ui-card group flex h-full flex-col overflow-hidden rounded-panel"
    >
      <Link href={href} className="ui-well relative block aspect-[4/3] w-full overflow-hidden" aria-label={`View ${vehicle.title}`}>
        <img
          src={vehicle.imageUrl}
          alt={vehicle.title}
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <p className="truncate text-xs font-semibold text-muted">
          {vehicle.sourceType} · {vehicle.year}
        </p>
        <h3 className="clamp-2 mt-1.5 min-h-[2.4em] font-display text-base leading-snug sm:text-lg">
          <Link href={href} className="underline-offset-4 hover:underline">
            {vehicle.title}
          </Link>
        </h3>

        {/* Phones show two cards per row, so the spec sheet waits for the details page. */}
        <dl className="mt-4 hidden grid-cols-2 gap-x-4 gap-y-3 border-t ui-divider pt-4 sm:grid">
          <Spec label="Mileage" value={vehicle.specs.mileage ?? '—'} />
          <Spec label="Fuel" value={vehicle.specs.fuelType} />
          <Spec label="Drivetrain" value={shortDrivetrain(vehicle.specs.drivetrain)} />
          <Spec label="Condition" value={shortCondition(vehicle.condition)} />
        </dl>

        <div className="mt-auto pt-3 sm:pt-5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs text-muted">Pricing</p>
              <p className="text-sm font-bold">On enquiry</p>
            </div>
            <AddToListButton
              item={{
                id: vehicle.id,
                title: vehicle.title,
                reference: vehicle.listingRef,
                imageUrl: vehicle.imageUrl,
                service: 'vehicle_sourcing',
              }}
            />
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Link
              href={href}
              className="hidden rounded-control border ui-divider px-3 py-2.5 text-center text-sm font-bold transition-colors hover:bg-black/5 sm:block dark:hover:bg-white/10"
            >
              Details
            </Link>
            <button
              type="button"
              onClick={() => requestQuote('vehicle_sourcing', vehicleQuoteDetails(vehicle))}
              className="rounded-control btn-theme px-2 py-2.5 text-sm font-bold cursor-pointer"
            >
              Request price
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
