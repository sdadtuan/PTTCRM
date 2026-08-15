'use client';

import { useEffect, useState } from 'react';
import { defaultConsent, parseConsent, serializeConsent, type Consent } from '@/lib/consent';

const KEY = 'ptt_consent';

type Props = { locale: 'vi' | 'en' };

export function CookieBar({ locale }: Props) {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [showOpts, setShowOpts] = useState(false);
  const [draft, setDraft] = useState<Consent>(defaultConsent());

  useEffect(() => {
    setConsent(parseConsent(localStorage.getItem(KEY)));
  }, []);

  function save(c: Consent) {
    localStorage.setItem(KEY, serializeConsent(c));
    document.cookie = `${KEY}=${encodeURIComponent(serializeConsent(c))}; path=/; max-age=15552000; SameSite=Lax`;
    setConsent(c);
    setShowOpts(false);
  }

  if (consent !== null && !showOpts) return null;

  const copy =
    locale === 'en'
      ? 'We use essential cookies. Analytics and ads run only with your consent.'
      : 'Chúng tôi dùng cookie cần thiết. Phân tích và quảng cáo chỉ khi bạn đồng ý.';

  return (
    <div className="cookie-bar" role="dialog" aria-label="Cookie consent">
      <div className="cookie-in">
        <p style={{ margin: 0, flex: '1 1 280px' }}>{copy}</p>
        {showOpts && (
          <label style={{ fontSize: 13 }}>
            <input
              type="checkbox"
              checked={draft.analytics}
              onChange={(e) => setDraft({ ...draft, analytics: e.target.checked })}
            />{' '}
            {locale === 'en' ? 'Analytics' : 'Phân tích'}
          </label>
        )}
        {showOpts && (
          <label style={{ fontSize: 13 }}>
            <input
              type="checkbox"
              checked={draft.ads}
              onChange={(e) => setDraft({ ...draft, ads: e.target.checked })}
            />{' '}
            {locale === 'en' ? 'Ads' : 'Quảng cáo'}
          </label>
        )}
        <button className="btn btn-ghost" type="button" onClick={() => save(defaultConsent())}>
          {locale === 'en' ? 'Essential only' : 'Đồng ý cần thiết'}
        </button>
        {!showOpts && (
          <button className="btn btn-ghost" type="button" onClick={() => setShowOpts(true)}>
            {locale === 'en' ? 'Options' : 'Tùy chọn'}
          </button>
        )}
        {showOpts && (
          <button className="btn btn-solid" type="button" onClick={() => save(draft)}>
            {locale === 'en' ? 'Save' : 'Lưu'}
          </button>
        )}
        <button className="btn btn-solid" type="button" onClick={() => save({ analytics: true, ads: true })}>
          {locale === 'en' ? 'Accept all' : 'Đồng ý tất cả'}
        </button>
      </div>
    </div>
  );
}
