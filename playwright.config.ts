import { defineConfig, devices } from '@playwright/test';

// Get a random port between 10000 and 65000
const getRandomPort = () => Math.floor(Math.random() * (65000 - 10000) + 10000);

// Use environment variable if set, otherwise generate a new port
const port = process.env.PLAYWRIGHT_TEST_PORT ? 
  parseInt(process.env.PLAYWRIGHT_TEST_PORT) : 
  getRandomPort();

// Set it in env to ensure consistency across config reloads
process.env.PLAYWRIGHT_TEST_PORT = String(port);

console.log(`Using port ${port} for Playwright tests`);

export default defineConfig({
  testDir: './test',
  outputDir: './test/results/test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: './test/results/playwright-report' }]],
  use: {
    baseURL: `http://localhost:${port}/chris-wireframe`,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: `npm run dev -- --port ${port}`,
    port: port,
    timeout: 120 * 1000,
    reuseExistingServer: false,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});