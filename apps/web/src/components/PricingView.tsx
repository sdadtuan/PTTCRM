import type { Locale } from '@pttcrm/gtm-core';
import Link from 'next/link';
import { formatVnd, getPricing, type PricingContent } from '@/lib/content';
import './pages.css';

type Props = {
  locale: Locale;
};

function formatAmt(vnd: number): string {
  if (vnd >= 1_000_000) return `${(vnd / 1_000_000).toFixed(1).replace('.0', '')}tr`;
  return formatVnd(vnd);
}

export function PricingView({ locale }: Props) {
  const p = getPricing(locale);
  const demoHref = locale === 'en' ? '/en/request-demo' : '/vi/dang-ky-demo';
  const home = locale === 'en' ? '/en' : '/vi';

  const jsonLd =
    p.showAmounts && 'skus' in p && p.skus.some((s) => 'retainer_vnd' in s)
      ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'PTTCRM',
          offers: (p.skus as PricingContent['skus']).map((s) => ({
            '@type': 'Offer',
            name: s.name,
            price: (s as { retainer_vnd: number }).retainer_vnd,
            priceCurrency: 'VND',
          })),
        }
      : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <section className="mast">
        <div className="wrap page-hero">
          <p className="crumbs">
            <Link href={home}>PTTCRM</Link> / {locale === 'vi' ? 'Bảng giá' : 'Pricing'}
          </p>
          <h1>{p.title}</h1>
          <p className="lead">{p.lead}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="price-grid">
            {p.skus.map((sku) => (
              <article className={`price${sku.popular ? ' pop' : ''}`} key={sku.id}>
                {sku.popular && (
                  <span className="badge">{locale === 'vi' ? 'PHỔ BIẾN' : 'CORE'}</span>
                )}
                <h2>{sku.name.replace('PTTCRM ', '')}</h2>
                {p.showAmounts && 'retainer_vnd' in sku && (
                  <>
                    <p className="amt">{formatAmt(sku.retainer_vnd)}</p>
                    <p className="setup">
                      VND/tháng · Setup {formatAmt((sku as { setup_vnd: number }).setup_vnd)}
                      {'userBand' in sku && sku.userBand ? ` · ${sku.userBand}` : ''}
                    </p>
                  </>
                )}
                {!p.showAmounts && <p className="setup">{p.note}</p>}
                <ul>
                  {sku.includes.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                {'excludes' in sku && sku.excludes && (
                  <ul className="out">
                    {sku.excludes.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                )}
                <Link
                  className={`btn ${sku.popular ? 'btn-solid' : 'btn-ghost'}`}
                  href={`${demoHref}?sku=${sku.id}`}
                >
                  {p.ctaButton}
                </Link>
              </article>
            ))}
          </div>
          {p.showAmounts && <p className="note">{p.note}</p>}
        </div>
      </section>

      <section className="section section-wash">
        <div className="wrap">
          <h2>{p.compareTitle}</h2>
          <table className="compare">
            <thead>
              <tr>
                <th />
                <th>Marketing</th>
                <th>Industry</th>
                <th>Agency OS</th>
              </tr>
            </thead>
            <tbody>
              {p.compareRows.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td>{row.mkt}</td>
                  <td>{row.ind}</td>
                  <td>{row.agy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <h2>{p.ctaTitle}</h2>
          <Link className="btn btn-invert" href={demoHref}>
            {p.ctaButton}
          </Link>
        </div>
      </section>
    </>
  );
}
