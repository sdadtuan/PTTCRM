import type { SkuInterest } from '@pttcrm/gtm-core';

function apiBase(): string {
  const base = process.env.NEXT_PUBLIC_GTM_API_BASE;
  if (!base) throw new Error('api_unconfigured');
  return base.replace(/\/$/, '');
}

export type CheckoutResult =
  | { checkout_url: string; session_id: string }
  | { field_errors: Record<string, string> }
  | { rate_limited: true };

export async function createUsdCheckout(input: {
  sku: SkuInterest;
  email: string;
  success_url: string;
  cancel_url: string;
}): Promise<CheckoutResult> {
  const res = await fetch(`${apiBase()}/api/v1/public/gtm/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (res.status === 429) return { rate_limited: true };
  if (res.status === 422) {
    const j = (await res.json()) as { field_errors?: Record<string, string> };
    return { field_errors: j.field_errors ?? { form: 'invalid' } };
  }
  if (!res.ok) throw new Error(`checkout_${res.status}`);

  return (await res.json()) as { checkout_url: string; session_id: string };
}
