import { NewsListView } from '@/components/NewsListView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tin tức — PTTCRM',
  alternates: { languages: { vi: '/vi/tin-tuc', en: '/en/news' } },
};

export default function ViNewsPage() {
  return <NewsListView locale="vi" />;
}
