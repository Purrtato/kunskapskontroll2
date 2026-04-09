// promotions.html
// Fetch promotion items and render them on the page.
import { fetchProductInfo, fetchPromotions } from "./api-service.js";
import { renderPromotionItems } from "./app.view.js";

const categoryFilter = document.getElementById("categoryFilter");
const storeFilter = document.getElementById("storeFilter");

async function renderPromotions(category, store) {
    const [items, promotions] = await Promise.all([
        fetchProductInfo(category, store),
        fetchPromotions(),
    ]);

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

async function init() {
    await renderPromotions();

    if (categoryFilter) {
        categoryFilter.addEventListener("change", handleFilter);
    }

    if (storeFilter) {
        storeFilter.addEventListener("change", handleFilter);
    }
}

init();

