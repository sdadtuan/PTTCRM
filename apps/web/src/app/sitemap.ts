import type { MetadataRoute } from 'next';
import { articleHref, eventHref, fetchArticles, fetchEvents } from '@/lib/cms';
import { legalSlugs, productSlugs, solutionSlugs } from '@/lib/content';

const BASE = 'https://pttcrm.com';

function entry(path: string, priority = 0.7): MetadataRoute.Sitemap[number] {
  return { url: `${BASE}${path}`, changeFrequency: 'weekly', priority };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    entry('/vi', 1),
    entry('/en', 1),
    entry('/vi/bang-gia'),
    entry('/en/pricing'),
    entry('/vi/dang-ky-demo'),
    entry('/en/request-demo'),
    entry('/vi/ve-chung-toi'),
    entry('/en/about'),
    entry('/vi/tin-tuc'),
    entry('/en/news'),
    entry('/vi/su-kien'),
    entry('/en/events'),
    ...productSlugs().flatMap((slug) => [entry(`/vi/san-pham/${slug}`), entry(`/en/product/${slug}`)]),
    ...solutionSlugs('vi').map((slug) => entry(`/vi/giai-phap/${slug}`)),
    ...solutionSlugs('en').map((slug) => entry(`/en/solutions/${slug}`)),
    ...legalSlugs('vi').map((slug) => entry(`/vi/phap-ly/${slug}`)),
    ...legalSlugs('en').map((slug) => entry(`/en/legal/${slug}`)),
  ];

  const [viArticles, enArticles, viEvents, enEvents] = await Promise.all([
    fetchArticles('vi'),
    fetchArticles('en'),
    fetchEvents('vi'),
    fetchEvents('en'),
  ]);

  const cmsRoutes: MetadataRoute.Sitemap = [
    ...viArticles.map((a) => entry(articleHref('vi', a.slug))),
    ...enArticles.map((a) => entry(articleHref('en', a.slug))),
    ...viEvents.map((e) => entry(eventHref('vi', e.slug))),
    ...enEvents.map((e) => entry(eventHref('en', e.slug))),
  ];

  return [...staticRoutes, ...cmsRoutes];
}
