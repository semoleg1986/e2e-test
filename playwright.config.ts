import { defineConfig } from '@playwright/test'

const isCI = process.env.CI === 'true'

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 7_000 },
  retries: isCI ? 1 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'retain-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' }
    }
  ]
})
