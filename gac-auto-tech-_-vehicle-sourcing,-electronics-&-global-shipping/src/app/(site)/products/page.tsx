import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductCatalog } from '../../../components/ProductCatalog';

export const metadata: Metadata = {
  title: 'All products',
  description: 'Browse every vehicle and electronics listing from GAC Auto Tech, with filters for category and availability.',
};

export default function ProductsPage() {
  // The catalogue reads its starting filters from the URL, which needs a Suspense boundary.
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ProductCatalog />
    </Suspense>
  );
}
