import { NextResponse } from 'next/server';
import { isAdminRequest } from '../../../../../lib/adminSession';
import { deleteEnquiry, setEnquiryStatus } from '../../../../../lib/enquiryStore';

type Context = { params: Promise<{ id: string }> };

const unauthorized = () => NextResponse.json({ error: 'Please sign in.' }, { status: 401 });

export async function PATCH(request: Request, { params }: Context) {
  if (!(await isAdminRequest())) return unauthorized();

  const body = (await request.json().catch(() => null)) as { status?: unknown } | null;
  if (body?.status !== 'new' && body?.status !== 'contacted') {
    return NextResponse.json({ error: 'Status must be "new" or "contacted".' }, { status: 400 });
  }

  try {
    const updated = await setEnquiryStatus((await params).id, body.status);
    return updated ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'Enquiry not found.' }, { status: 404 });
  } catch (err) {
    console.error('Updating enquiry failed', err);
    return NextResponse.json({ error: 'Could not reach the database.' }, { status: 503 });
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const deleted = await deleteEnquiry((await params).id);
    return deleted ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'Enquiry not found.' }, { status: 404 });
  } catch (err) {
    console.error('Deleting enquiry failed', err);
    return NextResponse.json({ error: 'Could not reach the database.' }, { status: 503 });
  }
}
