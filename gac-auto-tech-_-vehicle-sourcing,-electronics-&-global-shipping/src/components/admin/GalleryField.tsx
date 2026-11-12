'use client';

import React, { useEffect, useId, useState } from 'react';
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Star, X } from 'lucide-react';
import { VehicleImage } from '../../types';
import { MAX_VEHICLE_PHOTOS } from '../../data/catalog';
import { uploadPhoto } from './uploadPhoto';

interface Pending {
  key: string;
  preview: string;
}

interface GalleryFieldProps {
  images: VehicleImage[];
  /** Takes an updater because several uploads can finish while others are still running. */
  onChange: (update: (images: VehicleImage[]) => VehicleImage[]) => void;
  onUnauthorized: () => void;
  /** Reports whether uploads are still running, so the form can hold off saving until they finish. */
  onBusyChange?: (busy: boolean) => void;
}

const tileButton =
  'flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#111113] shadow transition-colors hover:bg-white disabled:opacity-40 cursor-pointer';

/** Several photos per vehicle. The first is the cover used on cards; the rest appear in the vehicle page gallery. */
export const GalleryField: React.FC<GalleryFieldProps> = ({ images, onChange, onUnauthorized, onBusyChange }) => {
  const inputId = useId();
  const [pending, setPending] = useState<Pending[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const room = MAX_VEHICLE_PHOTOS - images.length - pending.length;

  const busy = pending.length > 0;
  useEffect(() => {
    onBusyChange?.(busy);
  }, [busy, onBusyChange]);

  const addFiles = async (files: File[]) => {
    setErrors([]);
    const accepted = files.slice(0, Math.max(0, room));
    const skipped = files.length - accepted.length;
    if (skipped > 0) setErrors([`Only ${MAX_VEHICLE_PHOTOS} photos fit on a vehicle; ${skipped} were not added.`]);

    const jobs = accepted.map((file) => ({ file, key: `${Date.now()}-${Math.random()}`, preview: URL.createObjectURL(file) }));
    setPending((p) => [...p, ...jobs.map(({ key, preview }) => ({ key, preview }))]);

    // Two at a time keeps uploads quick without tripping over the server's request limits.
    const queue = [...jobs];
    const worker = async () => {
      for (let job = queue.shift(); job; job = queue.shift()) {
        const result = await uploadPhoto(job.file, 'vehicles');
        URL.revokeObjectURL(job.preview);
        const done = job.key;
        setPending((p) => p.filter((x) => x.key !== done));
        if (result.ok) {
          const { url, publicId } = result;
          onChange((current) => [...current, { url, publicId }]);
        } else if (result.unauthorized) {
          onUnauthorized();
          return;
        } else {
          setErrors((e) => [...e, `${job.file.name}: ${result.error}`]);
        }
      }
    };
    await Promise.all([worker(), worker()]);
  };

  const move = (from: number, to: number) =>
    onChange((current) => {
      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-bold">Photos *</p>
        <p className="text-sm text-muted">
          {images.length}/{MAX_VEHICLE_PHOTOS}
        </p>
      </div>

      <ul className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-2">
        {images.map((img, i) => (
          <li key={img.url} className="ui-well relative aspect-[4/3] overflow-hidden rounded-media">
            <img src={img.url} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
            <span className="absolute left-2 top-2 rounded-control bg-[#111113]/90 px-2 py-0.5 text-xs font-bold text-white">
              {i === 0 ? '1 · Cover' : i + 1}
            </span>
            <div className="absolute inset-x-2 bottom-2 flex justify-between gap-1">
              <div className="flex gap-1">
                <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} className={tileButton} aria-label={`Move photo ${i + 1} earlier`}>
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  disabled={i === images.length - 1}
                  className={tileButton}
                  aria-label={`Move photo ${i + 1} later`}
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="flex gap-1">
                {i > 0 && (
                  <button type="button" onClick={() => move(i, 0)} className={tileButton} aria-label={`Make photo ${i + 1} the cover`} title="Make cover">
                    <Star className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onChange((current) => current.filter((_, j) => j !== i))}
                  className={tileButton}
                  aria-label={`Remove photo ${i + 1}`}
                  title="Remove"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </li>
        ))}

        {pending.map((p) => (
          <li key={p.key} className="ui-well relative aspect-[4/3] overflow-hidden rounded-media">
            <img src={p.preview} alt="" className="h-full w-full object-cover opacity-70" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 text-sm font-bold text-white">
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading…
            </div>
          </li>
        ))}

        {room > 0 && (
          <li>
            <label
              htmlFor={inputId}
              className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-media border-2 border-dashed border-black/15 text-sm font-bold text-muted transition-colors hover:border-black/40 hover:text-[#111113] dark:border-white/20 dark:hover:border-white/50 dark:hover:text-white"
            >
              <ImagePlus className="h-6 w-6" />
              {images.length || pending.length ? 'Add more photos' : 'Add photos'}
            </label>
            <input
              id={inputId}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="sr-only"
              onChange={(e) => {
                addFiles(Array.from(e.target.files ?? []));
                e.target.value = '';
              }}
            />
          </li>
        )}
      </ul>

      <p className="mt-3 text-sm text-muted">

        Photos appear on the website in this order. Photo 1 is the cover on listing cards. Use the arrows to move a photo, or the star to make it the cover.
      </p>
      {errors.map((err) => (
        <p key={err} role="alert" className="mt-2 text-sm font-semibold">
          {err}
        </p>
      ))}
    </div>
  );
};
