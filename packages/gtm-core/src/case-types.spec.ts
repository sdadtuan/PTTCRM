import { describe, expect, test } from 'vitest';
import { canShowCaseMetrics, formatCaseMetrics } from './case-types';

describe('canShowCaseMetrics', () => {
  test('hides metrics unless PO verified', () => {
    expect(canShowCaseMetrics({ po_signed: true, metrics_verified: false })).toBe(false);
    expect(canShowCaseMetrics({ po_signed: true, metrics_verified: true })).toBe(true);
    expect(canShowCaseMetrics({ po_signed: false, metrics_verified: true })).toBe(false);
  });
});

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
