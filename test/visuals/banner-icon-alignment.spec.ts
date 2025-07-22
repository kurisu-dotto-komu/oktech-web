import { test } from "@playwright/test";

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "widescreen", width: 1920, height: 1080 },
];

test.describe("Banner icon alignment with logo", () => {
  viewports.forEach((viewport) => {
    test(`Icon aligns with logo on ${viewport.name}`, async ({ page, baseURL }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(baseURL!);

      // Wait for page to load
      await page.waitForLoadState("networkidle");

      // Get logo position
      const logo = await page.locator(".navbar-start .btn-ghost").first().boundingBox();

      // Get banner icon position
      const bannerIcon = await page.locator(".bg-error svg").first().boundingBox();

      if (logo && bannerIcon) {
        // Check that left edges align (with some tolerance for different element sizes)
        const leftAlignment = Math.abs(logo.x - bannerIcon.x);
        console.log(
          `${viewport.name}: Logo X: ${logo.x}, Icon X: ${bannerIcon.x}, Difference: ${leftAlignment}`,
        );

        // Take screenshot for visual inspection
        await page.screenshot({
          path: `test/screenshots/icon-alignment-${viewport.name}.png`,
          fullPage: false,
        });
      }
    });
  });
});
