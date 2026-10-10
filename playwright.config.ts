import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests', fullyParallel: true, workers: 2,
  reporter: 'list', timeout: 20000,
  use: { browserName: 'chromium', viewport: { width: 1440, height: 900 } },
});
