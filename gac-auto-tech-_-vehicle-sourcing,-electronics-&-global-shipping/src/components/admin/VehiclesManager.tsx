'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, CarFront, ExternalLink, Loader2, Pencil, Plus, Search, ShieldCheck, Trash2 } from 'lucide-react';
import { VehicleDamage, VehicleImage, VehicleListing } from '../../types';
import { AVAILABILITY_OPTIONS, DAMAGE_AREAS, SOURCE_OPTIONS, availabilityLabel, damageSummary, vehicleImages } from '../../data/catalog';
import { SelectField } from '../SelectField';
import { GalleryField } from './GalleryField';
import { EmptyState, Panel, Segmented, useAdminUi } from './ui';
import { adminFetch, fieldClass, jsonInit, labelClass } from './adminApi';

type Draft = Omit<VehicleListing, 'id' | 'year' | 'imageUrl' | 'imagePublicId' | 'images' | 'damage'> & {
  year: string;
  images: VehicleImage[];
  damage: VehicleDamage;
};

const emptyDraft = (): Draft => ({
  title: '',
  make: '',
  model: '',
  year: String(new Date().getFullYear()),
  category: '',
  specs: { mileage: '', engine: '', transmission: '', drivetrain: '', fuelType: '' },
  condition: '',
  damage: { damaged: false, areas: [], notes: '' },
  availability: 'Available',
  listingRef: '',
  images: [],
  notes: '',
  sourceType: 'Auction',
});

const toDraft = (vehicle: VehicleListing): Draft => {
  const { id: _id, year, imageUrl: _cover, imagePublicId: _coverId, images: _images, damage, ...rest } = vehicle;
  return {
    ...rest,
    year: String(year),
    images: vehicleImages(vehicle),
    damage: damage ?? { damaged: false, areas: [], notes: '' },
    specs: { mileage: '', engine: '', ...vehicle.specs },
  };
};

const statusDot = (value: VehicleListing['availability']) =>
  value === 'Available' ? 'bg-emerald-500' : value === 'Incoming' ? 'bg-amber-500' : value === 'Sold' ? 'bg-signal' : 'bg-zinc-400';

export const Status: React.FC<{ value: VehicleListing['availability'] }> = ({ value }) => (
  <span className="inline-flex items-center gap-2 whitespace-nowrap">
    <span className={`h-2 w-2 rounded-full ${statusDot(value)}`} aria-hidden />
    {availabilityLabel(value)}
  </span>
);

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  className?: string;
  hint?: string;
}> = ({ label, value, onChange, placeholder, required, type = 'text', className = '', hint }) => (
  <label className={`block ${className}`}>
    <span className={labelClass}>
      {label}
      {required && <span className="text-signal"> *</span>}
    </span>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} className={fieldClass} />
    {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
  </label>
);

type StatusFilter = 'all' | VehicleListing['availability'];

interface VehiclesManagerProps {
  vehicles: VehicleListing[];
  loading: boolean;
  reload: () => Promise<void>;
  onUnauthorized: () => void;
  /** Lets the overview's "Add vehicle" shortcut open the form straight away. */
  startWithNew?: boolean;
}

