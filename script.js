"use strict";

const products = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    price: 299,
    category: "T-Shirt",
    image: "assets/white-tshirt.jpg",
  },
  {
    id: 2,
    name: "Black Graphic T-Shirt",
    price: 399,
    category: "T-Shirt",
    image: "assets/black-tshirt.jpg",
  },
  {
    id: 3,
    name: "Oversized Street T-Shirt",
    price: 499,
    category: "T-Shirt",
    image: "assets/oversized-tshirt.jpg",
  },
  {
    id: 4,
    name: "Slim Fit Jeans",
    price: 899,
    category: "Pants",
    image: "assets/jeans.jpg",
  },
  {
    id: 5,
    name: "Cargo Pants",
    price: 1099,
    category: "Pants",
    image: "assets/cargo.jpg",
  },
  {
    id: 6,
    name: "Formal Trousers",
    price: 999,
    category: "Pants",
    image: "assets/trousers.jpg",
  },
  {
    id: 7,
    name: "Athletic Shorts",
    price: 349,
    category: "Shorts",
    image: "assets/athlete-short.jpg",
  },
  {
    id: 8,
    name: "Denim Shorts",
    price: 499,
    category: "Shorts",
    image: "assets/denim-short.jpg",
  },
  {
    id: 9,
    name: "Beach Shorts",
    price: 399,
    category: "Shorts",
    image: "assets/beach-short.jpg",
  },
  {
    id: 10,
    name: "Ankle Socks (3-Pack)",
    price: 199,
    category: "Socks",
    image: "assets/ankle-socks.jpg",
  },
  {
    id: 11,
    name: "Sports Socks",
    price: 249,
    category: "Socks",
    image: "assets/sport-socks.jpg",
  },
  {
    id: 12,
    name: "Winter Socks",
    price: 299,
    category: "Socks",
    image: "assets/winter-socks.jpg",
  },
];

let cart = [];

// DOM ELEMENTS
const productsContainer = document.getElementById("products-container");
const cartItemsBody = document.getElementById("cart-items");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");
const discountEl = document.getElementById("discount");
const shippingEl = document.getElementById("shipping");
const btnClearCart = document.getElementById("btn-clear-cart");
const btnConfirmOrder = document.getElementById("btn-confirm-order");
const searchInput = document.getElementById("search-query");
const deliveryOptionEl = document.getElementById("deliveryOption");
const addressGroup = document.getElementById("addressGroup");
const addressEl = document.getElementById("address");

// RENDER PRODUCTS
function renderProducts(filtered = products) {
  productsContainer.innerHTML = "";
  filtered.forEach((product) => {
    const col = document.createElement("div");
    col.className = "col";
    col.innerHTML = `
      <div class="card h-100 shadow-sm border-0">
        <img src="${product.image}" class="card-img-top" alt="${product.name}">
        <div class="card-body d-flex flex-column">
          <small class="text-muted">${product.category}</small>
          <h6 class="card-title mt-1 mb-2">${product.name}</h6>
          <p class="fw-bold text-dark mb-3 mt-auto">₱${product.price.toLocaleString()}</p>
          <button class="btn btn-dark btn-sm w-100" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
      </div>
    `;
    productsContainer.appendChild(col);
  });
}

// CART FUNCTIONS
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  renderCart();
}

function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  renderCart();
}

function removeItem(id) {
  cart = cart.filter((i) => i.id !== id);
  renderCart();
}

function clearCart() {
  if (cart.length === 0) return;
  const confirmed = confirm(
    "Are you sure you want to clear your entire cart?\nThis action cannot be undone.",
  );
  if (!confirmed) return;
  cart = [];
  renderCart();
}

// COMPUTE TOTALS
function computeTotals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = subtotal >= 1000 ? subtotal * 0.1 : 0;
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * 0.12;

  const shipping = subtotal < 500 ? 80 : 0;

  const total = taxableAmount + tax + shipping;

  subtotalEl.textContent =
    "₱" + subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 });
  discountEl.textContent =
    "−₱" + discount.toLocaleString(undefined, { minimumFractionDigits: 2 });
  taxEl.textContent =
    "₱" + tax.toLocaleString(undefined, { minimumFractionDigits: 2 });
  shippingEl.textContent =
    "₱" + shipping.toLocaleString(undefined, { minimumFractionDigits: 2 });
  totalEl.textContent =
    "₱" + total.toLocaleString(undefined, { minimumFractionDigits: 2 });

  btnConfirmOrder.disabled = cart.length === 0;
}

