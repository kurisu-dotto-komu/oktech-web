import { test, expect } from '@playwright/test';

// Smoke test for production build - tests just a few critical routes
test.describe('Build Smoke Test', () => {
  test('Homepage loads in production build', async ({ page, baseURL }) => {
    await page.goto(baseURL!);
    await page.waitForLoadState('networkidle');
    
    // Basic check that we're not on a 404 page
    const title = await page.title();
    expect(title).not.toContain('404');
    expect(title).toContain('OKTech');
  });

  test('Static assets are served correctly', async ({ page, baseURL }) => {
    const response = await page.goto(baseURL!);
    expect(response?.status()).toBe(200);
    
    // Check that CSS is loaded
    const hasStyles = await page.evaluate(() => {
      const styles = window.getComputedStyle(document.body);
      return styles.backgroundColor !== 'rgba(0, 0, 0, 0)';
    });
    expect(hasStyles).toBe(true);
  });

  test('JavaScript is executed', async ({ page, baseURL }) => {
    await page.goto(baseURL!);
    
    // Check that theme-change script runs
    const hasThemeAttribute = await page.evaluate(() => {
      return document.documentElement.hasAttribute('data-theme');
    });
    expect(hasThemeAttribute).toBe(true);
  });
});