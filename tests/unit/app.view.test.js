import { describe, test, expect, beforeEach } from 'vitest';
import { renderRecipeHeader, renderIngredients } from '../../src/app.view.js';

// Återställer DOM:en innan varje test så de inte påverkar varandra
beforeEach(() => {
    document.body.innerHTML = `
        <img id="recipe-image" />
        <h1 id="recipe-name"></h1>
        <p id="recipe-description"></p>
        <ul id="ingredient-list"></ul>
        <div id="instructions-container"></div>
        <div id="promotions-container" class="row"></div>
    `;
});

describe('renderRecipeHeader', () => {
 
    test('fyller i namn, beskrivning och bild från receptdata', () => {
        const recipe = {
            name: 'Pasta Carbonara',
            description: 'En klassisk italiensk rätt',
            image_url: 'https://example.com/pasta.jpg'
        };
 
        renderRecipeHeader(recipe);
 
        expect(document.getElementById('recipe-name').textContent).toBe('Pasta Carbonara');
        expect(document.getElementById('recipe-description').textContent).toBe('En klassisk italiensk rätt');
        expect(document.getElementById('recipe-image').src).toBe('https://example.com/pasta.jpg');
    });
 
    test('använder placeholder-bild om image_url saknas', () => {
        const recipe = { name: 'Test', description: 'Desc', image_url: null };
 
        renderRecipeHeader(recipe);
 
        expect(document.getElementById('recipe-image').src).toContain('placeholder');
    });
 
    test('gör ingenting om elementen inte finns i DOM:en', () => {
        document.body.innerHTML = ''; // tom DOM
        const recipe = { name: 'Test', description: 'Desc', image_url: null };
 
        expect(() => renderRecipeHeader(recipe)).not.toThrow();
    });
});

describe('renderIngredients', () => {
 
    test('skapar rätt antal list-items', () => {
        renderIngredients(['Mjölk', 'Ägg', 'Bacon']);
 
        const items = document.querySelectorAll('#ingredient-list .list-group-item');
        expect(items.length).toBe(3);
    });
 
    test('varje list-item har rätt text', () => {
        renderIngredients(['Mjölk', 'Ägg']);
 
        const items = document.querySelectorAll('#ingredient-list .list-group-item');
        expect(items[0].textContent).toBe('Mjölk');
        expect(items[1].textContent).toBe('Ägg');
    });
 
    test('tömmer listan innan ny rendering', () => {
        renderIngredients(['Mjölk']);
        renderIngredients(['Ägg', 'Bacon']); // renderar igen med ny data
 
        const items = document.querySelectorAll('#ingredient-list .list-group-item');
        expect(items.length).toBe(2); 
    });
 
    test('renderar en tom lista om ingredienser saknas', () => {
        renderIngredients([]);
 
        const items = document.querySelectorAll('#ingredient-list .list-group-item');
        expect(items.length).toBe(0);
    });
});