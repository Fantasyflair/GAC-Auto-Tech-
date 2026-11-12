import { NextResponse } from 'next/server';
import { adminRoute, readJson } from '../../../../lib/adminRoute';
import { createVehicle, listVehiclesForAdmin } from '../../../../lib/content';
import { parseVehicle } from '../../../../lib/validateContent';

export const GET = adminRoute('Listing vehicles', async () => NextResponse.json({ vehicles: await listVehiclesForAdmin() }));

export const POST = adminRoute('Creating vehicle', async (request: Request) => {
  const parsed = parseVehicle(await readJson(request));
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const id = await createVehicle(parsed.value);
  return NextResponse.json({ id }, { status: 201 });
});
