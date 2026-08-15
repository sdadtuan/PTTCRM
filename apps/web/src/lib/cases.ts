import type { CaseStudy } from '@pttcrm/gtm-core';

import agencyCase from '../../content/cases/agency-portal-roas.json';
import bdsCase from '../../content/cases/bds-booking-cpl.json';
import fnbCase from '../../content/cases/fnb-reservation.json';

const ALL: CaseStudy[] = [agencyCase, bdsCase, fnbCase] as CaseStudy[];

export function listSignedCases(): CaseStudy[] {
  return ALL.filter((c) => c.po_signed === true);
}

export function getCase(slug: string): CaseStudy | null {
  return ALL.find((c) => c.slug === slug) ?? null;
}
