// app.js - main UI logic (rendering, modal, wishlist)
const productListEl = document.getElementById("product-list");

// wishlist persistence (store product ids)
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// DOM elements for modal
const modal = document.getElementById("quick-view-modal");
const modalBackdrop = document.getElementById("modal-backdrop");
const modalCloseBtn = document.getElementById("modal-close");
const modalImg = document.getElementById("modal-product-image");
const modalName = document.getElementById("modal-product-name");
const modalCategory = document.getElementById("modal-product-category");
const modalPrice = document.getElementById("modal-product-price");
const modalDesc = document.getElementById("modal-product-desc");
const modalAddCartBtn = document.getElementById("modal-add-cart");
const modalWishlistBtn = document.getElementById("modal-wishlist-btn");

function renderProducts(list) {
  productListEl.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "product";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" onerror="this.style.objectFit='cover'; this.src='https://via.placeholder.com/400x300?text=No+Image'"/>
      <h3>${p.name}</h3>
      <p class="muted">Category: ${p.category}</p>
      <p><strong>₹${p.price}</strong></p>
      <div class="actions">
        <button class="btn btn-outline" data-action="view" data-id="${p.id}">View Details</button>
        <button class="btn btn-primary" data-action="addcart" data-id="${p.id}">Add to Cart</button>
        <button class="btn btn-outline" data-action="wishlist" data-id="${p.id}">
          ${wishlist.includes(p.id) ? 'Saved' : 'Add to Wishlist'}
        </button>
      </div>
    `;
    productListEl.appendChild(card);
  });
}

// initial render
renderProducts(products);
updateWishlistCount();

// Event delegation for product actions
productListEl.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const action = btn.dataset.action;
  const id = Number(btn.dataset.id);

  if (action === "view") openModalWithProduct(id);
  else if (action === "addcart") addToCartById(id);
  else if (action === "wishlist") toggleWishlist(id, btn);
});

// Open modal and populate data
function openModalWithProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  modalImg.src = p.image;
  modalName.innerText = p.name;
  modalCategory.innerText = `Category: ${p.category}`;
  modalPrice.innerText = `₹${p.price}`;
  modalDesc.innerText = p.description || "No description available.";

  modalAddCartBtn.onclick = () => addToCartById(id);
  
  setModalWishlistState(id);
  modalWishlistBtn.onclick = () => toggleWishlist(id, modalWishlistBtn);

  showModal();
}

function showModal() {
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

modalCloseBtn.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => { 
  if (e.key === "Escape") closeModal(); 
});

// 🔥 FINAL WISHLIST FUNCTION (WITH ALERT)
function toggleWishlist(id, btnEl = null) {
  const product = products.find(p => p.id === id);
  const idx = wishlist.indexOf(id);

  if (idx === -1) {
    wishlist.push(id);
    alert(`${product.name} added to Wishlist!`);
  } else {
    wishlist.splice(idx, 1);
    alert(`${product.name} removed from Wishlist!`);
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlistCount();

  if (btnEl) {
    btnEl.innerText = wishlist.includes(id) ? "Saved" : "Add to Wishlist";
  }

  refreshProductListWishlistButtons();
  setModalWishlistState(id);
}

function setModalWishlistState(id) {
  if (!modalWishlistBtn) return;

  if (wishlist.includes(id)) {
    modalWishlistBtn.classList.add("saved");
    modalWishlistBtn.innerText = "Saved";
  } else {
    modalWishlistBtn.classList.remove("saved");
    modalWishlistBtn.innerText = "Add to Wishlist";
  }
}

function refreshProductListWishlistButtons() {
  document.querySelectorAll('.product .actions button[data-action="wishlist"]').forEach(btn => {
    const id = Number(btn.dataset.id);
    btn.innerText = wishlist.includes(id) ? "Saved" : "Add to Wishlist";
  });
}

function updateWishlistCount() {
  const el = document.getElementById("wishlist-count");
  if (el) el.innerText = wishlist.length;
}

// Sync wishlist if changed in another tab
window.addEventListener("storage", (e) => {
  if (e.key === "wishlist") {
    wishlist = JSON.parse(e.newValue) || [];
    updateWishlistCount();
    refreshProductListWishlistButtons();

    const currId = Number(modalAddCartBtn?.onclick?.toString().match(/\d+/)?.[0]);
    if (currId) setModalWishlistState(currId);
  }
});

// ensure filters work on initial load
filterAndSortProducts();
