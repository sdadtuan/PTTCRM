import { describe, expect, test } from 'vitest';
import { parsePublicStatusResponse } from '@pttcrm/gtm-core';

describe('parsePublicStatusResponse', () => {
  test('validates component statuses', () => {
    const r = parsePublicStatusResponse({
      updated_at: '2026-08-16T07:00:00.000Z',
      sla_target_pct: 99.9,
      components: [{ id: 'x', name: 'X', status: 'operational' }],
    });
    expect(r?.components).toHaveLength(1);
  });
});
