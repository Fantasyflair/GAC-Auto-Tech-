import { NextResponse } from 'next/server';
import { adminRoute, readJson } from '../../../../../lib/adminRoute';
import { deleteImage } from '../../../../../lib/cloudinary';
import { deleteVehicle, updateVehicle } from '../../../../../lib/content';
import { parseVehicle } from '../../../../../lib/validateContent';

type Context = { params: Promise<{ id: string }> };

const notFound = () => NextResponse.json({ error: 'Vehicle not found.' }, { status: 404 });

export const PUT = adminRoute('Updating vehicle', async (request: Request, { params }: Context) => {
  const parsed = parseVehicle(await readJson(request));
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const result = await updateVehicle((await params).id, parsed.value);
  if (!result.found) return notFound();

  const kept = new Set(parsed.value.images.map((img) => img.publicId));
  await Promise.all(result.previousPhotoIds.filter((id) => !kept.has(id)).map(deleteImage));
  return NextResponse.json({ ok: true });
});

export const DELETE = adminRoute('Deleting vehicle', async (_request: Request, { params }: Context) => {
  const result = await deleteVehicle((await params).id);
  if (!result.found) return notFound();
  await Promise.all(result.previousPhotoIds.map(deleteImage));
  return NextResponse.json({ ok: true });
});
