import { ObjectId, WithId } from 'mongodb';
import { getDb } from './mongodb';
import type { Enquiry, EnquiryStatus } from '../data/enquiries';
import type { ServiceType } from '../types';

interface EnquiryDocument {
  name: string;
  email: string;
  whatsapp: string;
  service: ServiceType;
  destination: string;
  budget: string;
  details: string;
  status: EnquiryStatus;
  createdAt: Date;
  vehicleId?: string;
  vehicleTitle?: string;
}

const collection = async () => (await getDb()).collection<EnquiryDocument>('enquiries');

const toEnquiry = ({ _id, createdAt, ...rest }: WithId<EnquiryDocument>): Enquiry => ({
  ...rest,
  id: _id.toHexString(),
  createdAt: createdAt.toISOString(),
});

export const insertEnquiry = async (entry: Omit<EnquiryDocument, 'status' | 'createdAt'>) => {
  await (await collection()).insertOne({ ...entry, status: 'new', createdAt: new Date() });
};

export const listEnquiries = async (limit = 500) =>
  (await (await collection()).find().sort({ createdAt: -1 }).limit(limit).toArray()).map(toEnquiry);

/** Returns false when the id is malformed or no enquiry has it. */
export const setEnquiryStatus = async (id: string, status: EnquiryStatus) => {
  if (!ObjectId.isValid(id)) return false;
  const result = await (await collection()).updateOne({ _id: new ObjectId(id) }, { $set: { status } });
  return result.matchedCount === 1;
};

export const deleteEnquiry = async (id: string) => {
  if (!ObjectId.isValid(id)) return false;
  const result = await (await collection()).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
};
