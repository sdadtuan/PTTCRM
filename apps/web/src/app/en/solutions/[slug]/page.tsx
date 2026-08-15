import { SolutionView, solutionStaticParams } from '@/components/SolutionView';
import { getSolution } from '@/lib/content';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return solutionStaticParams('en');
}

export default async function EnSolutionPage({ params }: Props) {
  const { slug } = await params;
  if (!getSolution('en', slug)) notFound();
  return <SolutionView locale="en" slug={slug} />;
}
