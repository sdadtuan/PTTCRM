import { ResourcesHubView } from '@/components/ResourcesHubView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resources — PTTCRM',
  alternates: { languages: { vi: '/vi/tai-nguyen', en: '/en/resources' } },
};

export default function EnResourcesHubPage() {
  return <ResourcesHubView locale="en" />;
}
