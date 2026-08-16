import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: 'http://127.0.0.1:3300',
    trace: 'on-first-retry',
  },
  webServer: {
    command:
      'NEXT_PUBLIC_GTM_API_BASE=http://127.0.0.1:3300 npm run build && NEXT_PUBLIC_GTM_API_BASE=http://127.0.0.1:3300 npm run start',
    url: 'http://127.0.0.1:3300/vi',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
