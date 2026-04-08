export class SearchModel {
  constructor() {
    // Text search / filters
    this.searchQuery = '';
    this.categoryFilter = '';

    // ingredients the user has added to their search criteria
    this.selectedIngredients = [];

    // Recipes shown on the page
    this.recipeResults = [];

    // Promotions - fetch once and store in model
    this.promotions = [];
  }

  setSearchQuery(query) {
    this.searchQuery = query;
  }

  getSearchQuery() {
    return this.searchQuery;
  }

  setCategoryFilter(category) {
    this.categoryFilter = category;
  }

  getCategoryFilter() {
    return this.categoryFilter;
  }

  addSelectedIngredient(ingredient) {
    const alreadyAdded = this.selectedIngredients.some(
      //some() method checks if any ingredient in selectedIngredients has the same id as the one being added, to prevent duplicates.
      item => item.id === ingredient.id,
    );

    if (!alreadyAdded) {
      this.selectedIngredients.push(ingredient);
    }
  }

  getSelectedIngredients() {
    return this.selectedIngredients;
  }

  removeSelectedIngredient(ingredientId) {
    this.selectedIngredients = this.selectedIngredients.filter(
      item => item.id !== ingredientId,
    );
  }

  clearSelectedIngredients() {
    this.selectedIngredients = [];
  }

  setRecipeResults(recipes) {
    this.recipeResults = this.sortRecipesByMatches(recipes);
  }

  getRecipeResults() {
    return this.recipeResults;
  }

  clearRecipeResults() {
    this.recipeResults = [];
  }

  setPromotions(promotions) {
    this.promotions = promotions;
  }

  getPromotions() {
    return this.promotions;
  }

  clearPromotions() {
    this.promotions = [];
  }

  // returns an array of ingredients in the given recipe that have promotions available
  getMatchingPromotionsForRecipe(recipe) {
    const promoIng = new Set(this.promotions.map(p => p.ingredient_name));

    return recipe.ingredients_names.filter(ingredient =>
      promoIng.has(ingredient),
    );
  }

  //returns an array of ingredient names that are both in the given recipe and in the user's currently selected ingredients.
  getNumberOfMatchingIngredientsForRecipe(recipe) {
    const selectedIng = new Set(this.selectedIngredients.map(ing => ing.name));

    return recipe.ingredients_names.filter(ingredient =>
      selectedIng.has(ingredient),
    );
  }

  sortRecipesByMatches(recipes) {
    return recipes.sort((a, b) => {
      const aMatches = this.getNumberOfMatchingIngredientsForRecipe(a).length;
      const bMatches = this.getNumberOfMatchingIngredientsForRecipe(b).length;
      return bMatches - aMatches; // Sort in descending order of matches
    });
  }
}
