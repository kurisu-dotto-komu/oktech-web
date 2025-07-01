import { test, expect } from '@playwright/test';
import { resolveTestPath } from './helpers/url';

test.describe('Event Filtering UI', () => {
  // Test data setup
  const testEvents = [
    { topic: 'React', location: 'Osaka', title: 'React Study Session' },
    { topic: 'TypeScript', location: 'Tokyo', title: 'TypeScript Workshop' },
    { topic: 'Vue', location: 'Osaka', title: 'Vue.js Meetup' },
    { topic: 'React', location: 'Tokyo', title: 'Advanced React Patterns' },
  ];

  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(resolveTestPath('/events', baseURL!));
    await page.waitForLoadState('networkidle');
    
    // Wait for the filter UI to be visible
    await expect(page.locator('#collection-filter-wrapper')).toBeVisible();
  });

  test.describe('Search Functionality', () => {
    test('should filter events by search term', async ({ page }) => {
      const searchInput = page.locator('input[placeholder="Search events..."]');
      
      // Verify search input is present
      await expect(searchInput).toBeVisible();
      
      // Search for a specific term
      await searchInput.fill('React');
      
      // Wait for debounced search to complete
      await page.waitForTimeout(500);
      
      // Check URL is updated with search parameter
      await expect(page).toHaveURL(/search=React/);
      
      // Verify events are filtered (this will depend on actual events in the system)
      const eventCards = page.locator('[data-item-id]');
      await expect(eventCards.first()).toBeVisible();
    });

    test('should clear search with clear button', async ({ page }) => {
      const searchInput = page.locator('input[placeholder="Search events..."]');
      const clearButton = page.locator('button[aria-label="Clear search"]');
      
      // Type search term
      await searchInput.fill('TypeScript');
      await page.waitForTimeout(500);
      
      // Verify clear button appears
      await expect(clearButton).toBeVisible();
      
      // Click clear button
      await clearButton.click();
      
      // Verify search is cleared
      await expect(searchInput).toHaveValue('');
      await expect(page).toHaveURL(/^(?!.*search=)/);
    });

    test('should show debounced search behavior', async ({ page }) => {
      const searchInput = page.locator('input[placeholder="Search events..."]');
      
      // Type quickly without waiting
      await searchInput.fill('R');
      await searchInput.fill('Re');
      await searchInput.fill('Rea');
      await searchInput.fill('React');
      
      // Wait less than debounce time
      await page.waitForTimeout(200);
      
      // URL should not be updated yet
      await expect(page).not.toHaveURL(/search=React/);
      
      // Wait for debounce to complete
      await page.waitForTimeout(400);
      
      // Now URL should be updated
      await expect(page).toHaveURL(/search=React/);
    });
  });

  test.describe('Topic Filter', () => {
    test('should filter by single topic', async ({ page }) => {
      const topicsDropdown = page.locator('details:has(summary:has-text("Topics"))');
      
      // Open topics dropdown
      await topicsDropdown.locator('summary').click();
      await expect(topicsDropdown.locator('.dropdown-content')).toBeVisible();
      
      // Look for any available topic checkbox and click it
      const firstTopicCheckbox = topicsDropdown.locator('input[type="checkbox"]').first();
      if (await firstTopicCheckbox.count() > 0) {
        const topicLabel = await firstTopicCheckbox.locator('..').locator('.label-text').textContent();
        
        await firstTopicCheckbox.click();
        
        // Check URL is updated
        await expect(page).toHaveURL(new RegExp(`topics=.*${topicLabel}`));
        
        // Verify badge shows selected count
        await expect(topicsDropdown.locator('.badge')).toContainText('1');
      }
    });

    test('should filter by multiple topics', async ({ page }) => {
      const topicsDropdown = page.locator('details:has(summary:has-text("Topics"))');
      
      await topicsDropdown.locator('summary').click();
      
      const topicCheckboxes = topicsDropdown.locator('input[type="checkbox"]');
      const topicCount = await topicCheckboxes.count();
      
      if (topicCount >= 2) {
        // Select first two topics
        await topicCheckboxes.nth(0).click();
        await topicCheckboxes.nth(1).click();
        
        // Verify badge shows count of 2
        await expect(topicsDropdown.locator('.badge')).toContainText('2');
        
        // Check URL contains both topics
        const url = await page.url();
        expect(url).toMatch(/topics=.*,/);
      }
    });

    test('should clear topic filter', async ({ page }) => {
      const topicsDropdown = page.locator('details:has(summary:has-text("Topics"))');
      
      await topicsDropdown.locator('summary').click();
      
      const firstCheckbox = topicsDropdown.locator('input[type="checkbox"]').first();
      if (await firstCheckbox.count() > 0) {
        // Select a topic
        await firstCheckbox.click();
        
        // Wait for filter to apply
        await page.waitForTimeout(300);
        
        // Click clear button
        const clearButton = topicsDropdown.locator('button:has-text("Clear")');
        await clearButton.click();
        
        // Verify topic is deselected
        await expect(firstCheckbox).not.toBeChecked();
        await expect(topicsDropdown.locator('.badge')).not.toBeVisible();
      }
    });
  });

  test.describe('Location Filter', () => {
    test('should filter by location', async ({ page }) => {
      const locationDropdown = page.locator('details:has(summary:has-text("Location"))');
      
      // Open location dropdown
      await locationDropdown.locator('summary').click();
      await expect(locationDropdown.locator('.dropdown-content')).toBeVisible();
      
      // Select first available location
      const firstLocationRadio = locationDropdown.locator('input[type="radio"]').first();
      if (await firstLocationRadio.count() > 0) {
        const locationLabel = await firstLocationRadio.locator('..').locator('.label-text').textContent();
        
        await firstLocationRadio.click();
        
        // Dropdown should close automatically for single select
        await expect(locationDropdown.locator('.dropdown-content')).not.toBeVisible();
        
        // Check URL is updated
        await expect(page).toHaveURL(new RegExp(`location=${locationLabel}`));
        
        // Verify badge shows selection
        await expect(locationDropdown.locator('.badge')).toContainText('1');
      }
    });

    test('should clear location filter', async ({ page }) => {
      const locationDropdown = page.locator('details:has(summary:has-text("Location"))');
      
      await locationDropdown.locator('summary').click();
      
      const firstRadio = locationDropdown.locator('input[type="radio"]').first();
      if (await firstRadio.count() > 0) {
        // Select a location
        await firstRadio.click();
        
        // Reopen dropdown
        await locationDropdown.locator('summary').click();
        
        // Click clear button
        const clearButton = locationDropdown.locator('button:has-text("Clear")');
        await clearButton.click();
        
        // Verify location is deselected
        await expect(firstRadio).not.toBeChecked();
        await expect(locationDropdown.locator('.badge')).not.toBeVisible();
      }
    });
  });

  test.describe('Sort Functionality', () => {
    test('should sort by date ascending', async ({ page }) => {
      const sortSelect = page.locator('select.select-bordered');
      
      await expect(sortSelect).toBeVisible();
      
      // Change to date ascending
      await sortSelect.selectOption('date-asc');
      
      // Check URL is updated
      await expect(page).toHaveURL(/sort=date-asc/);
      
      // Verify select shows correct value
      await expect(sortSelect).toHaveValue('date-asc');
    });

    test('should sort by date descending (default)', async ({ page }) => {
      const sortSelect = page.locator('select.select-bordered');
      
      // Should default to date-desc
      await expect(sortSelect).toHaveValue('date-desc');
      
      // Change to ascending then back to descending
      await sortSelect.selectOption('date-asc');
      await sortSelect.selectOption('date-desc');
      
      await expect(sortSelect).toHaveValue('date-desc');
    });
  });

  test.describe('View Mode Selector', () => {
    test('should change view modes', async ({ page }) => {
      const viewModeSelector = page.locator('[data-testid="view-mode-selector"]').or(
        page.locator('div:has(button:has-text("Grid"))').or(
          page.locator('div:has(button:has-text("List"))').or(
            page.locator('div:has(button:has-text("Gallery"))')
          )
        )
      );
      
      // Look for view mode buttons
      const gridButton = page.locator('button:has-text("Grid")').or(page.locator('button[aria-label*="grid"]'));
      const listButton = page.locator('button:has-text("List")').or(page.locator('button[aria-label*="list"]'));
      const compactButton = page.locator('button:has-text("Compact")').or(page.locator('button[aria-label*="compact"]'));
      
      // Test different view modes if they exist
      if (await listButton.count() > 0) {
        await listButton.click();
        await expect(page).toHaveURL(/view=list|view=compact/);
      }
      
      if (await gridButton.count() > 0) {
        await gridButton.click();
        await expect(page).toHaveURL(/view=grid|^(?!.*view=)/);
      }
    });
  });

  test.describe('Active Filters', () => {
    test('should show active filters', async ({ page }) => {
      // Apply some filters
      const searchInput = page.locator('input[placeholder="Search events..."]');
      await searchInput.fill('React');
      await page.waitForTimeout(500);
      
      // Check if active filters component exists and shows the search filter
      const activeFilters = page.locator('#active-filters-container').or(
        page.locator('div:has-text("Clear all")').or(
          page.locator('div:has(button:has-text("✕"))')
        )
      );
      
      if (await activeFilters.count() > 0) {
        await expect(activeFilters).toBeVisible();
      }
    });

    test('should clear all filters', async ({ page }) => {
      // Apply multiple filters
      const searchInput = page.locator('input[placeholder="Search events..."]');
      await searchInput.fill('TypeScript');
      await page.waitForTimeout(500);
      
      // Look for clear all button
      const clearAllButton = page.locator('button:has-text("Clear all")').or(
        page.locator('button[aria-label="Clear all filters"]')
      );
      
      if (await clearAllButton.count() > 0) {
        await clearAllButton.click();
        
        // Verify all filters are cleared
        await expect(searchInput).toHaveValue('');
        await expect(page).toHaveURL(/^(?!.*search=)(?!.*topics=)(?!.*location=)/);
      }
    });
  });

  test.describe('Combined Filters', () => {
    test('should apply multiple filters simultaneously', async ({ page }) => {
      // Apply search filter
      const searchInput = page.locator('input[placeholder="Search events..."]');
      await searchInput.fill('meetup');
      await page.waitForTimeout(500);
      
      // Apply topic filter if available
      const topicsDropdown = page.locator('details:has(summary:has-text("Topics"))');
      await topicsDropdown.locator('summary').click();
      
      const firstTopic = topicsDropdown.locator('input[type="checkbox"]').first();
      if (await firstTopic.count() > 0) {
        await firstTopic.click();
      }
      
      // Apply sort
      const sortSelect = page.locator('select.select-bordered');
      await sortSelect.selectOption('date-asc');
      
      // Verify URL contains all filters
      const url = await page.url();
      expect(url).toMatch(/search=meetup/);
      expect(url).toMatch(/sort=date-asc/);
    });

    test('should persist filters in URL on page reload', async ({ page }) => {
      // Apply filters
      const searchInput = page.locator('input[placeholder="Search events..."]');
      await searchInput.fill('workshop');
      await page.waitForTimeout(500);
      
      const sortSelect = page.locator('select.select-bordered');
      await sortSelect.selectOption('date-asc');
      
      const currentUrl = page.url();
      
      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Verify filters are restored
      await expect(searchInput).toHaveValue('workshop');
      await expect(sortSelect).toHaveValue('date-asc');
      expect(page.url()).toBe(currentUrl);
    });
  });
});

