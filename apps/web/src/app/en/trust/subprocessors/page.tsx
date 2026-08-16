import type { Metadata } from 'next';
import { SubprocessorsView } from '@/components/SubprocessorsView';
import { getSubprocessorsContent } from '@/lib/trust-content';

export const metadata: Metadata = {
  title: getSubprocessorsContent().seo.title,
  description: getSubprocessorsContent().seo.description,
};

export default function SubprocessorsPage() {
  return <SubprocessorsView content={getSubprocessorsContent()} />;
}
