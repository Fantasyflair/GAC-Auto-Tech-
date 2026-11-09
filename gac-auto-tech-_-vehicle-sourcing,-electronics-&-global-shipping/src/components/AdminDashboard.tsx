'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  CarFront,
  Inbox,
  Info,
  LayoutDashboard,
  Mail,
  MonitorSmartphone,
  Moon,
  Search,
  Sun,
  Trash2,
} from 'lucide-react';
import { SAMPLE_ELECTRONICS, SAMPLE_VEHICLES } from '../data/mockData';
import { ELECTRONICS_CATEGORIES, SERVICE_LABELS, availabilityLabel, categoryLabel } from '../data/catalog';
import { StoredEnquiry, loadEnquiries, saveEnquiries } from '../data/enquiries';
import { useTheme } from '../context/ThemeContext';
import { GacLogo } from './GacLogo';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SelectField } from './SelectField';

type Tab = 'overview' | 'vehicles' | 'electronics' | 'enquiries';

const tabs: { id: Tab; label: string; icon: React.ElementType; blurb: string }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, blurb: 'Stock and enquiries at a glance.' },
  { id: 'vehicles', label: 'Vehicles', icon: CarFront, blurb: 'Every vehicle listed on the website.' },
  { id: 'electronics', label: 'Electronics', icon: MonitorSmartphone, blurb: 'Every electronics product on the website.' },
  { id: 'enquiries', label: 'Enquiries', icon: Inbox, blurb: 'Quote requests sent through the website form.' },
];

const statusDot = (value: string) =>
  value === 'Available' ? 'bg-emerald-500' : value === 'Incoming' ? 'bg-amber-500' : 'bg-zinc-400';

