const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsc3V3b3R2cml6d252dHRnZmxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5OTQwMzAsImV4cCI6MjA5MDU3MDAzMH0.XoCOepTSlLnqXIQibXJKwFmTanhAuPdbWMcUXJxA-Ts';

const BASE_URL = 'https://rlsuwotvrizwnvttgflc.supabase.co/rest/v1/';



// API-call for fetching ingredients based on user input in the ingredient search field. Returns an array of ingredient objects that match the query using "like".

export async function fetchIngredients(query) {
const TABLE_VIEW_URL = 'food';
    let url = `${BASE_URL}${TABLE_VIEW_URL}?apikey=${API_KEY}&name=ilike.*${query}*`;

    console.log(`Fetching ingredients with url: ${url}`);

    let response = await fetch(url);
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
    
    }



//Det här API-anropet blev bökigt... för att kunna filtrera med en array av ingredienser var vi tvungna att göra en joinad of aggregerad "view" i Supabase, "recipes_with_ingredients", där varje recept har en array av ingrediensnamn.

export async function fetchRecipes(searchQuery, categoryFilter, selectedIngredients) {
    const TABLE_VIEW_URL = 'recipes_with_ingredients';
    let url = `${BASE_URL}${TABLE_VIEW_URL}?apikey=${API_KEY}`;

    // Add search query filter
    if (searchQuery) {
        url += `&name=ilike.*${searchQuery}*`;
    }
    // Add category filter
    if (categoryFilter) {
        url += `&category_name=eq.${categoryFilter}`;
    }
    // Add selected ingredients filter
    if (selectedIngredients && selectedIngredients.length > 0) {
        const ingredientsList = selectedIngredients.join(',');
        url += `&ingredients_names=ov.{${ingredientsList}}`;

        url += `&order=ingredients_names.desc`; // gör förhoppningsvis så att recept med flest matchande ingredienser kommer först i listan.
    }
    console.log(`Fetching recipes with URL: ${url}`);
    let response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
}

export async function fetchRecipeById(recipeId) {
    const TABLE_VIEW_URL = 'recipes_with_ingredients';
    let url = `${BASE_URL}${TABLE_VIEW_URL}?apikey=${API_KEY}&id=eq.${recipeId}`;

    console.log(`Fetching recipe by ID with URL: ${url}`);

    let response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    return data;
}

export async function fetchPromotions(id) {

    const TABLE_VIEW_URL = 'promotion_expanded';

    let url = `${BASE_URL}${TABLE_VIEW_URL}?apikey=${API_KEY}`;

    if (id) {
        url += `&id=eq.${id}`;
    }

    console.log(`Fetching promotions with URL: ${url}`);
    let response = await fetch(url);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        return data;
    }

    // Fetches product info (name, brand, description, image) from promotion_item_info table.
export async function fetchProductInfo(categoryId, storeId) {
    const TABLE_VIEW_URL = 'promotion_item_info';
    let url = `${BASE_URL}${TABLE_VIEW_URL}?apikey=${API_KEY}`;

    if (categoryId) {
        url += `&category_id=eq.${categoryId}`;
    }

    if (storeId) {
        url += `&store_id=eq.${storeId}`;
    }

    console.log(`Fetching product info with URL: ${url}`);
    let response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}


// Fetches nutrition data for a product from the nutrition table.
export async function fetchNutrition(promotionItemInfoId) {
    const TABLE_VIEW_URL = 'nutrition';
    let url = `${BASE_URL}${TABLE_VIEW_URL}?apikey=${API_KEY}`;

    if (promotionItemInfoId) {
        url += `&promotion_item_info_id=eq.${promotionItemInfoId}`;
    }

    console.log(`Fetching nutrition with URL: ${url}`);
    let response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}

