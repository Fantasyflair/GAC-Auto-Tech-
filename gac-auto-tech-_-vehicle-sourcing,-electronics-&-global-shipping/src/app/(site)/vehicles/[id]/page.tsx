import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SAMPLE_VEHICLES } from '../../../../data/mockData';
import { getVehicle, relatedVehicles } from '../../../../data/catalog';
import { VehicleDetail } from '../../../../components/VehicleDetail';

type Params = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return SAMPLE_VEHICLES.map((vehicle) => ({ id: vehicle.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const vehicle = getVehicle((await params).id);
  if (!vehicle) return {};
  return {
    title: `${vehicle.year} ${vehicle.title}`,
    description: `${vehicle.title} from ${vehicle.sourceType}: ${vehicle.notes}`,
    openGraph: { images: [vehicle.imageUrl] },
  };
}

export default async function VehiclePage({ params }: Params) {
  const vehicle = getVehicle((await params).id);
  if (!vehicle) notFound();
  return <VehicleDetail vehicle={vehicle} related={relatedVehicles(vehicle, 3)} />;
}
