import { test, expect } from "@playwright/test";

test.describe("Event Gallery Modal", () => {
  const eventUrl = "/event/194472502-lets-meet-soon"; // Event with gallery captions

  test("should open modal when clicking on gallery image", async ({ page }) => {
    // Navigate to an event page with gallery images
    await page.goto(eventUrl);

    // Wait for gallery section to load by waiting for gallery images
    await page.waitForSelector('button[aria-label*="View larger image"]', { state: "visible" });

    // Get first gallery image button
    const firstImageButton = page.locator('button[aria-label*="View larger image"]').first();
    await expect(firstImageButton).toBeVisible();

    // Click on the first image
    await firstImageButton.click();

    // Wait for modal to appear with longer timeout
    await page.waitForSelector("dialog", { state: "visible", timeout: 10000 });

    // Check that modal is open with fade animation
    const modal = page.locator("dialog");
    await expect(modal).toBeVisible();
    await expect(modal).toHaveClass(/modal/);

    // Check that full-size image is displayed
    const fullSizeImage = modal.locator("img");
    await expect(fullSizeImage).toBeVisible();

    // Check that the image src contains the full-size pattern
    const imgSrc = await fullSizeImage.getAttribute("src");
    expect(imgSrc).toContain("w=1024");

    // Check navigation buttons are visible
    const nextButton = modal.locator('button[aria-label="Next image"]');
    const prevButton = modal.locator('button[aria-label="Previous image"]');
    await expect(nextButton).toBeVisible();
    // First image shouldn't have previous button
    await expect(prevButton).not.toBeVisible();

    // Check close button is visible
    const closeButton = modal.locator('button[aria-label="Close modal"]');
    await expect(closeButton).toBeVisible();

    // Click close button
    await closeButton.click();

    // Check that modal is closed
    await expect(modal).not.toBeVisible();
  });

  test("should close modal when clicking backdrop", async ({ page }) => {
    await page.goto(eventUrl);

    // Wait for gallery and click first image
    await page.waitForSelector('button[aria-label*="View larger image"]', { state: "visible" });
    const firstImageButton = page.locator('button[aria-label*="View larger image"]').first();
    await firstImageButton.click();

    // Check modal is open
    await page.waitForSelector("dialog", { state: "visible" });
    const modal = page.locator("dialog");
    await expect(modal).toBeVisible();

    // Click backdrop
    const backdrop = page.locator(".modal-backdrop button");
    await backdrop.click();

    // Check modal is closed
    await expect(modal).not.toBeVisible();
  });

  test("should display alt text in modal when available", async ({ page }) => {
    await page.goto(eventUrl);

    await page.waitForSelector('button[aria-label*="View larger image"]', { state: "visible" });
    const firstImageButton = page.locator('button[aria-label*="View larger image"]').first();
    await firstImageButton.click();

    // Check if figcaption exists (it should only show if alt text is present)
    const figcaption = page.locator("dialog figcaption");
    const captionCount = await figcaption.count();

    if (captionCount > 0) {
      await expect(figcaption).toBeVisible();
      const captionText = await figcaption.textContent();
      expect(captionText).toBeTruthy();
    }
  });

  test("should navigate between images with buttons", async ({ page }) => {
    await page.goto(eventUrl);

    await page.waitForSelector('button[aria-label*="View larger image"]', { state: "visible" });

    // Click first image
    const firstImageButton = page.locator('[data-testid="gallery-image-0"]');
    await firstImageButton.click();

    await page.waitForSelector("dialog", { state: "visible" });
    const modal = page.locator("dialog");
    await expect(modal).toBeVisible();

    // Get initial image src
    const img = modal.locator("img");
    const firstImageSrc = await img.getAttribute("src");

    // Click next button
    const nextButton = modal.locator('button[aria-label="Next image"]');
    await nextButton.click();

    // Wait for image to change
    await page.waitForTimeout(100);

    // Check that image changed
    const secondImageSrc = await img.getAttribute("src");
    expect(secondImageSrc).not.toBe(firstImageSrc);

    // Check previous button is now visible
    const prevButton = modal.locator('button[aria-label="Previous image"]');
    await expect(prevButton).toBeVisible();

    // Click previous to go back
    await prevButton.click();
    await page.waitForTimeout(100);

    // Check we're back to first image
    const currentImageSrc = await img.getAttribute("src");
    expect(currentImageSrc).toBe(firstImageSrc);
  });

  test("should navigate with keyboard arrows", async ({ page }) => {
    await page.goto(eventUrl);

    await page.waitForSelector('button[aria-label*="View larger image"]', { state: "visible" });

    // Click first image
    const firstImageButton = page.locator('[data-testid="gallery-image-0"]');
    await firstImageButton.click();

    await page.waitForSelector("dialog", { state: "visible" });
    const modal = page.locator("dialog");
    await expect(modal).toBeVisible();

    // Get initial image src
    const img = modal.locator("img");
    const firstImageSrc = await img.getAttribute("src");

    // Press right arrow
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(100);

    // Check that image changed
    const secondImageSrc = await img.getAttribute("src");
    expect(secondImageSrc).not.toBe(firstImageSrc);

    // Press left arrow
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(100);

    // Check we're back to first image
    const currentImageSrc = await img.getAttribute("src");
    expect(currentImageSrc).toBe(firstImageSrc);

    // Close with Escape
    await page.keyboard.press("Escape");
    await expect(modal).not.toBeVisible();
  });

  test("should not interfere with sticky nav keyboard navigation", async ({ page }) => {
    await page.goto(eventUrl);

    // Scroll down to make sticky nav visible
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Open gallery modal
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForSelector('button[aria-label*="View larger image"]', { state: "visible" });
    const firstImageButton = page.locator('[data-testid="gallery-image-0"]');
    await firstImageButton.click();

    await page.waitForSelector("dialog", { state: "visible" });
    const modal = page.locator("dialog");
    await expect(modal).toBeVisible();

    // Check that pressing arrow keys navigates gallery, not events
    const initialUrl = page.url();
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(100);

    // URL should not change (sticky nav not triggered)
    expect(page.url()).toBe(initialUrl);

    // Close modal
    await page.keyboard.press("Escape");
    await expect(modal).not.toBeVisible();

    // Now arrow keys should work for sticky nav again (if visible)
    // This would navigate to next/prev event if sticky nav is active
  });
});
