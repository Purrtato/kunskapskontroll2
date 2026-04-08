import { fetchPromotions } from "./api-service.js";

// ── Helpers ──────────────────────────────────────────────────────────────────

function getIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function showLoading() {
  document.getElementById("loadingState").classList.remove("d-none");
  document.getElementById("errorState").classList.add("d-none");
  document.getElementById("productContent").classList.add("d-none");
}

function showError() {
  document.getElementById("loadingState").classList.add("d-none");
  document.getElementById("errorState").classList.remove("d-none");
  document.getElementById("productContent").classList.add("d-none");
}

function showContent() {
  document.getElementById("loadingState").classList.add("d-none");
  document.getElementById("errorState").classList.add("d-none");
  document.getElementById("productContent").classList.remove("d-none");
}

function formatDate(dateStr) {
  if (!dateStr) return "–";
  return new Date(dateStr).toLocaleDateString("sv-SE");
}

// ── Render functions ──────────────────────────────────────────────────────────

function renderProduct(p) {
  const img = document.getElementById("productImage");
  img.src =
    p.product_image_url || "https://placehold.co/600x400?text=Ingen+bild";
  img.alt = p.product_name || "";

  document.getElementById("productName").textContent =
    p.product_name || "Okänd produkt";
  document.getElementById("productBrand").textContent = p.product_brand || "";
  document.getElementById("productDescription").textContent =
    p.product_description || "";

  document.getElementById("discountBadge").classList.add("d-none");

  document.getElementById("productPrice").textContent = p.price
    ? `${p.price} kr`
    : "–";
  document.getElementById("productOriginalPrice").textContent = "";

  document.getElementById("storeName").textContent = p.store_info || "–";
  document.getElementById("validDates").textContent =
    `${formatDate(p.start_date)} – ${formatDate(p.end_date)}`;
}

function renderNutrition(p) {
  const container = document.getElementById("nutritionContent");

  if (p.energy_kcal == null && p.protein_g == null) {
    container.innerHTML = '<p class="text-muted">Näringsvärden saknas.</p>';
    return;
  }

  const rows = [
    {
      label: "Energi",
      value: p.energy_kcal != null ? `${p.energy_kcal} kcal` : "–",
      highlight: true,
    },
    { label: "Fett", value: p.fat_g != null ? `${p.fat_g} g` : "–" },
    {
      label: "  varav mättat fett",
      value: p.saturated_fat_g != null ? `${p.saturated_fat_g} g` : "–",
    },
    {
      label: "Kolhydrater",
      value: p.carbs_g != null ? `${p.carbs_g} g` : "–",
      highlight: true,
    },
    {
      label: "  varav socker",
      value: p.sugar_g != null ? `${p.sugar_g} g` : "–",
    },
    {
      label: "Protein",
      value: p.protein_g != null ? `${p.protein_g} g` : "–",
      highlight: true,
    },
    { label: "Salt", value: p.salt_g != null ? `${p.salt_g} g` : "–" },
    { label: "Fiber", value: p.fiber_g != null ? `${p.fiber_g} g` : "–" },
  ];

  const tableRows = rows
    .map(
      (r) => `
            <tr class="${r.highlight ? "nutrition-highlight" : ""}">
                <td>${r.label}</td>
                <td>${r.value}</td>
            </tr>`,
    )
    .join("");

  container.innerHTML = `<table class="nutrition-table">${tableRows}</table>`;
}

function renderRelatedRecipes(ingredientName) {
  const container = document.getElementById("relatedRecipes");
  if (!ingredientName) {
    container.innerHTML =
      '<p class="text-muted">Inga recept hittades för denna ingrediens.</p>';
    return;
  }
  container.innerHTML = '<p class="text-muted">Laddar recept...</p>';
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function init() {
  showLoading();

  const id = getIdFromUrl();

  if (!id) {
    showError();
    return;
  }

  try {
    const promotions = await fetchPromotions(id);

    if (!promotions || promotions.length === 0) {
      showError();
      return;
    }

    const promotion = promotions[0];

    renderProduct(promotion);
    renderNutrition(promotion);
    renderRelatedRecipes(promotion.ingredient_name);

    showContent();
  } catch (err) {
    console.error("Error loading product detail:", err);
    showError();
  }
}

init();
