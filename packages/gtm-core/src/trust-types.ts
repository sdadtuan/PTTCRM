export type PublicComponentStatus = 'operational' | 'degraded' | 'outage';

export type PublicStatusComponent = {
  id: string;
  name: string;
  status: PublicComponentStatus;
  region?: string;
};

export type PublicStatusIncidentSeverity = 'minor' | 'major' | 'critical';

export type PublicStatusIncident = {
  id: string;
  started_at: string;
  resolved_at: string | null;
  severity: PublicStatusIncidentSeverity;
  title: string;
  summary: string;
};

export type PublicStatusDay = {
  date: string;
  status: PublicComponentStatus;
};

export type PublicStatusResponse = {
  updated_at: string;
  sla_target_pct: number;
  components: PublicStatusComponent[];
  incidents: PublicStatusIncident[];
  history: PublicStatusDay[];
  uptime_90d_pct: number | null;
};

export type SubprocessorRow = {
  name: string;
  purpose: string;
  region: string;
  dpa_url?: string;
};

export type PublicPartnerFeatured = {
  name: string;
  website_url?: string;
  po_approved: boolean;
};

const COMPONENT_STATUSES = new Set<PublicComponentStatus>(['operational', 'degraded', 'outage']);
const INCIDENT_SEVERITIES = new Set<PublicStatusIncidentSeverity>(['minor', 'major', 'critical']);

export function isPublicComponentStatus(v: string): v is PublicComponentStatus {
  return COMPONENT_STATUSES.has(v as PublicComponentStatus);
}

export function isPlaceholderVendor(name: string): boolean {
  return /^PO_[A-Z0-9_]+$/i.test(name.trim());
}

export function isPublishablePartner(featured: PublicPartnerFeatured): boolean {
  if (!featured.po_approved) return false;
  if (isPlaceholderVendor(featured.name)) return false;
  if (/^PO_/i.test(featured.name.trim())) return false;
  const url = featured.website_url ?? '';
  if (/example\.com/i.test(url)) return false;
  if (featured.name.trim().length < 2) return false;
  return true;
}

function parseIncident(item: unknown): PublicStatusIncident | null {
  if (typeof item !== 'object' || item === null || Array.isArray(item)) return null;
  const row = item as Record<string, unknown>;
  const id = typeof row.id === 'string' ? row.id : '';
  const started_at = typeof row.started_at === 'string' ? row.started_at : '';
  const title = typeof row.title === 'string' ? row.title : '';
  const summary = typeof row.summary === 'string' ? row.summary : '';
  const severity = typeof row.severity === 'string' ? row.severity : '';
  if (!id || !started_at || !title || !summary || !INCIDENT_SEVERITIES.has(severity as PublicStatusIncidentSeverity)) {
    return null;
  }
  const resolved_at = row.resolved_at === null || typeof row.resolved_at === 'string' ? row.resolved_at : null;
  return {
    id,
    started_at,
    resolved_at,
    severity: severity as PublicStatusIncidentSeverity,
    title,
    summary,
  };
}

function parseHistoryDay(item: unknown): PublicStatusDay | null {
  if (typeof item !== 'object' || item === null || Array.isArray(item)) return null;
  const row = item as Record<string, unknown>;
  const date = typeof row.date === 'string' ? row.date : '';
  const status = typeof row.status === 'string' ? row.status : '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !isPublicComponentStatus(status)) return null;
  return { date, status };
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

  let incidents: PublicStatusIncident[] = [];
  if (record.incidents !== undefined) {
    if (!Array.isArray(record.incidents)) return null;
    incidents = [];
    for (const item of record.incidents) {
      const parsed = parseIncident(item);
      if (!parsed) return null;
      incidents.push(parsed);
    }
  }

  let history: PublicStatusDay[] = [];
  if (record.history !== undefined) {
    if (!Array.isArray(record.history)) return null;
    history = [];
    for (const item of record.history) {
      const parsed = parseHistoryDay(item);
      if (!parsed) return null;
      history.push(parsed);
    }
  }

  let uptime_90d_pct: number | null = null;
  if (record.uptime_90d_pct !== undefined && record.uptime_90d_pct !== null) {
    if (typeof record.uptime_90d_pct !== 'number' || !Number.isFinite(record.uptime_90d_pct)) return null;
    uptime_90d_pct = record.uptime_90d_pct;
  }

  return { updated_at, sla_target_pct, components, incidents, history, uptime_90d_pct };
}

function utcDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addUtcDays(d: Date, days: number): Date {
  const next = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function incidentTouchesDay(incident: PublicStatusIncident, dayKey: string): boolean {
  const dayStart = Date.parse(`${dayKey}T00:00:00.000Z`);
  const dayEnd = Date.parse(`${dayKey}T23:59:59.999Z`);
  const start = Date.parse(incident.started_at);
  const end = incident.resolved_at ? Date.parse(incident.resolved_at) : dayEnd;
  if (!Number.isFinite(start) || !Number.isFinite(end) || !Number.isFinite(dayStart)) return false;
  return start <= dayEnd && end >= dayStart;
}

function dayStatus(incidents: PublicStatusIncident[], dayKey: string): PublicComponentStatus {
  const hits = incidents.filter((i) => incidentTouchesDay(i, dayKey));
  if (hits.some((i) => i.severity === 'critical')) return 'outage';
  if (hits.length > 0) return 'degraded';
  return 'operational';
}

export function buildStatusHistory(opts: {
  now: Date;
  historyStart: Date | null;
  incidents: PublicStatusIncident[];
  windowDays?: number;
}): { history: PublicStatusDay[]; uptime_90d_pct: number | null } {
  const windowDays = opts.windowDays ?? 90;
  if (!opts.historyStart) return { history: [], uptime_90d_pct: null };

  const today = new Date(
    Date.UTC(opts.now.getUTCFullYear(), opts.now.getUTCMonth(), opts.now.getUTCDate()),
  );
  const start = new Date(
    Date.UTC(
      opts.historyStart.getUTCFullYear(),
      opts.historyStart.getUTCMonth(),
      opts.historyStart.getUTCDate(),
    ),
  );
  if (start > today) return { history: [], uptime_90d_pct: null };

  const windowStart = addUtcDays(today, -(windowDays - 1));
  const from = start > windowStart ? start : windowStart;

  const history: PublicStatusDay[] = [];
  for (let cursor = from; cursor <= today; cursor = addUtcDays(cursor, 1)) {
    const date = utcDateKey(cursor);
    history.push({ date, status: dayStatus(opts.incidents, date) });
  }

  const uptime_90d_pct =
    history.length >= 30
      ? Math.round(
          (history.filter((d) => d.status === 'operational').length / history.length) * 1000,
        ) / 10
      : null;

  return { history, uptime_90d_pct };
}
