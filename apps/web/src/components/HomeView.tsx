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

const MODULE_ICONS: Record<string, string> = {
  crm: 'CRM',
  ads: 'ADS',
  portal: 'POR',
  ai: 'AI',
};

const INDUSTRY_THEMES = ['teal', 'violet', 'green'] as const;

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

      <section className="orbit-hero">
        <div className="orbit-hero-glow orbit-hero-glow-a" aria-hidden />
        <div className="orbit-hero-glow orbit-hero-glow-b" aria-hidden />
        <div className="wrap orbit-hero-in">
          <span className="orbit-badge">{c.hero.kicker}</span>
          <h1>
            <span className="orbit-gradient-text">{c.slogan}</span>
          </h1>
          <p className="orbit-hero-sub">{c.hero.subtitle}</p>
          <div className="orbit-hero-cta">
            <Link className="btn orbit-btn-primary" href={demoHref}>
              {c.hero.ctaDemo}
            </Link>
            <Link className="btn orbit-btn-outline" href={pricingHref}>
              {c.hero.ctaPricing}
            </Link>
          </div>
          <div className="orbit-stats">
            {c.hero.stats.map((stat) => (
              <div className="orbit-stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="orbit-trust">
        <div className="wrap">{c.trust}</div>
      </div>

      <section className="orbit-section orbit-section-light">
        <div className="wrap orbit-section-head">
          <p className="orbit-kicker">{c.position.kicker}</p>
          <h2>{c.position.title}</h2>
          <p className="orbit-lead">{c.position.lead}</p>
        </div>
        <div className="wrap orbit-feature-grid">
          {c.position.rows.map((row, i) => (
            <article className="orbit-glass-card orbit-feature-card" key={row.n}>
              <div className={`orbit-icon orbit-icon-${INDUSTRY_THEMES[i % 3]}`}>{row.n}</div>
              <h3>{row.title}</h3>
              <p>{row.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="orbit-section">
        <div className="wrap orbit-section-head">
          <p className="orbit-kicker">{c.modules.kicker}</p>
          <h2>{c.modules.title}</h2>
          <p className="orbit-lead">{c.modules.lead}</p>
        </div>
        <div className="wrap orbit-product-grid">
          {c.modules.items.map((m) => (
            <Link className="orbit-glass-card orbit-product-card" href={`${productBase}/${m.slug}`} key={m.slug}>
              <div className="orbit-product-icon">{MODULE_ICONS[m.slug] ?? m.k}</div>
              <h3>{m.title}</h3>
              <p>{m.body}</p>
              <span className="orbit-link">{c.learnMore} →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="orbit-section orbit-section-light">
        <div className="wrap orbit-section-head">
          <p className="orbit-kicker">{c.industries.kicker}</p>
          <h2>{c.industries.title}</h2>
          <p className="orbit-lead">{c.industries.lead}</p>
        </div>
        <div className="wrap orbit-service-grid">
          {c.industries.items.map((ind, i) => (
            <article className="orbit-light-card" key={ind.slug}>
              <div className={`orbit-icon orbit-icon-${INDUSTRY_THEMES[i % 3]}`}>{String(i + 1).padStart(2, '0')}</div>
              <h3>{ind.title}</h3>
              <p>{ind.body}</p>
              <Link className="orbit-link" href={`${solutionBase}/${solutionSlugForLocale(locale, ind.slug)}`}>
                {ind.link}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="orbit-section">
        <div className="wrap orbit-section-head">
          <p className="orbit-kicker">{c.steps.kicker}</p>
          <h2>{c.steps.title}</h2>
          <p className="orbit-lead">{c.steps.lead}</p>
        </div>
        <div className="wrap orbit-process-grid">
          {c.steps.items.map((s) => (
            <div className="orbit-glass-card orbit-process-card" key={s.n}>
              <b>{s.n}</b>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="orbit-section orbit-section-light">
        <div className="wrap orbit-section-head">
          <p className="orbit-kicker">{c.newsTeaser.kicker}</p>
          <h2>{c.newsTeaser.title}</h2>
        </div>
        <div className="wrap">
          {articles.length > 0 ? (
            <>
              <div className="orbit-insight-grid">
                {articles.map((a, i) => (
                  <Link
                    key={a.slug}
                    className={`orbit-light-card orbit-insight-card${i === 0 ? ' feature' : ''}`}
                    href={articleHref(locale, a.slug)}
                  >
                    <div className={`orbit-insight-thumb orbit-icon-${INDUSTRY_THEMES[i % 3]}`}>
                      <b>{String(i + 1).padStart(2, '0')}</b>
                      <span>{CATEGORY_LABELS[locale][a.category]}</span>
                    </div>
                    <div className="orbit-insight-body">
                      <time dateTime={a.published_at}>{formatArticleDate(a.published_at, locale)}</time>
                      <h3>{a.title}</h3>
                      <p>{a.dek}</p>
                      <span className="orbit-link">{c.learnMore} →</span>
                    </div>
                  </Link>
                ))}
              </div>
              <p className="orbit-more">
                <Link href={newsListHref(locale)}>{c.newsTeaser.allLink}</Link>
              </p>
            </>
          ) : upcoming ? (
            <p className="orbit-lead">
              {locale === 'vi' ? 'Sự kiện sắp tới: ' : 'Upcoming: '}
              <Link href={eventHref(locale, upcoming.slug)}>{upcoming.title}</Link>
            </p>
          ) : null}
        </div>
      </section>

      {customers.length > 0 ? (
        <section className="orbit-section">
          <div className="wrap orbit-section-head">
            <p className="orbit-kicker">{c.customersTeaser.kicker}</p>
            <h2>{c.customersTeaser.title}</h2>
          </div>
          <div className="wrap orbit-insight-grid">
            {customers.map((item, i) => (
              <Link
                key={item.slug}
                className={`orbit-glass-card orbit-insight-card dark${i === 0 ? ' feature' : ''}`}
                href={customerHref(locale, item.slug)}
              >
                <div className={`orbit-insight-thumb orbit-icon-${INDUSTRY_THEMES[i % 3]}`}>
                  <b>{String(i + 1).padStart(2, '0')}</b>
                  <span>{item.industry.toUpperCase()}</span>
                </div>
                <div className="orbit-insight-body">
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <span className="orbit-link">{c.learnMore} →</span>
                </div>
              </Link>
            ))}
          </div>
          <p className="wrap orbit-more">
            <Link href={customersListHref(locale)}>{c.customersTeaser.allLink}</Link>
          </p>
        </section>
      ) : null}

      <section className="orbit-section orbit-section-light">
        <div className="wrap orbit-section-head">
          <h2>{faq.title}</h2>
        </div>
        <div className="wrap orbit-faq">
          <FaqView items={faq.items} />
        </div>
      </section>

      <section className="orbit-cta">
        <div className="orbit-cta-glow" aria-hidden />
        <div className="wrap orbit-cta-in">
          <h2>{c.cta.title}</h2>
          <Link className="btn orbit-btn-primary" href={demoHref}>
            {c.cta.button}
          </Link>
        </div>
      </section>
    </>
  );
}
