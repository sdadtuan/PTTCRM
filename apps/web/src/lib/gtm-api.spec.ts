import { buildDemoRequest } from './gtm-api';
import { describe, expect, test } from 'vitest';

describe('gtm-api', () => {
  test('buildDemoRequest maps form and first-touch utm', () => {
    const body = buildDemoRequest({
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
      utm_json: '{"utm_source":"google","utm_campaign":"w0"}',
    });
    expect(body.utm_source).toBe('google');
    expect(body.website).toBe('');
    expect(body.consent_privacy).toBe(true);
  });
});
