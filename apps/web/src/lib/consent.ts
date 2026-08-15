export type Consent = { analytics: boolean; ads: boolean };

export function defaultConsent(): Consent {
  return { analytics: false, ads: false };
}

export function parseConsent(raw: string | null): Consent {
  if (!raw) return defaultConsent();
  try {
    const j = JSON.parse(raw) as Partial<Consent>;
    return { analytics: j.analytics === true, ads: j.ads === true };
  } catch {
    return defaultConsent();
  }
}

export function serializeConsent(c: Consent): string {
  return JSON.stringify(c);
}
