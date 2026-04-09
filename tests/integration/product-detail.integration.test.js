import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/api-service.js", () => ({
  fetchPromotions: vi.fn(),
}));

import { fetchPromotions } from "../../src/api-service.js";

describe("product-detail integration", () => {
  beforeEach(() => {
    vi.resetModules(); // 🔥 important

    document.body.innerHTML = `
      <div id="loadingState" class=""></div>
      <div id="errorState" class="d-none"></div>
      <div id="productContent" class="d-none">

        <img id="productImage" />
        <h1 id="productName"></h1>
        <p id="productBrand"></p>
        <p id="productDescription"></p>

        <span id="discountBadge"></span>

        <span id="productPrice"></span>
        <span id="productOriginalPrice"></span>

        <span id="storeName"></span>
        <span id="validDates"></span>

        <div id="nutritionContent"></div>
        <div id="relatedRecipes"></div>
      </div>
    `;
  });

  it("renders product detail when API returns data", async () => {
    window.location = { search: "?id=1" };

    fetchPromotions.mockResolvedValue([
      {
        id: 1,
        product_name: "Milk",
        product_brand: "Arla",
        product_description: "Fresh milk",
        product_image_url: "img.jpg",
        price: 20,
        store_info: "ICA",
        start_date: "2024-01-01",
        end_date: "2024-01-10",
        energy_kcal: 100,
        protein_g: 3,
        ingredient_name: "milk",
      },
    ]);

    await import("../../src/product-detail.js");

    await new Promise((r) => setTimeout(r, 0));

    expect(fetchPromotions).toHaveBeenCalledWith("1");

    expect(document.getElementById("productName").textContent).toBe("Milk");

    expect(
      document.getElementById("productContent").classList.contains("d-none"),
    ).toBe(false);
  });

  it("shows error when no id in URL", async () => {
    window.location = { search: "" };

    fetchPromotions.mockResolvedValue([]);

    await import("../../src/product-detail.js");

    await new Promise((r) => setTimeout(r, 0));

    expect(
      document.getElementById("errorState").classList.contains("d-none"),
    ).toBe(false);
  });

  it("shows error when API returns empty array", async () => {
    window.location = { search: "?id=1" };

    fetchPromotions.mockResolvedValue([]);

    await import("../../src/product-detail.js");

    await new Promise((r) => setTimeout(r, 0));

    expect(
      document.getElementById("errorState").classList.contains("d-none"),
    ).toBe(false);
  });

  it("shows error when API throws", async () => {
    window.location = { search: "?id=1" };

    fetchPromotions.mockRejectedValue(new Error("fail"));

    await import("../../src/product-detail.js");

    await new Promise((r) => setTimeout(r, 0));

    expect(
      document.getElementById("errorState").classList.contains("d-none"),
    ).toBe(false);
  });
});
