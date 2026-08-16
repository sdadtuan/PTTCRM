import { whatsappLink, type AseanMarket } from '@pttcrm/gtm-core';
import Link from 'next/link';
import type { MarketPlaybookContent } from '@/lib/market-content';
import { demoHrefFromPlaybook } from '@/lib/market-content';
import './pages.css';

type Props = {
  content: MarketPlaybookContent;
};

export function MarketPlaybookView({ content }: Props) {
  const market = content.market as AseanMarket;
  const waHref = whatsappLink(market, content.whatsapp_prefill);
  const demoHref = demoHrefFromPlaybook(market, content);

  return (
    <>
      <section className="mast">
        <div className="wrap page-hero">
          <p className="crumbs">
            <Link href="/en">PTTCRM</Link> / <Link href="/en/markets">Markets</Link> / {content.market.toUpperCase()}
          </p>
          <h1>{content.hero_title}</h1>
          <p className="lead">{content.hero_sub}</p>
          <p className="muted" style={{ marginTop: 12 }}>
            {content.timezone_label} · {content.business_hours_en}
          </p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap prose">
          <p className="muted">{content.persona}</p>
          <h2>Why agencies switch</h2>
          <ul>
            {content.pain_points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
            <Link className="btn btn-solid" href={demoHref}>
              Request demo
            </Link>
            <a className="btn btn-ghost" href={waHref} target="_blank" rel="noopener noreferrer">
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
