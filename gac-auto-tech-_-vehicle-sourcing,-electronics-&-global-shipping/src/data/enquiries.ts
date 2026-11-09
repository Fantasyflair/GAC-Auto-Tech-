import { ServiceType } from '../types';

export interface StoredEnquiry {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  whatsapp: string;
  service: ServiceType;
  destination: string;
  budget: string;
  details: string;
  status: 'new' | 'contacted';
}

// Enquiries live in this browser only until the form is connected to a real backend.
const STORAGE_KEY = 'gac_enquiries';
const MAX_STORED = 100;

export const loadEnquiries = (): StoredEnquiry[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as StoredEnquiry[]) : [];
  } catch {
    return [];
  }
};

export const saveEnquiries = (list: StoredEnquiry[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_STORED)));
};

export const addEnquiry = (entry: Omit<StoredEnquiry, 'id' | 'createdAt' | 'status'>) => {
  const enquiry: StoredEnquiry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    status: 'new',
  };
  saveEnquiries([enquiry, ...loadEnquiries()]);
};
