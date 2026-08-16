import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { CmsArticleCategory } from '@pttcrm/gtm-core';

export type SeedArticleSpec = {
  slug: string;
  category: CmsArticleCategory;
  htmlFile: string;
  featured_home?: boolean;
};

export const SEED_ARTICLES: SeedArticleSpec[] = [
  { slug: 'closed-loop', category: 'insight', htmlFile: 'closed-loop.html', featured_home: true },
  { slug: 'crm-theo-nganh', category: 'nganh', htmlFile: 'crm-theo-nganh.html' },
  { slug: 'portal-agency', category: 'insight', htmlFile: 'portal-agency.html' },
  { slug: 'demo-60-phut', category: 'huong-dan', htmlFile: 'demo-60-phut.html' },
  { slug: 'khong-dua-gia-seat', category: 'insight', htmlFile: 'khong-dua-gia-seat.html' },
  { slug: 'zalo-vietnam-pack', category: 'nganh', htmlFile: 'zalo-vietnam-pack.html' },
];

function extractAttr(tag: string, name: string): string | null {
  const match = tag.match(new RegExp(`${name}="([^"]*)"`, 'i'));
  return match?.[1] ?? null;
}

function extractI18n(html: string, tagName: string, locale: 'vi' | 'en'): string | null {
  const re = new RegExp(`<${tagName}[^>]*data-i18n[^>]*>`, 'gi');
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    const tag = match[0];
    const vi = extractAttr(tag, 'data-vi');
    const en = extractAttr(tag, 'data-en');
    const value = locale === 'en' ? (en ?? vi) : (vi ?? en);
    if (value) return value;
  }
  return null;
}

function extractSectionHtml(html: string, locale: 'vi' | 'en'): string {
  const marker = locale === 'vi' ? 'data-show-vi' : 'data-show-en';
  const open = new RegExp(`<div[^>]*${marker}[^>]*>`, 'i').exec(html);
  if (!open) return '';
  const start = open.index + open[0].length;
  const closeIdx = html.indexOf('</div>', start);
  if (closeIdx < 0) return '';
  return html.slice(start, closeIdx);
}

function htmlSectionToMarkdown(sectionHtml: string): string {
  const parts: string[] = [];
  const blockRe = /<(h2|p)[^>]*>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;
  while ((match = blockRe.exec(sectionHtml)) !== null) {
    const tag = match[1].toLowerCase();
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    if (!text) continue;
    parts.push(tag === 'h2' ? `## ${text}` : text);
  }
  return parts.join('\n\n');
}

function firstParagraph(sectionHtml: string): string {
  const match = sectionHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!match) return '';
  return match[1].replace(/<[^>]+>/g, '').trim();
}

export function parseMetaDate(html: string): string | null {
  const match = html.match(/<p class="meta">\s*(\d{2})\.(\d{2})\.(\d{4})/);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  return `${yyyy}-${mm}-${dd}T00:00:00.000Z`;
}

export function parseArticleHtml(htmlPath: string): {
  title_vi: string;
  title_en: string | null;
  dek_vi: string;
  dek_en: string | null;
  body_vi: string;
  body_en: string | null;
  published_at: string | null;
} {
  const html = readFileSync(htmlPath, 'utf8');
  const title_vi = extractI18n(html, 'h1', 'vi') ?? path.basename(htmlPath, '.html');
  const title_en = extractI18n(html, 'h1', 'en');
  const viSection = extractSectionHtml(html, 'vi');
  const enSection = extractSectionHtml(html, 'en');
  const body_vi = htmlSectionToMarkdown(viSection);
  const body_en = enSection ? htmlSectionToMarkdown(enSection) : null;
  const dek_vi = firstParagraph(viSection) || title_vi;
  const dek_en = enSection ? firstParagraph(enSection) || title_en : null;
  return { title_vi, title_en, dek_vi, dek_en, body_vi, body_en, published_at: parseMetaDate(html) };
}

export function resolveDemoHtmlDir(cwd = process.cwd()): string | null {
  const candidates = [
    path.resolve(cwd, 'demo-html', 'tin-tuc'),
    path.resolve(cwd, '..', '..', 'demo-html', 'tin-tuc'),
    path.resolve(cwd, '..', 'demo-html', 'tin-tuc'),
  ];
  return candidates.find((p) => {
    try {
      return readFileSync(path.join(p, 'closed-loop.html'), 'utf8').length > 0;
    } catch {
      return false;
    }
  }) ?? null;
}