const Status: React.FC<{ value: Parameters<typeof availabilityLabel>[0] }> = ({ value }) => (
  <span className="inline-flex items-center gap-2 whitespace-nowrap">
    <span className={`h-2 w-2 rounded-full ${statusDot(value)}`} aria-hidden />
    {availabilityLabel(value)}
  </span>
);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const SearchBox: React.FC<{ value: string; onChange: (v: string) => void; placeholder: string }> = ({ value, onChange, placeholder }) => (
  <label className="relative block w-full sm:max-w-xs">
    <span className="sr-only">{placeholder}</span>
    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-control border ui-divider bg-white py-2.5 pl-10 pr-3 text-base placeholder:text-[#78787f] focus:border-black/50 focus:outline-none dark:bg-[#151517] dark:focus:border-white/55"
    />
  </label>
);

const Thumb: React.FC<{ src: string }> = ({ src }) => (
  <img src={src} alt="" className="h-11 w-14 shrink-0 rounded-control object-cover" loading="lazy" />
);

export const AdminDashboard: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [tab, setTab] = useState<Tab>('overview');
  const [query, setQuery] = useState('');
  const [enquiries, setEnquiries] = useState<StoredEnquiry[]>([]);
  const [enquiryFilter, setEnquiryFilter] = useState<'all' | StoredEnquiry['status']>('all');

  useEffect(() => {
    setEnquiries(loadEnquiries());
  }, []);

  const updateEnquiries = (list: StoredEnquiry[]) => {
    setEnquiries(list);
    saveEnquiries(list);
  };

  const pickTab = (id: Tab) => {
    setTab(id);
    setQuery('');
    window.scrollTo({ top: 0 });
  };

  const text = query.trim().toLowerCase();
  const vehicles = useMemo(
    () => SAMPLE_VEHICLES.filter((v) => !text || `${v.title} ${v.listingRef} ${v.sourceType}`.toLowerCase().includes(text)),
    [text]
  );
  const electronics = useMemo(
    () => SAMPLE_ELECTRONICS.filter((p) => !text || `${p.title} ${p.listingRef} ${p.category}`.toLowerCase().includes(text)),
    [text]
  );
  const shownEnquiries = enquiries.filter((e) => enquiryFilter === 'all' || e.status === enquiryFilter);

  const inStock = (list: { availability: string }[]) => list.filter((i) => i.availability === 'Available').length;
  const incoming = [...SAMPLE_VEHICLES, ...SAMPLE_ELECTRONICS].filter((i) => i.availability === 'Incoming').length;
  const newEnquiries = enquiries.filter((e) => e.status === 'new').length;
  const maxCategory = Math.max(...ELECTRONICS_CATEGORIES.map((c) => SAMPLE_ELECTRONICS.filter((p) => p.category === c.id).length));

  const current = tabs.find((t) => t.id === tab)!;

  const kpis = [
    { label: 'Vehicles listed', value: SAMPLE_VEHICLES.length, sub: `${inStock(SAMPLE_VEHICLES)} in stock` },
    { label: 'Electronics listed', value: SAMPLE_ELECTRONICS.length, sub: `${inStock(SAMPLE_ELECTRONICS)} in stock` },
    { label: 'Arriving soon', value: incoming, sub: 'Vehicles and electronics' },
    { label: 'New enquiries', value: newEnquiries, sub: `${enquiries.length} received in total` },
  ];

  const toggleStatus = (id: string) =>
    updateEnquiries(enquiries.map((e) => (e.id === id ? { ...e, status: e.status === 'new' ? 'contacted' : 'new' } : e)));

  const removeEnquiry = (id: string) => {
    if (window.confirm('Delete this enquiry? This cannot be undone.')) updateEnquiries(enquiries.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1] text-[#111113] dark:bg-[#09090B] dark:text-white">
      <div className="lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
        <aside className="flex flex-col bg-[#0b0b0d] text-white lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-white/10">
          <div className="flex items-center justify-between gap-3 px-4 py-4 lg:px-5 lg:py-6">
            <Link href="/" aria-label="GAC Auto Tech website">
              <GacLogo size="sm" className="h-8" />
            </Link>
            <span className="eyebrow text-white/60">Admin</span>
          </div>

          <nav aria-label="Dashboard sections" className="grid grid-cols-4 gap-1 px-2 pb-3 lg:grid-cols-1 lg:px-3">
            {tabs.map(({ id, label, icon: Icon }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => pickTab(id)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex flex-col items-center gap-1 rounded-control px-2 py-2.5 text-xs font-bold transition-colors cursor-pointer lg:flex-row lg:gap-3 lg:px-3 lg:text-sm ${
                    active ? 'bg-white text-[#111113]' : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                  {id === 'enquiries' && newEnquiries > 0 && (
                    <span className={`hidden rounded-full px-1.5 text-xs lg:ml-auto lg:inline ${active ? 'bg-[#111113] text-white' : 'bg-white/15'}`}>
                      {newEnquiries}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto hidden space-y-1 border-t border-white/10 p-3 lg:block">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-sm font-bold text-white/70 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            <Link
              href="/"
              className="flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-bold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to website
            </Link>
          </div>
        </aside>

        <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl">{current.label}</h1>
              <p className="mt-1.5 text-base text-muted">{current.blurb}</p>
            </div>
            <div className="flex gap-2 lg:hidden">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex h-11 w-11 items-center justify-center rounded-control border ui-divider cursor-pointer"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <Link href="/" className="inline-flex items-center gap-2 rounded-control border ui-divider px-4 text-sm font-bold">
                <ArrowLeft className="h-4 w-4" />
                Website
              </Link>
            </div>
          </div>

          <p className="mt-5 flex items-start gap-2.5 rounded-panel border ui-divider bg-white px-4 py-3 text-sm text-muted dark:bg-[#151517]">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Preview dashboard. Listings come from the website's sample data, and enquiries are saved in this browser only. Connect a
              database and staff sign-in before relying on it for real customers.
            </span>
          </p>

          {tab === 'overview' && (
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                {kpis.map((kpi) => (
                  <div key={kpi.label} className="ui-card rounded-panel p-4 sm:p-5">
                    <p className="text-sm font-semibold text-muted">{kpi.label}</p>
                    <p className="mt-2 font-display text-3xl font-bold sm:text-4xl">{kpi.value}</p>
                    <p className="mt-1 text-sm text-muted">{kpi.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 xl:grid-cols-3">
                <section className="ui-card rounded-panel p-5 xl:col-span-2" aria-labelledby="latest-enquiries">
                  <div className="flex items-center justify-between gap-3">
                    <h2 id="latest-enquiries" className="font-display text-lg">Latest enquiries</h2>
                    <button type="button" onClick={() => pickTab('enquiries')} className="text-sm font-bold underline-offset-4 hover:underline cursor-pointer">
                      View all
                    </button>
                  </div>
                  {enquiries.length === 0 ? (
                    <p className="mt-4 rounded-media bg-black/[0.03] px-4 py-8 text-center text-sm text-muted dark:bg-white/[0.04]">
                      No enquiries yet. Requests sent through the website's quote form will appear here.
                    </p>
                  ) : (
                    <ul className="mt-3 divide-y divide-black/10 dark:divide-white/10">
                      {enquiries.slice(0, 5).map((e) => (
                        <li key={e.id} className="flex items-center justify-between gap-4 py-3">
                          <div className="min-w-0">
                            <p className="truncate font-bold">{e.name}</p>
                            <p className="truncate text-sm text-muted">
                              {SERVICE_LABELS[e.service]} · {formatDate(e.createdAt)}
                            </p>
                          </div>
                          <span className={`shrink-0 text-sm font-bold ${e.status === 'new' ? '' : 'text-muted'}`}>
                            {e.status === 'new' ? 'New' : 'Contacted'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section className="ui-card rounded-panel p-5" aria-labelledby="stock-by-category">
                  <h2 id="stock-by-category" className="font-display text-lg">Electronics by category</h2>
                  <ul className="mt-4 space-y-3">
                    {ELECTRONICS_CATEGORIES.map((c) => {
                      const count = SAMPLE_ELECTRONICS.filter((p) => p.category === c.id).length;
                      return (
                        <li key={c.id}>
                          <div className="flex justify-between text-sm">
                            <span className="font-semibold">{c.label}</span>
                            <span className="text-muted">{count}</span>
                          </div>
                          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/10">
                            <div className="h-full rounded-full bg-[#111113] dark:bg-white" style={{ width: `${(count / maxCategory) * 100}%` }} />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              </div>
            </div>
          )}

          {tab === 'vehicles' && (
            <section className="mt-6">
              <SearchBox value={query} onChange={setQuery} placeholder="Search vehicles" />
              <div className="ui-card mt-4 overflow-hidden rounded-panel">
                <table className="hidden w-full text-left text-sm md:table">
                  <thead className="eyebrow text-muted">
                    <tr>
                      <th className="px-5 py-3 font-bold">Vehicle</th>
                      <th className="px-5 py-3 font-bold">Source</th>
                      <th className="px-5 py-3 font-bold">Year</th>
                      <th className="px-5 py-3 font-bold">Mileage</th>
                      <th className="px-5 py-3 font-bold">Status</th>
                      <th className="px-5 py-3"><span className="sr-only">Open</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((v) => (
                      <tr key={v.id} className="border-t ui-divider">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <Thumb src={v.imageUrl} />
                            <div className="min-w-0">
                              <p className="font-bold">{v.title}</p>
                              <p className="text-xs text-muted">{v.listingRef}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">{v.sourceType}</td>
                        <td className="px-5 py-3">{v.year}</td>
                        <td className="px-5 py-3 whitespace-nowrap">{v.specs.mileage ?? '—'}</td>
                        <td className="px-5 py-3"><Status value={v.availability} /></td>
                        <td className="px-5 py-3 text-right">
                          <Link href={`/vehicles/${v.id}`} className="inline-flex items-center gap-1 font-bold underline-offset-4 hover:underline">
                            View <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <ul className="divide-y divide-black/10 md:hidden dark:divide-white/10">
                  {vehicles.map((v) => (
                    <li key={v.id}>
                      <Link href={`/vehicles/${v.id}`} className="flex items-center gap-3 p-4">
                        <Thumb src={v.imageUrl} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-bold">{v.title}</p>
                          <p className="text-sm text-muted">{v.sourceType} · {v.year}</p>
                          <p className="mt-1 text-sm"><Status value={v.availability} /></p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted" />
                      </Link>
                    </li>
                  ))}
                </ul>
                {vehicles.length === 0 && <p className="px-5 py-10 text-center text-sm text-muted">No vehicles match “{query}”.</p>}
              </div>
            </section>
          )}

          {tab === 'electronics' && (
            <section className="mt-6">
              <SearchBox value={query} onChange={setQuery} placeholder="Search electronics" />
              <div className="ui-card mt-4 overflow-hidden rounded-panel">
                <table className="hidden w-full text-left text-sm md:table">
                  <thead className="eyebrow text-muted">
                    <tr>
                      <th className="px-5 py-3 font-bold">Product</th>
                      <th className="px-5 py-3 font-bold">Category</th>
                      <th className="px-5 py-3 font-bold">Status</th>
                      <th className="px-5 py-3 font-bold">Wholesale</th>
                      <th className="px-5 py-3"><span className="sr-only">Open</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {electronics.map((p) => (
                      <tr key={p.id} className="border-t ui-divider">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <Thumb src={p.imageUrl} />
                            <div className="min-w-0">
                              <p className="font-bold">{p.title}</p>
                              <p className="text-xs text-muted">{p.listingRef}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">{categoryLabel(p.category)}</td>
                        <td className="px-5 py-3"><Status value={p.availability} /></td>
                        <td className="px-5 py-3">{p.wholesaleEligible ? 'Yes' : 'No'}</td>
                        <td className="px-5 py-3 text-right">
                          <Link href={`/products/${p.id}`} className="inline-flex items-center gap-1 font-bold underline-offset-4 hover:underline">
                            View <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <ul className="divide-y divide-black/10 md:hidden dark:divide-white/10">
                  {electronics.map((p) => (
                    <li key={p.id}>
                      <Link href={`/products/${p.id}`} className="flex items-center gap-3 p-4">
                        <Thumb src={p.imageUrl} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-bold">{p.title}</p>
                          <p className="text-sm text-muted">
                            {categoryLabel(p.category)} · {p.wholesaleEligible ? 'Wholesale' : 'Retail only'}
                          </p>
                          <p className="mt-1 text-sm"><Status value={p.availability} /></p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted" />
                      </Link>
                    </li>
                  ))}
                </ul>
                {electronics.length === 0 && <p className="px-5 py-10 text-center text-sm text-muted">No products match “{query}”.</p>}
              </div>
            </section>
          )}

          {tab === 'enquiries' && (
            <section className="mt-6">
              <SelectField
                label="Show"
                value={enquiryFilter}
                onChange={(v) => setEnquiryFilter(v as typeof enquiryFilter)}
                options={[
                  { value: 'all', label: `All enquiries (${enquiries.length})` },
                  { value: 'new', label: `New (${newEnquiries})` },
                  { value: 'contacted', label: `Contacted (${enquiries.length - newEnquiries})` },
                ]}
                className="sm:max-w-xs"
              />

              {shownEnquiries.length === 0 ? (
                <div className="ui-card mt-4 flex flex-col items-center rounded-panel px-6 py-14 text-center">
                  <Inbox className="h-6 w-6 text-muted" />
                  <p className="mt-3 font-display text-lg">No enquiries here yet</p>
                  <p className="mt-1.5 max-w-sm text-base text-muted">
                    When someone sends the quote form on the website from this browser, it shows up here.
                  </p>
                </div>
              ) : (
                <ul className="mt-4 space-y-3">
                  {shownEnquiries.map((e) => {
                    const phone = e.whatsapp.replace(/\D/g, '');
                    return (
                      <li key={e.id} className="ui-card rounded-panel p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-display text-lg font-bold">{e.name}</p>
                            <p className="text-sm text-muted">
                              {SERVICE_LABELS[e.service]} · {formatDate(e.createdAt)}
                              {e.destination ? ` · To ${e.destination}` : ''}
                              {e.budget ? ` · Budget ${e.budget}` : ''}
                            </p>
                          </div>
                          <span className={`inline-flex items-center gap-2 text-sm font-bold ${e.status === 'new' ? '' : 'text-muted'}`}>
                            <span className={`h-2 w-2 rounded-full ${e.status === 'new' ? 'bg-signal' : 'bg-zinc-400'}`} aria-hidden />
                            {e.status === 'new' ? 'New' : 'Contacted'}
                          </span>
                        </div>
                        {e.details && <p className="mt-3 text-base">{e.details}</p>}
                        <div className="mt-4 flex flex-wrap gap-2 border-t ui-divider pt-4">
                          <a
                            href={`mailto:${e.email}`}
                            className="inline-flex items-center gap-2 rounded-control border ui-divider px-3.5 py-2 text-sm font-bold transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                          >
                            <Mail className="h-4 w-4" />
                            {e.email}
                          </a>
                          {phone && (
                            <a
                              href={`https://wa.me/${phone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-control border ui-divider px-3.5 py-2 text-sm font-bold transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                            >
                              <WhatsAppIcon className="h-4 w-4" />
                              {e.whatsapp}
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => toggleStatus(e.id)}
                            className="btn-theme inline-flex items-center rounded-control px-3.5 py-2 text-sm font-bold cursor-pointer"
                          >
                            {e.status === 'new' ? 'Mark as contacted' : 'Mark as new'}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeEnquiry(e.id)}
                            className="ml-auto inline-flex items-center gap-2 rounded-control px-3 py-2 text-sm font-bold text-muted transition-colors hover:bg-black/5 hover:text-[#111113] cursor-pointer dark:hover:bg-white/10 dark:hover:text-white"
                            aria-label={`Delete enquiry from ${e.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};
