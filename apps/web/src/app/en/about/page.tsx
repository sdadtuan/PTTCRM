import { AboutView } from '@/components/AboutView';
import { getAbout } from '@/lib/content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About PTTCRM',
  description: getAbout('en').lead,
  alternates: { languages: { vi: '/vi/ve-chung-toi', en: '/en/about' } },
};

export default function AboutPage() {
  return <AboutView locale="en" />;
}
