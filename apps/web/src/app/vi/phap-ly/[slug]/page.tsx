import { LegalView, legalStaticParams } from '@/components/LegalView';
import { getLegalPage } from '@/lib/content';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return legalStaticParams('vi');
}

export default async function ViLegalPage({ params }: Props) {
  const { slug } = await params;
  if (!getLegalPage('vi', slug)) notFound();
  return <LegalView locale="vi" slug={slug} />;
}
