import { ServiceType } from '../types';

export type EnquiryStatus = 'new' | 'contacted';

export interface Enquiry {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  whatsapp: string;
  service: ServiceType;
  destination: string;
  budget: string;
  details: string;
  status: EnquiryStatus;
  /** Set when the enquiry was sent from a vehicle's page, so the dashboard can link straight to it. */
  vehicleId?: string;
  vehicleTitle?: string;
}

export type NewEnquiry = Omit<Enquiry, 'id' | 'createdAt' | 'status'>;

const errorMessage = async (res: Response, fallback: string) =>
  ((await res.json().catch(() => null)) as { error?: string } | null)?.error ?? fallback;

/** Sends a quote-form enquiry to the database. Throws with a readable message on failure. */
export const submitEnquiry = async (entry: NewEnquiry) => {
  const res = await fetch('/api/enquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error(await errorMessage(res, 'We could not send your enquiry. Please try again or message us on WhatsApp.'));
};
