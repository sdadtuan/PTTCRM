import { describe, expect, test } from 'vitest';
import { parsePublicEnterpriseReadiness } from './enterprise-types';

describe('enterprise-types', () => {
  test('parsePublicEnterpriseReadiness accepts valid payload', () => {
    const r = parsePublicEnterpriseReadiness({
      updated_at: '2026-08-16T08:00:00.000Z',
      identity: {
        sso_mode: 'dual',
        sso_configured: true,
        mfa_required_positions: ['gdkd'],
        mfa_enforced: true,
        nest_password_login: true,
      },
      rbac: {
        permission_sets: true,
        row_level_scope_pilot: false,
      },
      login: {
        staff_url: 'https://rs.pttads.vn/login',
        branded_staff_url: null,
      },
    });
    expect(r?.identity.sso_mode).toBe('dual');
    expect(r?.rbac.permission_sets).toBe(true);
  });

  test('parsePublicEnterpriseReadiness rejects invalid sso_mode', () => {
    expect(
      parsePublicEnterpriseReadiness({
        updated_at: '2026-08-16T08:00:00.000Z',
        identity: { sso_mode: 'ldap', sso_configured: false, mfa_required_positions: [], mfa_enforced: false, nest_password_login: true },
        rbac: { permission_sets: false, row_level_scope_pilot: false },
        login: { staff_url: 'https://rs.pttads.vn/login', branded_staff_url: null },
      }),
    ).toBeNull();
  });
});
