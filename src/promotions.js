import { fetchProductInfo, fetchPromotions } from "./api-service.js";
import { renderPromotionItems } from "./app.view.js";

const categoryFilter = document.getElementById("categoryFilter");
const storeFilter = document.getElementById("storeFilter");

// Fetch promotion items and render them on the page.
async function renderPromotions(category, store) {
    const [items, promotions] = await Promise.all([
        fetchProductInfo(category, store),
        fetchPromotions(),
    ]);

    // Skapar en mappning av promotion_item_info_id till promotion id för att kunna matcha dem korrekt
    const idMap = {};
    promotions.forEach((promo) => {
        idMap[promo.promotion_item_info_id] = promo.id;
    });

    const itemsWithCorrectId = items.map((item) => ({
        ...item,
        correctDetailId: idMap[item.id],
    }));

    renderPromotionItems(itemsWithCorrectId);
}

async function handleFilter() {
    const category = categoryFilter?.value;
    const store = storeFilter?.value;

    const [promotions, items] = await Promise.all([
        fetchPromotions(),
        fetchProductInfo(category, store),
    ]);
    // Skapar en mappning av promotion_item_info_id till promotion id
    const idMap = {};
    promotions.forEach((promo) => {
        idMap[promo.promotion_item_info_id] = promo.id;
    });

    const itemsWithCorrectId = items.map((item) => ({
        ...item,
        correctDetailId: idMap[item.id],
    }));

    renderPromotionItems(itemsWithCorrectId);
}

    // Initialiserar sidan genom att rendera promotion items och sätta upp event listeners för filtrering.
async function init() {
    await renderPromotions();

    if (categoryFilter) {
        categoryFilter.addEventListener("change", handleFilter);
    }

    if (storeFilter) {
        storeFilter.addEventListener("change", handleFilter);
    }
}
    // Kör init-funktionen när sidan laddas.
init();

