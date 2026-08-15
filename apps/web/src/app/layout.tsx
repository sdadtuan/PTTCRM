import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PTTCRM',
  description: 'Marketing CRM — Một nền tảng, chuyên biệt từng ngành',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