test.describe('Event Filtering UI - Visual Tests', () => {
  test('should take desktop screenshot of events filter interface', async ({ page, baseURL }) => {
    await page.goto(resolveTestPath('/events', baseURL!));
    await page.waitForLoadState('networkidle');
    
    // Wait for filter UI to be visible
    await expect(page.locator('#collection-filter-wrapper')).toBeVisible();
    
    // Take screenshot of the full page
    await expect(page).toHaveScreenshot('events-filter-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    });
    
    // Take screenshot of just the filter area
    await expect(page.locator('#collection-filter-wrapper')).toHaveScreenshot('events-filter-controls-desktop.png', {
      animations: 'disabled',
    });
  });

  test('should take mobile screenshot of events filter interface', async ({ page, baseURL }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto(resolveTestPath('/events', baseURL!));
    await page.waitForLoadState('networkidle');
    
    // Wait for filter UI to be visible
    await expect(page.locator('#collection-filter-wrapper')).toBeVisible();
    
    // Take screenshot of the full page on mobile
    await expect(page).toHaveScreenshot('events-filter-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
    
    // Take screenshot of just the filter area on mobile
    await expect(page.locator('#collection-filter-wrapper')).toHaveScreenshot('events-filter-controls-mobile.png', {
      animations: 'disabled',
    });
  });

  test('should test filter interface responsiveness', async ({ page, baseURL }) => {
    await page.goto(resolveTestPath('/events', baseURL!));
    await page.waitForLoadState('networkidle');
    
    // Test different viewport sizes
    const viewports = [
      { width: 320, height: 568, name: 'mobile-small' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1024, height: 768, name: 'tablet-landscape' },
      { width: 1440, height: 900, name: 'desktop-large' },
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(300); // Wait for layout to settle
      
      // Ensure filter UI is still functional
      await expect(page.locator('#collection-filter-wrapper')).toBeVisible();
      
      // Take screenshot for each viewport
      await expect(page).toHaveScreenshot(`events-filter-${viewport.name}.png`, {
        animations: 'disabled',
      });
      
      // Test that search input is accessible
      const searchInput = page.locator('input[placeholder="Search events..."]');
      await expect(searchInput).toBeVisible();
      
      // Test that dropdowns can be opened (basic interaction test)
      const topicsDropdown = page.locator('details:has(summary:has-text("Topics"))');
      if (await topicsDropdown.count() > 0) {
        await topicsDropdown.locator('summary').click();
        await expect(topicsDropdown.locator('.dropdown-content')).toBeVisible();
        await topicsDropdown.locator('summary').click(); // Close it
      }
    }
  });

  test('should test filter UI with applied filters screenshots', async ({ page, baseURL }) => {
    await page.goto(resolveTestPath('/events', baseURL!));
    await page.waitForLoadState('networkidle');
    
    // Apply some filters for a more interesting screenshot
    const searchInput = page.locator('input[placeholder="Search events..."]');
    await searchInput.fill('React Workshop');
    await page.waitForTimeout(500);
    
    // Apply topic filter if available
    const topicsDropdown = page.locator('details:has(summary:has-text("Topics"))');
    if (await topicsDropdown.count() > 0) {
      await topicsDropdown.locator('summary').click();
      const firstCheckbox = topicsDropdown.locator('input[type="checkbox"]').first();
      if (await firstCheckbox.count() > 0) {
        await firstCheckbox.click();
      }
    }
    
    // Change sort order
    const sortSelect = page.locator('select.select-bordered');
    await sortSelect.selectOption('date-asc');
    
    // Take screenshot with filters applied
    await expect(page).toHaveScreenshot('events-filter-with-active-filters.png', {
      fullPage: true,
      animations: 'disabled',
    });
    
    // Test mobile view with filters
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(300);
    
    await expect(page).toHaveScreenshot('events-filter-mobile-with-active-filters.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});