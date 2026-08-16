import type { Locale } from '@pttcrm/gtm-core';
import Link from 'next/link';
import { customerHref, customersListHref, fetchCustomers } from '@/lib/cms';
import './pages.css';

type Props = { locale: Locale };

const INDUSTRY_LABEL: Record<Locale, Record<string, string>> = {
  vi: { bds: 'BĐS', agency: 'AGENCY', fnb: 'F&B', education: 'GIÁO DỤC', pharma: 'PHARMA', other: 'KHÁC' },
  en: { bds: 'RE', agency: 'AGENCY', fnb: 'F&B', education: 'EDU', pharma: 'PHARMA', other: 'OTHER' },
};

export async function CustomersView({ locale }: Props) {
  const items = await fetchCustomers(locale);
  const title = locale === 'vi' ? 'Khách hàng' : 'Customers';
  const empty =
    locale === 'vi'
      ? 'Chưa có case published — tạo tại /cms (cần PO ký).'
      : 'No published cases yet — create them at /cms after PO sign-off.';
  const demoHref = locale === 'en' ? '/en/request-demo' : '/vi/dang-ky-demo';

  return (
    <>
      <section className="mast">
        <div className="wrap page-hero">
          <h1>{title}</h1>
          <p className="lead">
            {locale === 'vi'
              ? 'Kết quả theo ngành. CPL/ROAS chỉ hiện khi PO đã xác nhận số.'
              : 'Industry outcomes. CPL/ROAS appear only after PO-verified metrics.'}
          </p>
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
              {items.map((c, i) => (
                <Link key={c.slug} className={`news-card${i === 0 ? ' feature' : ''}`} href={customerHref(locale, c.slug)}>
                  <div className="news-thumb">
                    <b>{String(i + 1).padStart(2, '0')}</b>
                    <span>{INDUSTRY_LABEL[locale][c.industry] ?? c.industry.toUpperCase()}</span>
                  </div>
                  <div className="news-body">
                    <h3>{c.title}</h3>
                    <p>{c.summary}</p>
                    {c.metrics_label ? (
                      <p className="case-metrics">{c.metrics_label}</p>
                    ) : (
                      <p className="muted">
                        {locale === 'vi' ? 'Số liệu đang chờ PO xác nhận.' : 'Metrics pending PO verification.'}
                      </p>
                    )}
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

export { customersListHref };
