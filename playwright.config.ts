import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: 'http://localhost:19006',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'pnpm -s web -- --port 19006 --non-interactive',
    url: 'http://localhost:19006',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      EXPO_NO_TELEMETRY: '1',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
});
