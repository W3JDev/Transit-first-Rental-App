import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'NEXT_PUBLIC_USE_MOCK=1 next build --no-lint && NEXT_PUBLIC_USE_MOCK=1 next start',
    port: 3000,
    reuseExistingServer: !process.env.CI
  },
  testDir: 'tests'
});
