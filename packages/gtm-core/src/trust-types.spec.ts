import { describe, expect, test } from 'vitest';
import {
  buildStatusHistory,
  isPlaceholderVendor,
  isPublicComponentStatus,
  isPublishablePartner,
  parsePublicStatusResponse,
} from './trust-types';

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

  test('parsePublicStatusResponse defaults empty history when omitted', () => {
    const r = parsePublicStatusResponse({
      updated_at: '2026-08-16T07:00:00.000Z',
      sla_target_pct: 99.9,
      components: [{ id: 'x', name: 'X', status: 'operational' }],
    });
    expect(r?.incidents).toEqual([]);
    expect(r?.history).toEqual([]);
    expect(r?.uptime_90d_pct).toBeNull();
  });

  test('isPlaceholderVendor flags PO_ names', () => {
    expect(isPlaceholderVendor('PO_CLOUD_PROVIDER')).toBe(true);
    expect(isPlaceholderVendor('Stripe, Inc.')).toBe(false);
  });

  test('isPublishablePartner rejects placeholders', () => {
    expect(
      isPublishablePartner({
        name: 'PO_PARTNER_NAME',
        website_url: 'https://example.com',
        po_approved: true,
      }),
    ).toBe(false);
    expect(
      isPublishablePartner({
        name: 'Apex Partners',
        website_url: 'https://apex.example.sg',
        po_approved: true,
      }),
    ).toBe(true);
    expect(
      isPublishablePartner({
        name: 'Apex Partners',
        website_url: 'https://apex.sg',
        po_approved: false,
      }),
    ).toBe(false);
  });

  test('buildStatusHistory stays empty without a start date', () => {
    const out = buildStatusHistory({
      now: new Date('2026-08-16T00:00:00.000Z'),
      historyStart: null,
      incidents: [],
    });
    expect(out.history).toEqual([]);
    expect(out.uptime_90d_pct).toBeNull();
  });

  test('buildStatusHistory withholds uptime until 30 measured days', () => {
    const out = buildStatusHistory({
      now: new Date('2026-08-16T12:00:00.000Z'),
      historyStart: new Date('2026-08-10T00:00:00.000Z'),
      incidents: [],
    });
    expect(out.history.length).toBeGreaterThan(0);
    expect(out.uptime_90d_pct).toBeNull();
  });

  test('buildStatusHistory computes uptime after 30 days', () => {
    const out = buildStatusHistory({
      now: new Date('2026-08-16T12:00:00.000Z'),
      historyStart: new Date('2026-05-01T00:00:00.000Z'),
      incidents: [
        {
          id: 'inc-1',
          started_at: '2026-08-01T00:00:00.000Z',
          resolved_at: '2026-08-01T12:00:00.000Z',
          severity: 'minor',
          title: 'Demo API latency',
          summary: 'Elevated latency for 12 hours.',
        },
      ],
    });
    expect(out.history.length).toBe(90);
    expect(out.uptime_90d_pct).not.toBeNull();
    expect(out.uptime_90d_pct!).toBeLessThan(100);
    expect(out.history.find((d) => d.date === '2026-08-01')?.status).toBe('degraded');
  });
});
