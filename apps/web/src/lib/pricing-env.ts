export function showUsdPrices(): boolean {
  return process.env.NEXT_PUBLIC_USD_PRICE === '1';
}
