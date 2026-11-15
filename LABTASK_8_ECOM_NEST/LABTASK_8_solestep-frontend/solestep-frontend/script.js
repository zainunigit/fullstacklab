const API_URL = "http://localhost:3000";

const categoryIcons = {
  Running: "🏃", Outdoor: "🥾", Formal: "👞", Casual: "👟",
  Sports: "⚡", Boots: "🥾", Lifestyle: "☁️", Premium: "⭐"
};

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[ch]);
}

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

async function api(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {})
    }
  });

  const raw = await response.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; }
  catch { data = raw; }

  if (!response.ok) {
    const message = data && typeof data === "object"
      ? (Array.isArray(data.message) ? data.message.join(", ") : data.message)
      : data;
    throw new Error(message || `Request failed (${response.status})`);
  }
  return data;
}

function showMessage(id, message, success = false) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.className = `small mt-2 ${success ? "text-success" : "text-danger"}`;
}

async function loadProducts() {
  const container = document.getElementById("products-container");
  const message = document.getElementById("products-message");
  if (!container) return;

  try {
    const category = document.getElementById("category-filter")?.value;
    const endpoint = category
      ? `/products/category/${encodeURIComponent(category)}`
      : "/products";
    const products = await api(endpoint);

    message.textContent = products.length ? "" : "No products found in this category.";
    container.innerHTML = products.map((product) => `
      <div class="col-md-6 col-lg-3">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body d-flex flex-column">
            <div class="display-4 text-center mb-3">${categoryIcons[product.category] || "👟"}</div>
            <h5 class="card-title">${escapeHTML(product.name)}</h5>
            <p class="text-muted small mb-2">${escapeHTML(product.category)}</p>
            <p class="card-text flex-grow-1">${escapeHTML(product.description)}</p>
            <div class="d-flex justify-content-between align-items-center gap-2">
              <strong class="text-primary">${money(product.price)}</strong>
              <button class="btn btn-primary btn-sm add-to-cart" data-product-id="${Number(product.id)}">Add to Cart</button>
            </div>
            <div class="mt-2">
              <label class="form-label small mb-1" for="size-${Number(product.id)}">Shoe size</label>
              <select class="form-select form-select-sm product-size" id="size-${Number(product.id)}">
                <option value="8">8</option><option value="9">9</option>
                <option value="10">10</option><option value="11">11</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    `).join("");
  } catch (error) {
    message.textContent = `Could not load products: ${error.message}. Check that the backend is running.`;
    message.className = "text-center text-danger py-3";
  }
}

async function loadReviews() {
  const container = document.getElementById("reviews-container");
  const message = document.getElementById("reviews-message");
  if (!container) return;
  try {
    const reviews = await api("/reviews");
    message.textContent = reviews.length ? "" : "No reviews yet.";
    container.innerHTML = reviews.map((review) => `
      <div class="col-md-4">
        <div class="card h-100 border-0 shadow-sm"><div class="card-body">
          <div class="text-warning mb-2">${"★".repeat(Math.max(0, Math.min(5, Number(review.rating) || 0)))}${"☆".repeat(5 - Math.max(0, Math.min(5, Number(review.rating) || 0)))}</div>
          <p class="text-secondary">${escapeHTML(review.comment)}</p>
          <h6 class="fw-bold mb-0">${escapeHTML(review.customerName)}</h6>
        </div></div>
      </div>
    `).join("");
  } catch (error) {
    message.textContent = `Could not load reviews: ${error.message}`;
    message.className = "text-center text-danger mb-3";
  }
}

