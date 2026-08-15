import { EventView } from '@/components/EventView';
import { eventsListHref, fetchEvent } from '@/lib/cms';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ slug: string }> };

export default async function EnEventPage({ params }: Props) {
  const { slug } = await params;
  const event = await fetchEvent('en', slug);
  if (!event) notFound();
  return (
    <EventView locale="en" event={event} listHref={eventsListHref('en')} listLabel="Events" />
  );
}
