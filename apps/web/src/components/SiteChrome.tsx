'use client';

import Image from 'next/image';
import Link from 'next/link';
import { switchLocalePath, type Locale } from '@pttcrm/gtm-core';
import { useCallback, useState } from 'react';
import { buildNav, navCopy } from './nav';
import './chrome.css';

type Props = {
  locale: Locale;
  pathname: string;
  children: React.ReactNode;
};

export function SiteChrome({ locale, pathname, children }: Props) {
  const nav = buildNav(locale);
  const t = navCopy(locale);
  const other: Locale = locale === 'vi' ? 'en' : 'vi';
  const switchPath = switchLocalePath(pathname, other);
  const loginUrl = process.env.NEXT_PUBLIC_LOGIN_URL || 'https://rs.pttads.vn/login';
  const demoHref = locale === 'en' ? '/en/request-demo' : '/vi/dang-ky-demo';
  const home = locale === 'en' ? '/en' : '/vi';

  const [openMega, setOpenMega] = useState<string | null>(null);
  const [feat, setFeat] = useState<{ title: string; body: string; cta: string; href: string } | null>(
    nav.find((g) => g.id === 'solutions')?.featured ?? null,
  );

  const closeMega = useCallback(() => setOpenMega(null), []);

  const footer = {
    platform: nav.find((g) => g.id === 'platform')?.items ?? [],
    solutions: nav.find((g) => g.id === 'solutions')?.items ?? [],
    resources: nav.find((g) => g.id === 'resources')?.items ?? [],
    legal: [
      { href: locale === 'en' ? '/en/legal/privacy' : '/vi/phap-ly/bao-mat', label: locale === 'en' ? 'Privacy' : 'Bảo mật' },
      { href: locale === 'en' ? '/en/legal/terms' : '/vi/phap-ly/dieu-khoan', label: locale === 'en' ? 'Terms' : 'Điều khoản' },
      { href: locale === 'en' ? '/en/legal/cookies' : '/vi/phap-ly/cookie', label: 'Cookie' },
    ],
  };

  return (
    <div className="site-chrome">
      <a className="skip" href="#main" style={{ position: 'absolute', left: '-9999px' }}>
        {locale === 'en' ? 'Skip to content' : 'Tới nội dung'}
      </a>
      <header className="top" onMouseLeave={closeMega}>
        <div className="top-in wrap">
          <Link className="brand" href={home} onMouseEnter={closeMega}>
            <span className="brand-mark">
              <Image src="/pttcrm-logo-monogram.png" alt="" width={28} height={28} />
            </span>
            <span>PTTCRM</span>
          </Link>
          <button className="menu-toggle" type="button" aria-label="Menu">
            ☰
          </button>
          <nav className="nav" aria-label="Main">
            {nav.map((group) =>
              group.href ? (
                <Link
                  key={group.id}
                  className="nav-link"
                  href={group.href}
                  onMouseEnter={closeMega}
                >
                  {group.label}
                </Link>
              ) : (
                <div
                  key={group.id}
                  className="nav-item"
                  onMouseEnter={() => {
                    setOpenMega(group.id);
                    if (group.featured) setFeat(group.featured);
                  }}
                >
                  <button className="nav-btn" type="button" aria-expanded={openMega === group.id}>
                    {group.label} ▾
                  </button>
                  <div className={`mega ${openMega === group.id ? 'open' : ''}`}>
                    <div className="mega-in">
                      <div>
                        <p className="mega-k">{group.megaKicker}</p>
                        {group.items?.map((item) => (
                          <Link
                            key={item.id}
                            className="mega-link"
                            href={item.href}
                            onMouseEnter={() => group.featured && setFeat(group.featured)}
                          >
                            {item.icon && <span className="mega-ico">{item.icon}</span>}
                            <span className="mega-txt">
                              <strong>{item.label}</strong>
                              {item.desc && <span>{item.desc}</span>}
                            </span>
                          </Link>
                        ))}
                      </div>
                      {feat && (
                        <aside className="mega-feat">
                          <p className="mega-k">{locale === 'en' ? 'Preview' : 'Xem nhanh'}</p>
                          <h3>{feat.title}</h3>
                          <p>{feat.body}</p>
                          <Link className="btn btn-solid" href={feat.href}>
                            {feat.cta}
                          </Link>
                        </aside>
                      )}
                    </div>
                  </div>
                </div>
              ),
            )}
          </nav>
          <div className="nav-actions">
            <div className="locale">
              <Link href={locale === 'vi' ? pathname : switchPath} className={locale === 'vi' ? 'active' : ''}>
                VI
              </Link>
              <span>|</span>
              <Link href={locale === 'en' ? pathname : switchPath} className={locale === 'en' ? 'active' : ''}>
                EN
              </Link>
            </div>
            <a className="btn btn-ghost" href={loginUrl}>
              {t.login}
            </a>
            <Link className="btn btn-solid" href={demoHref} onMouseEnter={closeMega}>
              {t.demo}
            </Link>
          </div>
        </div>
      </header>
      <div className={`nav-dim ${openMega ? 'open' : ''}`} onClick={closeMega} aria-hidden />
      <main id="main" className="site-main">
        {children}
      </main>
      <footer className="site-footer">
        <div className="wrap footer-grid">
          <div>
            <h4>{t.platform}</h4>
            <ul>
              {footer.platform.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>{t.solutions}</h4>
            <ul>
              {footer.solutions.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>{locale === 'en' ? 'Legal' : 'Pháp lý'}</h4>
            <ul>
              {footer.legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>{t.resources}</h4>
            <ul>
              {footer.resources.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>{locale === 'en' ? 'Contact' : 'Liên hệ'}</h4>
            <ul>
              <li>
                <a href="mailto:hello@pttcrm.com">hello@pttcrm.com</a>
              </li>
              <li>
                <a href="tel:+842473077979">+84 24 7307 7979</a>
              </li>
            </ul>
          </div>
        </div>
        <p className="wrap" style={{ marginTop: '2rem', fontSize: 13, opacity: 0.7 }}>
          © 2026 PTTCRM
        </p>
      </footer>
    </div>
  );
}
