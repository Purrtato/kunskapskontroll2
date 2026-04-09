// Renders promotion items in the promotions.html page
export function renderPromotionItems(items) {
  const container = document.getElementById("promotion-container");
  container.classList.add("row", "mt-4");

  let promotionItem = "";

  items.forEach((item) => {
    const detailId = item.correctDetailId ?? item.id;

    promotionItem += `
    <div class="col-md-3 mb-3">
        <a href="product-detail.html?id=${detailId}" class="text-decoration-none">
            <div class="card h-100 shadow-sm">
                <img src="${item.image_url}" class="card-img-top" alt="${item.name}" style="height:150px; object-fit:cover;">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text text-muted">${item.description || ""}</p>
                    <span class="badge bg-success offer-badge">${item.price || ""}:-</span>
                </div>
            </div>
        </a>
    </div>
`;
console.log(items);
  });

  container.innerHTML = promotionItem;
}

// Fyller i bild, titel och beskrivning
export function renderRecipeHeader(recipe) {
    const img = document.getElementById('recipe-image');
    const name = document.getElementById('recipe-name');
    const desc = document.getElementById('recipe-description');

    // Använder en placeholder-bild om ingen bild finns i datan
    if (img) {
        img.src = recipe.image_url || 'https://via.placeholder.com/800x420';
        img.alt = recipe.name;
    }
    // Fyller i titel och beskrivning om de finns i datan
    if (name) {
        name.textContent = recipe.name;
    }
    if (desc) {
        desc.textContent = recipe.description;
    }
}

// Genererar ingredienslistan
export function renderIngredients(ingredients) {
    const list = document.getElementById('ingredient-list');
    if (!list) return;
    list.innerHTML = '';
// Skapar en listpunkt för varje ingrediens och lägger till den i listan
    ingredients.forEach(name => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = name;
        list.appendChild(li);
    });
}

// Genererar instruktioner
export function renderInstructions(instructions) {
    const container = document.getElementById('instructions-container');
    if (!container) return; // Säkerställer att elementet finns innan vi försöker manipulera det
    container.innerHTML = '';

    const steps = instructions
        .split(/(?=\d+\.\s)/) // Dela upp texten i steg baserat på numrering (1. Text, 2. Text, etc.)
        .map(s => s.trim()) // Ta bort överflödiga mellanslag
        .filter(s => s.length > 0); // Ta bort tomma steg

    // Om det inte finns några numrerade steg, visa hela instruktionen som en paragraf
    if (steps.length === 0) {
        const div = document.createElement('div');
        div.className = 'instruction-step mb-3';
        div.textContent = instructions;
        container.appendChild(div);
        return;
    }
    // Skapa ett element för varje steg och numrera dem
    steps.forEach((step, index) => {
        const div = document.createElement('div');
        div.className = 'instruction-step mb-3 d-flex'; // La till flexbox för layout
        const stepTextWithoutNumber = step.replace(/^\d+\.\s/, ''); // Ta bort numreringen från texten

        div.innerHTML = `
            <strong class="me-2">${index + 1}.</strong> 
            <p class="mb-0">${stepTextWithoutNumber}</p>
        `;
        container.appendChild(div);
    });
}

// Genererar erbjudandekort för ingredienser som matchar receptet
export function renderRecipePromotions(promotions, ingredientNames) {
    const container = document.getElementById('promotions-container');
    if (!container) return;
    container.innerHTML = '';

// Filtrera bara kampanjer som matchar receptets ingredienser
    const matching = promotions.filter(promo => {
    const promoName = promo.product_name?.toLowerCase() || "";
    
    // Kolla om någon av ingredienserna i receptet matchar kampanjens produktnamn. Gör en "includes"-matchning för att fånga upp relevanta kampanjer, även om namnen inte är exakt lika.
    return ingredientNames.some(ingName => {
        const recipeIngName = ingName.toLowerCase();
        return promoName.includes(recipeIngName) || recipeIngName.includes(promoName);
    });
});
// Om inga matchande kampanjer hittas, visa ett meddelande
    if (matching.length === 0) {
        container.innerHTML = '<p class="text-muted">Inga erbjudanden på ingredienserna just nu.</p>';
        return;
    }
    
// Skapa kort för varje matchande kampanj
    let html = "";
    matching.forEach(promo => {
        html += `
        <div class="col-md-4 mb-3">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <span class="badge bg-success mb-2">${promo.price}:-</span>
                    <h5 class="card-title">${promo.product_name}</h5>
                    <p class="card-text text-muted small">${promo.store_info ?? ''}</p>
                </div>
            </div>
        </div>`;
    });
    container.innerHTML = html;
}
