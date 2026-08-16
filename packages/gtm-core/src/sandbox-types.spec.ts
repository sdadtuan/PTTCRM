import { describe, expect, it } from 'vitest';
import { hubMapPass, parseSandboxMoatBoard } from './sandbox-types';

const SAMPLE = {
  industry: 'agency',
  tenant: 'sandbox_agency',
  title: 'Agency performance board',
  headline_metric: { label: 'Client ROAS', value: '3.4×' },
  leads_this_week: 18,
  cpl_demo_usd: 42,
  demos_booked: 6,
  pipeline: [
    { id: 'new', label: 'New lead', count: 8 },
    { id: 'qualified', label: 'Qualified', count: 5 },
  ],
  spend_map: [
    { campaign: 'Meta — Brand', client: 'Northstar Media', spend_vnd: 120_000_000, hub_mapped: true },
  ],
  attribution: {
    attribution_model: 'last_touch',
    hub_mapped_pct: 84,
    unmapped_spend_pct: 16,
    spend_source: 'Meta Ads API',
    through_date: '2026-08-15',
  },
  portal: {
    client_label: 'Northstar Media',
    roas: 3.4,
    spend_vnd: 420_000_000,
    contracts_closed: 2,
  },
  hub_map_pass: true,
  sample_data: true as const,
};

describe('parseSandboxMoatBoard', () => {
  it('parses valid moat board', () => {
    const board = parseSandboxMoatBoard(SAMPLE);
    expect(board?.industry).toBe('agency');
    expect(board?.hub_map_pass).toBe(true);
    expect(board?.pipeline).toHaveLength(2);
  });

  it('rejects missing sample_data flag', () => {
    expect(parseSandboxMoatBoard({ ...SAMPLE, sample_data: false })).toBeNull();
  });

  it('rejects empty pipeline', () => {
    expect(parseSandboxMoatBoard({ ...SAMPLE, pipeline: [] })).toBeNull();
  });
});

describe('hubMapPass', () => {
  it('passes at 20% unmapped', () => {
    expect(hubMapPass(20)).toBe(true);
  });

  it('fails above 20% unmapped', () => {
    expect(hubMapPass(21)).toBe(false);
  });
});