async function loadCart() {
  const itemsEl = document.getElementById("cart-items");
  if (!itemsEl) return;
  try {
    const summary = await api("/cart/summary");
    const items = summary.items || [];
    itemsEl.innerHTML = items.length ? items.map((item) => `
      <div class="card border-0 shadow-sm mb-3"><div class="card-body">
        <div class="row align-items-center g-3">
          <div class="col-md-1"><span class="fs-2">${categoryIcons[item.category] || "👟"}</span></div>
          <div class="col-md-4"><h5 class="fw-bold mb-1">${escapeHTML(item.name)}</h5>
            <p class="text-primary fw-bold mb-0">${money(item.price)}</p>
            <small class="text-secondary">Size: ${item.size ?? "Not selected"}</small></div>
          <div class="col-md-3"><label class="form-label small" for="qty-${item.id}">Quantity</label>
            <input id="qty-${item.id}" class="form-control cart-quantity" type="number" min="1" step="1" value="${Number(item.quantity)}" data-item-id="${Number(item.id)}"></div>
          <div class="col-md-2 fw-bold">${money(item.price * item.quantity)}</div>
          <div class="col-md-2"><button class="btn btn-outline-danger btn-sm remove-cart-item" data-item-id="${Number(item.id)}">Remove</button></div>
        </div>
      </div></div>
    `).join("") : '<div class="alert alert-light border">Your cart is empty. Add a pair of shoes to get started.</div>';

    document.getElementById("cart-subtotal").textContent = money(summary.subtotal);
    document.getElementById("cart-shipping").textContent = money(summary.shipping);
    document.getElementById("cart-total").textContent = money(summary.total);

    const summaryItems = document.getElementById("checkout-summary-items");
    if (summaryItems) {
      summaryItems.innerHTML = items.length ? items.map(item => `
        <div class="d-flex justify-content-between mb-3 gap-2">
          <span>${escapeHTML(item.name)} × ${Number(item.quantity)}</span><span>${money(item.price * item.quantity)}</span>
        </div>`).join("") : '<p class="text-secondary">Your cart is empty.</p>';
      document.getElementById("checkout-subtotal").textContent = money(summary.subtotal);
      document.getElementById("checkout-shipping").textContent = money(summary.shipping);
      document.getElementById("checkout-total").textContent = money(summary.total);
    }
  } catch (error) {
    document.getElementById("cart-message").textContent = `Could not load cart: ${error.message}`;
  }
}

async function addToCart(productId, size) {
  try {
    await api("/cart/items", {
      method: "POST",
      body: JSON.stringify({ productId, quantity: 1, size })
    });
    document.getElementById("cart-message").textContent = "Item added to your cart.";
    await loadCart();
  } catch (error) {
    alert(`Could not add item: ${error.message}`);
  }
}

