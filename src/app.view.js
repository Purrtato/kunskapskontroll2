let ingredientList = document.getElementById('ingredient-list');
let resultInfoText = document.getElementById('result-info-text');
let recipeList = document.getElementById('recipe-list');

export function renderRecipes(recipes) {
    recipeList.innerHTML = '';
    if (recipes.length === 0) {
        return;
    }

    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'card h-100';

        let recipeImg = document.createElement('img');
        recipeImg.src = recipe.image_url || 'https://via.placeholder.com/150';
        recipeImg.className = 'card-img-top';
        recipeImg.alt = recipe.name;

        card.appendChild(recipeImg);

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        const recipeName = document.createElement('h5');
        recipeName.className = 'recipe-name';
        recipeName.textContent = capitalizeFirstLetter(recipe.name);
        const recipeDescription = document.createElement('p');
        recipeDescription.className = 'recipe-description';
        recipeDescription.textContent = recipe.description;

        cardBody.appendChild(recipeName);
        cardBody.appendChild(recipeDescription);
        card.appendChild(cardBody);

        const cardFooter = document.createElement('div');
        cardFooter.className = 'card-footer d-flex align-items-center gap-3';

        const matchCount = document.createElement('span');
        matchCount.className = 'footer-label';
        matchCount.textContent = `${recipe.matches} matchningar`;

        const offerCount = document.createElement('span');
        offerCount.className = 'footer-label';
        offerCount.textContent = `${recipe.offers} erbjudanden`;

        cardFooter.appendChild(matchCount);
        cardFooter.appendChild(offerCount);
        card.appendChild(cardFooter);

        recipeList.appendChild(card);
    });
}

// Renders the selected ingredients - function takes an array of ingredient names.
export function renderIngredients(ingredients) {
    ingredientList.innerHTML = '';
    if (ingredients.length === 0) {
        return;
    }

    ingredients.forEach(ingredient => {
        const ingredientItem = document.createElement('span');
        ingredientItem.className = 'ingredient-item badge text-bg-primary px-3 py-2 rounded-pill d-inline-flex align-items-center';
        ingredientItem.textContent = capitalizeFirstLetter(ingredient);

        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'btn-close btn-close-white ms-2';
        removeButton.setAttribute('aria-label', 'Remove');

        ingredientItem.appendChild(removeButton);
        ingredientList.appendChild(ingredientItem);
    });   
}

export function renderResultInfo(totalResults) {

    if (totalResults === 0) {
        resultInfoText.textContent = 'Inga recept hittades. Prova med andra ingredienser eller kategorier.';
    } else {
        resultInfoText.textContent = `Hittade ${totalResults} recept med dina valda ingredienser`;
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}