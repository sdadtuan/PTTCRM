import type { Metadata } from 'next';
import { PartnersView } from '@/components/PartnersView';
import { getPartnersContent } from '@/lib/market-content';

export const metadata: Metadata = {
  title: getPartnersContent().seo.title,
  description: getPartnersContent().seo.description,
};

export default function PartnersPage() {
  return <PartnersView content={getPartnersContent()} />;
}
