export type PublicComponentStatus = 'operational' | 'degraded' | 'outage';

export type PublicStatusComponent = {
  id: string;
  name: string;
  status: PublicComponentStatus;
  region?: string;
};

export type PublicStatusResponse = {
  updated_at: string;
  sla_target_pct: number;
  components: PublicStatusComponent[];
};

export type SubprocessorRow = {
  name: string;
  purpose: string;
  region: string;
  dpa_url?: string;
};

const COMPONENT_STATUSES = new Set<PublicComponentStatus>(['operational', 'degraded', 'outage']);

export function isPublicComponentStatus(v: string): v is PublicComponentStatus {
  return COMPONENT_STATUSES.has(v as PublicComponentStatus);
}

export function parsePublicStatusResponse(input: unknown): PublicStatusResponse | null {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) return null;
  const record = input as Record<string, unknown>;
  const updated_at = typeof record.updated_at === 'string' ? record.updated_at : '';
  const sla_target_pct = typeof record.sla_target_pct === 'number' ? record.sla_target_pct : NaN;
  if (!updated_at || !Number.isFinite(sla_target_pct)) return null;

  const raw = record.components;
  if (!Array.isArray(raw)) return null;

  const components: PublicStatusComponent[] = [];
  for (const item of raw) {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) return null;
    const row = item as Record<string, unknown>;
    const id = typeof row.id === 'string' ? row.id : '';
    const name = typeof row.name === 'string' ? row.name : '';
    const status = typeof row.status === 'string' ? row.status : '';
    if (!id || !name || !isPublicComponentStatus(status)) return null;
    components.push({
      id,
      name,
      status,
      region: typeof row.region === 'string' ? row.region : undefined,
    });
  }

  return { updated_at, sla_target_pct, components };
}
