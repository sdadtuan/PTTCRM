import type { PublicEnterpriseReadiness } from '@pttcrm/gtm-core';
import { parsePublicEnterpriseReadiness } from '@pttcrm/gtm-core';

function apiBase(): string | null {
  const base = process.env.NEXT_PUBLIC_GTM_API_BASE;
  if (!base?.trim()) return null;
  return base.replace(/\/$/, '');
}

export async function fetchPublicEnterpriseReadiness(): Promise<PublicEnterpriseReadiness | null> {
  const base = apiBase();
  if (!base) return null;

  try {
    const res = await fetch(`${base}/api/v1/public/gtm/enterprise-readiness`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    return parsePublicEnterpriseReadiness(json);
  } catch {
    return null;
  }
}

export function enterpriseApiConfigured(): boolean {
  return apiBase() != null;
}
