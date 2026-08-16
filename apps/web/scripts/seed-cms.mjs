import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const htmlDir = path.join(root, 'demo-html/tin-tuc');
const outDir = path.join(root, 'apps/web/data/cms');

const specs = [
  { slug: 'closed-loop', category: 'insight', htmlFile: 'closed-loop.html', featured_home: true },
  { slug: 'crm-theo-nganh', category: 'nganh', htmlFile: 'crm-theo-nganh.html' },
  { slug: 'portal-agency', category: 'insight', htmlFile: 'portal-agency.html' },
  { slug: 'demo-60-phut', category: 'huong-dan', htmlFile: 'demo-60-phut.html' },
  { slug: 'khong-dua-gia-seat', category: 'insight', htmlFile: 'khong-dua-gia-seat.html' },
  { slug: 'zalo-vietnam-pack', category: 'nganh', htmlFile: 'zalo-vietnam-pack.html' },
];

function extractAttr(tag, name) {
  const match = tag.match(new RegExp(`${name}="([^"]*)"`, 'i'));
  return match?.[1] ?? null;
}

function extractI18n(html, tagName, locale) {
  const re = new RegExp(`<${tagName}[^>]*data-i18n[^>]*>`, 'gi');
  let match;
  while ((match = re.exec(html)) !== null) {
    const vi = extractAttr(match[0], 'data-vi');
    const en = extractAttr(match[0], 'data-en');
    const value = locale === 'en' ? (en ?? vi) : (vi ?? en);
    if (value) return value;
  }
  return null;
}

function extractSectionHtml(html, locale) {
  const marker = locale === 'vi' ? 'data-show-vi' : 'data-show-en';
  const open = new RegExp(`<div[^>]*${marker}[^>]*>`, 'i').exec(html);
  if (!open) return '';
  const start = open.index + open[0].length;
  const closeIdx = html.indexOf('</div>', start);
  return closeIdx < 0 ? '' : html.slice(start, closeIdx);
}

function htmlSectionToMarkdown(sectionHtml) {
  const parts = [];
  const blockRe = /<(h2|p)[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;
  while ((match = blockRe.exec(sectionHtml)) !== null) {
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    if (!text) continue;
    parts.push(match[1].toLowerCase() === 'h2' ? `## ${text}` : text);
  }
  return parts.join('\n\n');
}

function firstParagraph(sectionHtml) {
  const match = sectionHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  return match ? match[1].replace(/<[^>]+>/g, '').trim() : '';
}

function parseMetaDate(html) {
  const match = html.match(/<p class="meta">\s*(\d{2})\.(\d{2})\.(\d{4})/);
  if (!match) return null;
  return `${match[3]}-${match[2]}-${match[1]}T00:00:00.000Z`;
}

const now = new Date().toISOString();
const articles = specs.map((spec, i) => {
  const html = readFileSync(path.join(htmlDir, spec.htmlFile), 'utf8');
  const title_vi = extractI18n(html, 'h1', 'vi') ?? spec.slug;
  const title_en = extractI18n(html, 'h1', 'en');
  const viSection = extractSectionHtml(html, 'vi');
  const enSection = extractSectionHtml(html, 'en');
  const body_vi = htmlSectionToMarkdown(viSection);
  const body_en = enSection ? htmlSectionToMarkdown(enSection) : null;
  return {
    id: `art_seed_${i + 1}`,
    slug: spec.slug,
    status: 'published',
    category: spec.category,
    featured_home: Boolean(spec.featured_home),
    title_vi,
    title_en,
    dek_vi: firstParagraph(viSection) || title_vi,
    dek_en: enSection ? firstParagraph(enSection) || title_en : null,
    body_vi,
    body_en,
    cover_url: null,
    alt_vi: title_vi,
    alt_en: title_en,
    published_at: parseMetaDate(html) ?? now,
    updated_at: now,
  };
});

const store = { version: 1, seeded: true, articles, events: [], media: [], slots: [] };
mkdirSync(outDir, { recursive: true });
writeFileSync(path.join(outDir, 'store.json'), `${JSON.stringify(store, null, 2)}\n`);
console.log(`seeded ${articles.length} articles → ${path.join(outDir, 'store.json')}`);
