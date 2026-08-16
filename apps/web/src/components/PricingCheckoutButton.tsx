'use client';

import type { SkuInterest } from '@pttcrm/gtm-core';
import { useState } from 'react';
import { createUsdCheckout } from '@/lib/gtm-checkout';

type Props = {
  sku: SkuInterest;
  label: string;
};

export function PricingCheckoutButton({ sku, label }: Props) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function paySetup() {
    setErr('');
    const email = window.prompt('Work email for Stripe test receipt:');
    if (!email?.trim()) return;
    setBusy(true);
    try {
      const origin = window.location.origin;
      const out = await createUsdCheckout({
        sku,
        email: email.trim(),
        success_url: `${origin}/en/pricing?paid=1`,
        cancel_url: `${origin}/en/pricing`,
      });
      if ('checkout_url' in out) {
        window.location.href = out.checkout_url;
        return;
      }
      if ('rate_limited' in out) {
        setErr('Too many requests. Try again later.');
        return;
      }
      setErr(Object.values(out.field_errors)[0] ?? 'Checkout failed');
    } catch {
      setErr('Checkout unavailable. Request a demo instead.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button className="btn btn-ghost" type="button" disabled={busy} onClick={() => void paySetup()}>
        {busy ? '…' : label}
      </button>
      {err ? (
        <p className="err" style={{ fontSize: 13, marginTop: 8 }}>
          {err}
        </p>
      ) : null}
    </>
  );
}
