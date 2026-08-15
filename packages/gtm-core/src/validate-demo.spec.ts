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
});
