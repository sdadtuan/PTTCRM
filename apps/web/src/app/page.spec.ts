import { detectLocale } from '@pttcrm/gtm-core';
import { expect, test } from 'vitest';

test('root uses detectLocale for redirect target', () => {
  expect(`/${detectLocale('en')}`).toBe('/en');
  expect(`/${detectLocale(null)}`).toBe('/vi');
});
