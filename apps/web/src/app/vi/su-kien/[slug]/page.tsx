import { EventView } from '@/components/EventView';
import { eventsListHref, fetchEvent } from '@/lib/cms';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ slug: string }> };

export default async function ViEventPage({ params }: Props) {
  const { slug } = await params;
  const event = await fetchEvent('vi', slug);
  if (!event) notFound();
  return (
    <EventView locale="vi" event={event} listHref={eventsListHref('vi')} listLabel="Sự kiện" />
  );
}
