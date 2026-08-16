import { describe, expect, test } from 'vitest';
import { isPublicComponentStatus, parsePublicStatusResponse } from './trust-types';

describe('trust-types', () => {
  test('isPublicComponentStatus', () => {
    expect(isPublicComponentStatus('operational')).toBe(true);
    expect(isPublicComponentStatus('unknown')).toBe(false);
  });

  test('parsePublicStatusResponse accepts valid payload', () => {
    const r = parsePublicStatusResponse({
      updated_at: '2026-08-16T07:00:00.000Z',
      sla_target_pct: 99.9,
      components: [
        { id: 'demo_api', name: 'Demo API', status: 'operational', region: 'Singapore' },
      ],
    });
    expect(r?.sla_target_pct).toBe(99.9);
    expect(r?.components[0]?.status).toBe('operational');
  });

  test('parsePublicStatusResponse rejects invalid', () => {
    expect(parsePublicStatusResponse(null)).toBeNull();
    expect(
      parsePublicStatusResponse({
        updated_at: '2026-08-16T07:00:00.000Z',
        sla_target_pct: 99.9,
        components: [{ id: 'x', name: 'X', status: 'broken' }],
      }),
    ).toBeNull();
  });
});
