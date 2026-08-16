import type { Metadata } from 'next';
import { SecurityPackView } from '@/components/SecurityPackView';
import { getSecurityPack } from '@/lib/trust-content';

export const metadata: Metadata = {
  title: getSecurityPack().seo.title,
  description: getSecurityPack().seo.description,
};

export default function SecurityPackPage() {
  return <SecurityPackView content={getSecurityPack()} />;
}
