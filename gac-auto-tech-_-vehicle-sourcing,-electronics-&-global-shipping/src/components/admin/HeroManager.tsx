'use client';

import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { HeroSlide } from '../../types';
import { SERVICE_LABELS } from '../../data/catalog';
import { ImageField } from './ImageField';
import { useAdminUi } from './ui';
import { adminFetch, fieldClass, jsonInit, labelClass } from './adminApi';

const LIMITS = { eyebrow: 60, title: 80, copy: 160 };

export const HeroManager: React.FC<{ onUnauthorized: () => void }> = ({ onUnauthorized }) => {
  const { notify } = useAdminUi();
  const [slides, setSlides] = useState<HeroSlide[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    adminFetch<{ slides: HeroSlide[] }>('/api/admin/hero').then((result) => {
      if (result.ok) setSlides(result.data.slides);
      else if (result.status === 401) onUnauthorized();
      else setMessage(result.error);
    });
  }, [onUnauthorized]);

  const update = (index: number, patch: Partial<HeroSlide>) =>
    setSlides((list) => list && list.map((s, i) => (i === index ? { ...s, ...patch } : s)));

  const save = async () => {
    if (!slides) return;
    setSaving(true);
    const result = await adminFetch('/api/admin/hero', jsonInit('PUT', { slides }));
    setSaving(false);
    if (!result.ok && result.status === 401) return onUnauthorized();
    notify(result.ok ? 'Banner saved. It is live on the home page.' : result.error, result.ok ? 'success' : 'error');
  };

  if (!slides) {
    return (
      <p className="mt-10 flex items-center justify-center gap-2 text-sm text-muted">
        <Loader2 className="h-4 w-4 animate-spin" />
        {message || 'Loading banner…'}
      </p>
    );
  }

  return (
    <section className="space-y-5">
      {slides.map((slide, i) => (
        <div
          key={slide.service}
          className="grid gap-5 rounded-panel border border-black/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-6 lg:grid-cols-12 dark:border-white/10 dark:bg-[#121214]"
        >
          <div className="lg:col-span-5">
            <p className="eyebrow text-muted">
              Slide {i + 1} · {SERVICE_LABELS[slide.service]}
            </p>
            <div className="mt-3">
              <ImageField
                label="Background photo"
                value={{ url: slide.image, publicId: slide.imagePublicId }}
                onChange={({ url, publicId }) => update(i, { image: url, imagePublicId: publicId })}
                folder="hero"
                aspect="aspect-[16/9]"
                onUnauthorized={onUnauthorized}
              />
            </div>
          </div>
          <div className="grid content-start gap-4 lg:col-span-7">
            {(
              [
                ['eyebrow', 'Small label above the headline', 'e.g. Auctions · Dealers'],
                ['title', 'Headline', 'e.g. Auction cars, delivered to Ghana'],
                ['copy', 'Short line under the headline', 'e.g. We bid, inspect, and ship from Canada, the USA, and the UK.'],
              ] as const
            ).map(([key, label, placeholder]) => (
              <label key={key} className="block">
                <span className={labelClass}>
                  {label}
                  <span className="float-right font-medium text-muted">
                    {slide[key].length}/{LIMITS[key]}
                  </span>
                </span>
                <input
                  value={slide[key]}
                  maxLength={LIMITS[key]}
                  onChange={(e) => update(i, { [key]: e.target.value })}
                  placeholder={placeholder}
                  className={fieldClass}
                />
              </label>
            ))}
            <label className="block">
              <span className={labelClass}>Photo description (for screen readers)</span>
              <input value={slide.alt} onChange={(e) => update(i, { alt: e.target.value })} placeholder="e.g. Black Porsche on a highway" className={fieldClass} />
            </label>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="btn-theme inline-flex w-full items-center justify-center gap-2 rounded-control px-6 py-3.5 text-sm font-bold disabled:opacity-70 cursor-pointer sm:w-auto"
      >
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Save banner
      </button>
    </section>
  );
};
