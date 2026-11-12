import { NextResponse } from 'next/server';
import { adminRoute } from '../../../../lib/adminRoute';
import { isCloudinaryConfigured, uploadImage } from '../../../../lib/cloudinary';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
// Vercel caps request bodies at 4.5 MB; the dashboard shrinks photos well below this before sending.
const MAX_BYTES = 4 * 1024 * 1024;
const FOLDERS = ['vehicles', 'hero'];

/**
 * Receives a photo from the admin dashboard, stores it on Cloudinary, logs it in MongoDB's media
 * collection, and returns the Cloudinary URL for the dashboard to save on a listing or slide.
 */
export const POST = adminRoute('Image upload', async (request: Request) => {
  if (!isCloudinaryConfigured()) {
    return NextResponse.json({ error: 'Image uploads are not set up yet. Add the Cloudinary keys to the environment.' }, { status: 503 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get('file');
  const folder = String(form?.get('folder') ?? 'vehicles');

  if (!(file instanceof Blob) || file.size === 0) return NextResponse.json({ error: 'Choose a photo to upload.' }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: 'Photos must be JPG, PNG, WebP or AVIF.' }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'That photo is too large. Keep it under 4 MB.' }, { status: 413 });
  if (!FOLDERS.includes(folder)) return NextResponse.json({ error: 'Unknown upload folder.' }, { status: 400 });

  const image = await uploadImage(file, folder);
  return NextResponse.json(image, { status: 201 });
});
