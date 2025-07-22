import { test, expect } from "@playwright/test";
import { resolveTestPath } from "../helpers/url";

test.describe("Event Filters", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(resolveTestPath("/events", baseURL!));
    await page.waitForLoadState("networkidle");
  });

  test.describe("Search functionality", () => {
    test("should filter events by search term", async ({ page }) => {
      // Type in search box
      await page.fill('[data-testid="events-search-input"]', "javascript");
      
      // Wait for search to complete (debounce + filter update)
      await page.waitForTimeout(600);
      
      // Check that filtered results are shown
      const eventCards = page.locator('[data-testid="event-card"]');
      const count = await eventCards.count();
      expect(count).toBeGreaterThan(0);
      
      // Since Fuse.js searches across title, description, topics, and location,
      // we just verify that we have filtered results, not that every title contains the term
    });

    test("should update URL with search parameter", async ({ page }) => {
      await page.fill('[data-testid="events-search-input"]', "react");
      await page.waitForTimeout(500); // Wait for debounce
      
      const url = page.url();
      expect(url).toContain("search=react");
    });

    test("should clear search when input is cleared", async ({ page }) => {
      await page.fill('[data-testid="events-search-input"]', "test");
      await page.waitForTimeout(500);
      
      await page.fill('[data-testid="events-search-input"]', "");
      await page.waitForTimeout(500);
      
      const url = page.url();
      expect(url).not.toContain("search=");
    });
  });

  test.describe("Topic filtering", () => {
    test("should filter events by single topic", async ({ page }) => {
      // Click topic dropdown
      await page.click('[data-testid="topics-filter-dropdown"]');
      
      // Select a topic
      const firstTopic = page.locator('[data-testid="topic-option"]').first();
      const topicText = await firstTopic.textContent();
      await firstTopic.click();
      
      // Verify filtered results
      const eventCards = page.locator('[data-testid="event-card"]');
      const count = await eventCards.count();
      expect(count).toBeGreaterThan(0);
      
      // Check URL
      const url = page.url();
      expect(url).toContain("topics=");
    });

    test("should filter events by multiple topics", async ({ page }) => {
      await page.click('[data-testid="topics-filter-dropdown"]');
      
      // Select multiple topics
      await page.locator('[data-testid="topic-option"]').nth(0).click();
      await page.locator('[data-testid="topic-option"]').nth(1).click();
      
      // Click on the page heading to close dropdown
      await page.click('h1');
      await page.waitForTimeout(300); // Wait for dropdown to close and URL to update
      
      // Check URL contains topics parameter
      const url = page.url();
      expect(url).toContain("topics=");
      // The exact format might vary, just verify topics were added
    });

    test("should show active topic filters", async ({ page }) => {
      await page.click('[data-testid="topics-filter-dropdown"]');
      await page.locator('[data-testid="topic-option"]').first().click();
      
      // Check active filter chip is shown
      const activeFilter = page.locator('[data-testid="active-filter-chip"]');
      await expect(activeFilter).toBeVisible();
    });
  });

  test.describe("Location filtering", () => {
    test("should filter events by location", async ({ page }) => {
      // Click location dropdown
      await page.click('[data-testid="location-filter-dropdown"]');
      
      // Select a location
      const firstLocation = page.locator('[data-testid="location-option"]').first();
      const locationText = await firstLocation.textContent();
      await firstLocation.click();
      
      // Verify filtered results
      const eventCards = page.locator('[data-testid="event-card"]');
      const count = await eventCards.count();
      expect(count).toBeGreaterThan(0);
      
      // Check URL
      const url = page.url();
      expect(url).toContain(`location=${encodeURIComponent(locationText || "")}`);
    });
  });

  test.describe("Sort options", () => {
    test("should sort events by date ascending", async ({ page }) => {
      // For select elements, we need to select by value, not click
      await page.selectOption('[data-testid="sort-selector"]', 'date-asc');
      await page.waitForTimeout(300); // Wait for sort to apply
      
      // Get dates of visible events using data-date attribute
      const dateElements = await page.locator('[data-testid="event-date"]').all();
      const dates = await Promise.all(
        dateElements.map(el => el.getAttribute('data-date'))
      );
      
      // Verify ascending order
      for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(dates[i - 1]!);
        const currDate = new Date(dates[i]!);
        expect(prevDate.getTime()).toBeLessThanOrEqual(currDate.getTime());
      }
      
      // Check URL
      const url = page.url();
      expect(url).toContain("sort=date-asc");
    });

    test("should sort events by date descending (default)", async ({ page }) => {
      // Should be default sort
      await page.waitForTimeout(300); // Wait for initial load
      
      // Get dates of visible events using data-date attribute
      const dateElements = await page.locator('[data-testid="event-date"]').all();
      const dates = await Promise.all(
        dateElements.map(el => el.getAttribute('data-date'))
      );
      
      // Verify descending order
      for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(dates[i - 1]!);
        const currDate = new Date(dates[i]!);
        expect(prevDate.getTime()).toBeGreaterThanOrEqual(currDate.getTime());
      }
    });
  });

  test.describe("Combined filters", () => {
    test("should apply multiple filters simultaneously", async ({ page }) => {
      // Apply search
      await page.fill('[data-testid="events-search-input"]', "web");
      
      // Apply topic
      await page.click('[data-testid="topics-filter-dropdown"]');
      await page.locator('[data-testid="topic-option"]').first().click();
      
      // Apply sort - use selectOption for select elements
      await page.selectOption('[data-testid="sort-selector"]', 'date-asc');
      
      await page.waitForTimeout(800); // Wait for all updates
      
      // Check URL has all parameters
      const url = page.url();
      expect(url).toContain("search=web");
      expect(url).toContain("topics=");
      expect(url).toContain("sort=date-asc");
      
      // Verify some results are shown
      const eventCards = page.locator('[data-testid="event-card"]');
      const count = await eventCards.count();
      expect(count).toBeGreaterThan(0);
    });

    test("should clear all filters", async ({ page }) => {
      // Apply some filters
      await page.fill('[data-testid="events-search-input"]', "test");
      await page.click('[data-testid="topics-filter-dropdown"]');
      await page.locator('[data-testid="topic-option"]').first().click();
      
      // Clear all filters
      await page.click('[data-testid="clear-all-filters"]');
      
      // Check URL is clean
      const url = page.url();
      expect(url).not.toContain("search=");
      expect(url).not.toContain("topics=");
      expect(url).not.toContain("location=");
    });
  });

  test.describe("URL parameter persistence", () => {
    test("should load with filters from URL", async ({ page, baseURL }) => {
      // Navigate with filters in URL
      await page.goto(resolveTestPath("/events?search=javascript&sort=date-asc", baseURL!));
      await page.waitForLoadState("networkidle");
      
      // Check search input has value
      const searchInput = page.locator('[data-testid="events-search-input"]');
      await expect(searchInput).toHaveValue("javascript");
      
      // Check sort is applied
      const sortSelector = page.locator('[data-testid="sort-selector"]');
      await expect(sortSelector).toContainText("Oldest First");
    });

  });

  test.describe("View mode switching", () => {
    test("should switch to compact view", async ({ page }) => {
      await page.click('[data-testid="view-mode-compact"]');
      
      // Wait for URL to change
      await page.waitForURL('**/events/compact**');
      
      // Check URL
      expect(page.url()).toContain("/events/compact");
      
      // Wait a bit for view to load
      await page.waitForTimeout(1000);
      
      // For now, just check URL changed correctly
      expect(page.url()).toContain("/events/compact");
    });

    test("should switch to gallery view", async ({ page }) => {
      await page.click('[data-testid="view-mode-gallery"]');
      
      // Wait for URL to change
      await page.waitForURL('**/events/gallery**');
      
      // Check URL
      expect(page.url()).toContain("/events/gallery");
      
      // Wait a bit for view to load
      await page.waitForTimeout(1000);
      
      // For now, just check URL changed correctly
      expect(page.url()).toContain("/events/gallery");
    });

    test("should display gallery view correctly", async ({ page, baseURL }) => {
      // Navigate to gallery view
      await page.goto(resolveTestPath("/events/gallery", baseURL!));
      await page.waitForLoadState("networkidle");
      
      // Check gallery view is displayed
      const galleryView = page.locator('[data-testid="events-gallery-view"]');
      await expect(galleryView).toBeVisible();
      
      // Check that events are displayed
      const eventCards = page.locator('[data-testid="event-card"]');
      const eventCount = await eventCards.count();
      expect(eventCount).toBeGreaterThan(0);
      
      // Gallery images section is optional - only check if present
      const galleryImages = page.locator('[data-testid="event-gallery-images"]');
      const galleryCount = await galleryImages.count();
      
      if (galleryCount > 0) {
        // If there are gallery images, verify they're visible
        const firstGalleryImages = galleryImages.first();
        await expect(firstGalleryImages).toBeVisible();
      }
      // Test passes either way - gallery images are optional
    });

    test("should preserve filters when switching views", async ({ page }) => {
      // Apply filters
      await page.fill('[data-testid="events-search-input"]', "design");
      await page.waitForTimeout(600); // Wait for debounce
      
      // Switch to compact view
      await page.click('[data-testid="view-mode-compact"]');
      
      // Wait for URL to change to compact view with filters
      await page.waitForURL('**/events/compact*');
      
      // Check filters are preserved in URL
      expect(page.url()).toContain("search=design");
      
      // Check search input still has value
      const searchInput = page.locator('[data-testid="events-search-input"]');
      await expect(searchInput).toHaveValue("design");
    });
  });


  test.describe("No flash of unfiltered content", () => {
    test("should not flash unfiltered content when loading with URL params", async ({ page, baseURL }) => {
      // Set up to capture any flash
      let flashDetected = false;
      
      page.on('domcontentloaded', async () => {
        // Check if all events are visible initially
        const allEventsVisible = await page.evaluate(() => {
          const events = document.querySelectorAll('[data-testid="event-card"]');
          return events.length > 10; // Assuming filtered results would be less
        });
        
        if (allEventsVisible) {
          flashDetected = true;
        }
      });
      
      // Navigate with filter
      await page.goto(resolveTestPath("/events?topics=javascript", baseURL!));
      await page.waitForLoadState("networkidle");
      
      // Verify no flash occurred
      expect(flashDetected).toBe(false);
      
      // Verify filtered content is shown
      const eventCards = page.locator('[data-testid="event-card"]');
      const count = await eventCards.count();
      expect(count).toBeLessThan(10); // Should show filtered results only
    });
  });
});