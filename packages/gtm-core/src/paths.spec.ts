import { describe, expect, test } from 'vitest';
import { detectLocale, switchLocalePath } from './paths';

describe('detectLocale', () => {
  test('falls back to vi', () => {
    expect(detectLocale(null)).toBe('vi');
    expect(detectLocale('fr-FR,fr;q=0.9')).toBe('vi');
    expect(detectLocale('en-US,en;q=0.8')).toBe('en');
    expect(detectLocale('vi-VN,vi;q=0.9,en;q=0.8')).toBe('vi');
  });
});

describe('switchLocalePath', () => {
  test('maps commercial + cms routes', () => {
    expect(switchLocalePath('/vi/bang-gia', 'en')).toBe('/en/pricing');
    expect(switchLocalePath('/en/request-demo', 'vi')).toBe('/vi/dang-ky-demo');
    expect(switchLocalePath('/vi/giai-phap/agency', 'en')).toBe('/en/solutions/agency');
    expect(switchLocalePath('/vi/tin-tuc/closed-loop', 'en')).toBe('/en/news/closed-loop');
    expect(switchLocalePath('/en/events/demo-ngay-nganh', 'vi')).toBe('/vi/su-kien/demo-ngay-nganh');
    expect(switchLocalePath('/vi/khach-hang', 'en')).toBe('/en/customers');
    expect(switchLocalePath('/vi/giai-phap/education', 'en')).toBe('/en/solutions/education');
    expect(switchLocalePath('/vi/giai-phap/pharma', 'en')).toBe('/en/solutions/pharma');
    expect(switchLocalePath('/vi/tai-nguyen', 'en')).toBe('/en/resources');
    expect(switchLocalePath('/en/resources', 'vi')).toBe('/vi/tai-nguyen');
  });
});
