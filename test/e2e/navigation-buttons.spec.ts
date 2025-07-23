import { test, expect } from "@playwright/test";

test.describe("Navigation Buttons", () => {
  test.describe("Event Navigation", () => {
    test("should navigate between events using prev/next buttons", async ({ page }) => {
      // Navigate to an event page
      await page.goto("/events");

      // Click on the second event to ensure we have prev/next navigation
      const eventCards = page.getByTestId("event-card");
      await eventCards.nth(1).locator("a").first().click();

      // Wait for navigation to complete
      await page.waitForLoadState("networkidle");

      // Click previous button (newer event)
      await page.getByTestId("nav-button-prev").first().click();
      await page.waitForLoadState("networkidle");

      // Verify we're on a different event page
      const currentUrl = page.url();
      expect(currentUrl).toContain("/event/");

      // Click next button to go back
      await page.getByTestId("nav-button-next").first().click();
      await page.waitForLoadState("networkidle");

      // Should still be on an event page
      expect(page.url()).toContain("/event/");
    });

    test("should navigate using keyboard arrows on event pages", async ({ page }) => {
      // Navigate to an event page
      await page.goto("/events");
      const eventCards = page.getByTestId("event-card");
      await eventCards.nth(1).locator("a").first().click();
      await page.waitForLoadState("networkidle");

      // Wait for React components to hydrate
      await page.waitForTimeout(2000);

      // Get current URL
      const initialUrl = page.url();

      // Press left arrow key
      await page.keyboard.press("ArrowLeft");
      await page.waitForTimeout(1000);
      await page.waitForLoadState("networkidle");

      // Verify navigation happened
      const urlAfterLeft = page.url();
      expect(urlAfterLeft).not.toBe(initialUrl);
      expect(urlAfterLeft).toContain("/event/");

      // Press right arrow key
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(1000);
      await page.waitForLoadState("networkidle");

      // Should be back to initial page
      expect(page.url()).toBe(initialUrl);
    });

    test("should navigate back to events list", async ({ page }) => {
      // Navigate to an event page
      await page.goto("/events");
      const eventCards = page.getByTestId("event-card");
      await eventCards.first().locator("a").first().click();
      await page.waitForLoadState("networkidle");

      // Verify we're on an event page
      expect(page.url()).toContain("/event/");

      // Check that back button exists and is visible
      const backButton = page.getByTestId("nav-button-back").first();
      await expect(backButton).toBeVisible();

      // Click the back button
      await backButton.click();

      // Wait a bit for navigation
      await page.waitForTimeout(2000);
      await page.waitForLoadState("networkidle");

      // Should be back on events page
      expect(page.url()).toContain("/events");
      await expect(page.locator("h1")).toContainText("Events");
    });
  });

  test.describe("Person Navigation", () => {
    test("should navigate between people using prev/next buttons", async ({ page }) => {
      // Navigate to a person page
      await page.goto("/people");

      // Click on the second person
      const personLinks = page.locator('a[href^="/person/"]').filter({ hasText: /.+/ });
      const secondPersonLink = personLinks.nth(1);
      const secondPersonName = await secondPersonLink.locator("h3").textContent();
      await secondPersonLink.click();

      // Wait for navigation to complete
      await page.waitForLoadState("networkidle");

      // Wait for the person name to be visible and contain the person's name
      await expect(page.getByTestId("person-name")).toBeVisible();
      await expect(page.getByTestId("person-name")).toContainText(secondPersonName || "");

      // Verify navigation buttons exist (use .first() to avoid duplicates)
      await expect(page.getByTestId("nav-button-prev").first()).toBeVisible();
      await expect(page.getByTestId("nav-button-next").first()).toBeVisible();
      await expect(page.getByTestId("nav-button-back").first()).toBeVisible();

      // Click previous button
      await page.getByTestId("nav-button-prev").first().click();

      // Wait for navigation with timeout
      await page.waitForTimeout(2000);
      await page.waitForLoadState("networkidle");

      // Verify we're on a different person page
      const currentUrl = page.url();
      expect(currentUrl).toContain("/person/");

      // Wait for person name to be visible before getting its text
      await expect(page.getByTestId("person-name")).toBeVisible();
      const currentName = await page.getByTestId("person-name").textContent();
      expect(currentName).not.toBe(secondPersonName);

      // Click next button to go back
      await page.getByTestId("nav-button-next").first().click();

      // Wait for navigation with timeout
      await page.waitForTimeout(2000);
      await page.waitForLoadState("networkidle");

      // We should be back to the original person
      await expect(page.getByTestId("person-name")).toBeVisible();
      const finalName = await page.getByTestId("person-name").textContent();
      expect(finalName).toBe(secondPersonName);
    });

    test("should navigate using keyboard arrows on person pages", async ({ page }) => {
      // Navigate to a person page
      await page.goto("/people");
      const personLinks = page.locator('a[href^="/person/"]').filter({ hasText: /.+/ });
      await personLinks.nth(1).click();
      await page.waitForLoadState("networkidle");

      // Wait for React components to hydrate
      await page.waitForTimeout(2000);

      // Ensure nav buttons are visible
      await expect(page.getByTestId("sticky-nav-buttons").first()).toBeVisible();

      // Get current URL
      const initialUrl = page.url();

      // Press left arrow key
      await page.keyboard.press("ArrowLeft");
      await page.waitForTimeout(1000);
      await page.waitForLoadState("networkidle");

      // Verify navigation happened
      const urlAfterLeft = page.url();
      expect(urlAfterLeft).not.toBe(initialUrl);
      expect(urlAfterLeft).toContain("/person/");

      // Press right arrow key
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(1000);
      await page.waitForLoadState("networkidle");

      // Should be back to initial page
      expect(page.url()).toBe(initialUrl);
    });

    test("should navigate back to people list", async ({ page }) => {
      // Navigate to a person page
      await page.goto("/people");
      const personLinks = page.locator('a[href^="/person/"]').filter({ hasText: /.+/ });
      await personLinks.first().click();
      await page.waitForLoadState("networkidle");

      // Verify we're on a person page
      expect(page.url()).toContain("/person/");

      // Check that back button exists and is visible
      const backButton = page.getByTestId("nav-button-back").first();
      await expect(backButton).toBeVisible();

      // Click the back button
      await backButton.click();

      // Wait a bit for navigation
      await page.waitForTimeout(2000);
      await page.waitForLoadState("networkidle");

      // Should be back on people page
      expect(page.url()).toContain("/people");
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("h1")).toContainText("People");
    });
  });
});
