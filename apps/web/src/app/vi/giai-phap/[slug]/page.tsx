import { SolutionView, solutionStaticParams } from '@/components/SolutionView';
import { getSolution } from '@/lib/content';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return solutionStaticParams('vi');
}

export default async function ViSolutionPage({ params }: Props) {
  const { slug } = await params;
  if (!getSolution('vi', slug)) notFound();
  return <SolutionView locale="vi" slug={slug} />;
}
