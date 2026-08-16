export type SandboxPipelineStage = {
  id: string;
  label: string;
  count: number;
};

export type SandboxSpendMapRow = {
  campaign: string;
  client: string;
  spend_vnd: number;
  hub_mapped: boolean;
};

export type SandboxAttribution = {
  attribution_model: string;
  hub_mapped_pct: number;
  unmapped_spend_pct: number;
  spend_source: string;
  through_date: string;
};

export type SandboxPortalPreview = {
  client_label: string;
  roas: number;
  spend_vnd: number;
  contracts_closed: number;
};

export type SandboxMoatBoard = {
  industry: string;
  tenant: string;
  title: string;
  headline_metric: { label: string; value: string };
  leads_this_week: number;
  cpl_demo_usd: number;
  demos_booked: number;
  pipeline: SandboxPipelineStage[];
  spend_map: SandboxSpendMapRow[];
  attribution: SandboxAttribution;
  portal: SandboxPortalPreview;
  hub_map_pass: boolean;
  sample_data: true;
};

function parsePipeline(raw: unknown): SandboxPipelineStage[] | null {
  if (!Array.isArray(raw)) return null;
  const stages: SandboxPipelineStage[] = [];
  for (const item of raw) {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) return null;
    const row = item as Record<string, unknown>;
    const id = typeof row.id === 'string' ? row.id : '';
    const label = typeof row.label === 'string' ? row.label : '';
    const count = typeof row.count === 'number' ? row.count : NaN;
    if (!id || !label || !Number.isFinite(count)) return null;
    stages.push({ id, label, count });
  }
  return stages.length > 0 ? stages : null;
}

function parseSpendMap(raw: unknown): SandboxSpendMapRow[] | null {
  if (!Array.isArray(raw)) return null;
  const rows: SandboxSpendMapRow[] = [];
  for (const item of raw) {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) return null;
    const row = item as Record<string, unknown>;
    const campaign = typeof row.campaign === 'string' ? row.campaign : '';
    const client = typeof row.client === 'string' ? row.client : '';
    const spend_vnd = typeof row.spend_vnd === 'number' ? row.spend_vnd : NaN;
    if (typeof row.hub_mapped !== 'boolean') return null;
    if (!campaign || !client || !Number.isFinite(spend_vnd)) return null;
    rows.push({ campaign, client, spend_vnd, hub_mapped: row.hub_mapped });
  }
  return rows.length > 0 ? rows : null;
}

function parseAttribution(raw: unknown): SandboxAttribution | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null;
  const row = raw as Record<string, unknown>;
  const attribution_model = typeof row.attribution_model === 'string' ? row.attribution_model : '';
  const hub_mapped_pct = typeof row.hub_mapped_pct === 'number' ? row.hub_mapped_pct : NaN;
  const unmapped_spend_pct =
    typeof row.unmapped_spend_pct === 'number' ? row.unmapped_spend_pct : NaN;
  const spend_source = typeof row.spend_source === 'string' ? row.spend_source : '';
  const through_date = typeof row.through_date === 'string' ? row.through_date : '';
  if (
    !attribution_model ||
    !Number.isFinite(hub_mapped_pct) ||
    !Number.isFinite(unmapped_spend_pct) ||
    !spend_source ||
    !through_date
  ) {
    return null;
  }
  return {
    attribution_model,
    hub_mapped_pct,
    unmapped_spend_pct,
    spend_source,
    through_date,
  };
}

function parsePortal(raw: unknown): SandboxPortalPreview | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null;
  const row = raw as Record<string, unknown>;
  const client_label = typeof row.client_label === 'string' ? row.client_label : '';
  const roas = typeof row.roas === 'number' ? row.roas : NaN;
  const spend_vnd = typeof row.spend_vnd === 'number' ? row.spend_vnd : NaN;
  const contracts_closed =
    typeof row.contracts_closed === 'number' ? row.contracts_closed : NaN;
  if (!client_label || !Number.isFinite(roas) || !Number.isFinite(spend_vnd)) return null;
  if (!Number.isFinite(contracts_closed)) return null;
  return { client_label, roas, spend_vnd, contracts_closed };
}

export function parseSandboxMoatBoard(input: unknown): SandboxMoatBoard | null {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) return null;
  const record = input as Record<string, unknown>;
  const industry = typeof record.industry === 'string' ? record.industry : '';
  const tenant = typeof record.tenant === 'string' ? record.tenant : '';
  const title = typeof record.title === 'string' ? record.title : '';
  if (!industry || !tenant || !title) return null;
  if (record.sample_data !== true) return null;
  if (typeof record.hub_map_pass !== 'boolean') return null;

  const headline = record.headline_metric;
  if (typeof headline !== 'object' || headline === null || Array.isArray(headline)) return null;
  const hm = headline as Record<string, unknown>;
  const hmLabel = typeof hm.label === 'string' ? hm.label : '';
  const hmValue = typeof hm.value === 'string' ? hm.value : '';
  if (!hmLabel || !hmValue) return null;

  const leads_this_week =
    typeof record.leads_this_week === 'number' ? record.leads_this_week : NaN;
  const cpl_demo_usd = typeof record.cpl_demo_usd === 'number' ? record.cpl_demo_usd : NaN;
  const demos_booked = typeof record.demos_booked === 'number' ? record.demos_booked : NaN;
  if (!Number.isFinite(leads_this_week) || !Number.isFinite(cpl_demo_usd)) return null;
  if (!Number.isFinite(demos_booked)) return null;

  const pipeline = parsePipeline(record.pipeline);
  const spend_map = parseSpendMap(record.spend_map);
  const attribution = parseAttribution(record.attribution);
  const portal = parsePortal(record.portal);
  if (!pipeline || !spend_map || !attribution || !portal) return null;

  return {
    industry,
    tenant,
    title,
    headline_metric: { label: hmLabel, value: hmValue },
    leads_this_week,
    cpl_demo_usd,
    demos_booked,
    pipeline,
    spend_map,
    attribution,
    portal,
    hub_map_pass: record.hub_map_pass,
    sample_data: true,
  };
}

export function hubMapPass(unmappedSpendPct: number): boolean {
  return unmappedSpendPct <= 20;
}
