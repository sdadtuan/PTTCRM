import type { Metadata } from 'next';
import { TrustCenterView } from '@/components/TrustCenterView';
import { getTrustContent } from '@/lib/trust-content';

export const metadata: Metadata = {
  title: getTrustContent().seo.title,
  description: getTrustContent().seo.description,
};

export default function TrustPage() {
  return <TrustCenterView content={getTrustContent()} />;
}
