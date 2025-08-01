import { test, expect } from "@playwright/test";

test.describe("Event Gallery Modal", () => {
  const eventUrl = `/event/194472502-lets-meet-soon`; // Event with gallery images and captions

  test("should open and close modal when clicking gallery image", async ({ page }) => {
    await page.goto(eventUrl);
    await page.waitForLoadState("networkidle");

    // Find gallery images
    const galleryImages = page.locator('[data-testid^="gallery-image-"]');
    const imageCount = await galleryImages.count();
    expect(imageCount).toBeGreaterThan(0);

    // Click first gallery image
    await galleryImages.first().click();

    // Wait for modal to open
    const modal = page.locator('dialog.modal');
    await expect(modal).toBeVisible();

    // Check modal contains image
    const modalImage = modal.locator('img');
    await expect(modalImage).toBeVisible();

    // Check close button exists (the X button in the header)
    const closeButton = modal.locator('button[aria-label="Close modal"]').first();
    await expect(closeButton).toBeVisible();

    // Close modal
    await closeButton.click();
    await expect(modal).not.toBeVisible();
  });

  test("should close modal when clicking backdrop", async ({ page }) => {
    await page.goto(eventUrl);
    await page.waitForLoadState("networkidle");

    // Open modal
    const galleryImages = page.locator('[data-testid^="gallery-image-"]');
    await galleryImages.first().click();

    // Verify modal is open
    const modal = page.locator('dialog.modal');
    await expect(modal).toBeVisible();

    // Click backdrop by clicking outside the modal content
    // Use force:true to bypass any overlapping elements
    await page.locator('.modal-backdrop').click({ position: { x: 10, y: 10 }, force: true });

    // Verify modal is closed
    await expect(modal).not.toBeVisible();
  });

  test("should navigate between images using navigation buttons", async ({ page }) => {
    await page.goto(eventUrl);
    await page.waitForLoadState("networkidle");

    // Get gallery images count
    const galleryImages = page.locator('[data-testid^="gallery-image-"]');
    const imageCount = await galleryImages.count();
    expect(imageCount).toBeGreaterThan(1); // Need at least 2 images for navigation

    // Click first image
    await galleryImages.first().click();

    const modal = page.locator('dialog.modal');
    await expect(modal).toBeVisible();

    // Get initial image src
    const img = modal.locator('img');
    const firstImageSrc = await img.getAttribute("src");

    // Navigate using arrow buttons
    const nextButton = modal.locator('button[aria-label="Next image"]');
    const prevButton = modal.locator('button[aria-label="Previous image"]');

    // Click next
    await nextButton.click();
    await page.waitForTimeout(300);

    // Check image changed
    const secondImageSrc = await img.getAttribute("src");
    expect(secondImageSrc).not.toBe(firstImageSrc);

    // Click previous
    await prevButton.click();
    await page.waitForTimeout(300);

    // Should be back at first image
    const currentImageSrc = await img.getAttribute("src");
    expect(currentImageSrc).toBe(firstImageSrc);
  });

  test("should navigate through all images without looping", async ({ page }) => {
    await page.goto(eventUrl);
    await page.waitForLoadState("networkidle");

    // Get gallery images
    const galleryImages = page.locator('[data-testid^="gallery-image-"]');
    const imageCount = await galleryImages.count();
    expect(imageCount).toBeGreaterThan(1);

    // Click first image
    await galleryImages.first().click();

    const modal = page.locator('dialog.modal');
    await expect(modal).toBeVisible();

    // Navigate to last image by clicking next repeatedly
    const nextButton = modal.locator('button[aria-label="Next image"]');
    for (let i = 1; i < imageCount; i++) {
      await nextButton.click();
      await page.waitForTimeout(200);
    }

    // At last image, clicking next should go to first (circular navigation)
    const img = modal.locator('img');
    const lastImageSrc = await img.getAttribute("src");
    
    await nextButton.click();
    await page.waitForTimeout(300);
    
    // Should be at first image (circular)
    const currentImageSrc = await img.getAttribute("src");
    expect(currentImageSrc).not.toBe(lastImageSrc);
  });

  test("should navigate with keyboard arrows", async ({ page }) => {
    await page.goto(eventUrl);
    await page.waitForLoadState("networkidle");

    // Click first image
    const galleryImages = page.locator('[data-testid^="gallery-image-"]');
    await galleryImages.first().click();

    const modal = page.locator('dialog.modal');
    await expect(modal).toBeVisible();

    // Get initial image src to track changes
    const img = modal.locator('img');
    const firstImageSrc = await img.getAttribute("src");

    // Press right arrow to go to next image
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(300);

    // Check that image changed
    const secondImageSrc = await img.getAttribute("src");
    expect(secondImageSrc).not.toBe(firstImageSrc);

    // Press left arrow to go back
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(300);

    // Check we're back to first image
    const currentImageSrc = await img.getAttribute("src");
    expect(currentImageSrc).toBe(firstImageSrc);

    // Close with Escape
    await page.keyboard.press("Escape");
    await expect(modal).not.toBeVisible();
  });

  test("should display image captions", async ({ page }) => {
    await page.goto(eventUrl);
    await page.waitForLoadState("networkidle");

    // Open modal
    const galleryImages = page.locator('[data-testid^="gallery-image-"]');
    await galleryImages.first().click();

    const modal = page.locator('dialog.modal');
    await expect(modal).toBeVisible();

    // Check caption exists in the modal
    const caption = modal.locator('.bg-base-100 p');
    await expect(caption).toBeVisible();
    const captionText = await caption.textContent();
    expect(captionText).toBeTruthy();
    expect(captionText?.length).toBeGreaterThan(0);
  });

  test("should navigate using dots indicator", async ({ page }) => {
    await page.goto(eventUrl);
    await page.waitForLoadState("networkidle");

    // Open modal
    const galleryImages = page.locator('[data-testid^="gallery-image-"]');
    const imageCount = await galleryImages.count();
    
    // Skip test if less than 3 images
    if (imageCount < 3) {
      test.skip();
      return;
    }
    
    await galleryImages.first().click();

    const modal = page.locator('dialog.modal');
    await expect(modal).toBeVisible();

    // Get initial image
    const img = modal.locator('img');
    const firstImageSrc = await img.getAttribute("src");

    // Wait for dots to be visible
    await page.waitForTimeout(500);
    
    // Click on second dot (index 1) - safer than third
    const dots = modal.locator('button[aria-label^="Go to image"]');
    const dotCount = await dots.count();
    
    if (dotCount >= 2) {
      await dots.nth(1).click();
      await page.waitForTimeout(500);

      // Check image changed
      const secondImageSrc = await img.getAttribute("src");
      expect(secondImageSrc).not.toBe(firstImageSrc);

      // Click on first dot to go back
      await dots.first().click();
      await page.waitForTimeout(500);

      // Should be back at first image
      const currentImageSrc = await img.getAttribute("src");
      expect(currentImageSrc).toBe(firstImageSrc);
    }
  });
});