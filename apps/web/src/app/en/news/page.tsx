import { NewsListView } from '@/components/NewsListView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News — PTTCRM',
  alternates: { languages: { vi: '/vi/tin-tuc', en: '/en/news' } },
};

export default function EnNewsPage() {
  return <NewsListView locale="en" />;
}
