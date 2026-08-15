import { HomeView } from '@/components/HomeView';
import { getHome } from '@/lib/content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PTTCRM — Một nền tảng, chuyên biệt từng ngành',
  description: getHome('vi').metaDescription,
  alternates: { languages: { vi: '/vi', en: '/en' } },
};

export default function ViHomePage() {
  return <HomeView locale="vi" />;
}
