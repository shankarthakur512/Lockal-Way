import { test, expect } from "@playwright/test";
import { backendHealthUrl, createBrowserIssueTracker, uniqueTestUser } from "./helpers.js";

test.describe("auth flow", () => {
  test("can sign up, land on profile, and log out", async ({ page, request }) => {
    const tracker = createBrowserIssueTracker(page);
    const user = uniqueTestUser("signup");

    const health = await request.get(`${backendHealthUrl()}/healthz`);
    expect(health.ok(), "backend healthz should be available").toBeTruthy();

    await page.goto("/signup");
    await expect(page.getByTestId("auth-page")).toBeVisible();

    await page.getByTestId("auth-fullname").fill(user.fullname);
    await page.getByTestId("auth-username").fill(user.username);
    await page.getByTestId("auth-email").fill(user.email);
    await page.getByTestId("auth-password").fill(user.password);
    await page.getByTestId("auth-confirm-password").fill(user.password);
    await page.getByTestId("auth-submit").click();

    await expect(page).toHaveURL(/\/profile$/);
    await expect(page.getByTestId("navbar-account-toggle")).toBeVisible();

    await page.getByTestId("navbar-account-toggle").click();
    await page.getByTestId("navbar-logout").click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByTestId("auth-page")).toBeVisible();
    await expect(page.getByTestId("auth-login-toggle")).toBeVisible();

    await tracker.expectClean();
  });

  test("can log in with an existing local user and land on profile", async ({ page, request }) => {
    const tracker = createBrowserIssueTracker(page);
    const user = uniqueTestUser("login");

    const health = await request.get(`${backendHealthUrl()}/healthz`);
    expect(health.ok(), "backend healthz should be available").toBeTruthy();

    await page.goto("/signup");
    await page.getByTestId("auth-fullname").fill(user.fullname);
    await page.getByTestId("auth-username").fill(user.username);
    await page.getByTestId("auth-email").fill(user.email);
    await page.getByTestId("auth-password").fill(user.password);
    await page.getByTestId("auth-confirm-password").fill(user.password);
    await page.getByTestId("auth-submit").click();
    await expect(page).toHaveURL(/\/profile$/);

    await page.getByTestId("navbar-account-toggle").click();
    await page.getByTestId("navbar-logout").click();
    await expect(page).toHaveURL(/\/login$/);

    await page.goto("/login");
    await expect(page.getByTestId("auth-page")).toBeVisible();

    await page.getByTestId("auth-email").fill(user.email);
    await page.getByTestId("auth-password").fill(user.password);
    await page.getByTestId("auth-submit").click();

    await expect(page).toHaveURL(/\/profile$/);
    await expect(page.getByTestId("navbar-account-toggle")).toBeVisible();

    await tracker.expectClean();
  });
});
