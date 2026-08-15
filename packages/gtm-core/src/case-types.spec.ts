import { describe, expect, test } from 'vitest';
import { formatCaseMetrics } from './case-types';

describe('formatCaseMetrics', () => {
  test('formats VI case line', () => {
    expect(formatCaseMetrics({ cpl_vnd: 180000, roas: 3.2 }, 'vi')).toBe(
      'CPL 180.000 VND · ROAS 3,2',
    );
  });

  test('formats EN case line', () => {
    expect(formatCaseMetrics({ cpl_vnd: 180000, roas: 3.2 }, 'en')).toBe(
      'CPL 180,000 VND · ROAS 3.2',
    );
  });
});
