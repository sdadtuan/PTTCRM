import { ResourcesHubView } from '@/components/ResourcesHubView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tài nguyên — PTTCRM',
  alternates: { languages: { vi: '/vi/tai-nguyen', en: '/en/resources' } },
};

export default function ViResourcesHubPage() {
  return <ResourcesHubView locale="vi" />;
}
