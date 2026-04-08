import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('shows the search-form on index.html. Allows and renders adding and removing of ingredients', async ({
  page,
}) => {
  await page.goto('/index.html');

  const ingredientInput = page.locator('#ingredient-input');
  const addButton = page.locator("#search-form button[type='submit']");
  const selectedIngredientsContainer = page.locator('#ingredient-list');

  await ingredientInput.fill('mjölk');

  // make sure the query is validated against the "autosuggestions" and that "mjölk" is a valid ingredient in the database before adding.
  await expect(page.locator('#ingredient-suggestions option')).toHaveCount(1);
  await addButton.click();

  const milk = selectedIngredientsContainer.locator('.ingredient-item', {
    hasText: 'Mjölk',
  });

  const selectedIngredients = selectedIngredientsContainer.locator('.ingredient-item');

  await expect(milk).toBeVisible();
  await expect(selectedIngredients).toHaveCount(1);

  await milk.locator('button').click();

  await expect(selectedIngredients).toHaveCount(0);
});