// RENDER CART
function renderCart() {
  cartItemsBody.innerHTML = "";
  if (cart.length === 0) {
    cartItemsBody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-muted">Your cart is empty</td></tr>`;
    btnClearCart.disabled = true;
  } else {
    cart.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.name}</td>
        <td>₱${item.price.toLocaleString()}</td>
        <td>
          <div class="d-flex align-items-center">
            <button class="btn btn-sm btn-outline-secondary me-1" onclick="changeQty(${item.id}, -1)">−</button>
            <input type="number" class="form-control form-control-sm quantity-input text-center" value="${item.qty}" readonly>
            <button class="btn btn-sm btn-outline-secondary ms-1" onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="removeItem(${item.id})">×</button>
        </td>
      `;
      cartItemsBody.appendChild(row);
    });
    btnClearCart.disabled = false;
  }
  computeTotals();
}

// GENERATE RECEIPT
function generateReceipt() {
  const now = new Date();
  const orderId = "ORD-" + now.getTime().toString().slice(-8);
  const name = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const method = document.getElementById("paymentMethod").value;
  const delivery = deliveryOptionEl.value;
  const address = addressEl.value;

  let html = `
    <div class="text-center mb-4">
      <h4>Mini Checkout System</h4>
      <small>${now.toLocaleString()}</small>
    </div>
    <hr>
    <p><strong>Order ID:</strong> ${orderId}</p>
    <p><strong>Customer:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Payment:</strong> ${method}</p>
    <p><strong>Delivery Option:</strong> ${delivery}</p>
  `;
  if (delivery === "Delivery") {
    html += `<p><strong>Address:</strong> ${address}</p>`;
  }

  html += `
    <hr>
    <table class="table table-sm">
      <thead>
        <tr>
          <th>Item</th>
          <th class="text-end">Price</th>
          <th class="text-end">Qty</th>
          <th class="text-end">Total</th>
        </tr>
      </thead>
      <tbody>
  `;

  cart.forEach((item) => {
    const lineTotal = item.price * item.qty;
    html += `
      <tr>
        <td>${item.name}</td>
        <td class="text-end">₱${item.price.toLocaleString()}</td>
        <td class="text-end">${item.qty}</td>
        <td class="text-end">₱${lineTotal.toLocaleString()}</td>
      </tr>
    `;
  });

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = subtotal >= 1000 ? subtotal * 0.1 : 0;
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * 0.12;

  // SAME SHIPPING RULE IN RECEIPT
  const shipping = subtotal < 500 ? 80 : 0;

  const total = taxableAmount + tax + shipping;

  html += `
      </tbody>
    </table>
    <hr>
    <div class="d-flex justify-content-between"><strong>Subtotal</strong><span>₱${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
    <div class="d-flex justify-content-between"><strong>Discount${discount > 0 ? " (10%)" : ""}</strong><span>−₱${discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
    <div class="d-flex justify-content-between"><strong>Tax (12%)</strong><span>₱${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
    <div class="d-flex justify-content-between"><strong>Shipping Fee</strong><span>₱${shipping.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
    <hr>
    <div class="d-flex justify-content-between fs-5 fw-bold"><span>Total</span><span>₱${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
    <div class="text-center mt-4 text-muted small">Thank you for your purchase!</div>
  `;

  document.getElementById("receipt-content").innerHTML = html;
}

// EVENT LISTENERS
searchInput.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase().trim();
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
  );
  renderProducts(filtered);
});

btnClearCart.addEventListener("click", clearCart);

deliveryOptionEl.addEventListener("change", (e) => {
  if (e.target.value === "Delivery") {
    addressGroup.style.display = "block";
    addressEl.required = true;
  } else {
    addressGroup.style.display = "none";
    addressEl.required = false;
  }
  computeTotals();
});

btnConfirmOrder.addEventListener("click", () => {
  const form = document.getElementById("checkout-form");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  generateReceipt();
  const receiptModal = new bootstrap.Modal(
    document.getElementById("receiptModal"),
  );
  receiptModal.show();
  cart = [];
  renderCart();
  form.reset();
  addressGroup.style.display = "none";
  addressEl.required = false;
});

// INIT
renderProducts();
renderCart();
