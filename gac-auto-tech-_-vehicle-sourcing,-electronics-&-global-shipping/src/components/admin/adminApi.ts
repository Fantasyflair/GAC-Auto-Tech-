/** `data` is only meaningful when `ok` is true; `error` only when it is false. Status 401 means the session expired. */
export interface ApiResult<T> {
  ok: boolean;
  status: number;
  data: T;
  error: string;
}

/** Calls an admin API route and normalises failures into a readable message. */
export const adminFetch = async <T,>(url: string, init?: RequestInit): Promise<ApiResult<T>> => {
  const res = await fetch(url, { cache: 'no-store', ...init }).catch(() => null);
  if (!res) return { ok: false, status: 0, data: undefined as T, error: 'Could not reach the server. Check your connection and try again.' };
  const body = (await res.json().catch(() => null)) as (T & { error?: string }) | null;
  if (!res.ok) return { ok: false, status: res.status, data: undefined as T, error: body?.error ?? 'Something went wrong. Please try again.' };
  return { ok: true, status: res.status, data: body as T, error: '' };
};

export const jsonInit = (method: 'POST' | 'PUT' | 'PATCH', body: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export const fieldClass =
  'w-full rounded-control border ui-divider bg-white px-3.5 py-2.5 text-base text-[#111113] placeholder:text-[#78787f] focus:border-black/50 focus:outline-none dark:bg-[#151517] dark:text-white dark:focus:border-white/55';

export const labelClass = 'mb-1.5 block text-sm font-bold';
