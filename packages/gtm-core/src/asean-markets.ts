export type AseanMarket = 'th' | 'id' | 'ph' | 'sg';

export const ASEAN_MARKET_CODES = ['th', 'id', 'ph', 'sg'] as const;

export type AseanMarketMeta = {
  name: string;
  timezone: string;
  gmtLabel: string;
  whatsapp_e164: string;
};

/** PO replaces whatsapp_e164 with live sales line per market before prod cutover. */
export const ASEAN_MARKETS: Record<AseanMarket, AseanMarketMeta> = {
  th: {
    name: 'Thailand',
    timezone: 'Asia/Bangkok',
    gmtLabel: 'GMT+7',
    whatsapp_e164: '66812345678',
  },
  id: {
    name: 'Indonesia',
    timezone: 'Asia/Jakarta',
    gmtLabel: 'GMT+7',
    whatsapp_e164: '628123456789',
  },
  ph: {
    name: 'Philippines',
    timezone: 'Asia/Manila',
    gmtLabel: 'GMT+8',
    whatsapp_e164: '639123456789',
  },
  sg: {
    name: 'Singapore',
    timezone: 'Asia/Singapore',
    gmtLabel: 'GMT+8',
    whatsapp_e164: '6591234567',
  },
};

export function isAseanMarket(value: string): value is AseanMarket {
  return (ASEAN_MARKET_CODES as readonly string[]).includes(value);
}

export function whatsappLink(market: AseanMarket, text: string): string {
  const digits = ASEAN_MARKETS[market].whatsapp_e164.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function marketTimezone(market: AseanMarket | null | undefined): string {
  if (market && isAseanMarket(market)) return ASEAN_MARKETS[market].timezone;
  return 'Asia/Ho_Chi_Minh';
}
