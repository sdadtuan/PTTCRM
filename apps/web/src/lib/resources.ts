import type { Locale } from '@pttcrm/gtm-core';
import viResources from '../../content/vi/resources.json';
import enResources from '../../content/en/resources-hub.json';

export type ResourcesHubContent = typeof viResources;

export function getResourcesHub(locale: Locale): ResourcesHubContent {
  return locale === 'vi' ? viResources : enResources;
}
