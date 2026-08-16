import type { Metadata } from 'next';
import { EnterpriseTrustView } from '@/components/EnterpriseTrustView';
import { getEnterpriseQuestionnaire } from '@/lib/trust-content';

export const metadata: Metadata = {
  title: getEnterpriseQuestionnaire().seo.title,
  description: getEnterpriseQuestionnaire().seo.description,
};

export default function EnterpriseTrustPage() {
  return <EnterpriseTrustView content={getEnterpriseQuestionnaire()} />;
}
