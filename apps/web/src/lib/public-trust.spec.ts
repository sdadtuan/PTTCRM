import { describe, expect, test } from 'vitest';
import { publicPartnerFeatured, publicSubprocessorRows } from './public-trust';

describe('public trust gates', () => {
  test('drops PO_ subprocessors', () => {
    const rows = publicSubprocessorRows([
      { name: 'PO_EMAIL_PROVIDER', purpose: 'x', region: 'y' },
      { name: 'Stripe, Inc.', purpose: 'pay', region: 'US' },
    ]);
    expect(rows.map((r) => r.name)).toEqual(['Stripe, Inc.']);
  });

  test('hides draft partner', () => {
    expect(
      publicPartnerFeatured({
        country_code: 'sg',
        name: 'PO_PARTNER_NAME',
        logo_path: '/partners/po-partner.svg',
        description_en: 'draft',
        website_url: 'https://example.com',
        po_approved: true,
      }),
    ).toBeNull();
  });
});
