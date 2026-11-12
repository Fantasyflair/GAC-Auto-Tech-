import { NextResponse } from 'next/server';
import { adminRoute, readJson } from '../../../../lib/adminRoute';
import { getSettings, saveSettings } from '../../../../lib/content';
import { parseSettings } from '../../../../lib/validateContent';

export const GET = adminRoute('Loading settings', async () => NextResponse.json({ settings: await getSettings() }));

export const PUT = adminRoute('Saving settings', async (request: Request) => {
  const parsed = parseSettings(await readJson(request));
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  await saveSettings(parsed.value);
  return NextResponse.json({ ok: true });
});
