'use client';

import React, { useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { VehicleListing } from '../types';
import { submitEnquiry } from '../data/enquiries';
import { vehicleQuoteDetails } from '../data/catalog';
import { useSite } from './SiteShell';

const input =
  'w-full rounded-control border ui-divider bg-white px-3.5 py-3 text-base text-[#111113] placeholder:text-[#78787f] focus:border-black/50 focus:outline-none dark:bg-[#151517] dark:text-white dark:focus:border-white/55';
const label = 'mb-1.5 block text-sm font-bold';

/** Sends an enquiry about one vehicle straight to the admin dashboard, linked to that vehicle. */
export const VehicleEnquiryForm: React.FC<{ vehicle: VehicleListing }> = ({ vehicle }) => {
  const { openPrivacy } = useSite();
  const [form, setForm] = useState({
    name: '',
    email: '',
    whatsapp: '',
    destination: 'Ghana',
    message: `I'm interested in the ${vehicleQuoteDetails(vehicle)}. Please send the full price including shipping.`,
  });
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setError('Please agree to be contacted about this enquiry.');
      return;
    }
    setStatus('sending');
    setError('');
    try {
      await submitEnquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        whatsapp: form.whatsapp.trim(),
        service: 'vehicle_sourcing',
        destination: form.destination.trim(),
        budget: '',
        details: form.message.trim(),
        vehicleId: vehicle.id,
        vehicleTitle: `${vehicle.year} ${vehicle.title}`,
      });
      setStatus('sent');
    } catch (err) {
      setStatus('idle');
      setError(err instanceof Error ? err.message : 'We could not send your enquiry. Please try again.');
    }
  };

  if (status === 'sent') {
    return (
      <div className="ui-card rounded-panel p-6 text-center sm:p-8" role="status">
        <CheckCircle2 className="mx-auto h-10 w-10" />
        <p className="mt-3 font-display text-xl">Enquiry sent</p>
        <p className="mx-auto mt-1.5 max-w-sm text-base text-muted">
          Thanks, {form.name.split(' ')[0] || 'we have it'}. Our team will reply by email{form.whatsapp ? ' or WhatsApp' : ''} with the full price for this vehicle.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="ui-card rounded-panel p-5 sm:p-7" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={label}>Full name *</span>
          <input required autoComplete="name" value={form.name} onChange={set('name')} placeholder="e.g. Kwame Mensah" className={input} />
        </label>
        <label className="block">
          <span className={label}>Email *</span>
          <input required type="email" autoComplete="email" value={form.email} onChange={set('email')} placeholder="you@example.com" className={input} />
        </label>
        <label className="block">
          <span className={label}>WhatsApp (optional)</span>
          <input type="tel" autoComplete="tel" value={form.whatsapp} onChange={set('whatsapp')} placeholder="+233 20 000 0000" className={input} />
        </label>
        <label className="block">
          <span className={label}>Deliver to</span>
          <input value={form.destination} onChange={set('destination')} placeholder="Country or port" className={input} />
        </label>
        <label className="block sm:col-span-2">
          <span className={label}>Message *</span>
          <textarea required rows={4} value={form.message} onChange={set('message')} className={`${input} resize-y`} />
        </label>
      </div>

      <label className="mt-4 flex items-start gap-3 text-sm text-muted">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#111113] dark:accent-white" />
        <span>
          I agree that GAC Auto Tech may contact me about this enquiry. See the{' '}
          <button type="button" onClick={openPrivacy} className="font-semibold underline underline-offset-2 cursor-pointer">
            privacy policy
          </button>
          .
        </span>
      </label>

      {error && (
        <p role="alert" className="mt-4 text-sm font-semibold">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-theme mt-5 inline-flex w-full items-center justify-center gap-2 rounded-control px-6 py-3.5 text-sm font-bold disabled:opacity-70 cursor-pointer sm:w-auto"
      >
        {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {status === 'sending' ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  );
};
