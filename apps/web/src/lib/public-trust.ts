import { isPlaceholderVendor, isPublishablePartner } from '@pttcrm/gtm-core';
import type { PartnersContent } from '@/lib/market-content';
import type { SubprocessorsContent } from '@/lib/trust-content';

export function publicSubprocessorRows(
  rows: SubprocessorsContent['rows'],
): SubprocessorsContent['rows'] {
  return rows.filter((row) => !isPlaceholderVendor(row.name));
}

export function publicPartnerFeatured(
  featured: PartnersContent['featured'],
): PartnersContent['featured'] | null {
  if (!isPublishablePartner(featured)) return null;
  return featured;
}
