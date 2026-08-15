'use client';

import { parseConsent } from '@/lib/consent';
import { loadMetaPixel, shouldLoadPixel, trackLead } from '@/lib/pixel';
import { useEffect } from 'react';

const CONSENT_KEY = 'ptt_consent';

export function PixelLead() {
  useEffect(() => {
    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    if (!pixelId) return;

    const raw = localStorage.getItem(CONSENT_KEY);
    const consent = parseConsent(raw);
    if (!shouldLoadPixel(consent)) return;

    loadMetaPixel(pixelId);
    if (consent.ads) trackLead();
  }, []);

  return null;
}
