import Link from 'next/link';
import { ASEAN_MARKETS, type AseanMarket } from '@pttcrm/gtm-core';
import { MARKET_SLUGS } from '@/lib/market-content';
import './pages.css';

export function MarketsHubView() {
  return (
    <>
      <section className="mast">
        <div className="wrap page-hero">
          <p className="crumbs">
            <Link href="/en">PTTCRM</Link> / Markets
          </p>
          <h1>ASEAN markets</h1>
          <p className="lead">English playbooks for Thailand, Indonesia, Philippines, and Singapore.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="resource-grid">
            {MARKET_SLUGS.map((slug) => {
              const meta = ASEAN_MARKETS[slug as AseanMarket];
              return (
                <Link key={slug} href={`/en/markets/${slug}`} className="resource-tile">
                  <h2>{meta.name}</h2>
                  <p>
                    {meta.gmtLabel} · {meta.timezone}
                  </p>
                </Link>
              );
            })}
          </div>
          <p style={{ marginTop: 24 }}>
            <Link href="/en/partners">View partners →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
