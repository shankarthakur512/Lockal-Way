import { test, expect } from "@playwright/test";
import { createBrowserIssueTracker } from "./helpers.js";

test("home page renders and search CTA is available", async ({ page }) => {
  const tracker = createBrowserIssueTracker(page);

  await page.goto("/");

  await expect(page.getByTestId("home-hero")).toBeVisible();
  await expect(page.getByTestId("home-destination")).toBeVisible();
  await expect(page.getByTestId("home-search-submit")).toBeVisible();
  await expect(page.getByTestId("navbar-logo")).toBeVisible();

  await tracker.expectClean();
});
