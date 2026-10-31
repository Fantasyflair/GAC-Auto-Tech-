import React, { createContext, useContext, useEffect, useState } from 'react';
import { ServiceType } from '../types';

export interface EnquiryItem {
  id: string;
  title: string;
  reference: string;
  imageUrl: string;
  service: ServiceType;
}

interface EnquiryListContextType {
  items: EnquiryItem[];
  isOpen: boolean;
  add: (item: EnquiryItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
  open: () => void;
  close: () => void;
}

const STORAGE_KEY = 'gac_enquiry_list';

const EnquiryListContext = createContext<EnquiryListContextType | null>(null);

export const EnquiryListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<EnquiryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as EnquiryItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value: EnquiryListContextType = {
    items,
    isOpen,
    add: (item) => setItems((current) => (current.some((i) => i.id === item.id) ? current : [...current, item])),
    remove: (id) => setItems((current) => current.filter((i) => i.id !== id)),
    clear: () => setItems([]),
    has: (id) => items.some((i) => i.id === id),
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };

  return <EnquiryListContext.Provider value={value}>{children}</EnquiryListContext.Provider>;
};

export const useEnquiryList = () => {
  const context = useContext(EnquiryListContext);
  if (!context) throw new Error('useEnquiryList must be used inside EnquiryListProvider');
  return context;
};
