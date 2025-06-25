import { test, expect } from '@playwright/test';

test('landing page loads and contains correct title', async ({ page, baseURL }) => {
  // Navigate to the base URL directly (already includes /chris-wireframe)
  await page.goto(baseURL!);
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Check the title
  await expect(page).toHaveTitle(/OKTech/);
  
  // Check for the main heading
  const heading = page.locator('h1').first();
  await expect(heading).toBeVisible();
  await expect(heading).toContainText('Welcome to OKTech');
});