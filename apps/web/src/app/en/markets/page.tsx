import type { Metadata } from 'next';
import { MarketsHubView } from '@/components/MarketsHubView';

export const metadata: Metadata = {
  title: 'ASEAN markets | PTTCRM',
  description: 'English GTM playbooks for Thailand, Indonesia, Philippines, and Singapore.',
};

export default function MarketsHubPage() {
  return <MarketsHubView />;
}
