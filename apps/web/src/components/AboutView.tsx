import type { Locale } from '@pttcrm/gtm-core';
import Link from 'next/link';
import { getAbout } from '@/lib/content';
import './pages.css';

type Props = { locale: Locale };

export function AboutView({ locale }: Props) {
  const a = getAbout(locale);
  const home = locale === 'en' ? '/en' : '/vi';
  const demoHref = locale === 'en' ? '/en/request-demo' : '/vi/dang-ky-demo';

  return (
    <>
      <section className="mast">
        <div className="wrap page-hero">
          <p className="crumbs">
            <Link href={home}>PTTCRM</Link> / {a.title}
          </p>
          <h1>{a.title}</h1>
          <p className="lead">{a.lead}</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="ind-grid">
            {a.cards.map((card) => (
              <article key={card.title}>
                <h2>{card.title}</h2>
                {card.body.split('\n').map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </article>
            ))}
          </div>
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
