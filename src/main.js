import {
  fetchIngredients,
  fetchRecipes,
  fetchPromotions,
} from './api-service.js';
import { SearchModel } from './app.model.js';
import {
  renderRecipes,
  renderIngredients,
  renderResultInfo,
  renderIngredientSuggestions,
  clearIngredientInputAndSuggestions,
} from './app.view.js';

const model = new SearchModel();

// DOM element references
let form = document.getElementById('search-form');
let ingredientInput = document.getElementById('ingredient-input');
let categorySelect = document.getElementById('category-filter');


// fetch promotions when the app loads and store in model
fetchPromotions().then(promotions => {
  model.setPromotions(promotions);
  console.log('Fetched promotions:', promotions);
});

let validatedIngredient = null; // used to make sure the user only adds ingredients (to the selected list) that exist in the database, by validating against the autosuggestions when the user types in the ingredient input field.

// Ingredient autosuggestions
ingredientInput.addEventListener('input', async () => {
  const query = ingredientInput.value.trim();
  validatedIngredient = null; // reset the validated ingredient whenever the input changes

  if (query.length < 2) {
    renderIngredientSuggestions([]);
    return;
  }

  const suggestions = await fetchIngredients(query);

  renderIngredientSuggestions(suggestions);

  //Check if the current input exactly matches one of the suggestions (meaning that the ingredient exists in the database)
  const match = suggestions.find(
    ing => ing.name.toLowerCase() === query.toLowerCase(),
  );
  if (match) {
    validatedIngredient = match;
  }
});

// Add (validated) ingredient to the selected list
form.addEventListener('submit', async e => {
  e.preventDefault();

  if (!validatedIngredient) {
    // should probably show some kind of error message to the user here
    return;
  }
  model.addSelectedIngredient(validatedIngredient);
  clearIngredientInputAndSuggestions();

  renderIngredients(model.getSelectedIngredients(), handleRemoveIngredient);
  await loadRecipes();
});

// Category filter change
categorySelect.addEventListener('change', async () => {
  model.setCategoryFilter(
    categorySelect.value === 'alla' ? null : categorySelect.value,
  );
  await loadRecipes();
});

async function loadRecipes() {
  // set up the parameters for the API call based on the current state in the model
  const selectedIngredients = model
    .getSelectedIngredients()
    .map(ing => ing.name);
  const category = model.getCategoryFilter();
  const searchQuery = model.getSearchQuery(); // currently always empty string since we don't have a search input field, but could be added in the future...

  const recipes = await fetchRecipes(
    searchQuery,
    category,
    selectedIngredients,
  );

  //add match count and promotion count to each recipe object before storing in model.
  recipes.forEach(recipe => {
    recipe.matches =
      model.getNumberOfMatchingIngredientsForRecipe(recipe).length;
    recipe.offers = model.getMatchingPromotionsForRecipe(recipe).length;
  });

  // store the fetched recipes in the model and finally renders them
  model.setRecipeResults(recipes);
  renderRecipes(model.getRecipeResults());
  renderResultInfo(model.getRecipeResults().length);
}

// Remove ingredient - called from each ingredient badge's remove button via the renderIngredients callback
async function handleRemoveIngredient(ingredientId) {
  model.removeSelectedIngredient(ingredientId);
  renderIngredients(model.getSelectedIngredients(), handleRemoveIngredient);
  await loadRecipes();
}