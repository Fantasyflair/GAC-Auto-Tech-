import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { relatedVehicles } from '../../../../data/catalog';
import { getVehicle, getVehicles } from '../../../../lib/content';
import { VehicleDetail } from '../../../../components/VehicleDetail';

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const vehicle = await getVehicle((await params).id);
  if (!vehicle) return {};
  return {
    title: `${vehicle.year} ${vehicle.title}`,
    description: `${vehicle.title} (${vehicle.sourceType}): ${vehicle.notes}`,
    openGraph: { images: [vehicle.imageUrl] },
  };
}

export default async function VehiclePage({ params }: Params) {
  const vehicle = await getVehicle((await params).id);
  if (!vehicle) notFound();
  return <VehicleDetail vehicle={vehicle} related={relatedVehicles(vehicle, await getVehicles())} />;
}
