import { test, expect } from "@playwright/test";

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "widescreen", width: 1920, height: 1080 },
];

test.describe("Banner alignment across viewports", () => {
  viewports.forEach((viewport) => {
    test(`Banner aligns with navbar on ${viewport.name}`, async ({ page, baseURL }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(baseURL!);

      // Wait for page to load
      await page.waitForLoadState("networkidle");
      await expect(page.locator(".navbar").first()).toBeVisible();
      await expect(page.locator(".bg-error")).toBeVisible();

      // Take screenshot
      await page.screenshot({
        path: `test/screenshots/banner-alignment-${viewport.name}.png`,
        fullPage: false,
      });

      // Get navbar container bounds
      const navbarContainer = await page.locator(".navbar .max-w-6xl").first().boundingBox();

      // Get banner container bounds
      const bannerContainer = await page.locator(".bg-error .max-w-6xl").first().boundingBox();

      if (navbarContainer && bannerContainer) {
        // Check that left edges align
        expect(Math.abs(navbarContainer.x - bannerContainer.x)).toBeLessThanOrEqual(1);

        // Check that widths are the same
        expect(Math.abs(navbarContainer.width - bannerContainer.width)).toBeLessThanOrEqual(1);
      }
    });
  });
});
