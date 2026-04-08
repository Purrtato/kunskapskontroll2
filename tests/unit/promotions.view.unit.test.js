import { describe, test, expect, beforeEach } from "vitest";
import { renderPromotionItems } from "../../src/app.view.js";

describe("renderPromotionItems", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="promotion-container"></div>';
  });

  test("renders promotion cards in the promotions container", () => {
    const items = [
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

    renderPromotionItems(items);

    const container = document.getElementById("promotion-container");
    const cards = container.querySelectorAll(".card");
    const images = container.querySelectorAll("img");

    expect(cards).toHaveLength(2);
    expect(images).toHaveLength(2);

    expect(container.textContent).toContain("arla mellanmjölk");
    expect(container.textContent).toContain("klassisk mellanmjölk med 1.5% fetthalt");
    expect(images[0].getAttribute("src")).toBe(
      "https://images.arla.com/filename/07310865000194_C1L1.PNG?width=500&height=500&format=webp&quality=82&mode=boxpad",
    );
    expect(container.innerHTML).toContain("15:-");

    expect(container.textContent).toContain("gouda ost");
    expect(container.textContent).toContain("mild lagrad gouda skiva");
    expect(images[1].getAttribute("src")).toBe(
      "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=600",
    );
    expect(container.innerHTML).toContain("89:-");
  });
});
