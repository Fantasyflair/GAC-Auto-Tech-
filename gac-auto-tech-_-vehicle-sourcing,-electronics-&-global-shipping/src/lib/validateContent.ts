import { AVAILABILITY_OPTIONS, DAMAGE_AREAS, MAX_VEHICLE_PHOTOS, SOURCE_OPTIONS } from '../data/catalog';
import { DEFAULT_HERO_SLIDES } from '../data/mockData';
import type { HeroSlide, ServiceType, SiteSettings, VehicleImage, VehicleListing } from '../types';
import { isAllowedImageUrl } from './cloudinary';

/** `value` is set when `ok` is true; `error` explains the problem when it is false. */
type Result<T> = { ok: boolean; value?: T; error?: string };

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '');
const record = (value: unknown) => (value && typeof value === 'object' ? (value as Record<string, unknown>) : {});

const imageFields = (body: Record<string, unknown>, urlKey: string) => {
  const url = text(body[urlKey], 500);
  const publicId = text(body.imagePublicId, 200);
  return { url, publicId: publicId || undefined };
};

/** Cleans the gallery: allowed URLs only, no duplicates, cover first. Falls back to a lone imageUrl from older clients. */
const parseImages = (body: Record<string, unknown>): VehicleImage[] => {
  const raw = Array.isArray(body.images) ? body.images : [{ url: body.imageUrl, publicId: body.imagePublicId }];
  const seen = new Set<string>();
  const images: VehicleImage[] = [];
  for (const item of raw) {
    const entry = record(item);
    const url = text(entry.url, 500);
    if (!url || seen.has(url) || !isAllowedImageUrl(url)) continue;
    seen.add(url);
    images.push({ url, publicId: text(entry.publicId, 200) || undefined });
  }
  return images.slice(0, MAX_VEHICLE_PHOTOS);
};

const parseDamage = (input: unknown): VehicleListing['damage'] => {
  const body = record(input);
  const damaged = body.damaged === true;
  const allowed = new Set<string>(DAMAGE_AREAS);
  const areas = damaged && Array.isArray(body.areas) ? Array.from(new Set(body.areas.filter((a): a is string => typeof a === 'string' && allowed.has(a)))) : [];
  return { damaged, areas, notes: damaged ? text(body.notes, 600) : '' };
};

export const parseVehicle = (input: unknown): Result<Omit<VehicleListing, 'id'>> => {
  const body = record(input);
  const specs = record(body.specs);
  const year = Number(body.year);
  const images = parseImages(body);
  const image = { url: images[0]?.url ?? '', publicId: images[0]?.publicId };

  const vehicle: Omit<VehicleListing, 'id'> = {
    title: text(body.title, 120),
    make: text(body.make, 60),
    model: text(body.model, 80),
    year,
    category: text(body.category, 80),
    specs: {
      mileage: text(specs.mileage, 40) || undefined,
      engine: text(specs.engine, 120) || undefined,
      transmission: text(specs.transmission, 80),
      drivetrain: text(specs.drivetrain, 80),
      fuelType: text(specs.fuelType, 40),
    },
    condition: text(body.condition, 160),
    damage: parseDamage(body.damage),
    availability: body.availability as VehicleListing['availability'],
    listingRef: text(body.listingRef, 40),
    imageUrl: image.url,
    imagePublicId: image.publicId,
    images,
    notes: text(body.notes, 1500),
    sourceType: body.sourceType as VehicleListing['sourceType'],
  };

  const missing = (
    [
      ['title', vehicle.title],
      ['make', vehicle.make],
      ['model', vehicle.model],
      ['transmission', vehicle.specs.transmission],
      ['drivetrain', vehicle.specs.drivetrain],
      ['fuel type', vehicle.specs.fuelType],
      ['condition', vehicle.condition],
    ] as const
  ).find(([, value]) => !value);
  if (missing) return { ok: false, error: `Please fill in the ${missing[0]}.` };
  if (!Number.isInteger(year) || year < 1950 || year > new Date().getFullYear() + 1) {
    return { ok: false, error: 'Please enter a valid year.' };
  }
  if (!AVAILABILITY_OPTIONS.includes(vehicle.availability)) return { ok: false, error: 'Please choose an availability.' };
  if (!SOURCE_OPTIONS.includes(vehicle.sourceType)) return { ok: false, error: 'Please choose where the vehicle is sourced from.' };
  if (images.length === 0) return { ok: false, error: 'Please upload at least one photo of the vehicle.' };
  if (vehicle.damage.damaged && vehicle.damage.areas.length === 0 && !vehicle.damage.notes) {
    return { ok: false, error: 'Please say where the vehicle is damaged: tick the areas or describe it.' };
  }

  if (!vehicle.category) vehicle.category = 'Vehicle';
  if (!vehicle.listingRef) vehicle.listingRef = `GAC-VEH-${year}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  return { ok: true, value: vehicle };
};

export const parseHeroSlides = (input: unknown): Result<HeroSlide[]> => {
  const list = Array.isArray(record(input).slides) ? (record(input).slides as unknown[]) : [];
  const services = DEFAULT_HERO_SLIDES.map((s) => s.service);

  const slides: HeroSlide[] = [];
  for (const service of services) {
    const body = record(list.find((s) => record(s).service === service));
    const image = imageFields(body, 'image');
    const slide: HeroSlide = {
      service: service as ServiceType,
      eyebrow: text(body.eyebrow, 60),
      title: text(body.title, 80),
      copy: text(body.copy, 160),
      image: image.url,
      imagePublicId: image.publicId,
      alt: text(body.alt, 140) || text(body.title, 80),
    };
    if (!slide.title) return { ok: false, error: 'Every slide needs a headline.' };
    if (!slide.image || !isAllowedImageUrl(slide.image)) return { ok: false, error: 'Every slide needs a photo.' };
    slides.push(slide);
  }
  return { ok: true, value: slides };
};

const socialUrl = (value: unknown) => {
  const url = text(value, 300);
  return url === '' || /^https:\/\/[^\s]+$/.test(url) ? url : null;
};

export const parseSettings = (input: unknown): Result<SiteSettings> => {
  const body = record(input);
  const social = record(body.social);
  const whatsappNumber = text(body.whatsappNumber, 30).replace(/\D/g, '');
  const email = text(body.email, 200);

  if (whatsappNumber.length < 8 || whatsappNumber.length > 15) {
    return { ok: false, error: 'Enter the WhatsApp number with its country code, e.g. 233201234567.' };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: 'Please enter a valid email address.' };

  const links = {
    instagram: socialUrl(social.instagram),
    facebook: socialUrl(social.facebook),
    x: socialUrl(social.x),
    tiktok: socialUrl(social.tiktok),
    linkedin: socialUrl(social.linkedin),
  };
  const bad = Object.entries(links).find(([, url]) => url === null);
  if (bad) return { ok: false, error: `The ${bad[0]} link must start with https://` };

  return { ok: true, value: { whatsappNumber, email, social: links as SiteSettings['social'] } };
};
