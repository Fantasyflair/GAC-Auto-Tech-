import { cache } from 'react';
import { WithId } from 'mongodb';
import { getDb } from './mongodb';
import { DEFAULT_HERO_SLIDES, DEFAULT_SETTINGS, SAMPLE_VEHICLES } from '../data/mockData';
import { vehicleImages } from '../data/catalog';
import type { HeroSlide, SiteSettings, VehicleListing } from '../types';

interface VehicleDocument extends VehicleListing {
  createdAt: Date;
  updatedAt: Date;
}

interface SiteDocument {
  _id: 'hero' | 'settings' | 'seeded';
  slides?: HeroSlide[];
  settings?: SiteSettings;
}

const vehiclesCollection = async () => (await getDb()).collection<VehicleDocument>('vehicles');
const siteCollection = async () => (await getDb()).collection<SiteDocument>('site');

const globalForSeed = globalThis as unknown as { gacSeeded?: Promise<void> };

/**
 * Fills an empty database with the starting content once. A marker document records that this
 * happened, so deleting every vehicle later does not bring the samples back.
 */
const ensureSeeded = () => {
  if (!globalForSeed.gacSeeded) {
    globalForSeed.gacSeeded = (async () => {
      const site = await siteCollection();
      if (await site.findOne({ _id: 'seeded' })) return;

      const vehicles = await vehiclesCollection();
      await vehicles.createIndex({ id: 1 }, { unique: true });
      if ((await vehicles.countDocuments()) === 0) {
        const now = Date.now();
        await vehicles
          .insertMany(
            SAMPLE_VEHICLES.map((v, i) => ({ ...v, createdAt: new Date(now - i * 1000), updatedAt: new Date(now) })),
            { ordered: false }
          )
          .catch(() => undefined); // Another request may have seeded at the same moment.
      }
      await site.updateOne({ _id: 'hero' }, { $setOnInsert: { slides: DEFAULT_HERO_SLIDES } }, { upsert: true });
      await site.updateOne({ _id: 'settings' }, { $setOnInsert: { settings: DEFAULT_SETTINGS } }, { upsert: true });
      await site.updateOne({ _id: 'seeded' }, { $setOnInsert: {} }, { upsert: true });
    })().catch((err) => {
      globalForSeed.gacSeeded = undefined;
      throw err;
    });
  }
  return globalForSeed.gacSeeded;
};

const stripVehicle = ({ _id, createdAt, updatedAt, ...vehicle }: WithId<VehicleDocument>): VehicleListing => vehicle;

/** Reads fall back to the starting content so the public site stays up if the database is unreachable. */
const withFallback = async <T,>(label: string, read: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    await ensureSeeded();
    return await read();
  } catch (err) {
    console.error(`Reading ${label} from MongoDB failed; showing default content.`, err);
    return fallback;
  }
};

export const getVehicles = cache(() =>
  withFallback(
    'vehicles',
    async () => (await (await vehiclesCollection()).find().sort({ createdAt: -1 }).toArray()).map(stripVehicle),
    SAMPLE_VEHICLES
  )
);

export const getVehicle = cache(async (id: string) => (await getVehicles()).find((v) => v.id === id));

export const getHeroSlides = cache(() =>
  withFallback('hero slides', async () => (await (await siteCollection()).findOne({ _id: 'hero' }))?.slides ?? DEFAULT_HERO_SLIDES, DEFAULT_HERO_SLIDES)
);

export const getSettings = cache(() =>
  withFallback(
    'site settings',
    async () => ({ ...DEFAULT_SETTINGS, ...(await (await siteCollection()).findOne({ _id: 'settings' }))?.settings }),
    DEFAULT_SETTINGS
  )
);

/* Admin writes. These throw on database errors so the dashboard can tell the admin the save failed. */

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

export const createVehicle = async (input: Omit<VehicleListing, 'id'>) => {
  await ensureSeeded();
  const id = `${slugify(`${input.year} ${input.make} ${input.model}`)}-${Math.random().toString(36).slice(2, 6)}`;
  const now = new Date();
  await (await vehiclesCollection()).insertOne({ ...input, id, createdAt: now, updatedAt: now });
  return id;
};

const photoIds = (doc: VehicleListing) => vehicleImages(doc).map((img) => img.publicId).filter((id): id is string => !!id);

/** Returns the previous photo ids so the caller can remove any that are no longer used from Cloudinary. */
export const updateVehicle = async (id: string, input: Omit<VehicleListing, 'id'>) => {
  const previous = await (await vehiclesCollection()).findOneAndUpdate(
    { id },
    { $set: { ...input, updatedAt: new Date() } },
    { returnDocument: 'before' }
  );
  return previous ? { found: true, previousPhotoIds: photoIds(previous) } : { found: false, previousPhotoIds: [] as string[] };
};

export const deleteVehicle = async (id: string) => {
  const previous = await (await vehiclesCollection()).findOneAndDelete({ id });
  return previous ? { found: true, previousPhotoIds: photoIds(previous) } : { found: false, previousPhotoIds: [] as string[] };
};

export const listVehiclesForAdmin = async () => {
  await ensureSeeded();
  return (await (await vehiclesCollection()).find().sort({ createdAt: -1 }).toArray()).map(stripVehicle);
};

export const saveHeroSlides = async (slides: HeroSlide[]) => {
  await ensureSeeded();
  const previous = await (await siteCollection()).findOneAndUpdate(
    { _id: 'hero' },
    { $set: { slides } },
    { upsert: true, returnDocument: 'before' }
  );
  return previous?.slides ?? [];
};

export const saveSettings = async (settings: SiteSettings) => {
  await ensureSeeded();
  await (await siteCollection()).updateOne({ _id: 'settings' }, { $set: { settings } }, { upsert: true });
};
