import { beforeEach, describe, expect, test, vi } from "vitest";

const initialPromotions = [
  {
    id: 1,
    name: "arla mellanmjölk",
    brand: "arla",
    description: "klassisk mellanmjölk med 1.5% fetthalt",
    image_url:
      "https://images.arla.com/filename/07310865000194_C1L1.PNG?width=500&height=500&format=webp&quality=82&mode=boxpad",
    category_id: 1,
    price: 15,
    store_id: 2,
  },
  {
    id: 2,
    name: "gouda ost",
    brand: "arla",
    description: "mild lagrad gouda skiva",
    image_url:
      "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=600",
    category_id: 1,
    price: 89,
    store_id: 1,
  },
];

const filteredPromotions = [
  {
    id: 9,
    name: "pasta spaghetti",
    brand: "barilla",
    description: "durum spaghetti 500g",
    image_url:
      "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=600",
    category_id: 9,
    price: 20,
    store_id: 3,
  },
];

function renderPromotionsPageMockup() {
  document.body.innerHTML = `
    <div class="container my-5">
      <div class="row">
        <div id="filters" class="row g-3 mb-4">
          <div class="col-md-6">
            <label for="storeFilter" class="form-label">Butik</label>
            <select id="storeFilter" class="form-select">
              <option value="">Alla butiker</option>
              <option value="1">ICA</option>
              <option value="2">Coop</option>
              <option value="3">Willys</option>
              <option value="4">Lidl</option>
              <option value="5">Hemköp</option>
            </select>
          </div>
          <div class="col-md-6">
            <label for="categoryFilter" class="form-label">Kategori</label>
            <select id="categoryFilter" class="form-select">
              <option value="">Alla kategorier</option>
              <option value="1">Mejeri</option>
              <option value="2">Kött</option>
              <option value="3">Fisk & Skaldjur</option>
              <option value="4">Frukt</option>
              <option value="5">Grönsaker</option>
              <option value="6">Frysvaror</option>
              <option value="7">Bröd & Bageri</option>
              <option value="8">Dryck</option>
              <option value="9">Skafferi</option>
              <option value="10">Snacks & Godis</option>
              <option value="11">Vegetariskt</option>
            </select>
          </div>
        </div>
      </div>
      <div class="row">
        <div id="promotion-container"></div>
      </div>
    </div>
  `;
}

describe("promotions integration", () => {
  beforeEach(() => {
    vi.resetModules();
    renderPromotionsPageMockup();
  });

  test("renders initial promotions and updates the list when filters change", async () => {
    const fetchMock = vi.fn(async (url) => {
      const requestUrl = new URL(url);
      const categoryId = requestUrl.searchParams.get("category_id");
      const storeId = requestUrl.searchParams.get("store_id");

      const data =
        categoryId === "eq.8" && storeId === "eq.4"
          ? filteredPromotions
          : initialPromotions;

      return {
        ok: true,
        async json() {
          return data;
        },
      };
    });

    vi.stubGlobal("fetch", fetchMock);

    await import("../../src/promotions.js");

    await vi.waitFor(() => {
      expect(
        document.querySelectorAll("#promotion-container .card"),
      ).toHaveLength(2);
    });

    const promotionContainer = document.getElementById("promotion-container");
    expect(promotionContainer.textContent).toContain("arla mellanmjölk");
    expect(promotionContainer.textContent).toContain("gouda ost");

    const categoryFilter = document.getElementById("categoryFilter");
    const storeFilter = document.getElementById("storeFilter");

    categoryFilter.value = "8";
    categoryFilter.dispatchEvent(new Event("change"));

    storeFilter.value = "4";
    storeFilter.dispatchEvent(new Event("change"));

    await vi.waitFor(() => {
      expect(
        document.querySelectorAll("#promotion-container .card"),
      ).toHaveLength(1);
    });

    expect(promotionContainer.textContent).toContain("pasta spaghetti");
    expect(promotionContainer.textContent).toContain("durum spaghetti 500g");
    expect(promotionContainer.innerHTML).toContain("20:-");

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining("promotion_item_info?apikey="),
    );
    expect(fetchMock).toHaveBeenLastCalledWith(
      expect.stringContaining("category_id=eq.8&store_id=eq.4"),
    );
  });
});
