import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { VehicleListing } from '../types';
import { Reveal } from './Reveal';
import { VehicleTile } from './VehicleTile';

const FEATURED_COUNT = 4;

export const FeaturedVehicles: React.FC<{ vehicles: VehicleListing[] }> = ({ vehicles }) => {
  const featured = vehicles.filter((v) => v.availability !== 'Sold').slice(0, FEATURED_COUNT);

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
              Luxury sedans, electrics and performance SUVs from auctions and our dealer network.
            </p>
          </div>

          <div className="lg:col-span-4 lg:text-right">
            <Link
              href="/vehicles"
              className="group inline-flex items-center gap-2 rounded-control btn-theme px-5 py-3 text-sm font-bold"
            >
              Browse all vehicles
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        {featured.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 items-stretch gap-3 sm:gap-5 lg:grid-cols-4">
            {featured.map((vehicle, idx) => (
              <VehicleTile key={vehicle.id} vehicle={vehicle} index={idx} />
            ))}
          </div>
        ) : (
          <p className="ui-well mt-8 rounded-panel px-6 py-12 text-center text-base text-muted">
            New vehicles are being added. Tell us what you're looking for and we'll source it.
          </p>
        )}
      </div>
    </section>
  );
};
