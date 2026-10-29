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
    imageUrl: '/src/assets/images/trend_bmw_i4_studio_1793244775267.jpg',
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
    imageUrl: '/src/assets/images/trend_audi_a7_studio_1793244776245.jpg',
    notes: 'Premium Plus trim with Matrix LED headlights, Bang & Olufsen sound, and verified mechanical running condition from IAAI auction.',
    sourceType: 'IAAI'
  },
  {
    id: 'veh-03',
    title: 'Mercedes-Benz GLE 450 4MATIC',
    make: 'Mercedes-Benz',
    model: 'GLE 450 AMG Line',
    year: 2023,
    category: 'Luxury SUV',
    specs: {
      mileage: '21,100 km',
      engine: '3.0L Turbo Inline-6 EQ Boost (362 hp)',
      transmission: '9G-TRONIC 9-Speed Automatic',
      drivetrain: '4MATIC All-Wheel Drive',
      fuelType: 'Mild Hybrid'
    },
    condition: 'Clean Title · Zero Accident History',
    availability: 'Incoming',
    listingRef: 'GAC-VEH-2023-MGLE',
    imageUrl: '/src/assets/images/trend_merc_gle_studio_1793244777362.jpg',
    notes: 'AMG exterior styling, panoramic roof, third row seating, and air suspension. High demand model for West African export.',
    sourceType: 'Dealer Network'
  },
  {
    id: 'veh-04',
    title: 'Porsche 911 Carrera 4S (992)',
    make: 'Porsche',
    model: '911 Carrera 4S',
    year: 2023,
    category: 'High Performance Coupe',
    specs: {
      mileage: '9,800 km',
      engine: '3.0L Twin-Turbo Boxer 6 (443 hp)',
      transmission: '8-Speed Porsche Doppelkupplung (PDK)',
      drivetrain: 'All-Wheel Drive',
      fuelType: 'Gasoline'
    },
    condition: 'Pristine Inspection · Minor Bumper Scrape',
    availability: 'On request',
    listingRef: 'GAC-VEH-2023-P911',
    imageUrl: '/src/assets/images/trend_porsche_911_studio_1793244777372.jpg',
    notes: 'Sport Chrono package with active exhaust, 20/21 Carrera Classic wheels. Sourced via specialist Copart premier salvage/recovery division.',
    sourceType: 'Copart'
  }
];

export const SAMPLE_ELECTRONICS: ElectronicProduct[] = [
  {
    id: 'elec-01',
    title: 'Apple MacBook Pro 16" (M3 Pro)',
    category: 'laptops',
    specs: ['Apple M3 Pro Chip (12-Core CPU / 18-Core GPU)', '36GB Unified Memory', '512GB High-Speed NVMe SSD', 'Liquid Retina XDR Display'],
    condition: 'Brand New',
    availability: 'Available',
    listingRef: 'GAC-TECH-MBP16',
    imageUrl: '/src/assets/images/electronics_tech_collection_1793244792880.jpg',
    wholesaleEligible: true,
    notes: 'Factory sealed units. Canadian/US keyboard layout. Wholesale cartons available for bulk orders.'
  },
  {
    id: 'elec-02',
    title: 'Apple iPhone 15 Pro Max 256GB',
    category: 'phones',
    specs: ['Natural Titanium Finish', 'A17 Pro Bionic Chip', 'Factory Unlocked (Dual eSIM / Physical SIM)', 'Super Retina XDR OLED'],
    condition: 'Brand New',
    availability: 'Available',
    listingRef: 'GAC-TECH-IP15PM',
    imageUrl: '/src/assets/images/hero_tech_devices_1793210759484.jpg',
    wholesaleEligible: true,
    notes: 'Global carrier unlocked. Tested and verified for networks across North America, Europe, and Ghana.'
  },
  {
    id: 'elec-03',
    title: 'Sony PlayStation 5 Slim 1TB Console',
    category: 'gaming',
    specs: ['Ultra-High Speed 1TB SSD', 'Ray Tracing & 4K 120Hz Output', 'DualSense Wireless Controller Included', 'Disc Edition'],
    condition: 'Brand New',
    availability: 'Available',
    listingRef: 'GAC-TECH-PS5SLM',
    imageUrl: '/src/assets/images/electronics_showcase_group_1793210760329.jpg',
    wholesaleEligible: true,
    notes: 'Original manufacturer packaging with regional power cable. Wholesale pallet orders supported.'
  },
  {
    id: 'elec-04',
    title: 'PlayStation DualSense Wireless Controller',
    category: 'accessories',
    specs: ['Haptic Feedback & Adaptive Triggers', 'Integrated Microphone & Audio Jack', 'USB-C Fast Charging', 'Midnight Black Edition'],
    condition: 'Brand New',
    availability: 'Incoming',
    listingRef: 'GAC-TECH-DSE-BLK',
    imageUrl: '/src/assets/images/hero_tech_devices_1793210759484.jpg',
    wholesaleEligible: true,
    notes: 'High turnover gaming accessory. Ideal for electronics retailers and retail consumers.'
  }
];

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
