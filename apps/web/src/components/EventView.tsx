import type { Locale } from '@pttcrm/gtm-core';
import Link from 'next/link';
import { CmsBody } from '@/lib/cms-body';
import { formatArticleDate } from '@/lib/cms';
import type { EventDetail } from '@/lib/cms';
import './pages.css';

type Props = {
  locale: Locale;
  event: EventDetail;
  listHref: string;
  listLabel: string;
};

export function EventView({ locale, event, listHref, listLabel }: Props) {
  const demoHref = locale === 'en' ? '/en/request-demo' : '/vi/dang-ky-demo';
  const cancelled = event.status === 'cancelled';

  return (
    <>
      <section className="mast">
        <div className="wrap page-hero">
          <p className="crumbs">
            <Link href={listHref}>{listLabel}</Link> / {event.title}
          </p>
          <time dateTime={event.start_at}>{formatArticleDate(event.start_at, locale)}</time>
          <h1>
            {event.title}
            {cancelled && (
              <span style={{ display: 'block', fontSize: '1rem', marginTop: 8, opacity: 0.8 }}>
                {locale === 'vi' ? 'Đã hủy' : 'Cancelled'}
              </span>
            )}
          </h1>
          <p className="lead">{event.dek}</p>
          {event.location && <p>{event.location}</p>}
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap article-body">
          <CmsBody body={event.body} />
          {!cancelled && event.cta_url && (
            <p style={{ marginTop: 32 }}>
              <a className="btn btn-solid" href={event.cta_url}>
                {locale === 'vi' ? 'Đăng ký sự kiện' : 'Register'}
              </a>
            </p>
          )}
          {!cancelled && !event.cta_url && (
            <p style={{ marginTop: 32 }}>
              <Link className="btn btn-solid" href={demoHref}>
                {locale === 'vi' ? 'Đăng ký Demo' : 'Request demo'}
              </Link>
            </p>
          )}
        </div>
      </section>
    </>
  );
}
