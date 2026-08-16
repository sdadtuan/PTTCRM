import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'apps/web/src'),
    },
  },
  test: {
    include: ['packages/**/*.spec.ts', 'apps/**/*.spec.ts'],
    exclude: ['**/e2e/**', '**/node_modules/**'],
  },
});
