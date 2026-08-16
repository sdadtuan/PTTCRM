import { isAseanMarket, type AseanMarket } from '@pttcrm/gtm-core';
import th from '../../content/en/markets/th.json';
import id from '../../content/en/markets/id.json';
import ph from '../../content/en/markets/ph.json';
import sg from '../../content/en/markets/sg.json';
import partners from '../../content/en/partners.json';

export type MarketPlaybookContent = {
  market: AseanMarket;
  hero_title: string;
  hero_sub: string;
  pain_points: string[];
  persona: string;
  timezone_label: string;
  business_hours_en: string;
  whatsapp_prefill: string;
  recommended_sku: string;
  recommended_industry: string;
  seo: { title: string; description: string };
};

export type PartnersContent = typeof partners;

const BY_MARKET: Record<AseanMarket, MarketPlaybookContent> = {
  th: th as MarketPlaybookContent,
  id: id as MarketPlaybookContent,
  ph: ph as MarketPlaybookContent,
  sg: sg as MarketPlaybookContent,
};

export const MARKET_SLUGS = Object.keys(BY_MARKET) as AseanMarket[];

export function getMarketPlaybook(slug: string): MarketPlaybookContent | null {
  if (!isAseanMarket(slug)) return null;
  return BY_MARKET[slug];
}

export function getPartnersContent(): PartnersContent {
  return partners;
}

export function demoHrefFromPlaybook(market: AseanMarket, content: MarketPlaybookContent): string {
  const params = new URLSearchParams({
    market,
    sku: content.recommended_sku,
    industry: content.recommended_industry,
  });
  return `/en/request-demo?${params.toString()}`;
}
