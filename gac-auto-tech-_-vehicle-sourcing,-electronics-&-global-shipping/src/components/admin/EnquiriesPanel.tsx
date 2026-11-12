'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { CarFront, Check, Inbox, Loader2, Mail, MapPin, RefreshCw, Search, Trash2, Undo2, Wallet } from 'lucide-react';
import { Enquiry, EnquiryStatus } from '../../data/enquiries';
import { SERVICE_LABELS } from '../../data/catalog';
import { WhatsAppIcon } from '../WhatsAppIcon';
import { EmptyState, Panel, Segmented } from './ui';
import { fieldClass } from './adminApi';

export const formatDate = (iso: string) => {
  const date = new Date(iso);
  const minutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 60 * 24) return `${Math.round(minutes / 60)} h ago`;
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: date.getFullYear() === new Date().getFullYear() ? undefined : 'numeric' });
};

export const serviceLabel = (service: string) => SERVICE_LABELS[service as keyof typeof SERVICE_LABELS] ?? service;

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('') || '?';

interface EnquiriesPanelProps {
  enquiries: Enquiry[];
  loading: boolean;
  reload: () => void;
  onToggleStatus: (enquiry: Enquiry) => void;
  onDelete: (enquiry: Enquiry) => void;
}

const contactButton =
  'inline-flex items-center gap-2 rounded-control border ui-divider px-3 py-2 text-sm font-bold transition-colors hover:bg-black/5 dark:hover:bg-white/10';

export const EnquiriesPanel: React.FC<EnquiriesPanelProps> = ({ enquiries, loading, reload, onToggleStatus, onDelete }) => {
  const [filter, setFilter] = useState<'all' | EnquiryStatus>('all');
  const [query, setQuery] = useState('');
  const newCount = enquiries.filter((e) => e.status === 'new').length;

  const shown = useMemo(() => {
    const text = query.trim().toLowerCase();
    return enquiries.filter(
      (e) =>
        (filter === 'all' || e.status === filter) &&
        (!text || `${e.name} ${e.email} ${e.whatsapp} ${e.details} ${e.vehicleTitle ?? ''} ${e.destination}`.toLowerCase().includes(text))
    );
  }, [enquiries, filter, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Segmented<'all' | EnquiryStatus>
          label="Filter enquiries"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'All', count: enquiries.length },
            { value: 'new', label: 'New', count: newCount },
            { value: 'contacted', label: 'Contacted', count: enquiries.length - newCount },
          ]}
        />
        <div className="flex gap-2">
          <label className="relative block flex-1 sm:w-64 sm:flex-none">
            <span className="sr-only">Search enquiries</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className={`${fieldClass} pl-10`} />
          </label>
          <button
            type="button"
            onClick={reload}
            disabled={loading}
            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-control border ui-divider bg-white disabled:opacity-60 cursor-pointer dark:bg-[#151517]"
            aria-label="Refresh enquiries"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading && enquiries.length === 0 ? (
        <Panel>
          <p className="flex items-center justify-center gap-2 py-10 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading enquiries…
          </p>
        </Panel>
      ) : shown.length === 0 ? (
        <Panel>
          <EmptyState
            icon={Inbox}
            title={enquiries.length === 0 ? 'No enquiries yet' : 'Nothing here'}
            message={
              enquiries.length === 0
                ? "When someone sends the quote form or enquires about a vehicle, it lands here."
                : filter === 'new'
                  ? "You're all caught up."
                  : 'Try another search or filter.'
            }
          />
        </Panel>
      ) : (
        <ul className="space-y-3">
          {shown.map((e) => {
            const phone = e.whatsapp.replace(/\D/g, '');
            const isNew = e.status === 'new';
            return (
              <li
                key={e.id}
                className={`rounded-panel border bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-5 dark:bg-[#121214] ${
                  isNew ? 'border-black/15 dark:border-white/25' : 'border-black/[0.06] dark:border-white/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      isNew ? 'bg-[#111113] text-white dark:bg-white dark:text-[#111113]' : 'bg-black/[0.06] text-muted dark:bg-white/10'
                    }`}
                    aria-hidden
                  >
                    {initials(e.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <p className="font-display text-base font-bold sm:text-lg">{e.name}</p>
                      {isNew && <span className="rounded-full bg-signal px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide text-white">New</span>}
                    </div>
                    <p className="text-sm text-muted">
                      {serviceLabel(e.service)} · {formatDate(e.createdAt)}
                    </p>
                  </div>
                </div>

                {e.vehicleId && (
                  <Link
                    href={`/vehicles/${e.vehicleId}`}
                    target="_blank"
                    className="mt-3 inline-flex max-w-full items-center gap-2 rounded-control bg-black/[0.04] px-3 py-2 text-sm font-bold hover:bg-black/[0.07] dark:bg-white/[0.06] dark:hover:bg-white/10"
                  >
                    <CarFront className="h-4 w-4 shrink-0" />
                    <span className="truncate">{e.vehicleTitle ?? 'View vehicle'}</span>
                  </Link>
                )}

                {e.details && <p className="mt-3 whitespace-pre-line text-base">{e.details}</p>}

                {(e.destination || e.budget) && (
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
                    {e.destination && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {e.destination}
                      </span>
                    )}
                    {e.budget && (
                      <span className="inline-flex items-center gap-1.5">
                        <Wallet className="h-3.5 w-3.5" />
                        {e.budget}
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t ui-divider pt-4">
                  <a href={`mailto:${e.email}`} className={`${contactButton} min-w-0 max-w-full`}>
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">{e.email}</span>
                  </a>
                  {phone && (
                    <a
                      href={`https://wa.me/${phone}?text=${encodeURIComponent(`Hello ${e.name.split(' ')[0]}, thanks for your enquiry with GAC Auto Tech.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={contactButton}
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                      WhatsApp
                    </a>
                  )}
                  <div className="ml-auto flex gap-1">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(e)}
                      className={`inline-flex items-center gap-2 rounded-control px-3 py-2 text-sm font-bold cursor-pointer ${isNew ? 'btn-theme' : 'border ui-divider'}`}
                    >
                      {isNew ? <Check className="h-4 w-4" /> : <Undo2 className="h-4 w-4" />}
                      {isNew ? 'Mark contacted' : 'Mark new'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(e)}
                      className="flex h-10 w-10 items-center justify-center rounded-control text-muted hover:bg-signal/10 hover:text-signal cursor-pointer"
                      aria-label={`Delete enquiry from ${e.name}`}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
