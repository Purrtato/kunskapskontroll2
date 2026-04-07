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

// Add event listeners to filter dropdowns.
const categoryFilter = document.getElementById("categoryFilter");
const storeFilter = document.getElementById("storeFilter");

categoryFilter.addEventListener("change", handleFilter);
storeFilter.addEventListener("change", handleFilter);

// Handle filter changes and fetch filtered promotion items.
async function handleFilter() {
    const category = categoryFilter.value;
    const store = storeFilter.value;

    const items = await fetchProductInfo(category, store);
    renderPromotionItems(items);
}