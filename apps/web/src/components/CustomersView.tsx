import type { Locale } from '@pttcrm/gtm-core';
import { canShowCaseMetrics, formatCaseMetrics } from '@pttcrm/gtm-core';
import Link from 'next/link';
import { listSignedCases } from '@/lib/cases';
import './pages.css';

type Props = { locale: Locale };

export function CustomersView({ locale }: Props) {
  const cases = listSignedCases();
  const demoBase = locale === 'en' ? '/en/request-demo' : '/vi/dang-ky-demo';
  const home = locale === 'en' ? '/en' : '/vi';

  return (
    <>
      <section className="mast">
        <div className="wrap page-hero">
          <p className="crumbs">
            <Link href={home}>PTTCRM</Link> / {locale === 'vi' ? 'Khách hàng' : 'Customers'}
          </p>
          <h1>{locale === 'vi' ? 'Khách hàng & kết quả' : 'Customers & outcomes'}</h1>
          <p className="lead">
            {locale === 'vi'
              ? 'Case qualitative theo ngành. CPL/ROAS chỉ hiện khi PO xác nhận số (metrics_verified).'
              : 'Industry outcomes in qualitative form. CPL/ROAS appear only after PO-verified metrics.'}
          </p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          {cases.length === 0 ? (
            <>
              <p className="lead">
                {locale === 'vi' ? 'Case đang cập nhật.' : 'Case studies are being updated.'}
              </p>
              <Link className="btn btn-solid" href={demoBase}>
                {locale === 'vi' ? 'Đăng ký Demo' : 'Request demo'}
              </Link>
            </>
          ) : (
            <div className="case-grid">
              {cases.map((c) => {
                const title = locale === 'en' && c.title_en ? c.title_en : c.title_vi;
                const summary = locale === 'en' && c.summary_en ? c.summary_en : c.summary_vi;
                const demoHref = `${demoBase}?industry=${c.industry}&sku=${c.sku}`;
                return (
                  <article key={c.slug} className="case-card">
                    <span className="k">{c.industry.toUpperCase()}</span>
                    <h2>{title}</h2>
                    <p>{summary}</p>
                    {canShowCaseMetrics(c) ? (
                      <p className="case-metrics mono">{formatCaseMetrics(c, locale)}</p>
                    ) : (
                      <p className="muted">
                        {locale === 'vi'
                          ? 'Số liệu đang chờ PO xác nhận — không hiển thị CPL/ROAS.'
                          : 'Metrics pending PO verification — CPL/ROAS withheld.'}
                      </p>
                    )}
                    <Link className="btn btn-solid" href={demoHref}>
                      {locale === 'vi' ? 'Đăng ký Demo' : 'Request demo'}
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
