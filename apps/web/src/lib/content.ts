import type { Locale } from '@pttcrm/gtm-core';

import viAbout from '../../content/vi/about.json';
import viFaq from '../../content/vi/faq.json';
import viHome from '../../content/vi/home.json';
import viLegal from '../../content/vi/legal.json';
import viPricing from '../../content/vi/pricing.json';
import viProducts from '../../content/vi/products.json';
import viSolutions from '../../content/vi/solutions.json';
import enAbout from '../../content/en/about.json';
import enFaq from '../../content/en/faq.json';
import enHome from '../../content/en/home.json';
import enLegal from '../../content/en/legal.json';
import enPricing from '../../content/en/pricing.json';
import enProducts from '../../content/en/products.json';
import enSolutions from '../../content/en/solutions.json';

export type HomeContent = typeof viHome;
export type PricingContent = typeof viPricing | typeof enPricing;
export type ProductsContent = typeof viProducts;
export type SolutionsContent = typeof viSolutions;
export type AboutContent = typeof viAbout;
export type LegalContent = typeof viLegal;
export type FaqContent = typeof viFaq;

const EN_SOLUTION_SLUG: Record<string, string> = {
  bds: 'real-estate',
  agency: 'agency',
  fnb: 'fnb',
};

const VI_SOLUTION_SLUG: Record<string, string> = {
  'real-estate': 'bds',
  agency: 'agency',
  fnb: 'fnb',
};

const EN_LEGAL_SLUG: Record<string, string> = {
  'bao-mat': 'privacy',
  'dieu-khoan': 'terms',
  cookie: 'cookies',
};

const VI_LEGAL_SLUG: Record<string, string> = {
  privacy: 'bao-mat',
  terms: 'dieu-khoan',
  cookies: 'cookie',
};

export function getHome(locale: Locale): HomeContent {
  return locale === 'vi' ? viHome : enHome;
}

export function getPricing(locale: Locale): PricingContent {
  return locale === 'vi' ? viPricing : enPricing;
}

export function getProducts(locale: Locale): ProductsContent {
  return locale === 'vi' ? viProducts : enProducts;
}

export function getProduct(locale: Locale, slug: string) {
  const items = getProducts(locale).items as Record<string, (typeof viProducts.items)[keyof typeof viProducts.items]>;
  return items[slug] ?? null;
}

export function productSlugs(): string[] {
  return Object.keys(viProducts.items);
}

export function getSolutions(locale: Locale): SolutionsContent {
  return locale === 'vi' ? viSolutions : enSolutions;
}

export function solutionSlugForLocale(locale: Locale, key: string): string {
  if (locale === 'en') return EN_SOLUTION_SLUG[key] ?? key;
  return key;
}

export function solutionKeyFromSlug(locale: Locale, slug: string): string | null {
  if (locale === 'en') return VI_SOLUTION_SLUG[slug] ?? null;
  return slug in viSolutions.items ? slug : null;
}

export function getSolution(locale: Locale, slug: string) {
  const key = solutionKeyFromSlug(locale, slug);
  if (!key) return null;
  const items = getSolutions(locale).items as Record<string, (typeof viSolutions.items)[keyof typeof viSolutions.items]>;
  return items[key] ?? null;
}

export function solutionSlugs(locale: Locale): string[] {
  return Object.keys(viSolutions.items).map((k) => solutionSlugForLocale(locale, k));
}

export function getAbout(locale: Locale): AboutContent {
  return locale === 'vi' ? viAbout : enAbout;
}

export function getFaq(locale: Locale): FaqContent {
  return locale === 'vi' ? viFaq : enFaq;
}

export function getLegal(locale: Locale): LegalContent {
  return locale === 'vi' ? viLegal : enLegal;
}

export function legalSlugForLocale(locale: Locale, key: string): string {
  if (locale === 'en') return EN_LEGAL_SLUG[key] ?? key;
  return key;
}

export function legalKeyFromSlug(locale: Locale, slug: string): string | null {
  if (locale === 'en') return VI_LEGAL_SLUG[slug] ?? null;
  return slug in viLegal.items ? slug : null;
}

export function getLegalPage(locale: Locale, slug: string) {
  const key = legalKeyFromSlug(locale, slug);
  if (!key) return null;
  const items = getLegal(locale).items as Record<string, (typeof viLegal.items)[keyof typeof viLegal.items]>;
  return items[key] ?? null;
}

export function legalSlugs(locale: Locale): string[] {
  return Object.keys(viLegal.items).map((k) => legalSlugForLocale(locale, k));
}

export function formatVnd(amount: number): string {
  return amount.toLocaleString('vi-VN');
}
