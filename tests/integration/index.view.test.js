import { beforeEach, describe, expect, test, vi } from 'vitest';

describe('model → view: renderRecipes', () => {
  beforeEach(() => {
    vi.resetModules();
    document.body.innerHTML = `<div id="recipe-list" class="recipe-cards"></div>`;
  });

  test('renderRecipes shows recipe-cards', async () => {
    const { SearchModel } = await import('../../src/app.model.js');
    const { renderRecipes } = await import('../../src/index.view.js');

    const model = new SearchModel();
    const recipes = [
      {
        id: 1,
        name: 'Köttbullar',
        description: 'En svensk klassiker',
        image_url: '',
        ingredients_names: ['mjölk', 'köttfärs'],
        matches: 2,
        offers: 3,
      },
      {
        id: 2,
        name: 'Pannkakor',
        description: 'En annan klassiker',
        image_url: '',
        ingredients_names: ['mjölk', 'ägg'],
        matches: 1,
        offers: 1,
      },
    ];

    model.setRecipeResults(recipes);
    model.addSelectedIngredient({ id: 1, name: 'mjölk' });

    renderRecipes(model.getRecipeResults(), () => {});

    const recipeCards = document.querySelectorAll('.card');
    expect(recipeCards.length).toBe(2);
    expect(recipeCards[0].querySelector('.recipe-name').textContent).toBe('Köttbullar');
  });
});
