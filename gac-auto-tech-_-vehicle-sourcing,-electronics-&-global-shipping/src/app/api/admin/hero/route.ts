import { NextResponse } from 'next/server';
import { adminRoute, readJson } from '../../../../lib/adminRoute';
import { deleteImage } from '../../../../lib/cloudinary';
import { getHeroSlides, saveHeroSlides } from '../../../../lib/content';
import { parseHeroSlides } from '../../../../lib/validateContent';

export const GET = adminRoute('Loading hero slides', async () => NextResponse.json({ slides: await getHeroSlides() }));

export const PUT = adminRoute('Saving hero slides', async (request: Request) => {
  const parsed = parseHeroSlides(await readJson(request));
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const previous = await saveHeroSlides(parsed.value);
  const stillUsed = new Set(parsed.value.map((s) => s.imagePublicId));
  await Promise.all(previous.filter((s) => !stillUsed.has(s.imagePublicId)).map((s) => deleteImage(s.imagePublicId)));
  return NextResponse.json({ ok: true });
});
