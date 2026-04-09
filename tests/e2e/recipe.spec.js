import { test, expect } from "@playwright/test";

test("renders recipe details and ingredients", async ({ page }) => {
  await page.goto("https://kunskapskontroll2.vercel.app/recipes.html");

  // Vänta på att rubriken dyker upp
  const recipeTitle = page.locator("#recipe-name");
  await expect(recipeTitle).toBeVisible({ timeout: 10000 });
  await expect(recipeTitle).not.toBeEmpty();

  // Kolla att det finns minst en ingrediens i listan
  // Vi använder .count() för att få siffran och kollar att den är över 0
  const count = await page.locator("#ingredient-list li").count();
  expect(count).toBeGreaterThan(0);
});