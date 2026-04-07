// Renders promotion items in the promotions.html page
export function renderPromotionItems(items) {
  const container = document.getElementById("promotion-container");
  container.classList.add("row", "mt-4");

  let promotionItem = "";

  items.forEach((item) => {
    promotionItem += `
    <div class="col-md-3 mb-3">
        <div class="card h-100 shadow-sm">
            <img src="${item.image_url}" class="card-img-top" alt="${item.name}" style="height:150px; object-fit:cover;">
            <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text text-muted">${item.description || ""}</p>
                <span class="badge bg-success">${item.price || ""}</span>
            </div>
        </div>
    </div>
`;
  });

  container.innerHTML = promotionItem;
}
