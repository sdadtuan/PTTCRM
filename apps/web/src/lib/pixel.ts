import { parseConsent, type Consent } from '@/lib/consent';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

let pixelLoaded = false;

export function shouldLoadPixel(consent: Consent): boolean {
  return consent.analytics || consent.ads;
}

export function loadMetaPixel(pixelId?: string): void {
  if (typeof window === 'undefined' || pixelLoaded) return;

  const id = pixelId ?? process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!id) return;

  const consent = parseConsent(localStorage.getItem('ptt_consent'));
  if (!shouldLoadPixel(consent)) return;

  pixelLoaded = true;

  if (!window.fbq) {
    const q = (...args: unknown[]) => {
      (q as typeof q & { queue: unknown[] }).queue.push(args);
    };
    (q as typeof q & { queue: unknown[] }).queue = [];
    window.fbq = q;
    if (!window._fbq) window._fbq = q;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);

  window.fbq?.('init', id);
  window.fbq?.('track', 'PageView');
}

export function trackLead(): void {
  if (typeof window === 'undefined') return;
  const consent = parseConsent(localStorage.getItem('ptt_consent'));
  if (!consent.ads) return;
  window.fbq?.('track', 'Lead');
}

export function fireLeadEvent(): void {
  trackLead();
}
