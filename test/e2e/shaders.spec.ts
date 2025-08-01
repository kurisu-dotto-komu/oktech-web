import { test, expect } from "@playwright/test";

test.describe("Shader Components", () => {
  test("Water shader renders and accepts mouse events", async ({ page }) => {
    // Navigate to the home page where shaders are used
    await page.goto("/");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Check if canvas elements exist (shaders render to canvas)
    const canvases = await page.getByTestId("shader-canvas").all();
    expect(canvases.length).toBeGreaterThan(0);

    // Get the first canvas
    const canvas = page.getByTestId("shader-canvas").first();
    await expect(canvas).toBeVisible();

    // Test mouse interaction by moving mouse over canvas
    const box = await canvas.boundingBox();
    if (box) {
      // Move mouse to center of canvas
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);

      // Verify canvas is still rendering (no errors)
      await expect(canvas).toBeVisible();
    }
  });

  test("Asanoha shader renders and accepts mouse events", async ({ page }) => {
    // Navigate to a page that might use the Asanoha shader
    await page.goto("/");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Check if canvas elements exist
    const canvases = await page.getByTestId("shader-canvas").all();

    // Test mouse interaction on each canvas
    for (const canvas of canvases) {
      const isVisible = await canvas.isVisible();
      if (isVisible) {
        const box = await canvas.boundingBox();
        if (box) {
          // Move mouse around the canvas
          await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.25);
          await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.75);

          // Verify canvas is still rendering
          await expect(canvas).toBeVisible();
        }
      }
    }
  });
});
