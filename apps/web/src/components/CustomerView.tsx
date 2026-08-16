import type { Locale } from '@pttcrm/gtm-core';
import Link from 'next/link';
import { CmsBody } from '@/lib/cms-body';
import type { CustomerDetail } from '@/lib/cms';
import './pages.css';

type Props = {
  locale: Locale;
  customer: CustomerDetail;
  listHref: string;
  listLabel: string;
};

export function CustomerView({ locale, customer, listHref, listLabel }: Props) {
  const demoHref = `${locale === 'en' ? '/en/request-demo' : '/vi/dang-ky-demo'}?industry=${customer.industry}&sku=${customer.sku}`;

  return (
    <>
      <section className="mast">
        <div className="wrap page-hero">
          <p className="crumbs">
            <Link href={listHref}>{listLabel}</Link> / {customer.title}
          </p>
          <h1>{customer.title}</h1>
          <p className="lead">{customer.summary}</p>
          {customer.metrics_label ? <p className="case-metrics">{customer.metrics_label}</p> : null}
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap article-body">
          <CmsBody body={customer.body} />
          <p style={{ marginTop: 32 }}>
            <Link className="btn btn-solid" href={demoHref}>
              {locale === 'vi' ? 'Đăng ký Demo' : 'Request demo'}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
