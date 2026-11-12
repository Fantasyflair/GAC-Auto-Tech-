'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { VehicleImage } from '../types';

const arrow =
  'absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#111113] shadow-lg transition-colors hover:bg-white cursor-pointer';

export const VehicleGallery: React.FC<{ images: VehicleImage[]; title: string }> = ({ images, title }) => {
  const [index, setIndex] = useState(0);
  const count = images.length;
  if (count === 0) return <div className="ui-well aspect-[16/11] rounded-panel" />;

  const go = (step: number) => setIndex((i) => (i + step + count) % count);

  return (
    <div>
      <div
        className="ui-well relative aspect-[16/11] overflow-hidden rounded-panel"
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') go(-1);
          if (e.key === 'ArrowRight') go(1);
        }}
      >
        <img src={images[index].url} alt={`${title}, photo ${index + 1} of ${count}`} className="h-full w-full object-cover" />
        {count > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} className={`${arrow} left-3`} aria-label="Previous photo">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => go(1)} className={`${arrow} right-3`} aria-label="Next photo">
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-control bg-black/65 px-2.5 py-1 text-xs font-bold text-white">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
          {images.map((img, i) => (
            <li key={img.url}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
                className={`block aspect-[4/3] w-full overflow-hidden rounded-control transition-opacity cursor-pointer ${
                  i === index ? 'ring-2 ring-[#111113] ring-offset-2 dark:ring-white dark:ring-offset-[#09090B]' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
