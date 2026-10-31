import { VehicleListing, ElectronicProduct } from '../types';

export const WHATSAPP_NUMBER_DISPLAY = '+1 (647) 000-0000'; // Configurable placeholder for production deployment
export const WHATSAPP_CLEAN_NUMBER = '16470000000';

export function getWhatsAppUrl(customMessage?: string): string {
  const defaultMsg = 'Hello GAC Auto Tech, I would like to make an enquiry regarding your services.';
  const text = encodeURIComponent(customMessage || defaultMsg);
  return `https://wa.me/${WHATSAPP_CLEAN_NUMBER}?text=${text}`;
}

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
    notes: 'M-Sport package with curved display, wireless charging, and verified Copart clean-title inspection report. Export ready for Ghana.',
    sourceType: 'Copart'
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
    notes: 'Premium Plus trim with Matrix LED headlights, Bang & Olufsen sound, and verified mechanical running condition from IAAI auction.',
    sourceType: 'IAAI'
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
    notes: 'Sport Chrono package, active rear spoiler, and adaptive air suspension. Sourced via specialist Copart premier recovery division.',
    sourceType: 'Copart'
  }
];

export const SAMPLE_ELECTRONICS: ElectronicProduct[] = [
  {
    id: 'elec-01',
    title: 'Apple MacBook Pro 16"',
    category: 'laptops',
    specs: ['Apple M3 Pro Chip (12-Core CPU / 18-Core GPU)', '36GB Unified Memory', '512GB High-Speed NVMe SSD', 'Liquid Retina XDR Display'],
    condition: 'Brand New',
    availability: 'Available',
    listingRef: 'GAC-TECH-MBP16',
    imageUrl: '/images/macbook-pro.jpg',
    wholesaleEligible: true,
    notes: 'Factory sealed units. Canadian/US keyboard layout. Wholesale cartons available for bulk orders.'
  },
  {
    id: 'elec-02',
    title: 'Apple iPhone 15 Pro 256GB',
    category: 'phones',
    specs: ['Natural Titanium Finish', 'A17 Pro Bionic Chip', 'Factory Unlocked (Dual eSIM / Physical SIM)', 'Super Retina XDR OLED'],
    condition: 'Brand New',
    availability: 'Available',
    listingRef: 'GAC-TECH-IP15P',
    imageUrl: '/images/iphone-15-pro.jpg',
    wholesaleEligible: true,
    notes: 'Global carrier unlocked. Tested and verified for networks across North America, Europe, and Ghana.'
  },
  {
    id: 'elec-03',
    title: 'Sony PlayStation 5 Console',
    category: 'gaming',
    specs: ['Ultra-High Speed 825GB SSD', 'Ray Tracing & 4K 120Hz Output', 'DualSense Wireless Controller Included', 'Digital Edition'],
    condition: 'Brand New',
    availability: 'Available',
    listingRef: 'GAC-TECH-PS5',
    imageUrl: '/images/ps5.jpg',
    wholesaleEligible: true,
    notes: 'Original manufacturer packaging with regional power cable. Wholesale pallet orders supported.'
  },
  {
    id: 'elec-04',
    title: 'PlayStation DualSense Wireless Controller',
    category: 'accessories',
    specs: ['Haptic Feedback & Adaptive Triggers', 'Integrated Microphone & Audio Jack', 'USB-C Fast Charging', 'White Edition'],
    condition: 'Brand New',
    availability: 'Incoming',
    listingRef: 'GAC-TECH-DSE-WHT',
    imageUrl: '/images/dualsense.jpg',
    wholesaleEligible: true,
    notes: 'High turnover gaming accessory. Ideal for electronics retailers and retail consumers.'
  },
  {
    id: 'elec-05',
    title: 'Samsung Galaxy S24 Ultra 512GB',
    category: 'phones',
    specs: ['Titanium Gray Finish', 'Built-in S Pen', '200MP Main Camera', 'Factory Unlocked'],
    condition: 'Brand New',
    availability: 'Available',
    listingRef: 'GAC-TECH-S24U',
    imageUrl: '/images/galaxy-s24-ultra.jpg',
    wholesaleEligible: true,
    notes: 'International unlocked units that work on Ghanaian networks. Bulk orders welcome.'
  },
  {
    id: 'elec-06',
    title: 'Apple iPad Pro 12.9"',
    category: 'tablets',
    specs: ['Liquid Retina XDR Display', 'Apple Pencil Support', 'Wi-Fi + Cellular Options', '256GB Storage'],
    condition: 'Brand New',
    availability: 'Available',
    listingRef: 'GAC-TECH-IPADP',
    imageUrl: '/images/ipad-pro.jpg',
    wholesaleEligible: false,
    notes: 'Sealed units with Canadian warranty. Apple Pencil can be added to the same order.'
  },
  {
    id: 'elec-07',
    title: 'Apple AirPods Pro',
    category: 'audio',
    specs: ['Active Noise Cancellation', 'Transparency Mode', 'MagSafe Charging Case', 'Spatial Audio'],
    condition: 'Brand New',
    availability: 'Available',
    listingRef: 'GAC-TECH-APP',
    imageUrl: '/images/airpods-pro.jpg',
    wholesaleEligible: true,
    notes: 'Popular retail item. Wholesale cartons available for resellers.'
  },
  {
    id: 'elec-08',
    title: 'Sony WH-1000XM5 Headphones',
    category: 'audio',
    specs: ['Industry-Leading Noise Cancelling', '30-Hour Battery Life', 'Multipoint Bluetooth', 'Black Edition'],
    condition: 'Brand New',
    availability: 'Incoming',
    listingRef: 'GAC-TECH-WHXM5',
    imageUrl: '/images/sony-wh1000xm5.jpg',
    wholesaleEligible: true,
    notes: 'Next shipment is being consolidated. Reserve units ahead of arrival.'
  },
  {
    id: 'elec-09',
    title: 'Apple Watch Ultra',
    category: 'wearables',
    specs: ['49mm Titanium Case', 'Precision Dual-Frequency GPS', 'Cellular Built In', 'Up to 36-Hour Battery'],
    condition: 'Brand New',
    availability: 'On request',
    listingRef: 'GAC-TECH-AWU',
    imageUrl: '/images/apple-watch-ultra.jpg',
    wholesaleEligible: false,
    notes: 'Sourced to order. Tell us your preferred band and size.'
  }
];

// Replace these with GAC Auto Tech's real profile links.
export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/',
  facebook: 'https://www.facebook.com/',
  x: 'https://x.com/',
  tiktok: 'https://www.tiktok.com/',
  linkedin: 'https://www.linkedin.com/',
};

export const FAQ_ITEMS = [
  {
    question: 'What can GAC Auto Tech help me source?',
    answer: 'We assist with vehicle sourcing, electronics, and general merchandise. Send us your requirements to discuss available options.'
  },
  {
    question: 'Can you help me find a vehicle from Copart or IAAI?',
    answer: 'Yes. Share your budget, preferred vehicle details, or a listing link to discuss sourcing support.'
  },
  {
    question: 'Do you work with wholesale customers?',
    answer: 'Yes. We welcome enquiries from individual buyers and wholesale customers.'
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
