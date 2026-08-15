export type { Locale } from './paths';
export { PATH_PAIRS, detectLocale, switchLocalePath } from './paths';

export type { DemoPayload, Industry, SkuInterest, CompanySize } from './validate-demo';
export { validateDemoPayload } from './validate-demo';

export type { UtmFields } from './utm';
export { parseUtmSearch, mergeFirstTouchUtm } from './utm';

export type { SlaTone } from './sla';
export { slaTone, businessMinutesBetween } from './sla';

export type {
  CmsArticleStatus,
  CmsEventStatus,
  CmsArticleCategory,
  CmsSlotKey,
} from './cms-types';
export { CMS_SLOT_KEYS } from './cms-types';

export { assertNoRnosai, isAllowedCmsMarkdown } from './md-allow';

export type { CaseStudy } from './case-types';
export { formatCaseMetrics } from './case-types';
