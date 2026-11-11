import { defineConfig } from 'playwright/test'

const baseURL = 'http://127.0.0.1:4173'
const previewCommand =
  'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort'

export default defineConfig({
  testDir: './e2e',
  workers: 1,
  forbidOnly: true,
  retries: 0,
  reporter: 'list',
  use: {
    browserName: 'chromium',
    headless: true,
    viewport: { width: 1440, height: 900 },
    baseURL,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: process.env.CI
      ? previewCommand
      : `npm run build && ${previewCommand}`,
    timeout: 120_000,
    url: baseURL,
    reuseExistingServer: false,
  },
})
