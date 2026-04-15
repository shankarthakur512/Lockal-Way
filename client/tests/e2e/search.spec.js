import { test, expect } from "@playwright/test";
import { createBrowserIssueTracker } from "./helpers.js";

const guideFixture = {
  _id: "guide-1",
  picture: "",
  city: "Jaipur",
  country: "India",
  languages: ["English", "Hindi"],
  rating: 5,
  aboutYourself: "Local walks and city stories.",
  userInfo: {
    fullname: "Anaya Sharma",
  },
};

const tripFixture = {
  _id: "trip-1",
  tripName: "Golden City Walk",
  location: "Jaipur",
  type: "Cultural",
  duration: 4,
  price: 240,
  status: "Upcoming",
  photos: ["/vite.svg"],
  startingDate: new Date().toISOString(),
  itinerary: "Arrival and check-in, Heritage walk, Local food trail, Sunset viewpoint",
  policy: "Flexible cancellation up to 24 hours before departure.",
  bookedByUsers: [],
  hotel: {
    name: "The Pink Courtyard",
    rating: 4,
  },
  userDetails: {
    fullName: "Ravi Sharma",
  },
  guideDetails: {
    city: "Jaipur",
    country: "India",
    picture: "",
    aboutYourself: "Local host and experience curator.",
  },
};

test("home search opens search results and allows drilling into guide and trip details", async ({ page }) => {
  const tracker = createBrowserIssueTracker(page);

  await page.route("**/api/v1/Trips/find-trips", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ trips: [tripFixture] }),
    });
  });

  await page.route("**/api/v1/Guide/find-guideByCity", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ guides: [guideFixture] }),
    });
  });

  await page.route("**/api/v1/Guide/find-guide/guide-1", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ guide: { ...guideFixture, dailyRate: 120, userDetails: { fullname: "Anaya Sharma" } } }),
    });
  });

  await page.route("**/api/v1/Trips/find-trip/trip-1", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ trips: [tripFixture] }),
    });
  });

  await page.goto("/");
  await page.getByTestId("home-destination").fill("Jaipur");
  await page.getByTestId("home-search-submit").click();

  await expect(page).toHaveURL(/\/search$/);
  await expect(page.getByTestId("search-page")).toBeVisible();
  await expect(page.getByTestId("search-guide-card")).toBeVisible();
  await expect(page.getByTestId("search-trip-card")).toBeVisible();

  await page.getByTestId("search-guide-card").click();
  await expect(page).toHaveURL(/\/search\/guide-1$/);
  await expect(page.getByRole("heading", { name: "Anaya Sharma", level: 2 })).toBeVisible();

  await page.goto("/");
  await page.getByTestId("home-destination").fill("Jaipur");
  await page.getByTestId("home-search-submit").click();
  await expect(page).toHaveURL(/\/search$/);
  await page.getByTestId("search-trip-card").click();
  await expect(page).toHaveURL(/\/search\/tour\/trip-1$/);
  await expect(page.getByRole("heading", { name: "Golden City Walk" })).toBeVisible();

  await tracker.expectClean();
});
