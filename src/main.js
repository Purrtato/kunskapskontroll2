 import { fetchIngredients, fetchRecipes, fetchRecipeById, fetchPromotions } from "./api-service.js";


fetchIngredients('tom').then(returnedIngredients => {
    console.log('Returned ingredients:', returnedIngredients);
});

fetchRecipes(null, null, ['Mjölk']).then(returnedRecipes => {
    console.log('Returned recipes:', returnedRecipes);
});

fetchRecipeById(1).then(returnedRecipe => {
    console.log('Returned recipeById:', returnedRecipe);
});

fetchPromotions(61).then(returnedPromotions => {
    console.log('Returned promotions:', returnedPromotions);
});


// promotions.html
// Fetch promotion items and render them on the page.
import { fetchProductInfo } from "./api-service.js";
import { renderPromotionItems } from "./app.view.js";

async function init() {
    const items = await fetchProductInfo();
    renderPromotionItems(items);
}

init();