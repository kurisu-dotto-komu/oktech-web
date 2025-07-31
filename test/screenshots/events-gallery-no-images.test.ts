import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../helpers/screenshot";
import { VIEWPORTS } from "../helpers/viewports";

test.describe("Events Gallery - No Images Message", () => {
  VIEWPORTS.forEach((viewport) => {
    test(`shows no images message correctly at ${viewport.label}`, async ({ page }) => {
      await page.setViewportSize(viewport.size);
      await page.goto("/events/gallery");

      // Wait for the page to load
      await page.waitForLoadState("networkidle");

      // Check that at least one "no images" message is visible
      const noImagesMessage = page.getByText("This event doesn't have any images yet").first();
      await expect(noImagesMessage).toBeVisible();

      // Take screenshot of an event without images
      const eventWithoutImages = page
        .locator('[data-testid="event-card"]')
        .filter({
          has: page.getByText("This event doesn't have any images yet"),
        })
        .first();

      await takeScreenshot(page, `events-gallery-no-images-${viewport.label}`, {
        clip: await eventWithoutImages.boundingBox(),
      });
    });
  });
});
