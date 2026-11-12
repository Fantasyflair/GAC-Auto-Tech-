'use client';

import React, { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { VehicleListing } from '../types';
import { SOURCE_OPTIONS, availabilityLabel } from '../data/catalog';
import { useSite } from './SiteShell';
import { Breadcrumbs } from './Breadcrumbs';
import { VehicleTile } from './VehicleTile';
import { SelectField } from './SelectField';

type Sort = 'newest' | 'year' | 'az';

export const VehicleCatalog: React.FC<{ vehicles: VehicleListing[] }> = ({ vehicles }) => {
  const { requestQuote } = useSite();
  const [query, setQuery] = useState('');
  const [make, setMake] = useState('all');
  const [availability, setAvailability] = useState<'any' | VehicleListing['availability']>('any');
  const [source, setSource] = useState<'any' | VehicleListing['sourceType']>('any');
  const [damage, setDamage] = useState<'any' | 'clean' | 'damaged'>('any');
  const [sort, setSort] = useState<Sort>('newest');

  const makes = useMemo(() => Array.from(new Set(vehicles.map((v) => v.make))).sort(), [vehicles]);

  const results = useMemo(() => {
    const text = query.trim().toLowerCase();
    const list = vehicles.filter((v) => {
      // Sold cars only show when someone asks for them.
      if (availability === 'any' ? v.availability === 'Sold' : v.availability !== availability) return false;
      if (make !== 'all' && v.make !== make) return false;
      if (source !== 'any' && v.sourceType !== source) return false;
      if (damage === 'clean' && v.damage?.damaged !== false) return false;
      if (damage === 'damaged' && !v.damage?.damaged) return false;
      if (text && !`${v.title} ${v.make} ${v.model} ${v.category} ${v.year}`.toLowerCase().includes(text)) return false;
      return true;
    });
    if (sort === 'year') return [...list].sort((a, b) => b.year - a.year);
    if (sort === 'az') return [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [vehicles, query, make, availability, source, damage, sort]);

  const filtered = !!query || make !== 'all' || availability !== 'any' || source !== 'any' || damage !== 'any' || sort !== 'newest';
  const clear = () => {
    setQuery('');
    setMake('all');
    setAvailability('any');
    setSource('any');
    setDamage('any');
    setSort('newest');
  };

  return (
    <div className="ui-canvas pb-16 pt-24 text-[#111113] sm:pb-24 sm:pt-28 dark:text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'All vehicles' }]} />

        <div className="mt-5 border-b ui-divider pb-7">
          <h1 className="font-display text-3xl sm:text-5xl">All vehicles</h1>
          <p className="mt-3 max-w-2xl text-base text-muted">
            Every car we have listed, from auctions and our dealer network. Filter by make, availability, or source, then request a price.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          <label className="col-span-2 block min-w-0 sm:col-span-3 lg:col-span-2">
            <span className="mb-1.5 block text-sm font-bold">Search</span>
            <span className="relative block">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Make, model or year"
                className="w-full rounded-control border ui-divider bg-white py-3 pl-10 pr-10 text-base placeholder:text-[#78787f] focus:border-black/50 focus:outline-none dark:bg-[#151517] dark:focus:border-white/55"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-black/5 cursor-pointer dark:hover:bg-white/10"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </span>
          </label>
          <SelectField
            label="Make"
            value={make}
            onChange={setMake}
            options={[{ value: 'all', label: 'All makes' }, ...makes.map((m) => ({ value: m, label: m }))]}
          />
          <SelectField
            label="Availability"
            value={availability}
            onChange={(v) => setAvailability(v as typeof availability)}
            options={[
              { value: 'any', label: 'Any' },
              ...(['Available', 'Incoming', 'On request', 'Sold'] as const).map((a) => ({ value: a, label: availabilityLabel(a) })),
            ]}
          />
          <SelectField
            label="Source"
            value={source}
            onChange={(v) => setSource(v as typeof source)}
            options={[{ value: 'any', label: 'Any' }, ...SOURCE_OPTIONS.map((s) => ({ value: s, label: s }))]}
          />
          <SelectField
            label="Damage"
            value={damage}
            onChange={(v) => setDamage(v as typeof damage)}
            options={[
              { value: 'any', label: 'Any' },
              { value: 'clean', label: 'No damage' },
              { value: 'damaged', label: 'Damaged' },
            ]}
          />
          <SelectField
            label="Sort by"
            value={sort}
            onChange={(v) => setSort(v as Sort)}
            options={[
              { value: 'newest', label: 'Newest listed' },
              { value: 'year', label: 'Year: newest first' },
              { value: 'az', label: 'Name: A to Z' },
            ]}
          />
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-muted">
          <span>
            {results.length} vehicle{results.length === 1 ? '' : 's'}
          </span>
          {filtered && (
            <button type="button" onClick={clear} className="font-semibold underline-offset-4 hover:underline cursor-pointer">
              Clear filters
            </button>
          )}
        </div>

        {results.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 items-stretch gap-3 sm:gap-5 lg:grid-cols-4">
            {results.map((vehicle, i) => (
              <VehicleTile key={vehicle.id} vehicle={vehicle} index={i} />
            ))}
          </div>
        ) : (
          <div className="ui-well mt-8 flex flex-col items-center rounded-panel px-6 py-14 text-center">
            <Search className="w-6 h-6 text-muted" />
            <p className="mt-3 font-display text-lg">No vehicles match those filters</p>
            <p className="mt-1.5 max-w-sm text-base text-muted">We source to order, so tell us the car you're after and we'll find it.</p>
            <button
              type="button"
              onClick={() => requestQuote('vehicle_sourcing', query ? `Looking for: ${query}` : '')}
              className="btn-theme mt-5 rounded-control px-5 py-3 text-sm font-bold cursor-pointer"
            >
              Request a vehicle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
