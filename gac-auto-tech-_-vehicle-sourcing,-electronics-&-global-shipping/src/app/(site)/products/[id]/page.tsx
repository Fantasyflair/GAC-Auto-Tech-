import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SAMPLE_ELECTRONICS } from '../../../../data/mockData';
import { getProduct, relatedProducts } from '../../../../data/catalog';
import { ProductDetail } from '../../../../components/ProductDetail';

type Params = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return SAMPLE_ELECTRONICS.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = getProduct((await params).id);
  if (!product) return {};
  return {
    title: product.title,
    description: `${product.title}: ${product.specs.slice(0, 2).join(', ')}. ${product.notes}`,
    openGraph: { images: [product.imageUrl] },
  };
}

export default async function ProductPage({ params }: Params) {
  const product = getProduct((await params).id);
  if (!product) notFound();
  return <ProductDetail product={product} related={relatedProducts(product)} />;
}
