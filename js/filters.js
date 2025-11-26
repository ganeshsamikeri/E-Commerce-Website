// filters.js - wiring for search/category/sort
const categorySelect = document.getElementById("category");
const sortSelect = document.getElementById("sort");
const searchInput = document.getElementById("search");

function filterAndSortProducts() {
  let filtered = [...products];
  const category = categorySelect?.value || "all";
  const sort = sortSelect?.value || "asc";
  const search = (searchInput?.value || "").toLowerCase();

  if (category !== "all") {
    filtered = filtered.filter(p => p.category === category);
  }
  if (search) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(search));
  }
  filtered.sort((a, b) => (sort === "asc" ? a.price - b.price : b.price - a.price));
  displayProducts(filtered);
}

if (categorySelect) categorySelect.addEventListener("change", filterAndSortProducts);
if (sortSelect) sortSelect.addEventListener("change", filterAndSortProducts);
if (searchInput) searchInput.addEventListener("input", filterAndSortProducts);
