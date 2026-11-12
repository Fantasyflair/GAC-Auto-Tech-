import { NextResponse } from 'next/server';
import { isAdminRequest } from '../../../../lib/adminSession';
import { listEnquiries } from '../../../../lib/enquiryStore';

export async function GET() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });

  try {
    return NextResponse.json({ enquiries: await listEnquiries() });
  } catch (err) {
    console.error('Loading enquiries failed', err);
    return NextResponse.json({ error: 'Could not reach the database.' }, { status: 503 });
  }
}
