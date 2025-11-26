const products = [
  { id: 1, name: "Laptop", category: "electronics", price: 800 },
  { id: 2, name: "T-Shirt", category: "clothing", price: 20 },
  { id: 3, name: "Book", category: "books", price: 15 },
  { id: 4, name: "Headphones", category: "electronics", price: 50 },
  { id: 5, name: "Jeans", category: "clothing", price: 40 },
];

const productList = document.getElementById("product-list");
const categorySelect = document.getElementById("category");
const sortSelect = document.getElementById("sort");

// Render products
function displayProducts(items) {
  productList.innerHTML = "";
  items.forEach(product => {
    const productDiv = document.createElement("div");
    productDiv.className = "product";
    productDiv.innerHTML = `
      <h3>${product.name}</h3>
      <p>Category: ${product.category}</p>
      <p>Price: $${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productList.appendChild(productDiv);
  });
}

// Filter & Sort
function filterAndSortProducts() {
  let filtered = [...products];
  const category = categorySelect.value;
  const sort = sortSelect.value;

  if (category !== "all") {
    filtered = filtered.filter(p => p.category === category);
  }

  filtered.sort((a, b) => (sort === "asc" ? a.price - b.price : b.price - a.price));
  displayProducts(filtered);
}

// Add to Cart (basic alert)
function addToCart(id) {
  const product = products.find(p => p.id === id);
  alert(`${product.name} added to cart!`);
}

// Event listeners
categorySelect.addEventListener("change", filterAndSortProducts);
sortSelect.addEventListener("change", filterAndSortProducts);

// Initial render
displayProducts(products);
