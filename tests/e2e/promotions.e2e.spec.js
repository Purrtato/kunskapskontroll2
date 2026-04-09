import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/promotions.html");
});

test("renders promotions and applies filters", async ({ page }) => {

  const promotionCards = page.locator("#promotion-container .card");
  await expect(promotionCards).toHaveCount(16);
  const initialTitles = await page
    .locator("#promotion-container .card-title")
    .allTextContents();
  expect(initialTitles).toEqual(
    expect.arrayContaining(["tomat", "broccoli", "laxfilé", "mjölk"]),
  );

  await page.selectOption("#categoryFilter", "1");
  await expect(promotionCards).toHaveCount(3);
  const filteredTitles = await page
    .locator("#promotion-container .card-title")
    .allTextContents();
  expect(filteredTitles).toEqual(
    expect.arrayContaining(["naturell yoghurt", "ost", "mjölk"]),
  );
});
