import { EventListView } from '@/components/EventListView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sự kiện — PTTCRM',
  alternates: { languages: { vi: '/vi/su-kien', en: '/en/events' } },
};

export default function ViEventsPage() {
  return <EventListView locale="vi" />;
}
