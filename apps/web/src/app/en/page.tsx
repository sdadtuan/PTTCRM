import { HomeView } from '@/components/HomeView';
import { getHome } from '@/lib/content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PTTCRM — One platform, specialized by industry',
  description: getHome('en').metaDescription,
  alternates: { languages: { vi: '/vi', en: '/en' } },
};

export default function EnHomePage() {
  return <HomeView locale="en" />;
}
