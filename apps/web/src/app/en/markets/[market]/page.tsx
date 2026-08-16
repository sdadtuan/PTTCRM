import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MarketPlaybookView } from '@/components/MarketPlaybookView';
import { getMarketPlaybook, MARKET_SLUGS } from '@/lib/market-content';

type Props = { params: Promise<{ market: string }> };

export function generateStaticParams() {
  return MARKET_SLUGS.map((market) => ({ market }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { market } = await params;
  const content = getMarketPlaybook(market);
  if (!content) return {};
  return {
    title: content.seo.title,
    description: content.seo.description,
  };
}

export default async function MarketPlaybookPage({ params }: Props) {
  const { market } = await params;
  const content = getMarketPlaybook(market);
  if (!content) notFound();
  return <MarketPlaybookView content={content} />;
}
