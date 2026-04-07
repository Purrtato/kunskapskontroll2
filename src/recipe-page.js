// Denna fil hanterar logiken för receptsidan, inklusive att hämta data från API:et och skicka den till View för rendering
import { fetchRecipeById, fetchPromotions } from './api-service.js';
import { SearchModel } from './app.model.js';
import * as view from './app.view.js';

// Skapa en instans av modellen för att hålla data
const model = new SearchModel();

// Renderar receptets titel, beskrivning och bild
export function getRecipeIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Huvudfunktionen som initierar sidan, hämtar data och renderar den
export async function init() {
    const recipeId = getRecipeIdFromUrl();

    if (!recipeId) {
        console.error('Inget recept-ID hittades.');
        return;
    }

    try {
        // Hämtar både receptdata och kampanjdata parallellt för att optimera laddningstiden med Promise.all
        const [recipeData, promotionsData] = await Promise.all([ 
            fetchRecipeById(recipeId),
            fetchPromotions()
        ]);

        const recipe = recipeData[0];
        // Säkerställer att receptet finns i datan innan vi försöker rendera det
        if (!recipe) {
            console.error('Receptet saknas i databasen.');
            return;
        }

        // Sparar data i modellen
        model.setRecipeResults([recipe]);
        model.setPromotions(promotionsData);

        // Skickar data till View för rendering
        view.renderRecipeHeader(recipe);
        view.renderIngredients(recipe.ingredients_names);
        view.renderInstructions(recipe.instructions);
        
        // Renderar kampanjer som matchar ingredienserna i receptet
        view.renderRecipePromotions(model.getPromotions(), recipe.ingredients_names);

    } catch (error) {
        console.error('Ett fel uppstod', error);
    }
}

// Starta sidan
init();