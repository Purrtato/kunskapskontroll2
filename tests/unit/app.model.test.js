import { describe, test, expect, beforeEach } from 'vitest';
import { SearchModel } from '../../src/app.model.js';

describe('SearchModel', () => {
  let model;

  beforeEach(() => {
    model = new SearchModel();
  });

  test('setPromotions and getPromotions works together correctly', () => {
    const mockPromotions = [
      { id: 1, product_name: 'Mjölk' },
      { id: 2, product_name: 'Bröd' },
    ];
    model.setPromotions(mockPromotions);
    expect(model.getPromotions()).toEqual(mockPromotions);
  });

  test('addSelectedIngredient, getSelectedIngredients and removeSelectedIngredient works together correctly', () => {
    const ingredient1 = { id: 1, name: 'Mjölk' };
    const ingredient2 = { id: 2, name: 'Bröd' };

    model.addSelectedIngredient(ingredient1);
    model.addSelectedIngredient(ingredient2);

    expect(model.getSelectedIngredients()).toEqual([ingredient1, ingredient2]);
    model.removeSelectedIngredient(1);
    expect(model.getSelectedIngredients()).toEqual([ingredient2]);
  });
});
