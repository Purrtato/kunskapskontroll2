export class SearchModel {
    constructor() {
        // Text search / filters
        this.searchQuery = '';
        this.categoryFilter = '';

        // Ingredient handling
        this.ingredientInput = '';        // current text in the "add ingredient" field
        this.ingredientSuggestions = [];  // matches returned from the API for the current input
        this.selectedIngredients = [];   // ingredients the user has added to their search criteria

        // Recipes shown on the page
        this.recipeResults = [];
        this.totalRecipeResults = 0;

        // Promotions of ingredients
        this.promotions = []; // Inte helt säker på om jag tänkt rätt här... Men antingen hämtar och cachear vi alla aktuella kampanjer i modellen, eller så hämtar vi bara de som matchar de ingredienser som är i recepten som visas. Första alternativet känns bättre va? Det bör inte bli så mycket data att hantera oavsett. Sen när vi har alla kampanjer i modellen så kan vi enkelt kolla efter matchningar i recepten som visas. Se metoden getMatchingPromotionsForRecipe() nedan.

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

    setIngredientInput(value) {
        this.ingredientInput = value;
    }

    getIngredientInput() {
        return this.ingredientInput;
    }

    clearIngredientInput() {
        this.ingredientInput = '';
    }

    setIngredientSuggestions(suggestions) {
        this.ingredientSuggestions = suggestions;
    }

    getIngredientSuggestions() {
        return this.ingredientSuggestions;
    }

    clearIngredientSuggestions() {
        this.ingredientSuggestions = [];
    }

    addSelectedIngredient(ingredient) {
        const alreadyAdded = this.selectedIngredients.some( //some() method checks if any ingredient in selectedIngredients has the same id as the one being added, to prevent duplicates.
            item => item.id === ingredient.id
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
            item => item.id !== ingredientId
        );
    }

    clearSelectedIngredients() {
        this.selectedIngredients = [];
    }

    setRecipeResults(recipes) {
        this.recipeResults = recipes;
    }

    getRecipeResults() {
        return this.recipeResults;
    }

    setTotalRecipeResults(total) {
        this.totalRecipeResults = total;
    }

    getTotalRecipeResults() {
        return this.totalRecipeResults;
    }

    clearRecipeResults() {
        this.recipeResults = [];
        this.totalRecipeResults = 0;
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

    // returns an array of ingredients in the given recipe that have promotions available, based on the current promotions in the model.
    getMatchingPromotionsForRecipe(recipe) {
    const promoIds = new Set(this.promotions.map(p => p.ingredientId)); 

    return recipe.ingredients.filter(ing => promoIds.has(ing.id));
}

}