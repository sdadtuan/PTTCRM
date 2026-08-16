import type { SkuInterest } from './validate-demo';

export const USD_LIST_PRICE: Record<SkuInterest, { retainer_usd: number; setup_usd: number }> = {
  mkt: { retainer_usd: 199, setup_usd: 400 },
  ind: { retainer_usd: 399, setup_usd: 600 },
  agy: { retainer_usd: 799, setup_usd: 1200 },
};

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

export function minUsdPerUser(): number {
  return 15;
}
