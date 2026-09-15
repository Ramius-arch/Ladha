/**
 * LADHA — Unified Store Database Engine (Client-Side Reactive Layer)
 * Powers storefront and manager CRM with localStorage persistence, event dispatching, and JSON portability.
 */

(function () {
  const KEYS = {
    PRODUCTS: "ladha_products_v1",
    LOOKBOOK: "ladha_lookbook_v1",
    FEED: "ladha_feed_v1",
    SETTINGS: "ladha_settings_v1",
    ORDERS: "ladha_orders_v1"
  };

  // Factory Default Lookbook Data
  const DEFAULT_LOOKBOOK = [
    {
      id: "look-1",
      title: "LOOK 01 — STREET CLASSIC",
      caption: "LOOK 01 — STREET CLASSIC [ ARCHIVE // NBO ]",
      image: "assets/lookbook/look-1.jpg",
      isTall: true
    },
    {
      id: "look-2",
      title: "LOOK 02 — VINTAGE REVIVAL",
      caption: "LOOK 02 — VINTAGE REVIVAL [ ARCHIVE // NBO ]",
      image: "assets/lookbook/look-2.jpg",
      isTall: false
    },
    {
      id: "look-3",
      title: "LOOK 03 — URBAN EDGE",
      caption: "LOOK 03 — URBAN EDGE [ ARCHIVE // NBO ]",
      image: "assets/lookbook/look-3.jpg",
      isTall: false
    },
    {
      id: "look-4",
      title: "LOOK 04 — WEEKEND LAYERS",
      caption: "LOOK 04 — WEEKEND LAYERS [ ARCHIVE // NBO ]",
      image: "assets/lookbook/look-4.jpg",
      isTall: true
    }
  ];

  // Factory Default Feed Data
  const DEFAULT_FEED = [
    {
      id: "feed-1",
      caption: "LADHA Drop 01 — Rare 90s Nylon Sourced in Gikomba",
      image: "assets/feed/feed-1.jpg",
      url: "https://instagram.com/ladha.ke"
    },
    {
      id: "feed-2",
      caption: "LADHA Drop 02 — 14oz Marble Distressed Denim",
      image: "assets/feed/feed-2.jpg",
      url: "https://instagram.com/ladha.ke"
    },
    {
      id: "feed-3",
      caption: "LADHA Drop 03 — Heavyweight Reverse Weave Curation",
      image: "assets/feed/feed-3.jpg",
      url: "https://instagram.com/ladha.ke"
    },
    {
      id: "feed-4",
      caption: "LADHA Drop 04 — Raw Selvedge Denim Details",
      image: "assets/feed/feed-4.jpg",
      url: "https://instagram.com/ladha.ke"
    }
  ];

  // Factory Default Settings (Countdown & Ticker)
  const DEFAULT_SETTINGS = {
    dropTargetTimestamp: Date.now() + (2 * 24 * 3600 + 14 * 3600 + 28 * 60) * 1000,
    tickerNotice1: "GIKOMBA & TOI ARCHIVE BALES UNLOCKED",
    tickerNotice2: "NAIROBI SAME-DAY DISPATCH",
    tickerNotice3: "1-OF-1 PIECES • FIRST TO CLAIM WINS",
    tickerVisible: true,
    currencySymbol: "KES"
  };

  // Factory Sample Claims/Orders
  const DEFAULT_ORDERS = [
    {
      id: "LADHA-ORD-9821",
      customerName: "Ian Macharia",
      phone: "+254 712 345 678",
      estate: "Kilimani",
      address: "Dennis Pritt Rd, Apt 4B",
      items: [
        { id: "product-1", name: "Vintage Nike Colorblock Windbreaker", price: 3500, size: "L" }
      ],
      subtotal: 3500,
      deliveryFee: 250,
      total: 3750,
      paymentMethod: "MPESA",
      mpesaReceipt: "QFK482J9X1",
      status: "DISPATCHED",
      createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString()
    },
    {
      id: "LADHA-ORD-9818",
      customerName: "Brenda Wanjiru",
      phone: "+254 722 890 123",
      estate: "Westlands",
      address: "Rhapta Road, Villa 2",
      items: [
        { id: "product-6", name: "Minimalist Bias-Cut Silk Midi Skirt", price: 1800, size: "S/M" }
      ],
      subtotal: 1800,
      deliveryFee: 250,
      total: 2050,
      paymentMethod: "MPESA",
      mpesaReceipt: "QFL910K3Y8",
      status: "VERIFIED",
      createdAt: new Date(Date.now() - 3600 * 1000 * 18).toISOString()
    }
  ];

  // Helpers
  function readStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error(`Error reading ${key}`, e);
      return fallback;
    }
  }

  function writeStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent("ladha-db-updated", { detail: { key } }));
    } catch (e) {
      console.error(`Error writing ${key}`, e);
    }
  }

  // Database API
  const LadhaDB = {
    // --- Products ---
    getProducts: function () {
      let products = readStorage(KEYS.PRODUCTS, null);
      if (!products || !Array.isArray(products) || products.length === 0) {
        if (typeof LADHA_PRODUCTS !== "undefined" && Array.isArray(LADHA_PRODUCTS)) {
          products = JSON.parse(JSON.stringify(LADHA_PRODUCTS));
        } else {
          products = [];
        }
        writeStorage(KEYS.PRODUCTS, products);
      }
      return products;
    },

    getProductById: function (id) {
      const products = this.getProducts();
      return products.find((p) => p.id === id) || null;
    },

    getProduct: function (id) {
      return this.getProductById(id);
    },

    saveProduct: function (product) {
      if (!product || !product.id) return false;
      const products = this.getProducts();
      const index = products.findIndex((p) => p.id === product.id);
      if (index > -1) {
        products[index] = Object.assign({}, products[index], product);
      } else {
        products.unshift(product);
      }
      writeStorage(KEYS.PRODUCTS, products);
      return true;
    },

    deleteProduct: function (id) {
      let products = this.getProducts();
      products = products.filter((p) => p.id !== id);
      writeStorage(KEYS.PRODUCTS, products);
      return true;
    },

    toggleProductStock: function (id) {
      const products = this.getProducts();
      const product = products.find((p) => p.id === id);
      if (product) {
        product.inStock = !product.inStock;
        writeStorage(KEYS.PRODUCTS, products);
        return product.inStock;
      }
      return null;
    },

    // --- Lookbook ---
    getLookbook: function () {
      let items = readStorage(KEYS.LOOKBOOK, null);
      if (!items || !Array.isArray(items) || items.length === 0) {
        items = DEFAULT_LOOKBOOK;
        writeStorage(KEYS.LOOKBOOK, items);
      }
      return items;
    },

    saveLookbook: function (items) {
      writeStorage(KEYS.LOOKBOOK, items);
    },

    // --- Feed ---
    getFeed: function () {
      let items = readStorage(KEYS.FEED, null);
      if (!items || !Array.isArray(items) || items.length === 0) {
        items = DEFAULT_FEED;
        writeStorage(KEYS.FEED, items);
      }
      return items;
    },

    saveFeed: function (items) {
      writeStorage(KEYS.FEED, items);
    },

    // --- Settings (Drop Timer & Tickers) ---
    getSettings: function () {
      let settings = readStorage(KEYS.SETTINGS, null);
      if (!settings) {
        settings = DEFAULT_SETTINGS;
        writeStorage(KEYS.SETTINGS, settings);
      }
      return settings;
    },

    saveSettings: function (newSettings) {
      const current = this.getSettings();
      const updated = Object.assign({}, current, newSettings);
      writeStorage(KEYS.SETTINGS, updated);
      return updated;
    },

    // --- Orders / Claims ---
    getOrders: function () {
      let orders = readStorage(KEYS.ORDERS, null);
      if (!orders || !Array.isArray(orders)) {
        orders = DEFAULT_ORDERS;
        writeStorage(KEYS.ORDERS, orders);
      }
      return orders;
    },

    createOrder: function (orderData) {
      const orders = this.getOrders();
      const newOrder = Object.assign({
        id: "LADHA-ORD-" + Math.floor(1000 + Math.random() * 9000),
        status: "VERIFIED",
        createdAt: new Date().toISOString()
      }, orderData);
      orders.unshift(newOrder);
      writeStorage(KEYS.ORDERS, orders);
      return newOrder;
    },

    updateOrderStatus: function (orderId, newStatus) {
      const orders = this.getOrders();
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        order.status = newStatus;
        writeStorage(KEYS.ORDERS, orders);
        return true;
      }
      return false;
    },

    deleteOrder: function (orderId) {
      let orders = this.getOrders();
      orders = orders.filter((o) => o.id !== orderId);
      writeStorage(KEYS.ORDERS, orders);
      return true;
    },

    // --- Backup, Export & Reset ---
    exportDatabaseJSON: function () {
      const dump = {
        meta: {
          brand: "LADHA",
          exportedAt: new Date().toISOString(),
          version: "1.0.0"
        },
        products: this.getProducts(),
        lookbook: this.getLookbook(),
        feed: this.getFeed(),
        settings: this.getSettings(),
        orders: this.getOrders()
      };
      return JSON.stringify(dump, null, 2);
    },

    importDatabaseJSON: function (jsonStr) {
      try {
        const data = JSON.parse(jsonStr);
        if (data.products && Array.isArray(data.products)) writeStorage(KEYS.PRODUCTS, data.products);
        if (data.lookbook && Array.isArray(data.lookbook)) writeStorage(KEYS.LOOKBOOK, data.lookbook);
        if (data.feed && Array.isArray(data.feed)) writeStorage(KEYS.FEED, data.feed);
        if (data.settings && typeof data.settings === "object") writeStorage(KEYS.SETTINGS, data.settings);
        if (data.orders && Array.isArray(data.orders)) writeStorage(KEYS.ORDERS, data.orders);
        return { success: true };
      } catch (e) {
        return { success: false, error: e.message };
      }
    },

    resetToFactory: function () {
      let products = [];
      if (typeof LADHA_PRODUCTS !== "undefined" && Array.isArray(LADHA_PRODUCTS)) {
        products = JSON.parse(JSON.stringify(LADHA_PRODUCTS));
      }
      writeStorage(KEYS.PRODUCTS, products);
      writeStorage(KEYS.LOOKBOOK, DEFAULT_LOOKBOOK);
      writeStorage(KEYS.FEED, DEFAULT_FEED);
      writeStorage(KEYS.SETTINGS, DEFAULT_SETTINGS);
      writeStorage(KEYS.ORDERS, DEFAULT_ORDERS);
      return true;
    }
  };

  // Expose globally
  window.LadhaDB = LadhaDB;

  // Initialize immediately on script load
  document.addEventListener("DOMContentLoaded", () => {
    LadhaDB.getProducts();
    LadhaDB.getSettings();
  });
})();
