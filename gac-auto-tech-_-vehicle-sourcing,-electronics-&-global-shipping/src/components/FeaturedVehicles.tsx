import React from 'react';
import { motion } from 'motion/react';
import { SAMPLE_VEHICLES } from '../data/mockData';
import { VehicleListing } from '../types';
import { ArrowRight } from 'lucide-react';
import { Reveal, rise, trackSpotlight } from './Reveal';
import { AddToListButton } from './AddToListButton';

interface FeaturedVehiclesProps {
  onViewDetails: (vehicle: VehicleListing) => void;
  onRequestPrice: (vehicle: VehicleListing) => void;
  onBrowseAll: () => void;
}

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

export const FeaturedVehicles: React.FC<FeaturedVehiclesProps> = ({
  onViewDetails,
  onRequestPrice,
  onBrowseAll
}) => {
  return (
    <section id="vehicles" className="ui-canvas py-14 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="grid gap-5 border-b ui-divider pb-7 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-8">
            <p className="eyebrow text-muted">Vehicles</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">
              Cars sourced, inspected and shipped
            </h2>
            <p className="mt-3 max-w-xl text-base text-muted">
              Luxury sedans, electrics and performance SUVs from Copart, IAAI and our dealer network.
            </p>
          </div>

          <div className="lg:col-span-4 lg:text-right">
            <button
              type="button"
              onClick={onBrowseAll}
              className="group inline-flex items-center gap-2 rounded-full btn-theme px-5 py-3 text-sm font-bold cursor-pointer"
            >
              Browse all vehicles
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 items-stretch gap-3 sm:gap-5 lg:grid-cols-4">
          {SAMPLE_VEHICLES.map((vehicle, idx) => (
            <motion.article
              key={vehicle.id}
              onMouseMove={trackSpotlight}
              {...rise(idx)}
              className="spotlight ui-card group flex h-full flex-col overflow-hidden rounded-panel"
            >
              {/* Image sits flush in the card rather than as a second rounded box inside it. */}
              <button
                type="button"
                onClick={() => onViewDetails(vehicle)}
                className="ui-well relative block aspect-[4/3] w-full overflow-hidden cursor-pointer"
                aria-label={`View details for ${vehicle.title}`}
              >
                <img
                  src={vehicle.imageUrl}
                  alt={vehicle.title}
                  className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                {vehicle.availability !== 'Available' && (
                  <span className="absolute left-2 top-2 rounded-control bg-[#111113] px-2 py-0.5 text-xs font-bold text-white">
                    {vehicle.availability}
                  </span>
                )}
              </button>

              <div className="flex flex-1 flex-col p-3 sm:p-5">
                <p className="truncate text-xs font-semibold text-muted">
                  {vehicle.sourceType} · {vehicle.year}
                </p>
                <h3 className="clamp-2 mt-1.5 min-h-[2.4em] font-display text-base leading-snug sm:text-lg">
                  {vehicle.title}
                </h3>

                {/* Phones show two cards per row, so the spec sheet waits for the details view. */}
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
                    <button
                      type="button"
                      onClick={() => onViewDetails(vehicle)}
                      className="hidden rounded-control border ui-divider px-3 py-2.5 text-sm font-bold cursor-pointer transition-colors hover:bg-black/5 sm:block dark:hover:bg-white/10"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => onRequestPrice(vehicle)}
                      className="rounded-control btn-theme px-2 py-2.5 text-sm font-bold cursor-pointer"
                    >
                      Request price
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
