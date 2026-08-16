import type { Metadata } from 'next';
import { StatusPageView } from '@/components/StatusPageView';
import { getStatusCopy } from '@/lib/trust-content';

export const metadata: Metadata = {
  title: getStatusCopy().seo.title,
  description: getStatusCopy().seo.description,
};

export default function StatusPage() {
  return <StatusPageView copy={getStatusCopy()} />;
}
