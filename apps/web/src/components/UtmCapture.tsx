'use client';

import { mergeFirstTouchUtm, parseUtmSearch } from '@pttcrm/gtm-core';
import { useEffect } from 'react';

const UTM_COOKIE = 'ptt_utm';
const MAX_AGE = 2592000;

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`;
}

export function UtmCapture() {
  useEffect(() => {
    const search = window.location.search;
    if (!search) return;
    const incoming = parseUtmSearch(search);
    const hasUtm = Object.values(incoming).some((v) => v);
    if (!hasUtm) return;

    const match = document.cookie.match(new RegExp(`(?:^|; )${UTM_COOKIE}=([^;]*)`));
    const existing = match ? decodeURIComponent(match[1]) : null;
    const merged = mergeFirstTouchUtm(existing, incoming);
    setCookie(UTM_COOKIE, merged, MAX_AGE);
  }, []);

  return null;
}

export function readUtmCookie(): string {
  if (typeof document === 'undefined') return '{}';
  const match = document.cookie.match(new RegExp(`(?:^|; )${UTM_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '{}';
}
