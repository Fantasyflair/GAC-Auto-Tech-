export type ServiceType =
  | 'vehicle_sourcing'
  | 'shipping_quote'
  | 'general_merchandise';

export interface VehicleImage {
  url: string;
  /** Cloudinary id, kept so a removed photo can be deleted from Cloudinary. */
  publicId?: string;
}

export interface VehicleDamage {
  damaged: boolean;
  /** Where the damage is, chosen from DAMAGE_AREAS so buyers can scan it quickly. */
  areas: string[];
  /** Free text for anything the areas don't cover, e.g. "Dent on rear passenger door, airbags intact". */
  notes: string;
}

export interface VehicleListing {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  category: string;
  specs: {
    mileage?: string;
    engine?: string;
    transmission: string;
    drivetrain: string;
    fuelType: string;
  };
  condition: string;
  /** Missing on listings saved before damage reporting existed. */
  damage?: VehicleDamage;
  availability: 'Available' | 'Incoming' | 'Sold' | 'On request';
  listingRef: string;
  /** The cover photo. Always mirrors images[0] when a gallery exists. */
  imageUrl: string;
  imagePublicId?: string;
  /** Every photo of the vehicle, cover first. Older listings may only have imageUrl. */
  images?: VehicleImage[];
  notes: string;
  sourceType: 'Auction' | 'Dealer Network';
}

/** One hero banner slide. The service decides the tab label, icon and buttons; the admin edits the rest. */
export interface HeroSlide {
  service: ServiceType;
  eyebrow: string;
  title: string;
  copy: string;
  image: string;
  imagePublicId?: string;
  alt: string;
}

export interface SiteSettings {
  /** International format with country code, digits only, e.g. 233201234567. */
  whatsappNumber: string;
  email: string;
  social: {
    instagram: string;
    facebook: string;
    x: string;
    tiktok: string;
    linkedin: string;
  };
}

export interface QuoteFormData {
  fullName: string;
  email: string;
  whatsappNumber: string;
  serviceRequired: ServiceType;
  destinationCountry: string;
  budgetAmount: string;
  currency: string;
  requirements: string;
  consentAgreed: boolean;

  // Conditional fields
  vehicleMakeModelOrLink?: string;
  shippingOriginAndCargo?: string;
  merchandiseDescriptionOrLink?: string;
}
