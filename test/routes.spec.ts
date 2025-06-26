import { test, expect } from '@playwright/test';
import { resolveTestPath } from './helpers/url';

// Static routes tests
test.describe('Static Routes', () => {
  test('Homepage loads with correct title', async ({ page, baseURL }) => {
    await page.goto(baseURL!);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle('OKTech - Osaka Kansai Tech Meetup Group');
    await expect(page.locator('h1').first()).toContainText('Welcome to OKTech');
  });

  test('About page loads with correct title', async ({ page, baseURL }) => {
    await page.goto(resolveTestPath('/about', baseURL!));
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/About.*OKTech/);
  });

  test('People page loads with correct title', async ({ page, baseURL }) => {
    await page.goto(resolveTestPath('/people', baseURL!));
    await page.waitForLoadState('networkidle');
    // People page might not have "People" in title
    await expect(page).toHaveTitle(/OKTech/);
  });

  test('Sitemap HTML page loads', async ({ page, baseURL }) => {
    await page.goto(resolveTestPath('/sitemap', baseURL!));
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Sitemap.*OKTech/);
  });
});

// Dynamic routes tests - one example for each type
test.describe('Dynamic Routes', () => {
  test('Events page loads with correct title', async ({ page, baseURL }) => {
    await page.goto(resolveTestPath('/events', baseURL!));
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Events.*OKTech/);
  });

  test('Individual event page loads with correct title', async ({ page, baseURL }) => {
    await page.goto(resolveTestPath('/event/307774539-oktech-study-session-a-walking-skeleton-approach', baseURL!));
    await page.waitForLoadState('networkidle');
    // Event pages typically have the event name in the title
    await expect(page).toHaveTitle(/OKTech Study Session.*OKTech/);
  });

  test('Event projector view loads', async ({ page, baseURL }) => {
    await page.goto(resolveTestPath('/event/307774539-oktech-study-session-a-walking-skeleton-approach/projector', baseURL!));
    await page.waitForLoadState('networkidle');
    // Projector view might have different title pattern
    await expect(page).toHaveTitle(/OKTech/);
  });

  test('Individual person page loads with correct title', async ({ page, baseURL }) => {
    await page.goto(resolveTestPath('/person/martin-heidegger', baseURL!));
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Martin Heidegger.*OKTech/);
  });

  test('Individual venue page loads with correct title', async ({ page, baseURL }) => {
    await page.goto(resolveTestPath('/venue/27584681-co-ba-nakanoshima', baseURL!));
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/co-ba nakanoshima.*Venues.*OKTech/);
  });
});

// Special routes tests
test.describe('Special Routes', () => {
  test('RSS feed is accessible', async ({ page, baseURL }) => {
    const response = await page.goto(resolveTestPath('/rss.xml', baseURL!));
    expect(response?.status()).toBe(200);
    expect(response?.headers()['content-type']).toMatch(/xml/);
  });

  test('XML sitemap is accessible', async ({ page, baseURL }) => {
    const response = await page.goto(resolveTestPath('/sitemap.xml', baseURL!));
    expect(response?.status()).toBe(200);
    expect(response?.headers()['content-type']).toMatch(/xml/);
  });

  test('Homepage OG image is accessible', async ({ page, baseURL }) => {
    const response = await page.goto(resolveTestPath('/og.png', baseURL!));
    expect(response?.status()).toBe(200);
    expect(response?.headers()['content-type']).toContain('image/png');
  });

  test('Event OG image is accessible', async ({ page, baseURL }) => {
    const response = await page.goto(resolveTestPath('/event/307774539-oktech-study-session-a-walking-skeleton-approach/og.png', baseURL!));
    expect(response?.status()).toBe(200);
    expect(response?.headers()['content-type']).toContain('image/png');
  });

  test('Person OG image is accessible', async ({ page, baseURL }) => {
    const response = await page.goto(resolveTestPath('/person/martin-heidegger/og.png', baseURL!));
    expect(response?.status()).toBe(200);
    expect(response?.headers()['content-type']).toContain('image/png');
  });

  test('Venue OG image is accessible', async ({ page, baseURL }) => {
    const response = await page.goto(resolveTestPath('/venue/27584681-co-ba-nakanoshima/og.png', baseURL!));
    expect(response?.status()).toBe(200);
    expect(response?.headers()['content-type']).toContain('image/png');
  });
});