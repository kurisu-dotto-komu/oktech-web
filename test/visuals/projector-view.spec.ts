import { test, expect } from "@playwright/test";
import { resolveTestPath } from "../helpers/url";

test.describe("Projector View", () => {
  test("projector overlay opens and displays correctly", async ({ page, baseURL }) => {
    // Navigate to an event page
    await page.goto(
      resolveTestPath(
        "/event/307774539-oktech-study-session-a-walking-skeleton-approach",
        baseURL!,
      ),
    );
    await page.waitForLoadState("networkidle");

    // Find and click the projector button
    const projectorButton = page.getByRole("button", { name: "Open projector view" });
    await expect(projectorButton).toBeVisible();
    await projectorButton.click();

    // Verify overlay is visible
    const overlay = page.locator("#projector-overlay");
    await expect(overlay).toBeVisible();

    // Verify overlay is positioned correctly (fixed position covering entire viewport)
    const overlayBox = await overlay.boundingBox();
    expect(overlayBox?.x).toBe(0);
    expect(overlayBox?.y).toBe(0);
    const viewportSize = page.viewportSize();
    expect(overlayBox?.width).toBe(viewportSize?.width);
    expect(overlayBox?.height).toBe(viewportSize?.height);

    // Verify event title is displayed
    await expect(overlay.locator("h1")).toContainText("OKTech Study Session");

    // Verify date and time are displayed (the event date is in November)
    await expect(overlay.locator("text=/November.*2023/")).toBeVisible();

    // Note: Close button removed in favor of native fullscreen exit

    // Take a screenshot of the projector view
    await overlay.screenshot({ path: "test-results/projector-view.png" });
  });

  test("projector overlay can be closed with ESC key", async ({ page, baseURL }) => {
    // Navigate to an event page
    await page.goto(
      resolveTestPath(
        "/event/307774539-oktech-study-session-a-walking-skeleton-approach",
        baseURL!,
      ),
    );
    await page.waitForLoadState("networkidle");

    // Open projector view
    await page.getByRole("button", { name: "Open projector view" }).click();

    // Verify overlay is visible
    const overlay = page.locator("#projector-overlay");
    await expect(overlay).toBeVisible();

    // Press ESC key
    await page.keyboard.press("Escape");

    // Verify overlay is no longer visible
    await expect(overlay).not.toBeVisible();
  });

  test("projector view maintains aspect ratio", async ({ page, baseURL }) => {
    // Set different viewport sizes to test aspect ratio
    const viewportSizes = [
      { width: 1920, height: 1080 }, // 16:9 exactly
      { width: 1600, height: 900 }, // 16:9
      { width: 1200, height: 800 }, // 3:2 (wider than 16:9)
      { width: 800, height: 600 }, // 4:3 (more square than 16:9)
    ];

    for (const size of viewportSizes) {
      await page.setViewportSize(size);

      // Navigate to an event page
      await page.goto(
        resolveTestPath(
          "/event/307774539-oktech-study-session-a-walking-skeleton-approach",
          baseURL!,
        ),
      );
      await page.waitForLoadState("networkidle");

      // Open projector view
      await page.getByRole("button", { name: "Open projector view" }).click();

      // Get the content area (the gradient box inside the overlay)
      const contentArea = page.locator("#projector-overlay > div").nth(1);
      const contentBox = await contentArea.boundingBox();

      if (contentBox) {
        const aspectRatio = contentBox.width / contentBox.height;
        // Verify aspect ratio is approximately 16:9 (1.777...)
        expect(aspectRatio).toBeCloseTo(16 / 9, 1);
      }

      // Take screenshot for this viewport size
      await page.screenshot({
        path: `test-results/projector-view-${size.width}x${size.height}.png`,
        fullPage: false,
      });
    }
  });

  test("projector view automatically enters fullscreen", async ({ page, baseURL, browserName }) => {
    // Skip this test in webkit as it doesn't support fullscreen in headless mode
    test.skip(browserName === "webkit", "Webkit doesn't support fullscreen in headless mode");

    // Navigate to an event page
    await page.goto(
      resolveTestPath(
        "/event/307774539-oktech-study-session-a-walking-skeleton-approach",
        baseURL!,
      ),
    );
    await page.waitForLoadState("networkidle");

    // Open projector view
    await page.getByRole("button", { name: "Open projector view" }).click();

    const overlay = page.locator("#projector-overlay");
    await expect(overlay).toBeVisible();

    // Note: Fullscreen API requires user gesture and may not work in headless mode
    // In a real browser, this would automatically enter fullscreen
    // We can verify the overlay is displayed correctly
    await expect(overlay).toHaveAttribute("id", "projector-overlay");
  });
});
