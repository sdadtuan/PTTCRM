import type { Locale } from '@pttcrm/gtm-core';
import Link from 'next/link';
import { eventHref, eventsListHref, fetchEvents, formatArticleDate } from '@/lib/cms';
import './pages.css';

type Props = { locale: Locale; when?: string };

export async function EventListView({ locale, when }: Props) {
  const items = await fetchEvents(locale, when);
  const title = locale === 'vi' ? 'Sự kiện' : 'Events';
  const empty =
    locale === 'vi'
      ? 'Chưa có sự kiện published — tạo tại /cms trên site PTTCRM.'
      : 'No published events yet — create them at /cms on the PTTCRM site.';
  const demoHref = locale === 'en' ? '/en/request-demo' : '/vi/dang-ky-demo';

  return (
    <>
      <section className="mast">
        <div className="wrap page-hero">
          <h1>{title}</h1>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          {items.length === 0 ? (
            <>
              <p className="lead">{empty}</p>
              <Link className="btn btn-solid" href={demoHref}>
                {locale === 'vi' ? 'Đăng ký Demo' : 'Request demo'}
              </Link>
            </>
          ) : (
            <div className="news-grid">
              {items.map((ev) => (
                <Link key={ev.slug} className="news-card" href={eventHref(locale, ev.slug)}>
                  <div className="news-body">
                    <time dateTime={ev.start_at}>{formatArticleDate(ev.start_at, locale)}</time>
                    <h3>
                      {ev.title}
                      {ev.status === 'cancelled' && (
                        <span style={{ marginLeft: 8, fontSize: 12, opacity: 0.7 }}>
                          ({locale === 'vi' ? 'Đã hủy' : 'Cancelled'})
                        </span>
                      )}
                    </h3>
                    <p>{ev.dek}</p>
                    {ev.location && <p style={{ fontSize: 14 }}>{ev.location}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export { eventsListHref };
