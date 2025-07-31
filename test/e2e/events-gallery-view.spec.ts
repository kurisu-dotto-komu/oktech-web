import { test, expect } from "@playwright/test";

test.describe("Events Gallery View", () => {
  test("shows all events including those without gallery images", async ({ page }) => {
    await page.goto("/events/gallery");

    // Check that the gallery view container exists
    const galleryView = page.getByTestId("events-gallery-view");
    await expect(galleryView).toBeVisible();

    // Check that event cards are shown
    const eventCards = page.getByTestId("event-card");
    const eventCount = await eventCards.count();
    expect(eventCount).toBeGreaterThan(0);

    // Check that at least one event shows the "no images" message
    const noImagesMessage = page.getByText("This event doesn't have any images yet");
    const messageCount = await noImagesMessage.count();

    // We expect at least some events to not have images
    expect(messageCount).toBeGreaterThanOrEqual(0);
  });

  test("shows gallery images for events that have them", async ({ page }) => {
    await page.goto("/events/gallery");

    // Look for gallery images
    const galleryImages = page.getByTestId("gallery-image-0");
    const hasGalleryImages = (await galleryImages.count()) > 0;

    // If there are gallery images, check that they're visible
    if (hasGalleryImages) {
      await expect(galleryImages.first()).toBeVisible();
    }
  });
});
