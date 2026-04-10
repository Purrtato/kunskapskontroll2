// tests/product-detail.e2e.js
// End-to-end tests using Playwright
// Run with: npm run test:e2e

import { test, expect } from "@playwright/test";

const BASE_URL = "https://kunskapskontroll2.vercel.app";

test.describe("Product detail page", () => {
  test("shows error state when no id is provided", async ({ page }) => {
    await page.goto(`${BASE_URL}/product-detail.html`);

    const errorState = page.locator("#errorState");
    await expect(errorState).toBeVisible({ timeout: 5000 });

    const backLink = errorState.locator('a[href="promotions.html"]');
    await expect(backLink).toBeVisible();
  });

  test("shows error state for a non-existent product id", async ({ page }) => {
    await page.goto(`${BASE_URL}/product-detail.html?id=999999`);

    const errorState = page.locator("#errorState");
    await expect(errorState).toBeVisible({ timeout: 5000 });
  });

  test("shows product content for a valid id", async ({ page }) => {
    await page.goto(`${BASE_URL}/product-detail.html?id=61`);

    const productContent = page.locator("#productContent");
    await expect(productContent).toBeVisible({ timeout: 5000 });

    await expect(page.locator("#productName")).toHaveText("mjölk");
    await expect(page.locator("#storeName")).toHaveText("ica");
    await expect(page.locator("#productPrice")).toHaveText("12 kr");
  });

  test("navigates back to promotions page when back link is clicked", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/product-detail.html?id=61`);

    const backLink = page.locator(".back-link");
    await expect(backLink).toBeVisible({ timeout: 5000 });
    await backLink.click();

    await expect(page).toHaveURL(/promotions\.html/);
  });

  test("navbar links are present and correct", async ({ page }) => {
    await page.goto(`${BASE_URL}/product-detail.html?id=61`);

    await expect(page.locator(".navbar-brand")).toHaveText("SmartMat");
    await expect(page.locator('a.nav-link[href="index.html"]')).toBeVisible();
    await expect(page.locator('a.nav-link[href="recipes.html"]')).toBeVisible();
    await expect(
      page.locator('a.nav-link[href="promotions.html"]'),
    ).toBeVisible();
  });
});
