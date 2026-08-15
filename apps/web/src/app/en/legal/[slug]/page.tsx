import { LegalView, legalStaticParams } from '@/components/LegalView';
import { getLegalPage } from '@/lib/content';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return legalStaticParams('en');
}

export default async function EnLegalPage({ params }: Props) {
  const { slug } = await params;
  if (!getLegalPage('en', slug)) notFound();
  return <LegalView locale="en" slug={slug} />;
}
