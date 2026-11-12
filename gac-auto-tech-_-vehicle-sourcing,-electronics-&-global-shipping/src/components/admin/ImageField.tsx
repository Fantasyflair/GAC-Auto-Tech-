'use client';

import React, { useEffect, useId, useState } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { uploadPhoto } from './uploadPhoto';

export interface ImageValue {
  url: string;
  publicId?: string;
}

interface ImageFieldProps {
  label: string;
  value: ImageValue;
  onChange: (value: ImageValue) => void;
  folder: 'vehicles' | 'hero';
  onUnauthorized: () => void;
  aspect?: string;
}

/** A single photo with replace. Shows the chosen file immediately while it uploads. */
export const ImageField: React.FC<ImageFieldProps> = ({ label, value, onChange, folder, onUnauthorized, aspect = 'aspect-[4/3]' }) => {
  const inputId = useId();
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setPreview(URL.createObjectURL(file));
    const result = await uploadPhoto(file, folder);
    setPreview('');
    if (!result.ok) {
      if (result.unauthorized) return onUnauthorized();
      setError(result.error);
      return;
    }
    onChange({ url: result.url, publicId: result.publicId });
  };

  const shown = preview || value.url;

  return (
    <div>
      <p className="mb-1.5 text-sm font-bold">{label}</p>
      <div className={`ui-well relative ${aspect} overflow-hidden rounded-media`}>
        {shown ? (
          <img src={shown} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">No photo yet</div>
        )}
        {preview && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/45 text-sm font-bold text-white">
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading…
          </div>
        )}
      </div>
      <label
        htmlFor={inputId}
        className={`mt-2 inline-flex items-center gap-2 rounded-control border ui-divider px-3.5 py-2 text-sm font-bold transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${
          preview ? 'pointer-events-none opacity-60' : 'cursor-pointer'
        }`}
      >
        <ImagePlus className="h-4 w-4" />
        {value.url ? 'Replace photo' : 'Upload photo'}
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="sr-only"
        disabled={!!preview}
        onChange={(e) => {
          upload(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      {error && (
        <p role="alert" className="mt-2 text-sm font-semibold">
          {error}
        </p>
      )}
    </div>
  );
};
