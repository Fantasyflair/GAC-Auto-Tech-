import { NextResponse } from 'next/server';
import { isAdminRequest } from './adminSession';

/** Wraps an admin route: rejects signed-out requests and turns unexpected errors into a 503 the dashboard can show. */
export const adminRoute =
  <Args extends unknown[]>(label: string, handler: (...args: Args) => Promise<Response>) =>
  async (...args: Args) => {
    if (!(await isAdminRequest())) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
    try {
      return await handler(...args);
    } catch (err) {
      console.error(`${label} failed`, err);
      return NextResponse.json({ error: err instanceof Error ? err.message : 'Something went wrong.' }, { status: 503 });
    }
  };

export const readJson = async (request: Request) => (await request.json().catch(() => null)) as unknown;
