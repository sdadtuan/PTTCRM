import type { Locale } from '@pttcrm/gtm-core';
import Link from 'next/link';
import { customerHref, customersListHref, fetchCustomers } from '@/lib/cms';
import { getHome, solutionSlugForLocale } from '@/lib/content';
import { HeroSlider } from './HeroSlider';
import './pages.css';

type Props = {
  locale: Locale;
};

const SCENE: Record<string, string> = {
  bds: '/editorial-bds.svg',
  'real-estate': '/editorial-bds.svg',
  agency: '/editorial-agency.svg',
  fnb: '/editorial-fnb.svg',
};

const MODULE_ICONS: Record<string, string> = {
  crm: 'CRM',
  ads: 'ADS',
  portal: 'POR',
  ai: 'AI',
};

export async function HomeView({ locale }: Props) {
  const c = getHome(locale);
  const customers = (await fetchCustomers(locale)).slice(0, 3);

  const demoHref = locale === 'en' ? '/en/request-demo' : '/vi/dang-ky-demo';
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
    <div className="pro-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="pro-hero">
        <HeroSlider slides={c.hero.slides} demoHref={demoHref} ctaDemo={c.hero.ctaDemo} />
      </section>

      <div className="pro-trust">
        <div className="wrap pro-trust-in">
          <span>{c.trust}</span>
          <ul>
            {c.hero.channels.map((ch) => (
              <li key={ch}>{ch}</li>
            ))}
          </ul>
        </div>
      </div>

      <section className="pro-band pro-band-light">
        <div className="wrap pro-split">
          <div className="pro-split-copy">
            <p className="pro-kicker">{c.position.kicker}</p>
            <h2>{c.position.title}</h2>
            <p className="pro-lead">{c.position.lead}</p>
          </div>
          <div className="pro-split-cards">
            {c.position.rows.map((row) => (
              <article key={row.n}>
                <em>{row.n}</em>
                <h3>{row.title}</h3>
                <p>{row.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pro-band">
        <div className="wrap pro-head">
          <p className="pro-kicker">{c.modules.kicker}</p>
          <h2>{c.modules.title}</h2>
          <p className="pro-lead">{c.modules.lead}</p>
        </div>
        <div className="wrap pro-modules">
          {c.modules.items.map((m) => (
            <Link key={m.slug} className="pro-glass" href={`${productBase}/${m.slug}`}>
              <span>{MODULE_ICONS[m.slug] ?? m.k}</span>
              <h3>{m.title}</h3>
              <p>{m.body}</p>
              <em>{c.learnMore} →</em>
            </Link>
          ))}
        </div>
      </section>

      <section className="pro-band pro-band-light">
        <div className="wrap pro-head">
          <p className="pro-kicker">{c.industries.kicker}</p>
          <h2>{c.industries.title}</h2>
          <p className="pro-lead">{c.industries.lead}</p>
        </div>
        <div className="wrap pro-industries">
          {c.industries.items.map((ind) => (
            <article key={ind.slug}>
              <div className="pro-industry-visual">
                <img src={SCENE[ind.slug] ?? SCENE.bds} alt="" />
              </div>
              <p className="pro-metric">{ind.metric}</p>
              <h3>{ind.title}</h3>
              <p>{ind.body}</p>
              <Link href={`${solutionBase}/${solutionSlugForLocale(locale, ind.slug)}`}>{ind.link}</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="pro-band">
        <div className="wrap pro-head">
          <p className="pro-kicker">{c.steps.kicker}</p>
          <h2>{c.steps.title}</h2>
          <p className="pro-lead">{c.steps.lead}</p>
        </div>
        <div className="wrap pro-steps">
          {c.steps.items.map((s) => (
            <div className="pro-glass" key={s.n}>
              <b>{s.n}</b>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {customers.length > 0 ? (
        <section className="pro-band pro-band-light">
          <div className="wrap pro-head">
            <p className="pro-kicker">{c.customersTeaser.kicker}</p>
            <h2>{c.customersTeaser.title}</h2>
          </div>
          <div className="wrap pro-customers">
            {customers.map((item) => (
              <Link key={item.slug} href={customerHref(locale, item.slug)}>
                <img src={SCENE[item.industry] ?? SCENE.bds} alt="" />
                <div>
                  <p className="pro-metric">{item.industry}</p>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <em>{c.learnMore} →</em>
                </div>
              </Link>
            ))}
          </div>
          <p className="wrap pro-more">
            <Link href={customersListHref(locale)}>{c.customersTeaser.allLink}</Link>
          </p>
        </section>
      ) : null}

      <section className="pro-cta">
        <div className="pro-cta-glow" aria-hidden />
        <div className="wrap pro-cta-in">
          <h2>{c.cta.title}</h2>
          <Link className="btn pro-btn" href={demoHref}>
            {c.cta.button} →
          </Link>
        </div>
      </section>
    </div>
  );
}