async function submitOrder(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const summary = await api("/cart/summary");
  if (!summary.items.length) {
    showMessage("checkout-message", "Your cart is empty. Add a product before placing an order.");
    return;
  }

  const payload = {
    firstName: document.getElementById("checkout-first").value.trim(),
    lastName: document.getElementById("checkout-last").value.trim(),
    email: document.getElementById("checkout-email").value.trim(),
    address: document.getElementById("checkout-address").value.trim(),
    city: document.getElementById("checkout-city").value.trim(),
    postalCode: document.getElementById("checkout-postal").value.trim(),
    paymentMethod: document.getElementById("checkout-payment").value
  };

  try {
    const order = await api("/orders", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    showMessage("checkout-message", `Order #${order.id} placed successfully.`, true);
    document.getElementById("order-confirmation").innerHTML = `
      <div class="alert alert-success">
        <h5 class="alert-heading">Thank you for your order!</h5>
        <p class="mb-2">Your order number is <strong>#${Number(order.id)}</strong>. Status: ${escapeHTML(order.status)}.</p>
        <button type="button" class="btn btn-outline-success btn-sm" id="track-order" data-order-id="${Number(order.id)}">Retrieve this order from backend</button>
        <div id="order-lookup-result" class="mt-2 small"></div>
      </div>`;
    form.reset();
    await loadCart();
  } catch (error) {
    showMessage("checkout-message", `Could not place order: ${error.message}`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  loadReviews();
  loadCart();

  document.getElementById("category-filter")?.addEventListener("change", loadProducts);

  document.getElementById("products-container")?.addEventListener("click", (event) => {
    const button = event.target.closest(".add-to-cart");
    if (!button) return;
    const id = Number(button.dataset.productId);
    const size = Number(document.getElementById(`size-${id}`).value);
    addToCart(id, size);
  });

  document.getElementById("cart-items")?.addEventListener("change", async (event) => {
    const input = event.target.closest(".cart-quantity");
    if (!input) return;
    const quantity = Number(input.value);
    if (!Number.isInteger(quantity) || quantity < 1) {
      alert("Quantity must be a positive whole number.");
      await loadCart();
      return;
    }
    try {
      await api(`/cart/items/${Number(input.dataset.itemId)}`, {
        method: "PATCH", body: JSON.stringify({ quantity })
      });
      await loadCart();
    } catch (error) { alert(error.message); }
  });

  document.getElementById("cart-items")?.addEventListener("click", async (event) => {
    const button = event.target.closest(".remove-cart-item");
    if (!button) return;
    try {
      await api(`/cart/items/${Number(button.dataset.itemId)}`, { method: "DELETE" });
      await loadCart();
    } catch (error) { alert(error.message); }
  });

  document.getElementById("clear-cart-button")?.addEventListener("click", async () => {
    try {
      await api("/cart", { method: "DELETE" });
      await loadCart();
    } catch (error) { alert(error.message); }
  });

  document.getElementById("signup-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fullName = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const confirm = document.getElementById("signup-confirm").value;
    if (password !== confirm) {
      showMessage("signup-message", "Passwords do not match.");
      return;
    }
    try {
      await api("/users/register", {
        method: "POST", body: JSON.stringify({ fullName, email, password })
      });
      showMessage("signup-message", "Account created. You can now log in.", true);
      event.currentTarget.reset();
    } catch (error) { showMessage("signup-message", error.message); }
  });

  document.getElementById("login-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const result = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: document.getElementById("login-email").value.trim(),
          password: document.getElementById("login-password").value
        })
      });
      showMessage("login-message", `Welcome, ${result.user.fullName}! ${result.message}`, true);
      const emailInput = document.getElementById("checkout-email");
      if (emailInput && !emailInput.value) emailInput.value = result.user.email;
      const nameParts = result.user.fullName.split(" ");
      const first = document.getElementById("checkout-first");
      const last = document.getElementById("checkout-last");
      if (first && !first.value) first.value = nameParts.shift() || "";
      if (last && !last.value) last.value = nameParts.join(" ");
    } catch (error) { showMessage("login-message", error.message); }
  });

  document.getElementById("logout-button")?.addEventListener("click", async () => {
    try {
      const result = await api("/auth/logout", { method: "POST" });
      showMessage("login-message", result.message, true);
    } catch (error) { showMessage("login-message", error.message); }
  });

  document.getElementById("show-forgot")?.addEventListener("click", () => {
    document.getElementById("forgot-panel").classList.toggle("d-none");
  });

  document.getElementById("forgot-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const result = await api("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: document.getElementById("forgot-email").value.trim() })
      });
      showMessage("forgot-message", result.message, true);
    } catch (error) { showMessage("forgot-message", error.message); }
  });

  document.getElementById("reset-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const result = await api("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email: document.getElementById("reset-email").value.trim(),
          newPassword: document.getElementById("reset-password").value
        })
      });
      showMessage("reset-message", result.message, true);
    } catch (error) { showMessage("reset-message", error.message); }
  });

  document.getElementById("review-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await api("/reviews", {
        method: "POST",
        body: JSON.stringify({
          customerName: document.getElementById("review-name").value.trim(),
          rating: Number(document.getElementById("review-rating").value),
          comment: document.getElementById("review-comment").value.trim()
        })
      });
      showMessage("review-form-message", "Thank you! Your review was submitted.", true);
      event.currentTarget.reset();
      await loadReviews();
    } catch (error) { showMessage("review-form-message", error.message); }
  });

  document.getElementById("checkout-form")?.addEventListener("submit", submitOrder);

  document.getElementById("order-confirmation")?.addEventListener("click", async (event) => {
    const button = event.target.closest("#track-order");
    if (!button) return;
    try {
      const order = await api(`/orders/${Number(button.dataset.orderId)}`);
      document.getElementById("order-lookup-result").textContent =
        `Backend order #${order.id} — ${order.status} — Total ${money(order.total)}`;
    } catch (error) {
      document.getElementById("order-lookup-result").textContent = error.message;
    }
  });
});
