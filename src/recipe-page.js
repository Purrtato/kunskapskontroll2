import { fetchRecipeById, fetchPromotions } from './api-service.js';

// Hämtar recept-ID från URL:en, t.ex. recipes.html?id=1
export function getRecipeIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Fyller i bild, titel och beskrivning
export function renderRecipeHeader(recipe) {
    document.getElementById('recipe-image').src = recipe.image_url || 'https://via.placeholder.com/800x420';
    document.getElementById('recipe-image').alt = recipe.name;
    document.getElementById('recipe-name').textContent = recipe.name;
    document.getElementById('recipe-description').textContent = recipe.description;
}

// Genererar ingredienslistan
export function renderIngredients(ingredients) {
    const list = document.getElementById('ingredient-list');
    list.innerHTML = '';

    ingredients.forEach(name => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = name;
        list.appendChild(li);
    });
}

// Genererar instruktioner – delar upp på radbrytningar om de finns
export function renderInstructions(instructions) {
    const container = document.getElementById('instructions-container');
    container.innerHTML = '';

    const steps = instructions
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    steps.forEach((step, index) => {
        const div = document.createElement('div');
        div.className = 'instruction-step';
        div.innerHTML = `<strong>${index + 1}.</strong> ${step}`;
        container.appendChild(div);
    });
}

// Genererar erbjudandekort för ingredienser som matchar receptet
export function renderPromotions(promotions, ingredientNames) {
    const container = document.getElementById('promotions-container');
    container.innerHTML = '';

    // Filtrera bara kampanjer som matchar receptets ingredienser
    const matching = promotions.filter(promo =>
        ingredientNames.some(name =>
            name.toLowerCase() === promo.product_name?.toLowerCase()
        )
    );

    if (matching.length === 0) {
        container.innerHTML = '<p class="text-muted">Inga erbjudanden just nu.</p>';
        return;
    }

    matching.forEach(promo => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-3';
        col.innerHTML = `
        <div class="card">
            <div class="card-body">
                <span class="offer-badge">${promo.price} kr</span>
                <h5 class="card-title">${promo.product_name}</h5>
                <p class="card-text">${promo.store_info ?? ''}</p>
            </div>
        </div>
        `;
        container.appendChild(col);
    });
}

// Huvudfunktion
export async function init() {
    const recipeId = getRecipeIdFromUrl();

    if (!recipeId) {
        console.error('Inget recept-ID i URL:en. Lägg till ?id=1 i slutet.');
        return;
    }

    try {
        // Hämta recept och kampanjer parallellt
        const [recipeData, promotions] = await Promise.all([
            fetchRecipeById(recipeId),
            fetchPromotions()
        ]);

        const recipe = recipeData[0];

        if (!recipe) {
            console.error('Receptet hittades inte.');
            return;
        }

        renderRecipeHeader(recipe);
        renderIngredients(recipe.ingredients_names);
        renderInstructions(recipe.instructions);
        renderPromotions(promotions, recipe.ingredients_names);

    } catch (error) {
        console.error('Något gick fel:', error);
    }
}

init();