const RNOSAI_RE = /RNOSAI/i;

export function assertNoRnosai(text: string): void {
  if (RNOSAI_RE.test(text)) {
    throw new Error('RNOSAI_FORBIDDEN');
  }
}

const IMG_RE = /!\[[^\]]*]\(([^)]+)\)/g;

export function isAllowedCmsMarkdown(md: string, mediaBase: string): boolean {
  if (/<script/i.test(md)) return false;
  const base = mediaBase.replace(/\/$/, '');
  let match: RegExpExecArray | null;
  IMG_RE.lastIndex = 0;
  while ((match = IMG_RE.exec(md)) !== null) {
    const url = match[1]?.trim() ?? '';
    if (url.startsWith('#')) continue;
    if (!url.startsWith(base)) return false;
  }
  return true;
}
