'use client';

import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { SAMPLE_ELECTRONICS, SAMPLE_VEHICLES } from '../data/mockData';
import { ELECTRONICS_CATEGORIES, categoryLabel } from '../data/catalog';
import { useSite } from './SiteShell';
import { Breadcrumbs } from './Breadcrumbs';
import { ProductTile } from './ProductTile';
import { VehicleTile } from './VehicleTile';
import { SelectField, SelectOption } from './SelectField';

type Department = 'all' | 'vehicles' | 'electronics';
type Availability = 'any' | 'Available' | 'Incoming' | 'On request' | 'wholesale';
type Sort = 'featured' | 'az' | 'za';

const MAKES = Array.from(new Set(SAMPLE_VEHICLES.map((v) => v.make))).sort();

// Category values carry their department so one dropdown can hold makes and product types.
const vehicleCategoryOptions: SelectOption[] = MAKES.map((make) => ({ value: `veh:${make}`, label: make }));
const electronicsCategoryOptions: SelectOption[] = ELECTRONICS_CATEGORIES.map((c) => ({ value: `elec:${c.id}`, label: c.label }));

const byTitle = (sort: Sort) => (a: { title: string }, b: { title: string }) =>
  sort === 'az' ? a.title.localeCompare(b.title) : sort === 'za' ? b.title.localeCompare(a.title) : 0;

/* Keyed on the URL so following a link like "All vehicles" while already here resets the filters. */
export const ProductCatalog: React.FC = () => {
  const params = useSearchParams();
  return <Catalog key={params.toString()} params={params} />;
};

