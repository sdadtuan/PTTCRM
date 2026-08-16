import type { Locale } from '@pttcrm/gtm-core';
import Link from 'next/link';
import {
  articleHref,
  CATEGORY_LABELS,
  customerHref,
  customersListHref,
  eventHref,
  fetchArticles,
  fetchCustomers,
  fetchEvents,
  formatArticleDate,
  newsListHref,
} from '@/lib/cms';
import { getFaq, getHome, solutionSlugForLocale } from '@/lib/content';
import { FaqView } from './FaqView';
import './pages.css';

type Props = {
  locale: Locale;
};

export async function HomeView({ locale }: Props) {
  const c = getHome(locale);
  const faq = getFaq(locale);
  const articles = (await fetchArticles(locale)).slice(0, 3);
  const events = await fetchEvents(locale, 'upcoming');
  const upcoming = events[0];
  const customers = (await fetchCustomers(locale)).slice(0, 3);

  const demoHref = locale === 'en' ? '/en/request-demo' : '/vi/dang-ky-demo';
  const pricingHref = locale === 'en' ? '/en/pricing' : '/vi/bang-gia';
  const productBase = locale === 'en' ? '/en/product' : '/vi/san-pham';
  const solutionBase = locale === 'en' ? '/en/solutions' : '/vi/giai-phap';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'PTTCRM',
        url: 'https://pttcrm.com',
        email: 'hello@pttcrm.com',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'PTTCRM',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="kicker">{c.hero.kicker}</div>
            <h1>{c.slogan}</h1>
            <p className="sub">{c.hero.subtitle}</p>
            <div className="hero-cta">
              <Link className="btn btn-invert" href={demoHref}>
                {c.hero.ctaDemo}
              </Link>
              <Link className="btn btn-line-light" href={pricingHref}>
                {c.hero.ctaPricing}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="trust">
        <div className="wrap trust-in">{c.trust}</div>
      </div>

      <section className="section">
        <div className="wrap">
          <p className="kicker">{c.position.kicker}</p>
          <h2>{c.position.title}</h2>
          <p className="lead">{c.position.lead}</p>
          <div className="edit-list">
            {c.position.rows.map((row) => (
              <article className="edit-row" key={row.n}>
                <div className="edit-n">{row.n}</div>
                <div>
                  <h3>{row.title}</h3>
                  <p>{row.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-wash">
        <div className="wrap">
          <p className="kicker">{c.modules.kicker}</p>
          <h2>{c.modules.title}</h2>
          <p className="lead">{c.modules.lead}</p>
          <div className="mod-row">
            {c.modules.items.map((m) => (
              <Link key={m.slug} href={`${productBase}/${m.slug}`}>
                <div className="k">{m.k}</div>
                <h3>{m.title}</h3>
                <p>{m.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-ink">
        <div className="wrap">
          <p className="kicker">{c.industries.kicker}</p>
          <h2>{c.industries.title}</h2>
          <p className="lead">{c.industries.lead}</p>
          <div className="ind-grid">
            {c.industries.items.map((ind) => (
              <article key={ind.slug}>
                <h3>{ind.title}</h3>
                <p>{ind.body}</p>
                <Link href={`${solutionBase}/${solutionSlugForLocale(locale, ind.slug)}`}>{ind.link}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-wash">
        <div className="wrap">
          <p className="kicker">{c.steps.kicker}</p>
          <h2>{c.steps.title}</h2>
          <p className="lead">{c.steps.lead}</p>
          <div className="steps">
            {c.steps.items.map((s) => (
              <div className="step" key={s.n}>
                <b>{s.n}</b>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <p className="kicker">{c.newsTeaser.kicker}</p>
          <h2>{c.newsTeaser.title}</h2>
          {articles.length > 0 ? (
            <>
              <div className="news-grid" style={{ marginTop: 36 }}>
                {articles.map((a, i) => (
                  <Link
                    key={a.slug}
                    className={`news-card${i === 0 ? ' feature' : ''}`}
                    href={articleHref(locale, a.slug)}
                  >
                    <div className="news-thumb">
                      <b>{String(i + 1).padStart(2, '0')}</b>
                      <span>{CATEGORY_LABELS[locale][a.category]}</span>
                    </div>
                    <div className="news-body">
                      <time dateTime={a.published_at}>{formatArticleDate(a.published_at, locale)}</time>
                      <h3>{a.title}</h3>
                      <p>{a.dek}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <p style={{ marginTop: 28 }}>
                <Link href={newsListHref(locale)}>{c.newsTeaser.allLink}</Link>
              </p>
            </>
          ) : upcoming ? (
            <p className="lead" style={{ marginTop: 24 }}>
              {locale === 'vi' ? 'Sự kiện sắp tới: ' : 'Upcoming: '}
              <Link href={eventHref(locale, upcoming.slug)}>{upcoming.title}</Link>
            </p>
          ) : null}
        </div>
      </section>

      {customers.length > 0 ? (
        <section className="section section-wash">
          <div className="wrap">
            <p className="kicker">{c.customersTeaser.kicker}</p>
            <h2>{c.customersTeaser.title}</h2>
            <div className="news-grid" style={{ marginTop: 36 }}>
              {customers.map((item, i) => (
                <Link key={item.slug} className={`news-card${i === 0 ? ' feature' : ''}`} href={customerHref(locale, item.slug)}>
                  <div className="news-thumb">
                    <b>{String(i + 1).padStart(2, '0')}</b>
                    <span>{item.industry.toUpperCase()}</span>
                  </div>
                  <div className="news-body">
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
            <p style={{ marginTop: 28 }}>
              <Link href={customersListHref(locale)}>{c.customersTeaser.allLink}</Link>
            </p>
          </div>
        </section>
      ) : null}

      <section className="section section-surface">
        <div className="wrap">
          <h2>{faq.title}</h2>
          <FaqView items={faq.items} />
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <h2>{c.cta.title}</h2>
          <Link className="btn btn-invert" href={demoHref}>
            {c.cta.button}
          </Link>
        </div>
      </section>
    </>
  );
}
