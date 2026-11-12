import { adminFetch } from './adminApi';

const MAX_EDGE = 2000;

/**
 * Re-encodes the photo in the browser before upload: caps the longest edge, applies the camera's
 * rotation, strips metadata such as GPS location, and keeps the file well under the 4 MB server limit.
 */
const shrink = async (file: File): Promise<Blob> => {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const encode = (type: string) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85));
  const blob = (await encode('image/webp')) ?? (await encode('image/jpeg'));
  if (!blob) throw new Error('This photo could not be processed. Try a JPG or PNG.');
  return blob;
};

/** `url`/`publicId` are set when `ok`; `error` (and `unauthorized` for an expired session) when not. */
export interface UploadOutcome {
  ok: boolean;
  url?: string;
  publicId?: string;
  unauthorized?: boolean;
  error?: string;
}

/** Shrinks and uploads one photo to Cloudinary through the admin API. Never throws. */
export const uploadPhoto = async (file: File, folder: 'vehicles' | 'hero'): Promise<UploadOutcome> => {
  if (!file.type.startsWith('image/')) return { ok: false, unauthorized: false, error: `${file.name} is not an image.` };
  try {
    const blob = await shrink(file);
    const form = new FormData();
    form.append('file', blob, `${file.name.replace(/\.[^.]+$/, '') || 'photo'}.${blob.type === 'image/webp' ? 'webp' : 'jpg'}`);
    form.append('folder', folder);
    const result = await adminFetch<{ url: string; publicId: string }>('/api/admin/uploads', { method: 'POST', body: form });
    if (!result.ok) return { ok: false, unauthorized: result.status === 401, error: result.error };
    return { ok: true, url: result.data.url, publicId: result.data.publicId };
  } catch (err) {
    return { ok: false, unauthorized: false, error: err instanceof Error ? err.message : 'Upload failed. Please try again.' };
  }
};
