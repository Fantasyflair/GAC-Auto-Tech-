import { NextResponse } from 'next/server';
import { insertEnquiry } from '../../../lib/enquiryStore';
import type { ServiceType } from '../../../types';

const SERVICES: ServiceType[] = ['vehicle_sourcing', 'shipping_quote', 'general_merchandise'];

const LIMITS = { name: 120, email: 200, whatsapp: 40, destination: 120, budget: 60, details: 4000 } as const;

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });

  const entry = {
    name: text(body.name, LIMITS.name),
    email: text(body.email, LIMITS.email),
    whatsapp: text(body.whatsapp, LIMITS.whatsapp),
    service: body.service as ServiceType,
    destination: text(body.destination, LIMITS.destination),
    budget: text(body.budget, LIMITS.budget),
    details: text(body.details, LIMITS.details),
    vehicleId: text(body.vehicleId, 80) || undefined,
    vehicleTitle: text(body.vehicleTitle, 160) || undefined,
  };

  if (!entry.name) return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entry.email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (!SERVICES.includes(entry.service)) return NextResponse.json({ error: 'Please choose a service.' }, { status: 400 });
  if (!entry.details) return NextResponse.json({ error: 'Please tell us what you need.' }, { status: 400 });

  try {
    await insertEnquiry(entry);
  } catch (err) {
    console.error('Saving enquiry failed', err);
    return NextResponse.json(
      { error: 'We could not send your enquiry right now. Please try again or message us on WhatsApp.' },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
