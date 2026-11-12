'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CarFront,
  Contact,
  ExternalLink,
  GalleryHorizontal,
  Inbox,
  LayoutDashboard,
  Loader2,
  Lock,
  LogOut,
  Moon,
  PackageCheck,
  Plus,
  Sun,
  Truck,
} from 'lucide-react';
import { VehicleListing } from '../types';
import { AVAILABILITY_OPTIONS } from '../data/catalog';
import { Enquiry, EnquiryStatus } from '../data/enquiries';
import { useTheme } from '../context/ThemeContext';
import { GacLogo } from './GacLogo';
import { adminFetch, jsonInit } from './admin/adminApi';
import { AdminUiProvider, Panel, useAdminUi } from './admin/ui';
import { VehiclesManager, Status } from './admin/VehiclesManager';
import { HeroManager } from './admin/HeroManager';
import { SettingsManager } from './admin/SettingsManager';
import { EnquiriesPanel, formatDate, serviceLabel } from './admin/EnquiriesPanel';

type Tab = 'overview' | 'vehicles' | 'hero' | 'contact' | 'enquiries';

const tabs: { id: Tab; label: string; short: string; icon: React.ElementType; blurb: string }[] = [
  { id: 'overview', label: 'Overview', short: 'Home', icon: LayoutDashboard, blurb: 'Your stock and enquiries at a glance.' },
  { id: 'vehicles', label: 'Vehicles', short: 'Vehicles', icon: CarFront, blurb: 'Add, edit and remove the cars on the website.' },
  { id: 'hero', label: 'Hero banner', short: 'Banner', icon: GalleryHorizontal, blurb: 'The rotating banner at the top of the home page.' },
  { id: 'contact', label: 'Contact details', short: 'Contact', icon: Contact, blurb: 'The WhatsApp number and social links used across the website.' },
  { id: 'enquiries', label: 'Enquiries', short: 'Inbox', icon: Inbox, blurb: 'Requests from the quote form and vehicle pages.' },
];

/* ---------- Sign in ---------- */

