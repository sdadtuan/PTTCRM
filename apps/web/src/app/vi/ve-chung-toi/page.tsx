import { AboutView } from '@/components/AboutView';
import { getAbout } from '@/lib/content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Về PTTCRM',
  description: getAbout('vi').lead,
  alternates: { languages: { vi: '/vi/ve-chung-toi', en: '/en/about' } },
};

export default function VeChungToiPage() {
  return <AboutView locale="vi" />;
}
