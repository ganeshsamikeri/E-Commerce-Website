// cart.js - cart persistence & utilities
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCartById(id, showAlert = true) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  if (showAlert) alert(`${product.name} added to cart!`);
}

function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (el) el.innerText = cart.length;
}

// initial
updateCartCount();
