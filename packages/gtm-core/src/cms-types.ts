export type CmsArticleStatus = 'draft' | 'published' | 'archived';
export type CmsEventStatus = 'draft' | 'published' | 'cancelled' | 'archived';
export type CmsArticleCategory = 'insight' | 'nganh' | 'huong-dan';

export const CMS_SLOT_KEYS = [
  'home.hero',
  'home.module.crm',
  'home.module.ads',
  'home.module.portal',
  'home.module.ai',
  'product.crm',
  'product.ads',
  'product.portal',
  'product.ai',
  'solution.bds',
  'solution.agency',
  'solution.fnb',
] as const;

export type CmsSlotKey = (typeof CMS_SLOT_KEYS)[number];
