export type Locale = 'vi' | 'en';

export const PATH_PAIRS: Array<[string, string]> = [
  ['/vi', '/en'],
  ['/vi/san-pham/crm', '/en/product/crm'],
  ['/vi/san-pham/ads', '/en/product/ads'],
  ['/vi/san-pham/portal', '/en/product/portal'],
  ['/vi/san-pham/ai', '/en/product/ai'],
  ['/vi/giai-phap/bds', '/en/solutions/real-estate'],
  ['/vi/giai-phap/agency', '/en/solutions/agency'],
  ['/vi/giai-phap/fnb', '/en/solutions/fnb'],
  ['/vi/bang-gia', '/en/pricing'],
  ['/vi/dang-ky-demo', '/en/request-demo'],
  ['/vi/dang-ky-demo/cam-on', '/en/request-demo/thanks'],
  ['/vi/ve-chung-toi', '/en/about'],
  ['/vi/phap-ly/bao-mat', '/en/legal/privacy'],
  ['/vi/phap-ly/dieu-khoan', '/en/legal/terms'],
  ['/vi/phap-ly/cookie', '/en/legal/cookies'],
  ['/vi/tin-tuc', '/en/news'],
  ['/vi/su-kien', '/en/events'],
];

function parseAcceptLanguage(header: string): Array<{ tag: string; q: number }> {
  return header
    .split(',')
    .map((part) => {
      const [tagRaw, ...params] = part.trim().split(';');
      const tag = tagRaw.toLowerCase();
      const qParam = params.find((p) => p.trim().startsWith('q='));
      const q = qParam ? Number.parseFloat(qParam.split('=')[1] ?? '1') : 1;
      return { tag, q: Number.isFinite(q) ? q : 1 };
    })
    .sort((a, b) => b.q - a.q);
}

export function detectLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage?.trim()) return 'vi';
  const parsed = parseAcceptLanguage(acceptLanguage);
  let bestVi = 0;
  let bestEn = 0;
  for (const { tag, q } of parsed) {
    if (tag.startsWith('vi')) bestVi = Math.max(bestVi, q);
    if (tag.startsWith('en')) bestEn = Math.max(bestEn, q);
  }
  if (bestEn > bestVi) return 'en';
  if (bestVi > 0) return 'vi';
  if (bestEn > 0) return 'en';
  return 'vi';
}

function swapPrefix(pathname: string, from: '/vi' | '/en', to: '/vi' | '/en'): string {
  if (pathname === from) return to;
  if (pathname.startsWith(`${from}/`)) return `${to}${pathname.slice(from.length)}`;
  return pathname;
}

function swapCmsSlug(pathname: string, to: Locale): string | null {
  if (to === 'en') {
    if (pathname.startsWith('/vi/tin-tuc/')) {
      return `/en/news/${pathname.slice('/vi/tin-tuc/'.length)}`;
    }
    if (pathname.startsWith('/vi/su-kien/')) {
      return `/en/events/${pathname.slice('/vi/su-kien/'.length)}`;
    }
    return null;
  }
  if (pathname.startsWith('/en/news/')) {
    return `/vi/tin-tuc/${pathname.slice('/en/news/'.length)}`;
  }
  if (pathname.startsWith('/en/events/')) {
    return `/vi/su-kien/${pathname.slice('/en/events/'.length)}`;
  }
  return null;
}

export function switchLocalePath(pathname: string, to: Locale): string {
  const cms = swapCmsSlug(pathname, to);
  if (cms) return cms;

  for (const [viPath, enPath] of PATH_PAIRS) {
    if (to === 'en' && pathname === viPath) return enPath;
    if (to === 'vi' && pathname === enPath) return viPath;
  }

  if (to === 'en' && pathname.startsWith('/vi/')) {
    return swapPrefix(pathname, '/vi', '/en');
  }
  if (to === 'vi' && pathname.startsWith('/en/')) {
    return swapPrefix(pathname, '/en', '/vi');
  }
  return to === 'en' ? '/en' : '/vi';
}