const SignIn: React.FC<{ onSignedIn: () => void }> = ({ onSignedIn }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const result = await adminFetch('/api/admin/session', jsonInit('POST', { password }));
    setBusy(false);
    if (result.ok) {
      onSignedIn();
      return;
    }
    setError(result.status === 401 ? 'That password is not correct.' : result.error);
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#0b0b0d] px-4 py-10 text-white">
      <form onSubmit={submit} className="w-full max-w-sm rounded-panel border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <Link href="/" aria-label="GAC Auto Tech website">
          <GacLogo size="md" />
        </Link>
        <h1 className="mt-8 flex items-center gap-2 font-display text-2xl">
          <Lock className="h-5 w-5" />
          Admin sign in
        </h1>
        <p className="mt-2 text-base text-white/70">Manage vehicles, banner photos and enquiries.</p>
        <label htmlFor="admin-password" className="mt-6 block text-sm font-bold">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 w-full rounded-control border border-white/20 bg-white/[0.04] px-3.5 py-3 text-base text-white focus:border-white/50 focus:outline-none"
        />
        {error && (
          <p role="alert" className="mt-3 flex items-center gap-2 text-sm font-semibold text-white">
            <AlertTriangle className="h-4 w-4 text-signal" />
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="btn-on-dark mt-5 flex w-full items-center justify-center gap-2 rounded-control py-3.5 text-sm font-bold disabled:opacity-70 cursor-pointer"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Sign in
        </button>
        <Link href="/" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white/70 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to website
        </Link>
      </form>
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  const [auth, setAuth] = useState<'checking' | 'signed-out' | 'signed-in'>('checking');
  const signedOut = useCallback(() => setAuth('signed-out'), []);

  useEffect(() => {
    adminFetch<{ authenticated: boolean }>('/api/admin/session').then((result) =>
      setAuth(result.ok && result.data.authenticated ? 'signed-in' : 'signed-out')
    );
  }, []);

  if (auth === 'checking') {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#0b0b0d] text-white">
        <Loader2 className="h-6 w-6 animate-spin" aria-label="Loading" />
      </div>
    );
  }
  if (auth === 'signed-out') return <SignIn onSignedIn={() => setAuth('signed-in')} />;
  return (
    <AdminUiProvider>
      <Dashboard onSignedOut={signedOut} />
    </AdminUiProvider>
  );
};

/* ---------- Dashboard ---------- */

const greeting = () => {
  const hour = new Date().getHours();
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
};

const Dashboard: React.FC<{ onSignedOut: () => void }> = ({ onSignedOut }) => {
  const { theme, toggleTheme } = useTheme();
  const { notify, confirm } = useAdminUi();
  const [tab, setTab] = useState<Tab>('overview');
  const [openNewVehicle, setOpenNewVehicle] = useState(false);

  const [vehicles, setVehicles] = useState<VehicleListing[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(true);
  const [hello, setHello] = useState('Welcome back');

  useEffect(() => setHello(greeting()), []);

  const loadVehicles = useCallback(async () => {
    setLoadingVehicles(true);
    const result = await adminFetch<{ vehicles: VehicleListing[] }>('/api/admin/vehicles');
    setLoadingVehicles(false);
    if (result.ok) setVehicles(result.data.vehicles);
    else if (result.status === 401) onSignedOut();
    else notify(`Vehicles could not be loaded: ${result.error}`, 'error');
  }, [onSignedOut, notify]);

  const loadEnquiries = useCallback(async () => {
    setLoadingEnquiries(true);
    const result = await adminFetch<{ enquiries: Enquiry[] }>('/api/admin/enquiries');
    setLoadingEnquiries(false);
    if (result.ok) setEnquiries(result.data.enquiries);
    else if (result.status === 401) onSignedOut();
    else notify(`Enquiries could not be loaded: ${result.error}`, 'error');
  }, [onSignedOut, notify]);

  useEffect(() => {
    loadVehicles();
    loadEnquiries();
  }, [loadVehicles, loadEnquiries]);

  const signOut = async () => {
    await fetch('/api/admin/session', { method: 'DELETE' }).catch(() => null);
    onSignedOut();
  };

  const pickTab = (id: Tab, newVehicle = false) => {
    setTab(id);
    setOpenNewVehicle(newVehicle);
    window.scrollTo({ top: 0 });
  };

  // Both actions update the screen straight away and roll back if the database refuses.
  const toggleStatus = async (enquiry: Enquiry) => {
    const status: EnquiryStatus = enquiry.status === 'new' ? 'contacted' : 'new';
    const previous = enquiries;
    setEnquiries(enquiries.map((e) => (e.id === enquiry.id ? { ...e, status } : e)));
    const result = await adminFetch(`/api/admin/enquiries/${enquiry.id}`, jsonInit('PATCH', { status }));
    if (result.ok) return notify(status === 'contacted' ? `Marked ${enquiry.name} as contacted.` : `Moved ${enquiry.name} back to new.`);
    if (result.status === 401) return onSignedOut();
    setEnquiries(previous);
    notify('That change was not saved. Please try again.', 'error');
  };

  const removeEnquiry = async (enquiry: Enquiry) => {
    const ok = await confirm({
      title: `Delete the enquiry from ${enquiry.name}?`,
      message: 'Their contact details and message will be removed for good.',
      confirmLabel: 'Delete enquiry',
      danger: true,
    });
    if (!ok) return;
    const previous = enquiries;
    setEnquiries(enquiries.filter((e) => e.id !== enquiry.id));
    const result = await adminFetch(`/api/admin/enquiries/${enquiry.id}`, { method: 'DELETE' });
    if (result.ok) return notify('Enquiry deleted.');
    if (result.status === 401) return onSignedOut();
    setEnquiries(previous);
    notify('That enquiry was not deleted. Please try again.', 'error');
  };

  const newEnquiries = enquiries.filter((e) => e.status === 'new').length;
  const count = (availability: VehicleListing['availability']) => vehicles.filter((v) => v.availability === availability).length;
  const damaged = vehicles.filter((v) => v.damage?.damaged).length;
  const current = tabs.find((t) => t.id === tab)!;

  const kpis = [
    { label: 'Live listings', value: vehicles.length - count('Sold'), sub: `${count('Sold')} sold`, icon: CarFront, go: () => pickTab('vehicles') },
    { label: 'In stock', value: count('Available'), sub: `${damaged} with damage reported`, icon: PackageCheck, go: () => pickTab('vehicles') },
    { label: 'Arriving soon', value: count('Incoming'), sub: 'On the way', icon: Truck, go: () => pickTab('vehicles') },
    { label: 'New enquiries', value: newEnquiries, sub: `${enquiries.length} in total`, icon: Inbox, go: () => pickTab('enquiries'), highlight: newEnquiries > 0 },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#f4f4f5] text-[#111113] dark:bg-[#09090B] dark:text-white">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-[#0b0b0d] text-white lg:flex">
        <div className="px-5 pb-6 pt-6">
          <Link href="/" aria-label="GAC Auto Tech website">
            <GacLogo size="sm" className="h-9" />
          </Link>
          <p className="eyebrow mt-4 text-white/50">Admin</p>
        </div>
        <nav aria-label="Dashboard sections" className="flex-1 space-y-1 px-3">
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => pickTab(id)}
                aria-current={active ? 'page' : undefined}
                className={`flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-sm font-bold transition-colors cursor-pointer ${
                  active ? 'bg-white text-[#111113]' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
                {id === 'enquiries' && newEnquiries > 0 && (
                  <span className="ml-auto rounded-full bg-signal px-1.5 text-xs font-bold tabular-nums text-white">{newEnquiries}</span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="space-y-1 border-t border-white/10 p-3">
          <Link href="/" target="_blank" className="flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white">
            <ExternalLink className="h-4 w-4" />
            View website
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Phone and tablet top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-white/10 bg-[#0b0b0d] px-4 text-white lg:hidden">
        <Link href="/" aria-label="GAC Auto Tech website" className="shrink-0">
          <GacLogo size="sm" className="h-7" />
        </Link>
        <div className="flex items-center gap-1">
          <Link href="/" target="_blank" className="flex h-10 w-10 items-center justify-center rounded-control text-white/80 hover:bg-white/10" aria-label="View website">
            <ExternalLink className="h-[18px] w-[18px]" />
          </Link>
          <button type="button" onClick={toggleTheme} className="flex h-10 w-10 items-center justify-center rounded-control text-white/80 hover:bg-white/10 cursor-pointer" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>
          <button type="button" onClick={signOut} className="flex h-10 w-10 items-center justify-center rounded-control text-white/80 hover:bg-white/10 cursor-pointer" aria-label="Sign out">
            <LogOut className="h-[18px] w-[18px]" />
          </button>
        </div>
      </header>

      <main className="px-4 pb-28 pt-5 sm:px-6 lg:ml-64 lg:px-10 lg:pb-12 lg:pt-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <h1 className="font-display text-2xl sm:text-3xl">{tab === 'overview' ? `${hello}` : current.label}</h1>
            <p className="mt-1 text-base text-muted">{current.blurb}</p>
          </div>

          {tab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                {kpis.map(({ label, value, sub, icon: Icon, go, highlight }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={go}
                    className="group rounded-panel border border-black/[0.06] bg-white p-4 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md cursor-pointer sm:p-5 dark:border-white/10 dark:bg-[#121214]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-muted">{label}</p>
                      <span className={`flex h-8 w-8 items-center justify-center rounded-full ${highlight ? 'bg-signal text-white' : 'bg-black/[0.05] text-muted dark:bg-white/[0.08]'}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                    </div>
                    <p className="mt-3 font-display text-3xl font-bold tabular-nums sm:text-4xl">
                      {(label === 'New enquiries' ? loadingEnquiries : loadingVehicles) ? <Loader2 className="h-6 w-6 animate-spin text-muted" /> : value}
                    </p>
                    <p className="mt-1 truncate text-sm text-muted">{sub}</p>
                  </button>
                ))}
              </div>

              <Panel title="Quick actions">
                <div className="grid gap-2 sm:grid-cols-3">
                  {[
                    { label: 'Add a vehicle', hint: 'Photos, specs and damage', icon: Plus, onClick: () => pickTab('vehicles', true) },
                    { label: 'Change banner photos', hint: 'Home page hero', icon: GalleryHorizontal, onClick: () => pickTab('hero') },
                    { label: 'Update contact details', hint: 'WhatsApp and socials', icon: Contact, onClick: () => pickTab('contact') },
                  ].map(({ label, hint, icon: Icon, onClick }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={onClick}
                      className="group flex items-center gap-3 rounded-control border ui-divider px-4 py-3.5 text-left transition-colors hover:bg-black/[0.03] cursor-pointer dark:hover:bg-white/[0.05]"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-[#111113] text-white dark:bg-white dark:text-[#111113]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold">{label}</span>
                        <span className="block truncate text-xs text-muted">{hint}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ))}
                </div>
              </Panel>

              <div className="grid gap-5 xl:grid-cols-3">
                <Panel
                  title="Latest enquiries"
                  className="xl:col-span-2"
                  action={
                    <button type="button" onClick={() => pickTab('enquiries')} className="text-sm font-bold underline-offset-4 hover:underline cursor-pointer">
                      Open inbox
                    </button>
                  }
                >
                  {loadingEnquiries ? (
                    <p className="flex items-center justify-center gap-2 py-8 text-sm text-muted">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading…
                    </p>
                  ) : enquiries.length === 0 ? (
                    <p className="rounded-control bg-black/[0.03] px-4 py-8 text-center text-sm text-muted dark:bg-white/[0.04]">
                      No enquiries yet. They appear here as soon as someone sends one from the website.
                    </p>
                  ) : (
                    <ul className="-mx-2 divide-y divide-black/[0.06] dark:divide-white/10">
                      {enquiries.slice(0, 5).map((e) => (
                        <li key={e.id}>
                          <button type="button" onClick={() => pickTab('enquiries')} className="flex w-full items-center gap-3 rounded-control px-2 py-3 text-left hover:bg-black/[0.03] cursor-pointer dark:hover:bg-white/[0.04]">
                            <span className={`h-2 w-2 shrink-0 rounded-full ${e.status === 'new' ? 'bg-signal' : 'bg-transparent'}`} aria-label={e.status === 'new' ? 'New' : undefined} />
                            <span className="min-w-0 flex-1">
                              <span className={`block truncate ${e.status === 'new' ? 'font-bold' : 'font-semibold'}`}>{e.name}</span>
                              <span className="block truncate text-sm text-muted">{e.vehicleTitle ?? serviceLabel(e.service)}</span>
                            </span>
                            <span className="shrink-0 text-xs text-muted">{formatDate(e.createdAt)}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </Panel>

                <Panel
                  title="Stock by status"
                  action={
                    <button type="button" onClick={() => pickTab('vehicles')} className="text-sm font-bold underline-offset-4 hover:underline cursor-pointer">
                      Manage
                    </button>
                  }
                >
                  <ul className="space-y-3.5">
                    {AVAILABILITY_OPTIONS.map((a) => (
                      <li key={a}>
                        <div className="flex justify-between text-sm">
                          <Status value={a} />
                          <span className="font-bold tabular-nums">{count(a)}</span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/10">
                          <div className="h-full rounded-full bg-[#111113] dark:bg-white" style={{ width: `${vehicles.length ? (count(a) / vehicles.length) * 100 : 0}%` }} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </Panel>
              </div>
            </div>
          )}

          {tab === 'vehicles' && (
            <VehiclesManager
              key={openNewVehicle ? 'new' : 'list'}
              vehicles={vehicles}
              loading={loadingVehicles}
              reload={loadVehicles}
              onUnauthorized={onSignedOut}
              startWithNew={openNewVehicle}
            />
          )}

          {tab === 'hero' && <HeroManager onUnauthorized={onSignedOut} />}

          {tab === 'contact' && <SettingsManager onUnauthorized={onSignedOut} />}

          {tab === 'enquiries' && (
            <EnquiriesPanel enquiries={enquiries} loading={loadingEnquiries} reload={loadEnquiries} onToggleStatus={toggleStatus} onDelete={removeEnquiry} />
          )}
        </div>
      </main>

      {/* Phone and tablet tab bar */}
      <nav
        aria-label="Dashboard sections"
        className="fixed inset-x-0 bottom-0 z-40 grid h-[68px] grid-cols-5 border-t border-black/[0.08] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden dark:border-white/10 dark:bg-[#0b0b0d]/95"
      >
        {tabs.map(({ id, short, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => pickTab(id)}
              aria-current={active ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center gap-1 text-[0.7rem] font-bold transition-colors cursor-pointer ${
                active ? 'text-[#111113] dark:text-white' : 'text-[#71717a] dark:text-white/50'
              }`}
            >
              {active && <span className="absolute inset-x-5 top-0 h-[2px] rounded-full bg-[#111113] dark:bg-white" aria-hidden />}
              <span className="relative">
                <Icon className="h-5 w-5" />
                {id === 'enquiries' && newEnquiries > 0 && (
                  <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-signal px-1 text-[0.6rem] text-white">
                    {newEnquiries}
                  </span>
                )}
              </span>
              {short}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
