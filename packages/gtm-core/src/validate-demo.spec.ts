import { describe, expect, test } from 'vitest';
import { validateDemoPayload } from './validate-demo';

describe('validateDemoPayload', () => {
  test('rejects short name and missing consent', () => {
    const r = validateDemoPayload({
      full_name: 'A',
      email: 'bad',
      phone: '123',
      company: 'X',
      industry: 'agency',
      sku_interest: 'agy',
      consent_privacy: false,
      locale: 'vi',
      landing_path: '/vi',
      website: '',
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.field_errors.full_name).toBeTruthy();
      expect(r.field_errors.email).toBeTruthy();
      expect(r.field_errors.phone).toBeTruthy();
      expect(r.field_errors.consent_privacy).toBeTruthy();
    }
  });

  test('accepts VN phone and empty honeypot', () => {
    const r = validateDemoPayload({
      full_name: 'Nguyen An',
      email: 'an@agency.vn',
      phone: '0901234567',
      company: 'An Agency',
      industry: 'agency',
      sku_interest: 'agy',
      consent_privacy: true,
      locale: 'vi',
      landing_path: '/vi/giai-phap/agency',
      website: '',
    });
    expect(r.ok).toBe(true);
  });

  test('EN demo accepts market_country th', () => {
    const r = validateDemoPayload({
      full_name: 'Jane Doe',
      email: 'jane@agency.sg',
      phone: '+6591234567',
      company: 'Agency SG',
      industry: 'agency',
      sku_interest: 'agy',
      consent_privacy: true,
      locale: 'en',
      landing_path: '/en/markets/sg',
      website: '',
      market_country: 'th',
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.market_country).toBe('th');
  });

  test('invalid market_country rejected', () => {
    const r = validateDemoPayload({
      full_name: 'Jane Doe',
      email: 'jane@agency.sg',
      phone: '+6591234567',
      company: 'Agency SG',
      industry: 'agency',
      sku_interest: 'agy',
      consent_privacy: true,
      locale: 'en',
      landing_path: '/en/markets/sg',
      website: '',
      market_country: 'vn',
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.field_errors.market_country).toBeTruthy();
  });

  test('VI locale rejects market_country', () => {
    const r = validateDemoPayload({
      full_name: 'Nguyen An',
      email: 'an@agency.vn',
      phone: '0901234567',
      company: 'An Agency',
      industry: 'agency',
      sku_interest: 'agy',
      consent_privacy: true,
      locale: 'vi',
      landing_path: '/vi/giai-phap/agency',
      website: '',
      market_country: 'th',
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.field_errors.market_country).toBeTruthy();
  });
});
