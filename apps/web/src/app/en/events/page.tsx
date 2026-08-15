import { EventListView } from '@/components/EventListView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events — PTTCRM',
  alternates: { languages: { vi: '/vi/su-kien', en: '/en/events' } },
};

export default function EnEventsPage() {
  return <EventListView locale="en" />;
}
