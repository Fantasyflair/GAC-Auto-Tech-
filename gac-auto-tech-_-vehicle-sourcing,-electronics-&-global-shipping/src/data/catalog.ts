import { ElectronicProduct, ServiceType, VehicleListing } from '../types';
import { SAMPLE_ELECTRONICS, SAMPLE_VEHICLES } from './mockData';

export const ELECTRONICS_CATEGORIES: { id: ElectronicProduct['category']; label: string }[] = [
  { id: 'laptops', label: 'Laptops' },
  { id: 'phones', label: 'Phones' },
  { id: 'tablets', label: 'Tablets' },
  { id: 'audio', label: 'Audio' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'wearables', label: 'Wearables' },
  { id: 'accessories', label: 'Accessories' },
];

export const categoryLabel = (id: ElectronicProduct['category']) =>
  ELECTRONICS_CATEGORIES.find((c) => c.id === id)?.label ?? id;

export const availabilityLabel = (value: VehicleListing['availability'] | ElectronicProduct['availability']) => {
  if (value === 'Available') return 'In stock';
  if (value === 'Incoming') return 'Arriving soon';
  if (value === 'Sold') return 'Sold';
  return 'Sourced to order';
};

export const SERVICE_LABELS: Record<ServiceType, string> = {
  vehicle_sourcing: 'Vehicle sourcing',
  electronics_enquiry: 'Electronics',
  shipping_quote: 'Shipping',
  general_merchandise: 'General goods',
};

export const getProduct = (id: string) => SAMPLE_ELECTRONICS.find((p) => p.id === id);
export const getVehicle = (id: string) => SAMPLE_VEHICLES.find((v) => v.id === id);

/** Same category first, then the rest of the catalogue, so the row is always full. */
export const relatedProducts = (product: ElectronicProduct, limit = 4) => {
  const others = SAMPLE_ELECTRONICS.filter((p) => p.id !== product.id);
  const sameCategory = others.filter((p) => p.category === product.category);
  const rest = others.filter((p) => p.category !== product.category && p.wholesaleEligible === product.wholesaleEligible);
  const fallback = others.filter((p) => !sameCategory.includes(p) && !rest.includes(p));
  return [...sameCategory, ...rest, ...fallback].slice(0, limit);
};

export const relatedVehicles = (vehicle: VehicleListing, limit = 4) =>
  SAMPLE_VEHICLES.filter((v) => v.id !== vehicle.id)
    .sort((a, b) => Number(b.sourceType === vehicle.sourceType) - Number(a.sourceType === vehicle.sourceType))
    .slice(0, limit);

export const productQuoteDetails = (p: ElectronicProduct) => `${p.title} (Ref: ${p.listingRef})`;
export const vehicleQuoteDetails = (v: VehicleListing) => `${v.year} ${v.make} ${v.model} (Ref: ${v.listingRef})`;
