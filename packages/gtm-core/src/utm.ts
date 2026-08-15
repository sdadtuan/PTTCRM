export type UtmFields = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

export function parseUtmSearch(search: string): UtmFields {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const out: UtmFields = {};
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const) {
    const v = params.get(key);
    if (v) out[key] = v;
  }
  return out;
}

function hasAnyUtm(obj: UtmFields): boolean {
  return Object.values(obj).some((v) => typeof v === 'string' && v.length > 0);
}

export function mergeFirstTouchUtm(existing: string | null, incoming: UtmFields): string {
  if (existing) {
    try {
      const parsed = JSON.parse(existing) as UtmFields;
      if (hasAnyUtm(parsed)) return existing;
    } catch {
      /* use incoming */
    }
  }
  return JSON.stringify(incoming);
}
