import { describe, expect, test } from 'vitest';
import { parsePublicEnterpriseReadiness } from '@pttcrm/gtm-core';

describe('parsePublicEnterpriseReadiness', () => {
  test('validates enterprise readiness shape', () => {
    const r = parsePublicEnterpriseReadiness({
      updated_at: '2026-08-16T08:00:00.000Z',
      identity: {
        sso_mode: 'nest',
        sso_configured: false,
        mfa_required_positions: [],
        nest_password_login: true,
      },
      rbac: { permission_sets: true, row_level_scope_pilot: false },
      login: { staff_url: 'https://rs.pttads.vn/login', branded_staff_url: null },
    });
    expect(r?.identity.sso_mode).toBe('nest');
  });
});
