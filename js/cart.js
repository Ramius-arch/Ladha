/**
 * LADHA — Universal E-Commerce Cart System
 * Persistent localStorage state, slide-over drawer, WhatsApp deep-link generation.
 */

(function () {
  const STORAGE_KEY = "ladha_cart_v1";

  // --- Cart State Utilities ---
  function getCart() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to read cart from localStorage", e);
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      updateBadges();
      renderCartDrawer();
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }

  function getCartCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  }

  function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  }

  function addToCart(product, size) {
    if (!product) return;
    const cart = getCart();
    const existingIndex = cart.findIndex((item) => item.id === product.id);

    if (existingIndex > -1) {
      // 1-of-1 pieces can only be claimed once, notify user
      showToast("ALREADY IN BAG (1-OF-1 PIECE)");
      openDrawer();
      return;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
        size: size || product.size,
        quantity: 1
      });
      saveCart(cart);
      showToast("ADDED TO BAG");
      openDrawer();
    }
  }

  function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter((item) => item.id !== productId);
    saveCart(cart);
  }

  function clearCart() {
    saveCart([]);
  }

  // --- Drawer UI Injection & Handling ---
  function injectDrawer() {
    if (document.getElementById("ladha-cart-drawer")) return;

    const drawerHTML = `
      <div class="cart-backdrop" id="ladha-cart-backdrop"></div>
      <aside class="cart-drawer" id="ladha-cart-drawer" aria-label="Shopping Bag">
        <div class="cart-header">
          <div class="cart-header-title">
            <span>BAG</span>
            <span class="cart-header-count" id="cart-drawer-count">(0)</span>
          </div>
          <button class="cart-close-btn" id="cart-close-btn" aria-label="Close Bag">&times;</button>
        </div>

        <div class="cart-items" id="cart-items-container">
          <!-- Populated by JS -->
        </div>

        <div class="cart-footer" id="cart-footer">
          <div class="cart-subtotal-row">
            <span class="cart-subtotal-label">SUBTOTAL</span>
            <span class="cart-subtotal-value" id="cart-subtotal-val">KES 0</span>
          </div>
          <p class="cart-shipping-note">Standard Nairobi Delivery: KES 250 • Countrywide: KES 450</p>
          <div class="cart-actions">
            <a href="checkout.html" class="btn btn-accent btn-block" id="cart-checkout-btn">
              PROCEED TO CHECKOUT <span class="btn-arrow">&rarr;</span>
            </a>
            <a href="#" class="btn btn-outline btn-block" id="cart-whatsapp-btn" target="_blank" rel="noopener">
              CLAIM VIA WHATSAPP
            </a>
          </div>
        </div>
      </aside>
      <div id="ladha-toast" class="ladha-toast" aria-live="polite"></div>
    `;

    const wrapper = document.createElement("div");
    wrapper.id = "ladha-cart-root";
    wrapper.innerHTML = drawerHTML;
    document.body.appendChild(wrapper);

    // Bind listeners
    document.getElementById("cart-close-btn").addEventListener("click", closeDrawer);
    document.getElementById("ladha-cart-backdrop").addEventListener("click", closeDrawer);

    // Escape key closes drawer
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDrawer();
    });
  }

  function openDrawer() {
    injectDrawer();
    renderCartDrawer();
    const drawer = document.getElementById("ladha-cart-drawer");
    const backdrop = document.getElementById("ladha-cart-backdrop");
    if (drawer && backdrop) {
      drawer.classList.add("open");
      backdrop.classList.add("open");
      document.body.classList.add("cart-open");
    }
  }

  function closeDrawer() {
    const drawer = document.getElementById("ladha-cart-drawer");
    const backdrop = document.getElementById("ladha-cart-backdrop");
    if (drawer && backdrop) {
      drawer.classList.remove("open");
      backdrop.classList.remove("open");
      document.body.classList.remove("cart-open");
    }
  }

  function renderCartDrawer() {
    const container = document.getElementById("cart-items-container");
    const countEl = document.getElementById("cart-drawer-count");
    const subtotalEl = document.getElementById("cart-subtotal-val");
    const footerEl = document.getElementById("cart-footer");
    const whatsappBtn = document.getElementById("cart-whatsapp-btn");

    if (!container) return;

    const cart = getCart();
    const count = getCartCount();
    const total = getCartTotal();

    if (countEl) countEl.textContent = `(${count})`;
    if (subtotalEl) subtotalEl.textContent = `KES ${total.toLocaleString()}`;

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <p class="cart-empty-title">YOUR BAG IS EMPTY.</p>
          <p class="cart-empty-sub">Taste waits for no one. 1-of-1 pieces move fast.</p>
          <a href="shop.html" class="btn btn-accent btn-sm" onclick="LadhaCart.close()">BROWSE DROPS &rarr;</a>
        </div>
      `;
      if (footerEl) footerEl.style.display = "none";
      return;
    }

    if (footerEl) footerEl.style.display = "block";

    container.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-item" data-id="${item.id}">
          <a href="product.html?id=${item.id}" class="cart-item-img-link">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          </a>
          <div class="cart-item-info">
            <div class="cart-item-header">
              <span class="cart-item-cat">${item.category}</span>
              <button class="cart-item-remove" onclick="LadhaCart.remove('${item.id}')" aria-label="Remove item">REMOVE</button>
            </div>
            <h4 class="cart-item-name">
              <a href="product.html?id=${item.id}">${item.name}</a>
            </h4>
            <p class="cart-item-size">SIZE: ${item.size}</p>
            <div class="cart-item-price">KES ${item.price.toLocaleString()}</div>
          </div>
        </div>
      `
      )
      .join("");

    // Setup WhatsApp claim message
    if (whatsappBtn) {
      let waMsg = `Hello LADHA, I want to secure these pieces from my bag:\n\n`;
      cart.forEach((item, index) => {
        waMsg += `${index + 1}. ${item.name} (${item.size}) — KES ${item.price.toLocaleString()}\n`;
      });
      waMsg += `\nSubtotal: KES ${total.toLocaleString()}`;
      waMsg += `\nPlease confirm availability and delivery to Nairobi!`;
      whatsappBtn.href = `https://wa.me/254700000000?text=${encodeURIComponent(waMsg)}`;
    }
  }

  function updateBadges() {
    const count = getCartCount();
    const badges = document.querySelectorAll(".cart-count-badge");
    badges.forEach((badge) => {
      badge.textContent = count;
      badge.setAttribute("data-count", count);
      badge.style.display = count > 0 ? "inline-flex" : "none";
    });

    const labels = document.querySelectorAll(".cart-btn-label");
    labels.forEach((label) => {
      label.textContent = `BAG (${count})`;
    });
  }

  function showToast(message) {
    const toast = document.getElementById("ladha-toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("active");
    setTimeout(() => {
      toast.classList.remove("active");
    }, 2200);
  }

  // --- Public API ---
  window.LadhaCart = {
    get: getCart,
    count: getCartCount,
    total: getCartTotal,
    add: function (productOrId, size) {
      let product = productOrId;
      if (typeof productOrId === "string") {
        if (typeof LADHA_PRODUCTS !== "undefined") {
          product = LADHA_PRODUCTS.find((p) => p.id === productOrId);
        }
      }
      addToCart(product, size);
    },
    remove: removeFromCart,
    clear: clearCart,
    open: openDrawer,
    close: closeDrawer,
    toast: showToast
  };

  // Auto initialize on DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    injectDrawer();
    updateBadges();

    // Bind all cart-toggle triggers
    document.querySelectorAll(".cart-trigger").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        openDrawer();
      });
    });
  });
})();
