import type { Locale } from './paths';
import type { Industry, SkuInterest } from './validate-demo';

export type CaseStudy = {
  slug: string;
  po_signed: boolean;
  /** PO-attested numbers. False → qualitative card only (BR-GTM-018). */
  metrics_verified: boolean;
  industry: Industry;
  sku: SkuInterest;
  title_vi: string;
  title_en?: string;
  summary_vi: string;
  summary_en?: string;
  cpl_vnd: number;
  roas: number;
};

export function canShowCaseMetrics(
  c: Pick<CaseStudy, 'po_signed' | 'metrics_verified'>,
): boolean {
  return c.po_signed === true && c.metrics_verified === true;
}

function formatVnd(amount: number, locale: Locale): string {
  if (locale === 'vi') {
    return amount.toLocaleString('vi-VN');
  }
  return amount.toLocaleString('en-US');
}

function formatRoas(roas: number, locale: Locale): string {
  if (locale === 'vi') {
    return roas.toLocaleString('vi-VN', { maximumFractionDigits: 1 });
  }
  return roas.toLocaleString('en-US', { maximumFractionDigits: 1 });
}

export function formatCaseMetrics(
  c: Pick<CaseStudy, 'cpl_vnd' | 'roas'>,
  locale: Locale,
): string {
  return `CPL ${formatVnd(c.cpl_vnd, locale)} VND · ROAS ${formatRoas(c.roas, locale)}`;
}