const Catalog: React.FC<{ params: { get: (name: string) => string | null } }> = ({ params }) => {
  const { requestQuote } = useSite();

  const initialDept = params.get('dept');
  const [department, setDepartment] = useState<Department>(
    initialDept === 'vehicles' || initialDept === 'electronics' ? initialDept : 'all'
  );
  const [category, setCategory] = useState(params.get('category') ?? 'all');
  const [availability, setAvailability] = useState<Availability>('any');
  const [sort, setSort] = useState<Sort>('featured');
  const [query, setQuery] = useState(params.get('q') ?? '');

  const categoryOptions: SelectOption[] = [
    { value: 'all', label: 'All categories' },
    ...(department === 'electronics'
      ? electronicsCategoryOptions
      : department === 'vehicles'
        ? vehicleCategoryOptions
        : [
            ...vehicleCategoryOptions.map((o) => ({ ...o, label: `Vehicles · ${o.label}` })),
            ...electronicsCategoryOptions.map((o) => ({ ...o, label: `Electronics · ${o.label}` })),
          ]),
  ];

  const changeDepartment = (value: Department) => {
    setDepartment(value);
    const prefix = value === 'vehicles' ? 'veh:' : value === 'electronics' ? 'elec:' : '';
    if (prefix && !category.startsWith(prefix)) setCategory('all');
    if (value === 'vehicles' && availability === 'wholesale') setAvailability('any');
  };

  const text = query.trim().toLowerCase();

  const vehicles = useMemo(() => {
    if (department === 'electronics' || category.startsWith('elec:') || availability === 'wholesale') return [];
    return SAMPLE_VEHICLES.filter((v) => {
      if (category.startsWith('veh:') && v.make !== category.slice(4)) return false;
      if (availability !== 'any' && v.availability !== availability) return false;
      if (text && !`${v.title} ${v.make} ${v.model} ${v.category} ${v.sourceType}`.toLowerCase().includes(text)) return false;
      return true;
    }).sort(byTitle(sort));
  }, [department, category, availability, text, sort]);

  const electronics = useMemo(() => {
    if (department === 'vehicles' || category.startsWith('veh:')) return [];
    return SAMPLE_ELECTRONICS.filter((p) => {
      if (category.startsWith('elec:') && p.category !== category.slice(5)) return false;
      if (availability === 'wholesale' && !p.wholesaleEligible) return false;
      if (availability !== 'any' && availability !== 'wholesale' && p.availability !== availability) return false;
      if (text && !`${p.title} ${p.specs.join(' ')} ${categoryLabel(p.category)}`.toLowerCase().includes(text)) return false;
      return true;
    }).sort(byTitle(sort));
  }, [department, category, availability, text, sort]);

  const total = vehicles.length + electronics.length;
  const filtered = department !== 'all' || category !== 'all' || availability !== 'any' || sort !== 'featured' || !!query;

  const clear = () => {
    setDepartment('all');
    setCategory('all');
    setAvailability('any');
    setSort('featured');
    setQuery('');
  };

  return (
    <div className="ui-canvas pb-16 pt-24 text-[#111113] sm:pb-24 sm:pt-28 dark:text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'All products' }]} />

        <div className="mt-5 border-b ui-divider pb-7">
          <h1 className="font-display text-3xl sm:text-5xl">All products</h1>
          <p className="mt-3 max-w-2xl text-base text-muted">
            Every vehicle and electronics listing in one place. Filter by department, category, or availability, then request a price.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-6">
          <label className="col-span-2 block min-w-0">
            <span className="mb-1.5 block text-sm font-bold">Search</span>
            <span className="relative block">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Make, model or product"
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
            label="Department"
            value={department}
            onChange={(v) => changeDepartment(v as Department)}
            options={[
              { value: 'all', label: 'Everything' },
              { value: 'vehicles', label: `Vehicles (${SAMPLE_VEHICLES.length})` },
              { value: 'electronics', label: `Electronics (${SAMPLE_ELECTRONICS.length})` },
            ]}
          />
          <SelectField label="Category" value={category} onChange={setCategory} options={categoryOptions} />
          <SelectField
            label="Availability"
            value={availability}
            onChange={(v) => setAvailability(v as Availability)}
            options={[
              { value: 'any', label: 'Any' },
              { value: 'Available', label: 'In stock' },
              { value: 'Incoming', label: 'Arriving soon' },
              { value: 'On request', label: 'Sourced to order' },
              ...(department === 'vehicles' ? [] : [{ value: 'wholesale', label: 'Wholesale ready' }]),
            ]}
          />
          <SelectField
            label="Sort by"
            value={sort}
            onChange={(v) => setSort(v as Sort)}
            options={[
              { value: 'featured', label: 'Featured' },
              { value: 'az', label: 'Name: A to Z' },
              { value: 'za', label: 'Name: Z to A' },
            ]}
          />
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-muted">
          <span>
            {total} item{total === 1 ? '' : 's'}
          </span>
          {filtered && (
            <button type="button" onClick={clear} className="font-semibold underline-offset-4 hover:underline cursor-pointer">
              Clear filters
            </button>
          )}
        </div>

        {vehicles.length > 0 && (
          <section className="mt-8" aria-labelledby="catalog-vehicles">
            <h2 id="catalog-vehicles" className="font-display text-2xl">
              Vehicles <span className="text-muted">({vehicles.length})</span>
            </h2>
            <div className="mt-5 grid grid-cols-2 items-stretch gap-3 sm:gap-5 lg:grid-cols-4">
              {vehicles.map((vehicle, i) => (
                <VehicleTile key={vehicle.id} vehicle={vehicle} index={i} />
              ))}
            </div>
          </section>
        )}

        {electronics.length > 0 && (
          <section className="mt-12" aria-labelledby="catalog-electronics">
            <h2 id="catalog-electronics" className="font-display text-2xl">
              Electronics <span className="text-muted">({electronics.length})</span>
            </h2>
            <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4">
              {electronics.map((product, i) => (
                <ProductTile key={product.id} product={product} index={i} />
              ))}
            </div>
          </section>
        )}

        {total === 0 && (
          <div className="ui-well mt-8 flex flex-col items-center rounded-panel px-6 py-14 text-center">
            <Search className="w-6 h-6 text-muted" />
            <p className="mt-3 font-display text-lg">Nothing matches those filters</p>
            <p className="mt-1.5 max-w-sm text-base text-muted">We source to order, so tell us exactly what you're after and we'll find it.</p>
            <button
              type="button"
              onClick={() => requestQuote(department === 'vehicles' ? 'vehicle_sourcing' : 'electronics_enquiry', query ? `Looking for: ${query}` : '')}
              className="btn-theme mt-5 rounded-control px-5 py-3 text-sm font-bold cursor-pointer"
            >
              Request it
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
