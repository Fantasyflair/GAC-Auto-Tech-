import { ServiceType, VehicleImage, VehicleListing } from '../types';

export const MAX_VEHICLE_PHOTOS = 12;

export const DAMAGE_AREAS = [
  'Front',
  'Rear',
  'Left side',
  'Right side',
  'Roof',
  'Windows / glass',
  'Wheels / tyres',
  'Engine',
  'Transmission',
  'Electrical',
  'Interior',
  'Undercarriage',
  'Water / flood',
  'Airbags deployed',
] as const;

/** Short buyer-facing summary, or null when the listing predates damage reporting. */
export const damageSummary = (v: VehicleListing): string | null => {
  if (!v.damage) return null;
  if (!v.damage.damaged) return 'No damage';
  if (v.damage.areas.length === 0) return 'Damaged';
  return v.damage.areas.length > 2 ? `${v.damage.areas.slice(0, 2).join(', ')} +${v.damage.areas.length - 2}` : v.damage.areas.join(', ');
};

/** All photos of a vehicle, cover first, including listings saved before galleries existed. */
export const vehicleImages = (v: VehicleListing): VehicleImage[] =>
  v.images?.length ? v.images : v.imageUrl ? [{ url: v.imageUrl, publicId: v.imagePublicId }] : [];

export const AVAILABILITY_OPTIONS: VehicleListing['availability'][] = ['Available', 'Incoming', 'On request', 'Sold'];
export const SOURCE_OPTIONS: VehicleListing['sourceType'][] = ['Auction', 'Dealer Network'];

export const availabilityLabel = (value: VehicleListing['availability']) => {
  if (value === 'Available') return 'In stock';
  if (value === 'Incoming') return 'Arriving soon';
  if (value === 'Sold') return 'Sold';
  return 'Sourced to order';
};

export const SERVICE_LABELS: Record<ServiceType, string> = {
  vehicle_sourcing: 'Vehicle sourcing',
  shipping_quote: 'Shipping',
  general_merchandise: 'General goods',
};

/** Same source first, so an auction car suggests other auction cars. */
export const relatedVehicles = (vehicle: VehicleListing, all: VehicleListing[], limit = 3) =>
  all
    .filter((v) => v.id !== vehicle.id && v.availability !== 'Sold')
    .sort((a, b) => Number(b.sourceType === vehicle.sourceType) - Number(a.sourceType === vehicle.sourceType))
    .slice(0, limit);

export const vehicleQuoteDetails = (v: VehicleListing) => `${v.year} ${v.make} ${v.model} (Ref: ${v.listingRef})`;
