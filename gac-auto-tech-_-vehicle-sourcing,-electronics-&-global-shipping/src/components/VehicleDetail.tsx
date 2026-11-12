'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, AlertTriangle, ArrowRight, Check, Plus, ShieldCheck } from 'lucide-react';
import { VehicleListing } from '../types';
import { availabilityLabel, vehicleImages, vehicleQuoteDetails } from '../data/catalog';
import { VehicleGallery } from './VehicleGallery';
import { VehicleEnquiryForm } from './VehicleEnquiryForm';
import { useEnquiryList } from '../context/EnquiryListContext';
import { useSite } from './SiteShell';
import { Breadcrumbs } from './Breadcrumbs';
import { VehicleTile } from './VehicleTile';
import { WhatsAppIcon } from './WhatsAppIcon';

export const VehicleDetail: React.FC<{ vehicle: VehicleListing; related: VehicleListing[] }> = ({ vehicle, related }) => {
  const { whatsappUrl } = useSite();
  const damage = vehicle.damage;
  const cart = useEnquiryList();
  const inCart = cart.has(vehicle.id);

  const toggleCart = () =>
    inCart
      ? cart.remove(vehicle.id)
      : cart.add({
          id: vehicle.id,
          title: vehicle.title,
          reference: vehicle.listingRef,
          imageUrl: vehicle.imageUrl,
          service: 'vehicle_sourcing',
        });

  const specs: [string, string][] = [
    ['Year', String(vehicle.year)],
    ['Mileage', vehicle.specs.mileage ?? '—'],
    ['Engine', vehicle.specs.engine ?? 'Standard'],
    ['Transmission', vehicle.specs.transmission],
    ['Drivetrain', vehicle.specs.drivetrain],
    ['Fuel type', vehicle.specs.fuelType],
    ['Body', vehicle.category],
    ['Condition', vehicle.condition],
    ...(damage ? [['Damage', damage.damaged ? (damage.areas.join(', ') || 'Yes, see report') : 'None'] as [string, string]] : []),
    ['Source', vehicle.sourceType],
    ['Reference', vehicle.listingRef],
  ];

  return (
    <div className="ui-canvas pb-16 pt-24 text-[#111113] sm:pb-24 sm:pt-28 dark:text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'All vehicles', href: '/vehicles' },
            { label: vehicle.title },
          ]}
        />

        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <VehicleGallery images={vehicleImages(vehicle)} title={vehicle.title} />
            <p className="mt-6 text-base text-muted">{vehicle.notes}</p>

            {damage && (
              <section className="ui-card mt-6 rounded-panel p-5 sm:p-6" aria-labelledby="damage-heading">
                <h2 id="damage-heading" className="flex items-center gap-2 font-display text-lg">
                  {damage.damaged ? <AlertTriangle className="h-5 w-5 text-signal" /> : <ShieldCheck className="h-5 w-5" />}
                  {damage.damaged ? 'Damage report' : 'No damage reported'}
                </h2>
                {damage.damaged ? (
                  <>
                    {damage.areas.length > 0 && (
                      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Damaged areas">
                        {damage.areas.map((area) => (
                          <li key={area} className="rounded-control border ui-divider px-3 py-1.5 text-sm font-semibold">
                            {area}
                          </li>
                        ))}
                      </ul>
                    )}
                    {damage.notes && <p className="mt-4 text-base">{damage.notes}</p>}
                    <p className="mt-4 text-sm text-muted">Ask us for the full inspection photos and repair estimate before you commit.</p>
                  </>
                ) : (
                  <p className="mt-2 text-base text-muted">This vehicle has no known body, mechanical or flood damage.</p>
                )}
              </section>
            )}
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow text-muted">
              {vehicle.sourceType} · {vehicle.year}
            </p>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl">{vehicle.title}</h1>
            <p className="mt-3 text-base text-muted">
              {vehicle.category} · {availabilityLabel(vehicle.availability)}
            </p>

            <div className="mt-6 border-y ui-divider py-5">
              <p className="text-sm text-muted">Price</p>
              <p className="mt-0.5 font-display text-2xl font-bold">On enquiry</p>
              <p className="mt-1 text-sm text-muted">Includes auction fees and shipping to your port, confirmed before bidding.</p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href="#enquire"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('enquire')?.scrollIntoView({ behavior: 'smooth' });
                  window.setTimeout(() => document.querySelector<HTMLInputElement>('#enquire input')?.focus({ preventScroll: true }), 500);
                }}
                className="btn-theme inline-flex w-full items-center justify-center gap-2 rounded-control px-5 py-3.5 text-sm font-bold"
              >
                Request price
                <ArrowRight className="w-4 h-4" />
              </a>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={toggleCart}
                  aria-pressed={inCart}
                  className="inline-flex items-center justify-center gap-2 rounded-control border border-black/20 px-4 py-3 text-sm font-bold transition-colors hover:bg-black/5 cursor-pointer dark:border-white/25 dark:hover:bg-white/10"
                >
                  {inCart ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {inCart ? 'In cart' : 'Add to cart'}
                </button>
                <a
                  href={whatsappUrl(`Hello GAC Auto Tech, I'd like pricing and shipping for ${vehicleQuoteDetails(vehicle)}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-control border border-black/20 px-4 py-3 text-sm font-bold transition-colors hover:bg-black/5 dark:border-white/25 dark:hover:bg-white/10"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
            </div>

            <h2 className="eyebrow mt-8 text-muted">Specifications</h2>
            <dl className="mt-3 border-t ui-divider text-sm">
              {specs.map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between gap-4 border-b ui-divider py-2.5">
                  <dt className="shrink-0 text-muted">{label}</dt>
                  <dd className="text-right font-bold">{value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-5 flex items-start gap-2 text-sm text-muted">
              <AlertCircle className="mt-0.5 w-4 h-4 shrink-0" />
              <span>Final pricing depends on auction bids, fees, and destination shipping.</span>
            </p>
          </div>
        </div>

        <section id="enquire" className="mt-14 scroll-mt-28 lg:max-w-3xl" aria-labelledby="enquire-heading">
          <h2 id="enquire-heading" className="font-display text-2xl sm:text-3xl">Enquire about this vehicle</h2>
          <p className="mt-1.5 text-base text-muted">Send your details and we'll reply with the full landed price to your port.</p>
          <div className="mt-5">
            <VehicleEnquiryForm vehicle={vehicle} />
          </div>
        </section>

        <section className="mt-16 border-t ui-divider pt-10" aria-labelledby="related-heading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-muted">Related</p>
              <h2 id="related-heading" className="mt-2 font-display text-2xl sm:text-3xl">More vehicles like this</h2>
            </div>
            <Link href="/vehicles" className="group inline-flex items-center gap-1.5 text-sm font-bold">
              All vehicles
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          {related.length > 0 && (
            <div className="mt-6 grid grid-cols-2 items-stretch gap-3 sm:gap-5 lg:grid-cols-3">
              {related.map((item, i) => (
                <VehicleTile key={item.id} vehicle={item} index={i} />
              ))}
            </div>
          )}
          <div className="mt-10 flex justify-center">
            <Link
              href="/vehicles"
              className="btn-theme inline-flex items-center gap-2 rounded-control px-6 py-3.5 text-sm font-bold"
            >
              View all vehicles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
