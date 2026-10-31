export type ServiceType = 
  | 'vehicle_sourcing'
  | 'electronics_enquiry'
  | 'shipping_quote'
  | 'general_merchandise';

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
  availability: 'Available' | 'Incoming' | 'Sold' | 'On request';
  listingRef: string;
  imageUrl: string;
  notes: string;
  sourceType: 'Copart' | 'IAAI' | 'Dealer Network';
}

export interface ElectronicProduct {
  id: string;
  title: string;
  category: 'laptops' | 'phones' | 'tablets' | 'audio' | 'gaming' | 'wearables' | 'accessories';
  specs: string[];
  condition: 'Brand New' | 'Certified Refurbished' | 'Open Box' | 'Grade A Pre-Owned';
  availability: 'Available' | 'Incoming' | 'On request';
  listingRef: string;
  imageUrl: string;
  wholesaleEligible: boolean;
  notes: string;
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
  electronicsModelAndQty?: string;
  merchandiseDescriptionOrLink?: string;
}
