import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PTTCRM',
  description: 'Marketing CRM — Một nền tảng, chuyên biệt từng ngành',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0090a0',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