export const VehiclesManager: React.FC<VehiclesManagerProps> = ({ vehicles, loading, reload, onUnauthorized, startWithNew }) => {
  const { notify, confirm } = useAdminUi();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [editing, setEditing] = useState<{ id: string | null; draft: Draft } | null>(startWithNew ? { id: null, draft: emptyDraft() } : null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const shown = useMemo(() => {
    const text = query.trim().toLowerCase();
    return vehicles.filter(
      (v) =>
        (statusFilter === 'all' || v.availability === statusFilter) &&
        (!text || `${v.title} ${v.listingRef} ${v.make} ${v.model} ${v.year}`.toLowerCase().includes(text))
    );
  }, [vehicles, query, statusFilter]);

  const update = (patch: Partial<Draft>) => setEditing((e) => (e ? { ...e, draft: { ...e.draft, ...patch } } : e));
  const updateSpecs = (patch: Partial<Draft['specs']>) =>
    setEditing((e) => (e ? { ...e, draft: { ...e.draft, specs: { ...e.draft.specs, ...patch } } } : e));
  const updateDamage = (patch: Partial<VehicleDamage>) =>
    setEditing((e) => (e ? { ...e, draft: { ...e.draft, damage: { ...e.draft.damage, ...patch } } } : e));
  const updateImages = (fn: (images: VehicleImage[]) => VehicleImage[]) =>
    setEditing((e) => (e ? { ...e, draft: { ...e.draft, images: fn(e.draft.images) } } : e));

  const closeEditor = async () => {
    if (editing && editing.draft.images.length + editing.draft.title.length > 0 && !editing.id) {
      const leave = await confirm({ title: 'Discard this vehicle?', message: 'It has not been added to the website yet.', confirmLabel: 'Discard', danger: true });
      if (!leave) return;
    }
    setEditing(null);
    setError('');
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError('');
    const body = { ...editing.draft, year: Number(editing.draft.year) };
    const result = editing.id
      ? await adminFetch(`/api/admin/vehicles/${editing.id}`, jsonInit('PUT', body))
      : await adminFetch('/api/admin/vehicles', jsonInit('POST', body));
    setSaving(false);
    if (!result.ok) {
      if (result.status === 401) return onUnauthorized();
      setError(result.error);
      return;
    }
    notify(editing.id ? `Saved changes to ${editing.draft.title}.` : `${editing.draft.title} is now live on the website.`);
    setEditing(null);
    window.scrollTo({ top: 0 });
    await reload();
  };

  const remove = async (vehicle: VehicleListing) => {
    const ok = await confirm({
      title: `Delete ${vehicle.title}?`,
      message: 'It disappears from the website straight away and its photos are removed. This cannot be undone.',
      confirmLabel: 'Delete vehicle',
      danger: true,
    });
    if (!ok) return;
    const result = await adminFetch(`/api/admin/vehicles/${vehicle.id}`, { method: 'DELETE' });
    if (!result.ok) {
      if (result.status === 401) return onUnauthorized();
      notify(result.error, 'error');
      return;
    }
    notify(`${vehicle.title} was deleted.`);
    await reload();
  };

  /* ---------- Editor ---------- */
  if (editing) {
    const d = editing.draft;
    return (
      <form onSubmit={save} className="pb-24 lg:pb-0">
        <button type="button" onClick={closeEditor} className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-[#111113] cursor-pointer dark:hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          All vehicles
        </button>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl">{editing.id ? d.title || 'Edit vehicle' : 'Add a vehicle'}</h2>

        <div className="mt-6 grid gap-5 xl:grid-cols-12">
          <div className="space-y-5 xl:col-span-5">
            <Panel title="Photos" description="Up to 12. They appear on the website in this order.">
              <GalleryField images={d.images} onChange={updateImages} onUnauthorized={onUnauthorized} onBusyChange={setUploading} />
            </Panel>
          </div>

          <div className="space-y-5 xl:col-span-7">
            <Panel title="Vehicle details">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Listing title" value={d.title} onChange={(v) => update({ title: v })} placeholder="e.g. Toyota Land Cruiser VXR" required className="sm:col-span-2" />
                <Field label="Make" value={d.make} onChange={(v) => update({ make: v })} placeholder="Toyota" required />
                <Field label="Model" value={d.model} onChange={(v) => update({ model: v })} placeholder="Land Cruiser 300" required />
                <Field label="Year" type="number" value={d.year} onChange={(v) => update({ year: v })} required />
                <Field label="Body / category" value={d.category} onChange={(v) => update({ category: v })} placeholder="Full-size SUV" />
              </div>
            </Panel>

            <Panel title="Specifications">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Mileage" value={d.specs.mileage ?? ''} onChange={(v) => updateSpecs({ mileage: v })} placeholder="24,000 km" />
                <Field label="Engine" value={d.specs.engine ?? ''} onChange={(v) => updateSpecs({ engine: v })} placeholder="3.5L Twin-Turbo V6" />
                <Field label="Transmission" value={d.specs.transmission} onChange={(v) => updateSpecs({ transmission: v })} placeholder="10-Speed Automatic" required />
                <Field label="Drivetrain" value={d.specs.drivetrain} onChange={(v) => updateSpecs({ drivetrain: v })} placeholder="Four-Wheel Drive" required />
                <Field label="Fuel type" value={d.specs.fuelType} onChange={(v) => updateSpecs({ fuelType: v })} placeholder="Gasoline" required className="sm:col-span-2" />
              </div>
            </Panel>

            <Panel title="Condition & damage" description="Buyers see this on the vehicle's page.">
              <Field
                label="Condition summary"
                value={d.condition}
                onChange={(v) => update({ condition: v })}
                placeholder="Clean title · Full service history"
                required
              />

              <p className={`${labelClass} mt-5`}>Is the vehicle damaged?</p>
              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Is the vehicle damaged?">
                {[
                  { value: false, label: 'No damage', icon: ShieldCheck },
                  { value: true, label: 'Damaged', icon: AlertTriangle },
                ].map(({ value, label, icon: Icon }) => {
                  const active = d.damage.damaged === value;
                  return (
                    <button
                      key={label}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => updateDamage({ damaged: value })}
                      className={`flex items-center justify-center gap-2 rounded-control border px-4 py-3 text-sm font-bold transition-colors cursor-pointer ${
                        active
                          ? value
                            ? 'border-signal bg-signal/10 text-signal'
                            : 'border-[#111113] bg-[#111113] text-white dark:border-white dark:bg-white dark:text-[#111113]'
                          : 'ui-divider hover:bg-black/5 dark:hover:bg-white/10'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  );
                })}
              </div>

              {d.damage.damaged && (
                <div className="mt-5">
                  <p className={labelClass}>
                    Where is the damage? <span className="font-medium text-muted">Tick all that apply</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {DAMAGE_AREAS.map((area) => {
                      const on = d.damage.areas.includes(area);
                      return (
                        <button
                          key={area}
                          type="button"
                          aria-pressed={on}
                          onClick={() => updateDamage({ areas: on ? d.damage.areas.filter((a) => a !== area) : [...d.damage.areas, area] })}
                          className={`rounded-control border px-3 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                            on ? 'border-signal bg-signal text-white' : 'ui-divider hover:bg-black/5 dark:hover:bg-white/10'
                          }`}
                        >
                          {area}
                        </button>
                      );
                    })}
                  </div>
                  <label className="mt-4 block">
                    <span className={labelClass}>Describe the damage</span>
                    <textarea
                      rows={3}
                      maxLength={600}
                      value={d.damage.notes}
                      onChange={(e) => updateDamage({ notes: e.target.value })}
                      placeholder="e.g. Dent on rear passenger door, front bumper cracked, airbags intact, starts and drives."
                      className={`${fieldClass} resize-y`}
                    />
                  </label>
                </div>
              )}
            </Panel>

            <Panel title="Listing">
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="Availability"
                  value={d.availability}
                  onChange={(v) => update({ availability: v as Draft['availability'] })}
                  options={AVAILABILITY_OPTIONS.map((a) => ({ value: a, label: availabilityLabel(a) }))}
                />
                <SelectField
                  label="Source"
                  value={d.sourceType}
                  onChange={(v) => update({ sourceType: v as Draft['sourceType'] })}
                  options={SOURCE_OPTIONS.map((s) => ({ value: s, label: s }))}
                />
                <Field label="Reference" value={d.listingRef} onChange={(v) => update({ listingRef: v })} hint="Leave blank and one is created for you." className="sm:col-span-2" />
                <label className="block sm:col-span-2">
                  <span className={labelClass}>Description</span>
                  <textarea rows={4} value={d.notes} onChange={(e) => update({ notes: e.target.value })} placeholder="Trim, options, inspection notes…" className={`${fieldClass} resize-y`} />
                </label>
              </div>
            </Panel>
          </div>
        </div>

        {/* Save bar: pinned above the phone tab bar, inline on desktop. */}
        <div className="fixed inset-x-0 bottom-[68px] z-30 border-t ui-divider bg-white/95 px-4 py-3 backdrop-blur-md dark:bg-[#0b0b0d]/95 lg:static lg:mt-6 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          {error && (
            <p role="alert" className="mb-2 text-sm font-semibold text-signal">
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <button type="button" onClick={closeEditor} className="rounded-control border ui-divider bg-white px-5 py-3 text-sm font-bold cursor-pointer dark:bg-transparent">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="btn-theme inline-flex flex-1 items-center justify-center gap-2 rounded-control px-6 py-3 text-sm font-bold disabled:opacity-70 cursor-pointer lg:flex-none"
            >
              {(saving || uploading) && <Loader2 className="h-4 w-4 animate-spin" />}
              {uploading ? 'Waiting for photos…' : saving ? 'Saving…' : editing.id ? 'Save changes' : 'Publish vehicle'}
            </button>
          </div>
        </div>
      </form>
    );
  }

  /* ---------- List ---------- */
  const counts = (value: StatusFilter) => (value === 'all' ? vehicles.length : vehicles.filter((v) => v.availability === value).length);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-sm">
          <span className="sr-only">Search vehicles</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, make or reference" className={`${fieldClass} pl-10`} />
        </label>
        <button
          type="button"
          onClick={() => setEditing({ id: null, draft: emptyDraft() })}
          className="btn-theme inline-flex items-center justify-center gap-2 rounded-control px-5 py-3 text-sm font-bold cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add vehicle
        </button>
      </div>

      <Segmented<StatusFilter>
        label="Filter by status"
        value={statusFilter}
        onChange={setStatusFilter}
        options={[
          { value: 'all', label: 'All', count: counts('all') },
          ...AVAILABILITY_OPTIONS.map((a) => ({ value: a as StatusFilter, label: availabilityLabel(a), count: counts(a) })),
        ]}
      />

      <Panel className="!p-0 overflow-hidden">
        {loading && vehicles.length === 0 ? (
          <p className="flex items-center justify-center gap-2 px-5 py-14 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading vehicles…
          </p>
        ) : shown.length === 0 ? (
          <EmptyState
            icon={CarFront}
            title={vehicles.length === 0 ? 'No vehicles yet' : 'Nothing matches'}
            message={vehicles.length === 0 ? 'Add your first vehicle and it appears on the website straight away.' : 'Try another search or status.'}
            action={
              vehicles.length === 0 && (
                <button type="button" onClick={() => setEditing({ id: null, draft: emptyDraft() })} className="btn-theme inline-flex items-center gap-2 rounded-control px-5 py-3 text-sm font-bold cursor-pointer">
                  <Plus className="h-4 w-4" />
                  Add vehicle
                </button>
              )
            }
          />
        ) : (
          <ul className="divide-y divide-black/[0.06] dark:divide-white/10">
            {shown.map((v) => {
              const damage = damageSummary(v);
              const photos = vehicleImages(v).length;
              return (
                <li key={v.id} className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
                  <button type="button" onClick={() => setEditing({ id: v.id, draft: toDraft(v) })} className="relative shrink-0 cursor-pointer" aria-label={`Edit ${v.title}`}>
                    <img src={v.imageUrl} alt="" className="h-16 w-20 rounded-control object-cover sm:h-[72px] sm:w-28" loading="lazy" />
                    {photos > 1 && (
                      <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 text-[0.65rem] font-bold text-white">{photos}</span>
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <button type="button" onClick={() => setEditing({ id: v.id, draft: toDraft(v) })} className="block max-w-full truncate text-left font-bold hover:underline cursor-pointer">
                      {v.title}
                    </button>
                    <p className="truncate text-sm text-muted">
                      {v.year} · {v.sourceType} · {v.listingRef}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      <Status value={v.availability} />
                      {damage && (
                        <span className={`inline-flex items-center gap-1.5 ${v.damage?.damaged ? 'text-signal' : 'text-muted'}`}>
                          {v.damage?.damaged ? <AlertTriangle className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                          {damage}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Link
                      href={`/vehicles/${v.id}`}
                      target="_blank"
                      className="hidden h-10 w-10 items-center justify-center rounded-control text-muted hover:bg-black/5 hover:text-[#111113] sm:flex dark:hover:bg-white/10 dark:hover:text-white"
                      aria-label={`Open ${v.title} on the website`}
                      title="View on website"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setEditing({ id: v.id, draft: toDraft(v) })}
                      className="flex h-10 w-10 items-center justify-center rounded-control text-muted hover:bg-black/5 hover:text-[#111113] cursor-pointer dark:hover:bg-white/10 dark:hover:text-white"
                      aria-label={`Edit ${v.title}`}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(v)}
                      className="flex h-10 w-10 items-center justify-center rounded-control text-muted hover:bg-signal/10 hover:text-signal cursor-pointer"
                      aria-label={`Delete ${v.title}`}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </div>
  );
};
