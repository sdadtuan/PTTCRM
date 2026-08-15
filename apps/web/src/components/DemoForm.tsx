'use client';

import type { Locale } from '@pttcrm/gtm-core';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { readUtmCookie } from '@/components/UtmCapture';
import { buildDemoRequest, submitDemo, thanksPath } from '@/lib/gtm-api';
import type { CompanySize, Industry, SkuInterest } from '@pttcrm/gtm-core';

type Props = {
  locale: Locale;
};

const INDUSTRIES: { value: Industry; vi: string; en: string }[] = [
  { value: 'bds', vi: 'Bất động sản', en: 'Real estate' },
  { value: 'agency', vi: 'Agency', en: 'Agency' },
  { value: 'fnb', vi: 'F&B', en: 'F&B' },
  { value: 'education', vi: 'Education', en: 'Education' },
  { value: 'pharma', vi: 'Pharma', en: 'Pharma' },
  { value: 'other', vi: 'Khác', en: 'Other' },
];

const SKUS: { value: SkuInterest; vi: string; en: string }[] = [
  { value: 'mkt', vi: 'PTTCRM Marketing', en: 'PTTCRM Marketing' },
  { value: 'ind', vi: 'PTTCRM Industry', en: 'PTTCRM Industry' },
  { value: 'agy', vi: 'PTTCRM Agency OS', en: 'PTTCRM Agency OS' },
];

const SIZES: CompanySize[] = ['1-10', '11-30', '31-80', '81+'];

export function DemoForm({ locale }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = locale === 'vi';

  const [pending, setPending] = useState(false);
  const [apiError, setApiError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [industry, setIndustry] = useState(searchParams.get('industry') ?? 'bds');
  const [sku, setSku] = useState(searchParams.get('sku') ?? 'ind');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setApiError('');
    setFieldErrors({});
    setPending(true);

    const fd = new FormData(e.currentTarget);
    const payload = buildDemoRequest({
      full_name: String(fd.get('full_name') ?? ''),
      email: String(fd.get('email') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      company: String(fd.get('company') ?? ''),
      industry: industry as Industry,
      sku_interest: sku as SkuInterest,
      company_size: (String(fd.get('company_size') ?? '') || undefined) as CompanySize | undefined,
      message: String(fd.get('message') ?? '') || undefined,
      consent_privacy: fd.get('consent_privacy') === 'on' ? true : (false as never),
      locale,
      landing_path: pathname,
      website: String(fd.get('website') ?? ''),
      utm_json: readUtmCookie(),
    });

    try {
      const result = await submitDemo(payload);
      if ('field_errors' in result) {
        setFieldErrors(result.field_errors);
        setPending(false);
        return;
      }
      if ('rate_limited' in result) {
        setApiError(t ? 'Quá nhiều yêu cầu. Thử lại sau.' : 'Too many requests. Try again later.');
        setPending(false);
        return;
      }
      router.push(thanksPath(locale));
    } catch (err) {
      const msg = err instanceof Error && err.message === 'api_unconfigured'
        ? t
          ? 'Hệ thống demo chưa kết nối'
          : 'Demo API is not configured'
        : t
          ? 'Không gửi được. Thử lại.'
          : 'Could not submit. Try again.';
      setApiError(msg);
      setPending(false);
    }
  }

  const privacyHref = locale === 'en' ? '/en/legal/privacy' : '/vi/phap-ly/bao-mat';
  const errLabel = (k: string) => {
    const code = fieldErrors[k];
    if (!code) return '';
    if (k === 'full_name' || k === 'company') return t ? 'Tối thiểu 2 ký tự' : 'At least 2 characters';
    if (k === 'email') return t ? 'Email không hợp lệ' : 'Invalid email';
    if (k === 'phone') return t ? 'SĐT 0xxxxxxxxx hoặc E.164' : 'Phone format invalid';
    if (k === 'consent_privacy') return t ? 'Cần đồng ý bảo mật' : 'Privacy consent required';
    return code;
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      <input
        className="hp"
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        style={{ position: 'absolute', left: '-9999px' }}
      />
      <label htmlFor="full_name">{t ? 'Họ tên' : 'Full name'}</label>
      <input id="full_name" name="full_name" required minLength={2} autoComplete="name" />
      <div className="err">{errLabel('full_name')}</div>

      <label htmlFor="email">{t ? 'Email công ty' : 'Work email'}</label>
      <input id="email" name="email" type="email" required autoComplete="email" />
      <div className="err">{errLabel('email')}</div>

      <label htmlFor="phone">{t ? 'Số điện thoại' : 'Phone'}</label>
      <input id="phone" name="phone" required autoComplete="tel" />
      <div className="err">{errLabel('phone')}</div>

      <label htmlFor="company">{t ? 'Công ty' : 'Company'}</label>
      <input id="company" name="company" required minLength={2} />
      <div className="err">{errLabel('company')}</div>

      <label htmlFor="industry">{t ? 'Ngành' : 'Industry'}</label>
      <select id="industry" name="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} required>
        {INDUSTRIES.map((o) => (
          <option key={o.value} value={o.value}>
            {t ? o.vi : o.en}
          </option>
        ))}
      </select>

      <label htmlFor="sku_interest">{t ? 'Gói quan tâm' : 'Plan of interest'}</label>
      <select id="sku_interest" name="sku_interest" value={sku} onChange={(e) => setSku(e.target.value)} required>
        {SKUS.map((o) => (
          <option key={o.value} value={o.value}>
            {t ? o.vi : o.en}
          </option>
        ))}
      </select>

      <label htmlFor="company_size">{t ? 'Quy mô (không bắt buộc)' : 'Company size (optional)'}</label>
      <select id="company_size" name="company_size" defaultValue="">
        <option value="">—</option>
        {SIZES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <label htmlFor="message">{t ? 'Nhu cầu (không bắt buộc)' : 'Notes (optional)'}</label>
      <textarea
        id="message"
        name="message"
        maxLength={1000}
        placeholder={t ? 'Ví dụ: muốn xem ROAS từng client trên portal' : 'e.g. per-client ROAS on the portal'}
      />

      <label className="check">
        <input type="checkbox" name="consent_privacy" required />
        <span>
          {t ? 'Tôi đồng ý ' : 'I agree to the '}
          <Link href={privacyHref}>{t ? 'Chính sách bảo mật' : 'privacy policy'}</Link>
        </span>
      </label>
      <div className="err">{errLabel('consent_privacy')}</div>

      {apiError && <p className="err">{apiError}</p>}

      <button className="btn btn-solid" type="submit" disabled={pending} style={{ marginTop: 20 }}>
        {pending ? (t ? 'Đang gửi…' : 'Sending…') : t ? 'Gửi đăng ký' : 'Submit request'}
      </button>
    </form>
  );
}
