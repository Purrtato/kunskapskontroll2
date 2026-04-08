import { describe, test, expect, beforeEach, vi } from 'vitest';
import { init } from '../../src/recipe-page.js'; // justera sökvägen om den skiljer sig
 
// Mockar API-anropen så inga riktiga nätverksanrop görs
vi.mock('../../src/api-service.js', () => ({
    fetchRecipeById: vi.fn().mockResolvedValue([{
        name: 'Grillad Halloumisallad',
        description: 'En krispig sallad',
        image_url: 'https://example.com/halloumi.jpg',
        instructions: '1. Skär halloumi. 2. Grilla halloumi.',
        ingredients_names: ['Halloumi', 'Sallad'],
        ingredients_detailed: ['Halloumi 200g', 'Sallad 1 påse']
    }]),
    fetchPromotions: vi.fn().mockResolvedValue([
        { product_name: 'Halloumi', price: 35, store_info: 'ICA' }
    ])
}));
 
beforeEach(() => {
    document.body.innerHTML = `
        <img id="recipe-image" />
        <h1 id="recipe-name"></h1>
        <p id="recipe-description"></p>
        <ul id="ingredient-list"></ul>
        <div id="instructions-container"></div>
        <div id="promotions-container"></div>
    `;
});
 
describe('init – integrationstest', () => {
 
    test('hämtar data och renderar receptet korrekt på sidan', async () => {
        await init();
 
        expect(document.getElementById('recipe-name').textContent).toBe('Grillad Halloumisallad');
        expect(document.getElementById('recipe-description').textContent).toBe('En krispig sallad');
        expect(document.getElementById('recipe-image').src).toContain('halloumi.jpg');
    });
 
    test('renderar ingredienser från API-svaret', async () => {
        await init();
 
        const items = document.querySelectorAll('#ingredient-list .list-group-item');
        expect(items.length).toBeGreaterThan(0);
    });
 
    test('renderar matchande erbjudanden från API-svaret', async () => {
        await init();
 
        expect(document.getElementById('promotions-container').textContent).toContain('Halloumi');
    });
 
});