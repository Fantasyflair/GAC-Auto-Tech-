import type { Metadata } from 'next';
import { getVehicles } from '../../../lib/content';
import { VehicleCatalog } from '../../../components/VehicleCatalog';

export const metadata: Metadata = {
  title: 'All vehicles',
  description: 'Browse every vehicle listed by GAC Auto Tech, sourced from auctions and dealers and shipped to Ghana.',
};

export default async function VehiclesPage() {
  return <VehicleCatalog vehicles={await getVehicles()} />;
}
