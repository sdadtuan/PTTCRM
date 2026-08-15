import { describe, expect, test } from 'vitest';
import { businessMinutesBetween, slaTone } from './sla';

describe('slaTone', () => {
  test('freezes outside VN business hours', () => {
    const created = new Date('2026-08-14T11:00:00+07:00');
    const sat = new Date('2026-08-15T12:00:00+07:00');
    expect(slaTone(created, sat, 'new')).toBe('none');
  });

  test('danger after 4 business hours', () => {
    const created = new Date('2026-08-14T09:00:00+07:00');
    const now = new Date('2026-08-14T13:30:00+07:00');
    expect(businessMinutesBetween(created, now)).toBeGreaterThan(240);
    expect(slaTone(created, now, 'new')).toBe('danger');
    expect(slaTone(created, now, 'qualified')).toBe('none');
  });
});
