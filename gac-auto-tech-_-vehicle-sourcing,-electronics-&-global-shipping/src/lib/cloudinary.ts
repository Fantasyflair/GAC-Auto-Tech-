import { createHash } from 'crypto';
import { getDb } from './mongodb';

const ROOT_FOLDER = 'gac-auto-tech';

const config = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) throw new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.');
  return { cloudName, apiKey, apiSecret };
};

export const isCloudinaryConfigured = () =>
  !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

/** Cloudinary signs the alphabetically sorted parameters followed by the API secret. */
const sign = (params: Record<string, string | number>, apiSecret: string) =>
  createHash('sha1')
    .update(
      Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join('&') + apiSecret
    )
    .digest('hex');

/** Serves every upload as WebP/AVIF where supported, compressed, and no wider than 2000px. */
const deliveryUrl = (secureUrl: string) => secureUrl.replace('/image/upload/', '/image/upload/f_auto,q_auto,c_limit,w_2000/');

interface MediaDocument {
  publicId: string;
  url: string;
  width: number;
  height: number;
  bytes: number;
  folder: string;
  uploadedAt: Date;
}

const mediaCollection = async () => (await getDb()).collection<MediaDocument>('media');

export interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

/** Uploads an image to Cloudinary and records it in the media collection. */
export const uploadImage = async (file: Blob, subfolder: string): Promise<UploadedImage> => {
  const { cloudName, apiKey, apiSecret } = config();
  const folder = `${ROOT_FOLDER}/${subfolder}`;
  const timestamp = Math.round(Date.now() / 1000);

  const form = new FormData();
  form.append('file', file);
  form.append('api_key', apiKey);
  form.append('timestamp', String(timestamp));
  form.append('folder', folder);
  form.append('signature', sign({ folder, timestamp }, apiSecret));

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: form });
  const data = (await res.json()) as {
    secure_url?: string;
    public_id?: string;
    width?: number;
    height?: number;
    bytes?: number;
    error?: { message?: string };
  };
  if (!res.ok || !data.secure_url || !data.public_id) {
    throw new Error(`Cloudinary upload failed: ${data.error?.message ?? res.statusText}`);
  }

  const image: UploadedImage = {
    url: deliveryUrl(data.secure_url),
    publicId: data.public_id,
    width: data.width ?? 0,
    height: data.height ?? 0,
  };
  // The log is bookkeeping only; a database hiccup must not lose a photo that is already safely on Cloudinary.
  try {
    await (await mediaCollection()).insertOne({ ...image, bytes: data.bytes ?? 0, folder, uploadedAt: new Date() });
  } catch (err) {
    console.error('Logging an upload in MongoDB failed; the photo itself is saved on Cloudinary.', err);
  }
  return image;
};

/** Removes a replaced or deleted photo from Cloudinary. Failures are logged, never thrown, so a save still succeeds. */
export const deleteImage = async (publicId: string | undefined) => {
  if (!publicId || !publicId.startsWith(`${ROOT_FOLDER}/`)) return;
  try {
    const { cloudName, apiKey, apiSecret } = config();
    const timestamp = Math.round(Date.now() / 1000);
    const form = new FormData();
    form.append('public_id', publicId);
    form.append('api_key', apiKey);
    form.append('timestamp', String(timestamp));
    form.append('signature', sign({ public_id: publicId, timestamp }, apiSecret));
    await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, { method: 'POST', body: form });
    await (await mediaCollection()).deleteOne({ publicId });
  } catch (err) {
    console.error('Removing an old image from Cloudinary failed', err);
  }
};

/** Only photos shipped with the site or uploaded to this Cloudinary account may be saved on listings. */
export const isAllowedImageUrl = (url: string) => {
  if (/^\/images\/[\w.-]+$/.test(url)) return true;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  return !!cloudName && url.startsWith(`https://res.cloudinary.com/${cloudName}/image/upload/`);
};
