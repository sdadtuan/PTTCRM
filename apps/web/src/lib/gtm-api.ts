import type { Locale } from '@pttcrm/gtm-core';
import type { DemoPayload } from '@pttcrm/gtm-core';
import { mergeFirstTouchUtm, parseUtmSearch, validateDemoPayload } from '@pttcrm/gtm-core';

export type DemoFormInput = DemoPayload & {
  utm_json?: string;
};

export type DemoSubmitResult =
  | { id: string; lead_id: string; deduped: boolean }
  | { honeypot: true }
  | { field_errors: Record<string, string> }
  | { rate_limited: true };

export function buildDemoRequest(input: DemoFormInput): DemoPayload & UtmOut {
  const utmJson = input.utm_json ?? '{}';
  let utm: UtmOut = {};
  try {
    const parsed = JSON.parse(utmJson) as Record<string, string>;
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const) {
      if (parsed[k]) utm[k] = parsed[k];
    }
  } catch {
    /* ignore */
  }

  return {
    full_name: input.full_name,
    email: input.email,
    phone: input.phone,
    company: input.company,
    industry: input.industry,
    sku_interest: input.sku_interest,
    company_size: input.company_size,
    message: input.message,
    consent_privacy: input.consent_privacy,
    locale: input.locale,
    landing_path: input.landing_path,
    website: input.website ?? '',
    ...utm,
  };
}

type UtmOut = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function apiBase(): string {
  const base = process.env.NEXT_PUBLIC_GTM_API_BASE;
  if (!base) throw new Error('api_unconfigured');
  return base.replace(/\/$/, '');
}

export async function submitDemo(payload: unknown): Promise<DemoSubmitResult> {
  const validated = validateDemoPayload(payload);
  if (!validated.ok) return { field_errors: validated.field_errors };

  const body = validated.value;
  const raw = isRecord(payload) ? payload : {};
  const postBody: Record<string, unknown> = { ...body };
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const) {
    if (typeof raw[k] === 'string') postBody[k] = raw[k];
  }

  if (body.website && body.website.trim().length > 0) {
    return { honeypot: true };
  }

  const res = await fetch(`${apiBase()}/api/v1/public/gtm/demo-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postBody),
  });

  if (res.status === 204) return { honeypot: true };
  if (res.status === 429) return { rate_limited: true };
  if (res.status === 422) {
    const j = (await res.json()) as { field_errors?: Record<string, string> };
    return { field_errors: j.field_errors ?? { form: 'invalid' } };
  }
  if (!res.ok) throw new Error(`demo_submit_${res.status}`);

  return (await res.json()) as { id: string; lead_id: string; deduped: boolean };
}

export function mergeUtmCookie(existing: string | null, search: string): string {
  return mergeFirstTouchUtm(existing, parseUtmSearch(search));
}

export function demoPath(locale: Locale): string {
  return locale === 'en' ? '/en/request-demo' : '/vi/dang-ky-demo';
}

export function thanksPath(locale: Locale): string {
  return locale === 'en' ? '/en/request-demo/thanks' : '/vi/dang-ky-demo/cam-on';
}
