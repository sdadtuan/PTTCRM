'use client';

import Image from 'next/image';
import Link from 'next/link';
import { switchLocalePath, type Locale } from '@pttcrm/gtm-core';
import { useCallback, useEffect, useState } from 'react';
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [feat, setFeat] = useState<{ title: string; body: string; cta: string; href: string } | null>(
    nav.find((g) => g.id === 'solutions')?.featured ?? null,
  );

  const closeMega = useCallback(() => setOpenMega(null), []);
  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setOpenGroup(null);
  }, []);

  useEffect(() => {
    closeMobile();
    closeMega();
  }, [pathname, closeMobile, closeMega]);

  useEffect(() => {
    document.body.classList.toggle('nav-locked', mobileOpen);
    return () => document.body.classList.remove('nav-locked');
  }, [mobileOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeMobile();
        closeMega();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeMobile, closeMega]);

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
      <a className="skip" href="#main">
        {locale === 'en' ? 'Skip to content' : 'Tới nội dung'}
      </a>
      <header className="top" onMouseLeave={closeMega}>
        <div className="top-in wrap">
          <Link className="brand" href={home} onMouseEnter={closeMega} onClick={closeMobile}>
            <span className="brand-mark">
              <Image src="/pttcrm-logo-monogram.png" alt="" width={28} height={28} />
            </span>
            <span>PTTCRM</span>
          </Link>
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
              <span aria-hidden="true">|</span>
              <Link href={locale === 'en' ? pathname : switchPath} className={locale === 'en' ? 'active' : ''}>
                EN
              </Link>
            </div>
            <a className="btn btn-ghost btn-login" href={loginUrl}>
              {t.login}
            </a>
            <Link className="btn btn-solid btn-demo" href={demoHref} onMouseEnter={closeMega} onClick={closeMobile}>
              <span className="demo-full">{t.demo}</span>
              <span className="demo-short">Demo</span>
            </Link>
            <button
              className={`menu-toggle${mobileOpen ? ' is-open' : ''}`}
              type="button"
              aria-label={mobileOpen ? (locale === 'en' ? 'Close menu' : 'Đóng menu') : 'Menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
      <div className={`nav-dim ${openMega || mobileOpen ? 'open' : ''}`} onClick={() => { closeMega(); closeMobile(); }} aria-hidden />
      <aside className={`mnav${mobileOpen ? ' open' : ''}`} id="mobile-nav" aria-hidden={!mobileOpen}>
        <div className="mnav-scroll">
          {nav.map((group) =>
            group.href ? (
              <Link key={group.id} className="mnav-link" href={group.href} onClick={closeMobile}>
                {group.label}
              </Link>
            ) : (
              <div key={group.id} className="mnav-group">
                <button
                  className="mnav-acc"
                  type="button"
                  aria-expanded={openGroup === group.id}
                  onClick={() => setOpenGroup((cur) => (cur === group.id ? null : group.id))}
                >
                  {group.label}
                  <span aria-hidden="true">{openGroup === group.id ? '−' : '+'}</span>
                </button>
                {openGroup === group.id && (
                  <div className="mnav-sub">
                    {group.items?.map((item) => (
                      <Link key={item.id} className="mnav-sublink" href={item.href} onClick={closeMobile}>
                        <strong>{item.label}</strong>
                        {item.desc && <span>{item.desc}</span>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ),
          )}
        </div>
        <div className="mnav-foot">
          <a className="btn btn-ghost" href={loginUrl}>
            {t.login}
          </a>
          <Link className="btn btn-solid" href={demoHref} onClick={closeMobile}>
            {t.demo}
          </Link>
        </div>
      </aside>
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
        <p className="wrap footer-copy">© 2026 PTTCRM</p>
      </footer>
    </div>
  );
}
