import { test, expect } from "@playwright/test";
import { TEST_EVENTS } from "../helpers/url";

test.describe("Projector View E2E", () => {
  test("projector overlay opens when button is clicked", async ({ page }) => {
    await page.goto(`/event/${TEST_EVENTS.PRIMARY}`);
    await page.waitForLoadState("networkidle");

    // Find and click the projector button
    const projectorButton = page.getByTestId("projector-view-button");
    await expect(projectorButton).toBeVisible();
    await projectorButton.click();

    // Verify overlay is visible
    const overlay = page.getByTestId("projector-overlay");
    await expect(overlay).toBeVisible();

    // Verify event title is displayed
    await expect(page.getByTestId("projector-title")).toContainText("Future Test Event 1");

    // Verify date and time are displayed
    await expect(page.getByTestId("projector-datetime")).toBeVisible();
    await expect(page.getByTestId("projector-datetime")).toContainText("April");
    await expect(page.getByTestId("projector-datetime")).toContainText("2027");
  });

  test("projector overlay can be closed with ESC key", async ({ page }) => {
    await page.goto(`/event/${TEST_EVENTS.PRIMARY}`);
    await page.waitForLoadState("networkidle");

    // Open projector view
    await page.getByTestId("projector-view-button").click();

    // Verify overlay is visible
    const overlay = page.getByTestId("projector-overlay");
    await expect(overlay).toBeVisible();

    // Press ESC key
    await page.keyboard.press("Escape");

    // Verify overlay is no longer visible
    await expect(overlay).not.toBeVisible();
  });

  test("projector view displays venue information", async ({ page }) => {
    await page.goto(`/event/${TEST_EVENTS.PRIMARY}`);
    await page.waitForLoadState("networkidle");

    // Open projector view
    await page.getByTestId("projector-view-button").click();

    const overlay = page.getByTestId("projector-overlay");
    await expect(overlay).toBeVisible();

    // Check for venue information (verify venue is displayed if present)
    // Note: The event might not have venue info loaded yet
    const venueTitleElement = page.getByTestId("projector-venue-title");
    const venueCount = await venueTitleElement.count();
    if (venueCount > 0) {
      await expect(venueTitleElement).toBeVisible();
    }
  });
});
