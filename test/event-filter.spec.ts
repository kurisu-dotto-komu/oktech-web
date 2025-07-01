// @ts-nocheck
import { test, expect } from '@playwright/test';
import { resolveTestPath } from './helpers/url';

// Helper to wait until the grid items are shown (script sets opacity to 1)
async function waitForCollectionReady(page) {
  await page.waitForFunction(() => {
    const el = document.querySelector('#collection-container');
    return el && getComputedStyle(el).opacity === '1';
  });
}

test.describe('Event Filtering UI – user stories', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(resolveTestPath('/events', baseURL!));
    // Wait until client-side filtering script has run
    await waitForCollectionReady(page);
  });

  test('search filters events', async ({ page }) => {
    // Ensure at least a couple events are visible before searching
    const allVisibleBefore = await page.locator('div[data-item-id]:not([style*="display: none"]').count();
    expect(allVisibleBefore).toBeGreaterThan(1);

    // Type into search box
    await page.getByPlaceholder('Search events...').fill('Walking Skeleton');

    // Wait for debounce (300 ms) + next tick
    await page.waitForTimeout(500);

    const visibleAfter = await page.locator('div[data-item-id]:not([style*="display: none"]').count();
    expect(visibleAfter).toBe(1);

    // Check that the remaining card contains the query text
    await expect(page.locator('h3').first()).toContainText(/Walking Skeleton/i);
  });

  test('topic and location filters work together', async ({ page }) => {
    // Open Topics dropdown and select a topic
    await page.locator('summary', { hasText: 'Topics' }).click();
    await page.getByLabel('Design Patterns').check();

    // Wait for filter to be applied
    await page.waitForTimeout(300);

    // Confirm active filters badge shows topic
    await expect(page.locator('#active-filters-container')).toContainText('topic: Design Patterns');

    // Open Location dropdown and choose Osaka (lower-case in dataset)
    await page.locator('summary', { hasText: 'Location' }).click();
    await page.getByLabel(/osaka/i).check();

    await page.waitForTimeout(300);
    await expect(page.locator('#active-filters-container')).toContainText('location: osaka');

    // There should still be at least one event visible
    const visible = await page.locator('div[data-item-id]:not([style*="display: none"]').count();
    expect(visible).toBeGreaterThan(0);
  });

  test('sort selector changes order', async ({ page }) => {
    const firstBefore = await page.locator('div[data-item-id]:not([style*="display: none"]').first().getAttribute('data-item-id');

    // Change sort order to oldest first
    await page.locator('select').selectOption('date-asc');
    await page.waitForTimeout(300);

    const firstAfter = await page.locator('div[data-item-id]:not([style*="display: none"]').first().getAttribute('data-item-id');

    expect(firstAfter).not.toEqual(firstBefore);
  });

  test('clear all filters resets view', async ({ page }) => {
    // Apply a quick filter first (search)
    await page.getByPlaceholder('Search events...').fill('Walking Skeleton');
    await page.waitForTimeout(500);

    // Ensure Clear All appears and click it
    await page.locator('text=Clear All').click();

    // Wait for filters to clear
    await page.waitForTimeout(300);

    await expect(page.locator('#active-filters-container')).toBeHidden();
  });
});

// ---------------------------------------------------------
//                     Screenshot tests
// ---------------------------------------------------------

test.describe('Events page visual regression', () => {
  test('desktop layout', async ({ page, baseURL }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(resolveTestPath('/events', baseURL!));
    await waitForCollectionReady(page);
    await expect(page).toHaveScreenshot('events-desktop.png', { fullPage: true });
  });

  test('mobile layout', async ({ page, baseURL }) => {
    // Emulate a mobile viewport
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 12-ish
    await page.goto(resolveTestPath('/events', baseURL!));
    await waitForCollectionReady(page);
    await expect(page).toHaveScreenshot('events-mobile.png', { fullPage: true });
  });
});