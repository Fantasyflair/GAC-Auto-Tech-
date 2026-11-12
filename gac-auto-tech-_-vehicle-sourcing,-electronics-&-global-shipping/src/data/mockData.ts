import { HeroSlide, SiteSettings, VehicleListing } from '../types';

/** Builds a WhatsApp chat link for the given number (digits only, with country code). */
export function buildWhatsAppUrl(number: string, customMessage?: string): string {
  const defaultMsg = 'Hello GAC Auto Tech, I would like to make an enquiry regarding your services.';
  const text = encodeURIComponent(customMessage || defaultMsg);
  return `https://wa.me/${number.replace(/\D/g, '')}?text=${text}`;
}

/* Everything below is starting content. It seeds the database the first time it is used,
   and the site falls back to it if the database cannot be reached. */

export const DEFAULT_SETTINGS: SiteSettings = {
  whatsappNumber: '16470000000',
  email: '',
  social: {
    instagram: 'https://www.instagram.com/',
    facebook: 'https://www.facebook.com/',
    x: 'https://x.com/',
    tiktok: 'https://www.tiktok.com/',
    linkedin: 'https://www.linkedin.com/',
  },
};

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    service: 'vehicle_sourcing',
    eyebrow: 'Auctions · Dealers',
    title: 'Auction cars, delivered to Ghana',
    copy: 'We bid, inspect, and ship from Canada, the USA, and the UK.',
    image: '/images/porsche-911.jpg',
    alt: 'Black Porsche Panamera on the highway',
  },
  {
    service: 'shipping_quote',
    eyebrow: 'RoRo · Containers',
    title: 'Canada, USA and UK to Tema',
    copy: 'Cars and cargo shipped, with export paperwork handled.',
    image: '/images/port-hamburg.jpg',
    alt: 'Container ships and cranes at a busy port',
  },
  {
    service: 'general_merchandise',
    eyebrow: 'Parts · Equipment · Goods',
    title: "If it exists, we'll source it",
    copy: 'Combined with your other items in one shipment.',
    image: '/images/warehouse-boxes.jpg',
    alt: 'Boxes packed and ready in a warehouse',
  },
];

export const SAMPLE_VEHICLES: VehicleListing[] = [
  {
    id: 'veh-01',
    title: 'BMW i4 eDrive40 M-Sport',
    make: 'BMW',
    model: 'i4 Gran Coupe',
    year: 2023,
    category: 'Electric / Sport Gran Coupe',
    specs: {
      mileage: '12,500 km',
      engine: 'Single Electric Motor (335 hp)',
      transmission: 'Single-Speed Automatic',
      drivetrain: 'Rear-Wheel Drive',
      fuelType: 'Electric'
    },
    condition: 'Clean Title · Verified Battery Health 98%',
    availability: 'Available',
    listingRef: 'GAC-VEH-2023-BI4',
    imageUrl: '/images/bmw.jpg',
    notes: 'M-Sport package with curved display, wireless charging, and a verified clean-title inspection report. Export ready for Ghana.',
    sourceType: 'Auction'
  },
  {
    id: 'veh-02',
    title: 'Audi A7 55 TFSI Quattro S-Line',
    make: 'Audi',
    model: 'A7 Sportback',
    year: 2023,
    category: 'Executive Sportback',
    specs: {
      mileage: '18,400 km',
      engine: '3.0L Turbocharged V6 (335 hp)',
      transmission: '7-Speed S Tronic Dual-Clutch',
      drivetrain: 'Quattro All-Wheel Drive',
      fuelType: 'Gasoline Hybrid'
    },
    condition: 'Run & Drive Certified · Full Inspection Report',
    availability: 'Available',
    listingRef: 'GAC-VEH-2023-AA7',
    imageUrl: '/images/audi-a7.jpg',
    notes: 'Premium Plus trim with Matrix LED headlights, Bang & Olufsen sound, and verified mechanical running condition at auction.',
    sourceType: 'Auction'
  },
  {
    id: 'veh-03',
    title: 'Mercedes-AMG GLC 43 Coupé',
    make: 'Mercedes-Benz',
    model: 'AMG GLC 43 Coupé',
    year: 2024,
    category: 'Performance SUV Coupé',
    specs: {
      mileage: '14,600 km',
      engine: '2.0L Turbo Inline-4 with Electric Turbocharger (416 hp)',
      transmission: 'AMG SPEEDSHIFT MCT 9-Speed',
      drivetrain: '4MATIC+ All-Wheel Drive',
      fuelType: 'Mild Hybrid'
    },
    condition: 'Clean Title · Zero Accident History',
    availability: 'Incoming',
    listingRef: 'GAC-VEH-2024-GLC43',
    imageUrl: '/images/amg-gle-white.jpg',
    notes: 'AMG Night Package, panoramic roof, quad exhaust, and adaptive suspension. High demand model for West African export.',
    sourceType: 'Dealer Network'
  },
  {
    id: 'veh-04',
    title: 'Porsche Panamera Turbo',
    make: 'Porsche',
    model: 'Panamera Turbo',
    year: 2021,
    category: 'Luxury Sport Sedan',
    specs: {
      mileage: '28,300 km',
      engine: '4.0L Twin-Turbo V8 (550 hp)',
      transmission: '8-Speed Porsche Doppelkupplung (PDK)',
      drivetrain: 'All-Wheel Drive',
      fuelType: 'Gasoline'
    },
    condition: 'Pristine Inspection · Minor Bumper Scrape',
    availability: 'On request',
    listingRef: 'GAC-VEH-2021-PNMT',
    imageUrl: '/images/porsche-911.jpg',
    notes: 'Sport Chrono package, active rear spoiler, and adaptive air suspension. Sourced through a specialist auction recovery partner.',
    sourceType: 'Auction'
  }
];

export const FAQ_ITEMS = [
  {
    question: 'What can GAC Auto Tech help me source?',
    answer: 'We assist with vehicle sourcing, international shipping, and general merchandise. Send us your requirements to discuss available options.'
  },
  {
    question: 'Can you help me find a vehicle from a car auction?',
    answer: 'Yes. Share your budget, preferred vehicle details, or a listing link to discuss sourcing support.'
  },
  {
    question: 'Do you work with wholesale customers?',
    answer: 'Yes. We welcome enquiries from individual buyers and businesses ordering in volume.'
  },
  {
    question: 'Where do you arrange shipping from?',
    answer: 'Shipping enquiries are welcome for Canada, the USA, the UK, and other supported locations. Route availability depends on the shipment and service required.'
  },
  {
    question: 'Can you arrange delivery to Ghana?',
    answer: 'Yes. We assist with Ghana-bound shipping enquiries. The available service and destination arrangements are confirmed for each shipment.'
  },
  {
    question: 'How much does sourcing or shipping cost?',
    answer: 'Costs depend on the item, location, destination, and service scope. Request a quote for the details relevant to your enquiry.'
  }
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'CAD', symbol: 'C$', label: 'CAD (C$)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'GHS', symbol: 'GH₵', label: 'GHS (GH₵)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' }
];
