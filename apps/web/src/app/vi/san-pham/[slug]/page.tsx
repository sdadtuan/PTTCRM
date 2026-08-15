import { ProductView, productStaticParams } from '@/components/ProductView';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/content';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return productStaticParams();
}

export default async function ViProductPage({ params }: Props) {
  const { slug } = await params;
  if (!getProduct('vi', slug)) notFound();
  return <ProductView locale="vi" slug={slug} />;
}
