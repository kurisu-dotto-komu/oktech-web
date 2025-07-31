import { test, expect } from "@playwright/test";

test.describe("Add to Calendar functionality", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to events page and click on the first event
    await page.goto("/events");
    await page.waitForLoadState("networkidle");

    // Click on the first event card
    const eventCard = page.getByTestId("event-card").first();
    await eventCard.locator("a").first().click();
    await page.waitForLoadState("networkidle");
  });

  test("should display Add to Calendar dropdown", async ({ page }) => {
    // Check for Add to Calendar dropdown buttons (mobile and desktop)
    const addToCalendarButtons = page.getByTestId("add-to-calendar-dropdown");
    await expect(addToCalendarButtons).toHaveCount(2); // One for mobile, one for desktop

    // At least one should be visible depending on viewport
    const visibleCount = await addToCalendarButtons.evaluateAll(
      (elements) => elements.filter((el) => window.getComputedStyle(el).display !== "none").length,
    );
    expect(visibleCount).toBeGreaterThan(0);

    // Verify button text on first dropdown
    await expect(addToCalendarButtons.first()).toContainText("Add to Calendar");
  });

  test("should open dropdown menu when clicked", async ({ page }) => {
    // Use the last dropdown (desktop view)
    const dropdown = page.getByTestId("add-to-calendar-dropdown").last();
    await dropdown.click();

    // Wait a bit for the dropdown animation
    await page.waitForTimeout(500);

    // Check all calendar options are visible (use .first() to avoid strict mode violations)
    await expect(page.getByTestId("calendar-ical").first()).toBeVisible();
    await expect(page.getByTestId("calendar-google").first()).toBeVisible();
    await expect(page.getByTestId("calendar-yahoo").first()).toBeVisible();
  });

  test("should close dropdown when clicking outside", async ({ page }) => {
    // Use the last dropdown (desktop view)
    const dropdown = page.getByTestId("add-to-calendar-dropdown").last();
    await dropdown.click();

    // Verify dropdown is open
    await expect(page.getByTestId("calendar-google").first()).toBeVisible();

    // Click outside to close
    await page.locator("body").click({ position: { x: 0, y: 0 } });

    // Verify dropdown is closed
    await expect(page.getByTestId("calendar-google").first()).not.toBeVisible();
  });

  test("should have correct calendar option labels", async ({ page }) => {
    // Use the last dropdown (desktop view)
    const dropdown = page.getByTestId("add-to-calendar-dropdown").last();
    await dropdown.click();

    // Check the text content of each option (use .first() to avoid strict mode violations)
    await expect(page.getByTestId("calendar-ical").first()).toHaveText("iCal / Outlook");
    await expect(page.getByTestId("calendar-google").first()).toHaveText("Google Calendar");
    await expect(page.getByTestId("calendar-yahoo").first()).toHaveText("Yahoo Calendar");
  });

  test("should display in both mobile and desktop views", async ({ page }) => {
    // Desktop view
    await page.setViewportSize({ width: 1280, height: 720 });
    const desktopDropdown = page.getByTestId("add-to-calendar-dropdown").last();
    await expect(desktopDropdown).toBeVisible();

    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileDropdown = page.getByTestId("add-to-calendar-dropdown").first();
    await expect(mobileDropdown).toBeVisible();
  });
});
