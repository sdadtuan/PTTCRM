import type { PublicStatusResponse } from '@pttcrm/gtm-core';
import { parsePublicStatusResponse } from '@pttcrm/gtm-core';

function apiBase(): string | null {
  const base = process.env.NEXT_PUBLIC_GTM_API_BASE;
  if (!base?.trim()) return null;
  return base.replace(/\/$/, '');
}

export async function fetchPublicStatus(): Promise<PublicStatusResponse | null> {
  const base = apiBase();
  if (!base) return null;

  try {
    const res = await fetch(`${base}/api/v1/public/gtm/status`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    return parsePublicStatusResponse(json);
  } catch {
    return null;
  }
}

export function statusApiConfigured(): boolean {
  return apiBase() != null;
}
