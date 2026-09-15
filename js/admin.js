/**
 * LADHA — Store Manager Command Center Controller
 * Powers real-time inventory editing, lookbook updates, feed curation,
 * drop countdown scheduler, orders tracking, and database export/import.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Guard check for database layer
  if (typeof LadhaDB === "undefined") {
    console.error("LadhaDB is required for Admin CRM");
    return;
  }

  // --- State Variables ---
  let activeTab = "inventory";
  let inventoryCategory = "ALL";
  let inventorySearchQuery = "";
  let dropTimerInterval = null;

  // --- DOM Elements ---
  const dom = {
    // Top bar & KPIs
    clock: document.querySelectorAll(".live-nairobi-clock"),
    kpiActiveInv: document.getElementById("kpi-active-inventory"),
    kpiArchiveVal: document.getElementById("kpi-archive-value"),
    kpiOrdersCount: document.getElementById("kpi-orders-count"),
    kpiOrdersRevenue: document.getElementById("kpi-orders-revenue"),
    kpiPendingDispatch: document.getElementById("kpi-pending-dispatches"),

    // Tabs
    tabBtns: document.querySelectorAll(".admin-tab-btn"),
    panels: document.querySelectorAll(".admin-panel"),

    // Inventory Tab
    invTbody: document.getElementById("inventory-tbody"),
    invSearch: document.getElementById("inventory-search"),
    invCatBtns: document.querySelectorAll("#inventory-category-filters .filter-btn"),
    invCountLabel: document.getElementById("inventory-count-label"),
    btnAddGarment: document.getElementById("btn-add-garment"),
    btnQuickNewPiece: document.getElementById("btn-quick-new-piece"),

    // Lookbook Tab
    lookbookContainer: document.getElementById("lookbook-cards-container"),
    btnSaveLookbook: document.getElementById("btn-save-lookbook"),

    // Feed Tab
    feedContainer: document.getElementById("feed-cards-container"),
    btnSaveFeed: document.getElementById("btn-save-feed"),

    // Timer Tab
    timerInput: document.getElementById("timer-drop-datetime"),
    timerDigitsPreview: document.getElementById("timer-preview-digits"),
    ticker1: document.getElementById("ticker-notice-1"),
    ticker2: document.getElementById("ticker-notice-2"),
    ticker3: document.getElementById("ticker-notice-3"),
    tickerVisibleToggle: document.getElementById("ticker-visible-toggle"),
    btnSaveTimer: document.getElementById("btn-save-timer"),

    // Claims & Orders Tab
    ordersTbody: document.getElementById("orders-tbody"),
    btnSimulateOrder: document.getElementById("btn-simulate-order"),

    // Backup Tab
    btnExportJson: document.getElementById("btn-export-json"),
    btnImportJson: document.getElementById("btn-import-json"),
    importFileInput: document.getElementById("import-json-file"),
    btnResetFactory: document.getElementById("btn-reset-factory"),

    // Garment Modal
    modal: document.getElementById("garment-modal"),
    modalBackdrop: document.getElementById("modal-backdrop"),
    modalCloseBtn: document.getElementById("modal-close-btn"),
    modalCancelBtn: document.getElementById("modal-cancel-btn"),
    modalSaveBtn: document.getElementById("modal-save-btn"),
    modalHeading: document.getElementById("modal-garment-heading"),
    garmentForm: document.getElementById("garment-form"),
    editId: document.getElementById("edit-id"),
    editIdDisplay: document.getElementById("edit-id-display"),
    editName: document.getElementById("edit-name"),
    editCategory: document.getElementById("edit-category"),
    editPrice: document.getElementById("edit-price"),
    editSize: document.getElementById("edit-size"),
    editStock: document.getElementById("edit-stock"),
    editCondition: document.getElementById("edit-condition"),
    editProvenance: document.getElementById("edit-provenance"),
    editConditionNote: document.getElementById("edit-condition-note"),
    editFabric: document.getElementById("edit-fabric"),
    editDescription: document.getElementById("edit-description"),
    editImage: document.getElementById("edit-image"),
    editImgPreview: document.getElementById("edit-img-preview"),

    // Measurements Inputs
    editPitIn: document.getElementById("edit-pit-in"),
    editPitCm: document.getElementById("edit-pit-cm"),
    editLenIn: document.getElementById("edit-len-in"),
    editLenCm: document.getElementById("edit-len-cm"),
    editShIn: document.getElementById("edit-sh-in"),
    editShCm: document.getElementById("edit-sh-cm"),
    editSlIn: document.getElementById("edit-sl-in"),
    editSlCm: document.getElementById("edit-sl-cm"),

    // Toast
    toast: document.getElementById("ladha-toast")
  };

  // --- Toast Notification ---
  function showToast(msg) {
    if (!dom.toast) return;
    dom.toast.textContent = msg;
    dom.toast.classList.add("active");
    setTimeout(() => {
      dom.toast.classList.remove("active");
    }, 2400);
  }

  // --- Live Nairobi EAT Clock ---
  function updateNairobiClock() {
    const now = new Date();
    const utcHours = now.getUTCHours();
    const eatHours = (utcHours + 3) % 24;
    const eatMinutes = String(now.getUTCMinutes()).padStart(2, "0");
    const eatSeconds = String(now.getUTCSeconds()).padStart(2, "0");
    const formattedHours = String(eatHours).padStart(2, "0");
    const timeStr = `NAIROBI ${formattedHours}:${eatMinutes}:${eatSeconds} EAT`;
    dom.clock.forEach((el) => {
      el.textContent = timeStr;
    });
  }
  updateNairobiClock();
  setInterval(updateNairobiClock, 1000);

  // --- Tab Navigation ---
  dom.tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");
      dom.tabBtns.forEach((b) => b.classList.remove("active"));
      dom.panels.forEach((p) => p.classList.remove("active"));

      btn.classList.add("active");
      const targetPanel = document.getElementById(`panel-${targetTab}`);
      if (targetPanel) targetPanel.classList.add("active");
      activeTab = targetTab;
    });
  });

  // --- KPI HUD Metrics Calculation ---
  function renderKPIMetrics() {
    const products = LadhaDB.getProducts();
    const orders = LadhaDB.getOrders();

    const activeInStock = products.filter((p) => p.inStock);
    const totalArchiveVal = activeInStock.reduce((acc, p) => acc + (p.price || 0), 0);

    const totalOrdersRev = orders.reduce((acc, o) => acc + (o.total || 0), 0);
    const pendingDispatches = orders.filter((o) => o.status === "VERIFIED" || o.status === "PENDING").length;

    if (dom.kpiActiveInv) dom.kpiActiveInv.textContent = `${activeInStock.length} PIECES`;
    if (dom.kpiArchiveVal) dom.kpiArchiveVal.textContent = `KES ${totalArchiveVal.toLocaleString()}`;
    if (dom.kpiOrdersCount) dom.kpiOrdersCount.textContent = `${orders.length} CLAIMS`;
    if (dom.kpiOrdersRevenue) dom.kpiOrdersRevenue.textContent = `KES ${totalOrdersRev.toLocaleString()} in verified volume`;
    if (dom.kpiPendingDispatch) dom.kpiPendingDispatch.textContent = `${pendingDispatches} PENDING`;
  }

  // --- Tab 1: Inventory Table & Filtering ---
  function renderInventoryTable() {
    if (!dom.invTbody) return;
    const products = LadhaDB.getProducts();

    const query = inventorySearchQuery.toLowerCase().trim();
    const filtered = products.filter((p) => {
      const matchCat = inventoryCategory === "ALL" || p.category.toUpperCase() === inventoryCategory.toUpperCase();
      const matchQuery =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.fabric && p.fabric.toLowerCase().includes(query));
      return matchCat && matchQuery;
    });

    if (dom.invCountLabel) {
      dom.invCountLabel.textContent = `SHOWING ${filtered.length} OF ${products.length} PIECES`;
    }

    if (filtered.length === 0) {
      dom.invTbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 4rem 1rem; color: var(--text-muted); font-family: var(--font-mono); font-size: 11px;">
            NO MATCHING ARCHIVE PIECES FOUND. TRY ANOTHER SEARCH OR RESET FILTERS.
          </td>
        </tr>
      `;
      return;
    }

    dom.invTbody.innerHTML = filtered
      .map(
        (p) => `
        <tr data-id="${p.id}">
          <td>
            <img src="${p.image}" alt="${p.name}" class="thumb-preview" onerror="this.src='assets/products/product-1.jpg'">
          </td>
          <td>
            <div class="table-item-name">${p.name}</div>
            <div class="table-item-meta">${p.id.toUpperCase()} • ${p.provenance || "Nairobi"}</div>
          </td>
          <td>
            <span style="font-family: var(--font-mono); font-size: 10px; font-weight: 700; color: #444;">${p.category}</span>
          </td>
          <td>
            <span style="font-family: var(--font-mono); font-size: 11px;">${p.size}</span>
          </td>
          <td>
            <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);">${p.condition || "Grade A"}</span>
          </td>
          <td style="text-align: right;">
            <div style="display: inline-flex; align-items: center; gap: 4px;">
              <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);">KES</span>
              <input type="number" class="inline-price-input" data-id="${p.id}" value="${p.price}">
            </div>
          </td>
          <td style="text-align: center;">
            <button class="stock-badge ${p.inStock ? "in-stock" : "sold-out"}" onclick="window.LadhaAdmin.toggleStock('${p.id}')" title="Click to toggle availability">
              <span class="card-live-dot" style="background: ${p.inStock ? "#72a300" : "#888"};"></span>
              ${p.inStock ? "1-OF-1 AVAILABLE" : "SOLD OUT"}
            </button>
          </td>
          <td style="text-align: right;">
            <div class="action-btn-group" style="justify-content: flex-end;">
              <button class="btn-action-sm" onclick="window.LadhaAdmin.openEditModal('${p.id}')">EDIT</button>
              <button class="btn-action-sm" onclick="window.LadhaAdmin.duplicatePiece('${p.id}')" title="Duplicate piece">COPY</button>
              <button class="btn-action-sm danger" onclick="window.LadhaAdmin.deletePiece('${p.id}')">DEL</button>
            </div>
          </td>
        </tr>
      `
      )
      .join("");

    // Bind inline price change listeners
    dom.invTbody.querySelectorAll(".inline-price-input").forEach((input) => {
      input.addEventListener("change", (e) => {
        const id = e.target.getAttribute("data-id");
        const newPrice = parseInt(e.target.value) || 0;
        const product = LadhaDB.getProductById(id);
        if (product) {
          product.price = newPrice;
          LadhaDB.saveProduct(product);
          renderKPIMetrics();
          showToast(`PRICE UPDATED: ${product.name} → KES ${newPrice.toLocaleString()}`);
        }
      });
    });
  }

  // Inventory Search & Category Filter Binding
  if (dom.invSearch) {
    dom.invSearch.addEventListener("input", (e) => {
      inventorySearchQuery = e.target.value;
      renderInventoryTable();
    });
  }

  dom.invCatBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      dom.invCatBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      inventoryCategory = btn.getAttribute("data-cat");
      renderInventoryTable();
    });
  });

  // --- Garment Edit / Create Modal ---
  function openGarmentModal(product = null) {
    if (!dom.modal || !dom.modalBackdrop) return;

    if (product) {
      dom.modalHeading.textContent = `EDIT PIECE // ${product.id.toUpperCase()}`;
      dom.editId.value = product.id;
      dom.editIdDisplay.value = product.id;
      dom.editIdDisplay.readOnly = true;
      dom.editName.value = product.name || "";
      dom.editCategory.value = product.category || "STREETWEAR";
      dom.editPrice.value = product.price || 0;
      dom.editSize.value = product.size || "";
      dom.editStock.value = product.inStock !== false ? "true" : "false";
      dom.editCondition.value = product.condition || "";
      dom.editProvenance.value = product.provenance || "";
      dom.editConditionNote.value = product.conditionNote || "";
      dom.editFabric.value = product.fabric || "";
      dom.editDescription.value = product.description || "";
      dom.editImage.value = product.image || "assets/products/product-1.jpg";
      dom.editImgPreview.src = product.image || "assets/products/product-1.jpg";
      updateGarmentAssetPreview(product.image || "assets/products/product-1.jpg");
      updateGarmentAssetPreview(product.image || "assets/products/product-1.jpg");

      // Measurements
      const inMeas = product.measurementsIn || {};
      const cmMeas = product.measurementsCm || {};
      dom.editPitIn.value = inMeas["PIT TO PIT"] || "";
      dom.editPitCm.value = cmMeas["PIT TO PIT"] || "";
      dom.editLenIn.value = inMeas["TOTAL LENGTH"] || "";
      dom.editLenCm.value = cmMeas["TOTAL LENGTH"] || "";
      dom.editShIn.value = inMeas["SHOULDER WIDTH"] || "";
      dom.editShCm.value = cmMeas["SHOULDER WIDTH"] || "";
      dom.editSlIn.value = inMeas["SLEEVE LENGTH"] || "";
      dom.editSlCm.value = cmMeas["SLEEVE LENGTH"] || "";
    } else {
      // New Piece Defaults
      const newId = "product-" + (LadhaDB.getProducts().length + 1);
      dom.modalHeading.textContent = "NEW ARCHIVE PIECE";
      dom.editId.value = newId;
      dom.editIdDisplay.value = newId;
      dom.editIdDisplay.readOnly = false;
      dom.editName.value = "";
      dom.editCategory.value = "STREETWEAR";
      dom.editPrice.value = 2500;
      dom.editSize.value = "L";
      dom.editStock.value = "true";
      dom.editCondition.value = "Grade A Vintage (9.5/10)";
      dom.editProvenance.value = "Sourced in Gikomba.";
      dom.editConditionNote.value = "Hand-selected vintage condition. Clean seams and authentic patina.";
      dom.editFabric.value = "100% Cotton";
      dom.editDescription.value = "1-of-1 archive curation piece. Hand-picked and steam-treated in Nairobi.";
      dom.editImage.value = "assets/products/product-1.jpg";
      dom.editImgPreview.src = "assets/products/product-1.jpg";
      updateGarmentAssetPreview("assets/products/product-1.jpg");
      updateGarmentAssetPreview("assets/products/product-1.jpg");

      dom.editPitIn.value = "23.0 in";
      dom.editPitCm.value = "58.5 cm";
      dom.editLenIn.value = "28.0 in";
      dom.editLenCm.value = "71.0 cm";
      dom.editShIn.value = "20.0 in";
      dom.editShCm.value = "51.0 cm";
      dom.editSlIn.value = "25.0 in";
      dom.editSlCm.value = "63.5 cm";
    }

    dom.modal.classList.add("open");
    dom.modalBackdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeGarmentModal() {
    if (!dom.modal || !dom.modalBackdrop) return;
    dom.modal.classList.remove("open");
    dom.modalBackdrop.classList.remove("open");
    document.body.style.overflow = "";
  }

  // Image preview live update
  if (dom.editImage) {
    dom.editImage.addEventListener("input", (e) => {
      dom.editImgPreview.src = e.target.value;
    });
  }

  // Modal bindings
  if (dom.modalCloseBtn) dom.modalCloseBtn.addEventListener("click", closeGarmentModal);
  if (dom.modalCancelBtn) dom.modalCancelBtn.addEventListener("click", closeGarmentModal);
  if (dom.modalBackdrop) dom.modalBackdrop.addEventListener("click", closeGarmentModal);
  if (dom.btnAddGarment) dom.btnAddGarment.addEventListener("click", () => openGarmentModal(null));
  if (dom.btnQuickNewPiece) dom.btnQuickNewPiece.addEventListener("click", () => openGarmentModal(null));

  // Save Modal Form
  if (dom.modalSaveBtn) {
    dom.modalSaveBtn.addEventListener("click", () => {
      const id = (dom.editIdDisplay.value || dom.editId.value || "product-" + Date.now()).trim();
      const name = dom.editName.value.trim();
      if (!name) {
        alert("Please enter a garment title.");
        return;
      }

      const product = {
        id: id,
        name: name,
        category: dom.editCategory.value,
        price: parseInt(dom.editPrice.value) || 0,
        size: dom.editSize.value,
        inStock: dom.editStock.value === "true",
        condition: dom.editCondition.value,
        provenance: dom.editProvenance.value,
        conditionNote: dom.editConditionNote.value,
        fabric: dom.editFabric.value,
        description: dom.editDescription.value,
        image: dom.editImage.value,
        measurementsIn: {
          "PIT TO PIT": dom.editPitIn.value || "23.0 in",
          "TOTAL LENGTH": dom.editLenIn.value || "28.0 in",
          "SHOULDER WIDTH": dom.editShIn.value || "20.0 in",
          "SLEEVE LENGTH": dom.editSlIn.value || "25.0 in"
        },
        measurementsCm: {
          "PIT TO PIT": dom.editPitCm.value || "58.5 cm",
          "TOTAL LENGTH": dom.editLenCm.value || "71.0 cm",
          "SHOULDER WIDTH": dom.editShCm.value || "51.0 cm",
          "SLEEVE LENGTH": dom.editSlCm.value || "63.5 cm"
        }
      };

      LadhaDB.saveProduct(product);
      renderInventoryTable();
      renderKPIMetrics();
      closeGarmentModal();
      showToast(`ARCHIVE PIECE SAVED: ${product.name}`);
    });
  }

  // --- Tab 2: Editorial Lookbook Manager ---
  function renderLookbookPanel() {
    if (!dom.lookbookContainer) return;
    const items = LadhaDB.getLookbook();

    dom.lookbookContainer.innerHTML = items
      .map(
        (item, idx) => `
        <div class="admin-card" data-index="${idx}">
          <div class="admin-card-header">
            <span class="admin-card-title">LOOK 0${idx + 1} CAMPAIGN</span>
            <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);">SLOT 0${idx + 1}</span>
          </div>

          <div style="display: flex; gap: 1.5rem; align-items: flex-start; margin-bottom: 1rem;">
            <div style="width: 110px; aspect-ratio: ${item.isTall ? "3/5" : "4/5"}; background: #f0eee9; border: 1px solid var(--border); overflow: hidden; flex-shrink: 0; position: relative; cursor: pointer;" onclick="window.LadhaAdmin.pickMediaForLookbook(${idx})" title="Click to replace asset">
              <div class="viewfinder-corners"></div>
              <img src="${item.image}" alt="${item.title}" id="look-img-preview-${idx}" style="width: 100%; height: 100%; object-fit: cover;">
              <span style="position: absolute; bottom: 4px; left: 4px; right: 4px; background: rgba(10,10,10,0.85); color: #fff; font-family: var(--font-mono); font-size: 8px; text-align: center; padding: 2px 0;">REPLACE ↗</span>
            </div>

            <div style="flex-grow: 1;">
              <div class="form-row">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                  <label style="margin-bottom: 0;">Photograph or Video Asset</label>
                  <button type="button" class="btn-lib-browse" onclick="window.LadhaAdmin.pickMediaForLookbook(${idx})">📁 CHOOSE FROM LIBRARY</button>
                </div>
                <input type="text" id="look-input-${idx}" class="look-image-input" data-index="${idx}" value="${item.image}">
              </div>
              <div class="form-row">
                <label>Caption & Stamped Details</label>
                <input type="text" class="look-caption-input" data-index="${idx}" value="${item.caption}">
              </div>
              <div class="form-row">
                <label>Aspect Ratio</label>
                <select class="look-tall-select" data-index="${idx}">
                  <option value="true" ${item.isTall ? "selected" : ""}>Tall Editorial (3:5 Ratio)</option>
                  <option value="false" ${!item.isTall ? "selected" : ""}>Standard Square/Portrait (4:5 Ratio)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      `
      )
      .join("");

    // Bind image preview
    dom.lookbookContainer.querySelectorAll(".look-image-input").forEach((input) => {
      input.addEventListener("input", (e) => {
        const idx = e.target.getAttribute("data-index");
        const img = document.getElementById(`look-img-preview-${idx}`);
        if (img) img.src = e.target.value;
      });
    });
  }

  if (dom.btnSaveLookbook) {
    dom.btnSaveLookbook.addEventListener("click", () => {
      const items = LadhaDB.getLookbook();
      dom.lookbookContainer.querySelectorAll(".admin-card").forEach((card) => {
        const idx = parseInt(card.getAttribute("data-index"));
        const imgInput = card.querySelector(".look-image-input");
        const captionInput = card.querySelector(".look-caption-input");
        const tallSelect = card.querySelector(".look-tall-select");

        if (items[idx]) {
          items[idx].image = imgInput ? imgInput.value.trim() : items[idx].image;
          items[idx].caption = captionInput ? captionInput.value.trim() : items[idx].caption;
          items[idx].isTall = tallSelect ? tallSelect.value === "true" : items[idx].isTall;
        }
      });
      LadhaDB.saveLookbook(items);
      showToast("CAMPAIGN LOOKBOOK SAVED! LIVE ON HOMEPAGE");
    });
  }

  // --- Tab 3: The Feed Manager ---
  function renderFeedPanel() {
    if (!dom.feedContainer) return;
    const items = LadhaDB.getFeed();

    dom.feedContainer.innerHTML = items
      .map(
        (item, idx) => `
        <div class="admin-card" data-index="${idx}">
          <div class="admin-card-header">
            <span class="admin-card-title">FEED TILE 0${idx + 1}</span>
            <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);">INSTAGRAM</span>
          </div>

          <div style="display: flex; gap: 1.5rem; align-items: flex-start; margin-bottom: 1rem;">
            <div style="width: 95px; height: 95px; background: #f0eee9; border: 1px solid var(--border); overflow: hidden; flex-shrink: 0; position: relative; cursor: pointer;" onclick="window.LadhaAdmin.pickMediaForFeed(${idx})" title="Click to replace asset">
              <img src="${item.image}" alt="Feed" id="feed-img-preview-${idx}" style="width: 100%; height: 100%; object-fit: cover;">
              <span style="position: absolute; bottom: 4px; left: 4px; right: 4px; background: rgba(10,10,10,0.85); color: #fff; font-family: var(--font-mono); font-size: 8px; text-align: center; padding: 2px 0;">REPLACE ↗</span>
            </div>

            <div style="flex-grow: 1;">
              <div class="form-row">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                  <label style="margin-bottom: 0;">Tile Photograph</label>
                  <button type="button" class="btn-lib-browse" onclick="window.LadhaAdmin.pickMediaForFeed(${idx})">📁 CHOOSE FROM LIBRARY</button>
                </div>
                <input type="text" id="feed-input-${idx}" class="feed-image-input" data-index="${idx}" value="${item.image}">
              </div>
              <div class="form-row">
                <label>Caption / Drop Tag</label>
                <input type="text" class="feed-caption-input" data-index="${idx}" value="${item.caption || ""}">
              </div>
              <div class="form-row">
                <label>Instagram URL</label>
                <input type="text" class="feed-url-input" data-index="${idx}" value="${item.url || "https://instagram.com/ladha.ke"}">
              </div>
            </div>
          </div>
        </div>
      `
      )
      .join("");

    dom.feedContainer.querySelectorAll(".feed-image-input").forEach((input) => {
      input.addEventListener("input", (e) => {
        const idx = e.target.getAttribute("data-index");
        const img = document.getElementById(`feed-img-preview-${idx}`);
        if (img) img.src = e.target.value;
      });
    });
  }

  if (dom.btnSaveFeed) {
    dom.btnSaveFeed.addEventListener("click", () => {
      const items = LadhaDB.getFeed();
      dom.feedContainer.querySelectorAll(".admin-card").forEach((card) => {
        const idx = parseInt(card.getAttribute("data-index"));
        const imgInput = card.querySelector(".feed-image-input");
        const capInput = card.querySelector(".feed-caption-input");
        const urlInput = card.querySelector(".feed-url-input");

        if (items[idx]) {
          items[idx].image = imgInput ? imgInput.value.trim() : items[idx].image;
          items[idx].caption = capInput ? capInput.value.trim() : items[idx].caption;
          items[idx].url = urlInput ? urlInput.value.trim() : items[idx].url;
        }
      });
      LadhaDB.saveFeed(items);
      showToast("THE FEED CURATION SAVED! LIVE ON HOMEPAGE");
    });
  }

  // --- Tab 4: Drop Countdown & Ticker Manager ---
  function renderTimerPanel() {
    const settings = LadhaDB.getSettings();

    if (dom.timerInput) {
      const d = new Date(settings.dropTargetTimestamp || Date.now() + 86400000 * 2);
      // Format as YYYY-MM-DDTHH:mm
      const pad = (n) => String(n).padStart(2, "0");
      const localIso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      dom.timerInput.value = localIso;
    }

    if (dom.ticker1) dom.ticker1.value = settings.tickerNotice1 || "";
    if (dom.ticker2) dom.ticker2.value = settings.tickerNotice2 || "";
    if (dom.ticker3) dom.ticker3.value = settings.tickerNotice3 || "";
    if (dom.tickerVisibleToggle) dom.tickerVisibleToggle.checked = settings.tickerVisible !== false;

    // Live preview update
    function updateTimerPreview() {
      if (!dom.timerDigitsPreview) return;
      const targetTime = dom.timerInput && dom.timerInput.value ? new Date(dom.timerInput.value).getTime() : settings.dropTargetTimestamp;
      const now = Date.now();
      const diff = Math.max(0, targetTime - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const pad = (n) => String(n).padStart(2, "0");
      dom.timerDigitsPreview.textContent = `${pad(days)}D ${pad(hours)}H ${pad(minutes)}M ${pad(seconds)}S`;
    }

    updateTimerPreview();
    if (dropTimerInterval) clearInterval(dropTimerInterval);
    dropTimerInterval = setInterval(updateTimerPreview, 1000);
  }

  if (dom.btnSaveTimer) {
    dom.btnSaveTimer.addEventListener("click", () => {
      const targetDate = dom.timerInput.value ? new Date(dom.timerInput.value).getTime() : Date.now() + 86400000 * 2;
      const updated = {
        dropTargetTimestamp: targetDate,
        tickerNotice1: dom.ticker1 ? dom.ticker1.value.trim() : "",
        tickerNotice2: dom.ticker2 ? dom.ticker2.value.trim() : "",
        tickerNotice3: dom.ticker3 ? dom.ticker3.value.trim() : "",
        tickerVisible: dom.tickerVisibleToggle ? dom.tickerVisibleToggle.checked : true
      };
      LadhaDB.saveSettings(updated);
      showToast("RUNWAY DROP TIMER & TICKER UPDATED SITE-WIDE!");
    });
  }

  // --- Tab 5: Claims & Orders ---
  function renderOrdersPanel() {
    if (!dom.ordersTbody) return;
    const orders = LadhaDB.getOrders();

    if (orders.length === 0) {
      dom.ordersTbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; padding: 4rem 1rem; color: var(--text-muted); font-family: var(--font-mono); font-size: 11px;">
            NO ORDERS RECORDED YET. SIMULATE A TEST CHECKOUT OR RECORD CUSTOMER CLAIMS.
          </td>
        </tr>
      `;
      return;
    }

    dom.ordersTbody.innerHTML = orders
      .map((o) => {
        const dateStr = o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-KE", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Today";
        const itemsSummary = o.items ? o.items.map((i) => `${i.name} (${i.size})`).join(", ") : "Curated Piece";

        return `
          <tr data-order-id="${o.id}">
            <td>
              <strong style="font-family: var(--font-mono); font-size: 11px; color: #0a0a0a;">${o.id}</strong>
              <div style="font-size: 10px; color: var(--text-muted);">${dateStr}</div>
            </td>
            <td><strong>${o.customerName || "Customer"}</strong></td>
            <td><span style="font-family: var(--font-mono); font-size: 11px;">${o.phone || "—"}</span></td>
            <td>
              <div><strong>${o.estate || "Nairobi"}</strong></div>
              <div style="font-size: 10px; color: var(--text-muted);">${o.address || ""}</div>
            </td>
            <td style="max-width: 220px; font-size: 11px; color: #444;">${itemsSummary}</td>
            <td style="text-align: right; font-family: var(--font-mono); font-weight: 800;">KES ${(o.total || 0).toLocaleString()}</td>
            <td style="text-align: center;">
              <span style="font-family: var(--font-mono); font-size: 10px; background: #fafaf8; border: 1px solid var(--border); padding: 2px 6px;">
                ${o.mpesaReceipt || "M-PESA"}
              </span>
            </td>
            <td style="text-align: center;">
              <select class="order-status-select" onchange="window.LadhaAdmin.changeOrderStatus('${o.id}', this.value)">
                <option value="PENDING" ${o.status === "PENDING" ? "selected" : ""}>PENDING</option>
                <option value="VERIFIED" ${o.status === "VERIFIED" ? "selected" : ""}>VERIFIED (PAID)</option>
                <option value="DISPATCHED" ${o.status === "DISPATCHED" ? "selected" : ""}>DISPATCHED</option>
                <option value="DELIVERED" ${o.status === "DELIVERED" ? "selected" : ""}>DELIVERED</option>
              </select>
            </td>
            <td style="text-align: right;">
              <button class="btn-action-sm danger" onclick="window.LadhaAdmin.deleteOrder('${o.id}')">DEL</button>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  if (dom.btnSimulateOrder) {
    dom.btnSimulateOrder.addEventListener("click", () => {
      const products = LadhaDB.getProducts();
      const randomPiece = products[Math.floor(Math.random() * products.length)];

      const sampleNames = ["Kevin Otieno", "Wanjiku Mwangi", "Ahmed Noor", "Faith Chebet", "David Karanja"];
      const sampleEstates = ["Kilimani", "Westlands", "Kileleshwa", "Karen", "Lavington", "Parklands"];

      const order = LadhaDB.createOrder({
        customerName: sampleNames[Math.floor(Math.random() * sampleNames.length)],
        phone: "+254 7" + Math.floor(10000000 + Math.random() * 90000000),
        estate: sampleEstates[Math.floor(Math.random() * sampleEstates.length)],
        address: "Apartment 3B, Gate 4",
        items: [
          { id: randomPiece.id, name: randomPiece.name, price: randomPiece.price, size: randomPiece.size }
        ],
        subtotal: randomPiece.price,
        deliveryFee: 250,
        total: randomPiece.price + 250,
        paymentMethod: "MPESA",
        mpesaReceipt: "QK" + Math.floor(100000 + Math.random() * 900000) + "X"
      });

      renderOrdersPanel();
      renderKPIMetrics();
      showToast(`NEW SIMULATED ORDER CREATED: ${order.id} (KES ${order.total.toLocaleString()})`);
    });
  }

  // --- Tab 6: Database Portability & Backup ---
  if (dom.btnExportJson) {
    dom.btnExportJson.addEventListener("click", () => {
      const dump = LadhaDB.exportDatabaseJSON();
      const blob = new Blob([dump], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ladha-archive-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("BACKUP EXPORTED SUCCESSFULLY (.JSON)");
    });
  }

  if (dom.btnImportJson) {
    dom.btnImportJson.addEventListener("click", () => {
      const file = dom.importFileInput ? dom.importFileInput.files[0] : null;
      if (!file) {
        alert("Please select a JSON file to restore from.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = LadhaDB.importDatabaseJSON(e.target.result);
        if (result.success) {
          renderAll();
          showToast("DATABASE RESTORED SUCCESSFULLY FROM FILE!");
        } else {
          alert("Import error: " + result.error);
        }
      };
      reader.readAsText(file);
    });
  }

  if (dom.btnResetFactory) {
    dom.btnResetFactory.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset LADHA store to factory curated defaults? All custom changes will be overwritten.")) {
        LadhaDB.resetToFactory();
        renderAll();
        showToast("STORE RESET TO FACTORY DEFAULTS");
      }
    });
  }

  // --- Global Public Admin API for Event Handlers ---
  window.LadhaAdmin = {
    openEditModal: function (id) {
      const product = LadhaDB.getProductById(id);
      openGarmentModal(product);
    },

    toggleStock: function (id) {
      const newStock = LadhaDB.toggleProductStock(id);
      renderInventoryTable();
      renderKPIMetrics();
      showToast(newStock ? "PIECE MARKED AVAILABLE" : "PIECE MARKED SOLD OUT");
    },

    duplicatePiece: function (id) {
      const original = LadhaDB.getProductById(id);
      if (!original) return;
      const copy = JSON.parse(JSON.stringify(original));
      copy.id = "product-" + Date.now().toString().slice(-4);
      copy.name = `${copy.name} (Copy)`;
      copy.inStock = true;
      LadhaDB.saveProduct(copy);
      renderInventoryTable();
      renderKPIMetrics();
      showToast(`PIECE DUPLICATED: ${copy.name}`);
    },

    deletePiece: function (id) {
      const original = LadhaDB.getProductById(id);
      const name = original ? original.name : id;
      if (confirm(`Delete '${name}' from catalog?`)) {
        LadhaDB.deleteProduct(id);
        renderInventoryTable();
        renderKPIMetrics();
        showToast(`DELETED: ${name}`);
      }
    },

    changeOrderStatus: function (orderId, newStatus) {
      LadhaDB.updateOrderStatus(orderId, newStatus);
      renderKPIMetrics();
      showToast(`ORDER ${orderId} STATUS → ${newStatus}`);
    },

    deleteOrder: function (orderId) {
      if (confirm(`Remove order ${orderId}?`)) {
        LadhaDB.deleteOrder(orderId);
        renderOrdersPanel();
        renderKPIMetrics();
        showToast(`ORDER ${orderId} REMOVED`);
      }
    }
  };

  // --- Initial Full Render ---
  function renderAll() {
    renderKPIMetrics();
    renderInventoryTable();
    renderLookbookPanel();
    renderFeedPanel();
    renderTimerPanel();
    renderOrdersPanel();
  }

  renderAll();

  // Listen for storage events across tabs
  window.addEventListener("ladha-db-updated", () => {
    renderAll();
  });

  // ===================================================================
  // MEDIA ASSET LIBRARY & DRAG-AND-DROP UPLOAD ENGINE
  // ===================================================================

  let availableMedia = [];
  let selectedMediaItem = null;
  let activeTargetInputId = "edit-image";
  let mediaLibCategory = "ALL";
  let mediaLibSearchQuery = "";

  const mediaDom = {
    backdrop: document.getElementById("media-lib-backdrop"),
    closeBtn: document.getElementById("media-lib-close-btn"),
    grid: document.getElementById("media-lib-grid"),
    search: document.getElementById("media-lib-search"),
    catTabs: document.querySelectorAll("#media-cat-tabs .media-tab-pill"),
    countAll: document.getElementById("count-all-media"),
    btnUpload: document.getElementById("btn-lib-upload-file"),
    hiddenFileInput: document.getElementById("lib-hidden-file-input"),
    btnInsert: document.getElementById("btn-select-chosen-asset"),
    btnOpenGlobal: document.getElementById("btn-open-global-media-lib"),

    // Sidebar Inspector
    sidebarFrame: document.getElementById("sidebar-preview-frame"),
    sidebarImg: document.getElementById("sidebar-preview-img"),
    sidebarName: document.getElementById("sidebar-file-name"),
    sidebarBadge: document.getElementById("sidebar-file-badge"),
    sidebarPath: document.getElementById("sidebar-file-path"),
    sidebarFolder: document.getElementById("sidebar-file-folder"),
    sidebarSize: document.getElementById("sidebar-file-size"),

    // Garment Form Asset Preview
    garmentDropzone: document.getElementById("garment-dropzone"),
    garmentMediaFrame: document.getElementById("garment-media-frame"),
    garmentImgPreview: document.getElementById("edit-img-preview"),
    garmentFileName: document.getElementById("garment-file-name"),
    garmentMediaBadge: document.getElementById("garment-media-badge"),
    garmentFilePath: document.getElementById("garment-file-path"),
    btnChangeGarmentAsset: document.getElementById("btn-change-garment-asset"),
    btnRemoveGarmentAsset: document.getElementById("btn-remove-garment-asset"),
    btnToggleManualUrl: document.getElementById("btn-toggle-manual-url")
  };

  // Default fallback catalog of assets in case /api/media is not ready
  const FALLBACK_MEDIA = [
    { name: "product-1.jpg", path: "assets/products/product-1.jpg", category: "PRODUCTS", folder: "products", extension: "JPG", size: 795531, isVideo: false },
    { name: "product-2.jpg", path: "assets/products/product-2.jpg", category: "PRODUCTS", folder: "products", extension: "JPG", size: 876142, isVideo: false },
    { name: "product-3.jpg", path: "assets/products/product-3.jpg", category: "PRODUCTS", folder: "products", extension: "JPG", size: 804778, isVideo: false },
    { name: "product-4.jpg", path: "assets/products/product-4.jpg", category: "PRODUCTS", folder: "products", extension: "JPG", size: 689012, isVideo: false },
    { name: "product-5.jpg", path: "assets/products/product-5.jpg", category: "PRODUCTS", folder: "products", extension: "JPG", size: 742110, isVideo: false },
    { name: "product-6.jpg", path: "assets/products/product-6.jpg", category: "PRODUCTS", folder: "products", extension: "JPG", size: 615090, isVideo: false },
    { name: "product-7.jpg", path: "assets/products/product-7.jpg", category: "PRODUCTS", folder: "products", extension: "JPG", size: 712340, isVideo: false },
    { name: "product-8.jpg", path: "assets/products/product-8.jpg", category: "PRODUCTS", folder: "products", extension: "JPG", size: 799820, isVideo: false },
    { name: "product-9.jpg", path: "assets/products/product-9.jpg", category: "PRODUCTS", folder: "products", extension: "JPG", size: 654210, isVideo: false },
    { name: "look-1.jpg", path: "assets/lookbook/look-1.jpg", category: "LOOKBOOK", folder: "lookbook", extension: "JPG", size: 910240, isVideo: false },
    { name: "look-2.jpg", path: "assets/lookbook/look-2.jpg", category: "LOOKBOOK", folder: "lookbook", extension: "JPG", size: 852100, isVideo: false },
    { name: "look-3.jpg", path: "assets/lookbook/look-3.jpg", category: "LOOKBOOK", folder: "lookbook", extension: "JPG", size: 890450, isVideo: false },
    { name: "look-4.jpg", path: "assets/lookbook/look-4.jpg", category: "LOOKBOOK", folder: "lookbook", extension: "JPG", size: 940120, isVideo: false },
    { name: "feed-1.jpg", path: "assets/feed/feed-1.jpg", category: "FEED", folder: "feed", extension: "JPG", size: 520410, isVideo: false },
    { name: "feed-2.jpg", path: "assets/feed/feed-2.jpg", category: "FEED", folder: "feed", extension: "JPG", size: 531890, isVideo: false },
    { name: "feed-3.jpg", path: "assets/feed/feed-3.jpg", category: "FEED", folder: "feed", extension: "JPG", size: 512300, isVideo: false },
    { name: "feed-4.jpg", path: "assets/feed/feed-4.jpg", category: "FEED", folder: "feed", extension: "JPG", size: 549120, isVideo: false },
    { name: "flame.mp4", path: "assets/videos/flame.mp4", category: "VIDEOS", folder: "videos", extension: "MP4", size: 1947850, isVideo: true },
    { name: "smoke.mp4", path: "assets/videos/smoke.mp4", category: "VIDEOS", folder: "videos", extension: "MP4", size: 1012774, isVideo: true }
  ];

  // Helper format bytes
  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return "0 KB";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  // Helper: check if file path is video
  function checkIsVideo(path) {
    if (!path) return false;
    const lower = path.toLowerCase();
    return lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.endsWith(".mov") || lower.includes("video/mp4");
  }

  // Fetch media from server API
  async function loadMediaAssets() {
    try {
      const res = await fetch("/api/media");
      if (res.ok) {
        const data = await res.json();
        if (data.media && Array.isArray(data.media) && data.media.length > 0) {
          availableMedia = data.media;
        } else {
          availableMedia = FALLBACK_MEDIA;
        }
      } else {
        availableMedia = FALLBACK_MEDIA;
      }
    } catch (e) {
      console.warn("Could not reach /api/media, using fallback catalog", e);
      availableMedia = FALLBACK_MEDIA;
    }

    if (mediaDom.countAll) {
      mediaDom.countAll.textContent = availableMedia.length;
    }

    renderMediaGrid();
  }

  // Render Grid in Media Modal
  function renderMediaGrid() {
    if (!mediaDom.grid) return;

    const query = mediaLibSearchQuery.toLowerCase().trim();
    const filtered = availableMedia.filter((item) => {
      const matchCat = mediaLibCategory === "ALL" || item.category === mediaLibCategory;
      const matchQuery = !query || item.name.toLowerCase().includes(query) || item.path.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });

    if (filtered.length === 0) {
      mediaDom.grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);">
          NO MEDIA FOUND FOR THIS FILTER. CLICK '+ UPLOAD NEW FILE' TO ADD ASSETS.
        </div>
      `;
      return;
    }

    mediaDom.grid.innerHTML = filtered
      .map((item, idx) => {
        const isSelected = selectedMediaItem && selectedMediaItem.path === item.path;
        return `
          <div class="media-item-card ${isSelected ? "selected" : ""}" data-index="${idx}" data-path="${item.path}">
            ${
              item.isVideo
                ? `<video src="${item.path}" muted class="media-item-thumb" preload="metadata"></video>
                   <span class="media-item-video-indicator">▶ VIDEO</span>`
                : `<img src="${item.path}" alt="${item.name}" class="media-item-thumb" loading="lazy">`
            }
          </div>
        `;
      })
      .join("");

    // Bind card click
    mediaDom.grid.querySelectorAll(".media-item-card").forEach((card) => {
      card.addEventListener("click", () => {
        const path = card.getAttribute("data-path");
        const found = availableMedia.find((m) => m.path === path);
        if (found) {
          selectMediaItem(found);
        }
      });
    });

    // If something was selected, keep inspector updated
    if (selectedMediaItem) {
      updateSidebarInspector(selectedMediaItem);
    } else if (filtered.length > 0) {
      selectMediaItem(filtered[0]);
    }
  }

  // Select Item in Modal
  function selectMediaItem(item) {
    selectedMediaItem = item;
    mediaDom.grid.querySelectorAll(".media-item-card").forEach((c) => {
      if (c.getAttribute("data-path") === item.path) {
        c.classList.add("selected");
      } else {
        c.classList.remove("selected");
      }
    });
    updateSidebarInspector(item);
  }

  // Update Sidebar Inspector in Modal
  function updateSidebarInspector(item) {
    if (!mediaDom.sidebarFrame) return;

    if (item.isVideo) {
      mediaDom.sidebarFrame.innerHTML = `
        <div class="viewfinder-corners"></div>
        <video src="${item.path}" controls autoplay loop muted style="width: 100%; height: 100%; object-fit: cover;"></video>
      `;
      mediaDom.sidebarBadge.textContent = `${item.extension || "MP4"} VIDEO`;
    } else {
      mediaDom.sidebarFrame.innerHTML = `
        <div class="viewfinder-corners"></div>
        <img src="${item.path}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">
      `;
      mediaDom.sidebarBadge.textContent = `${item.extension || "JPG"} IMAGE`;
    }

    mediaDom.sidebarName.textContent = item.name;
    mediaDom.sidebarPath.textContent = item.path;
    mediaDom.sidebarFolder.textContent = item.folder || "assets";
    mediaDom.sidebarSize.textContent = formatBytes(item.size);
  }

  // Open Media Library Modal
  function openMediaLibrary(targetInputId = "edit-image") {
    activeTargetInputId = targetInputId;
    loadMediaAssets();

    if (mediaDom.backdrop) {
      mediaDom.backdrop.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  }

  function closeMediaLibrary() {
    if (mediaDom.backdrop) {
      mediaDom.backdrop.classList.remove("open");
      // Check if another modal is open
      const garmentModal = document.getElementById("garment-modal");
      if (!garmentModal || !garmentModal.classList.contains("open")) {
        document.body.style.overflow = "";
      }
    }
  }

  // Bind Media Modal Category Tabs
  if (mediaDom.catTabs) {
    mediaDom.catTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        mediaDom.catTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        mediaLibCategory = tab.getAttribute("data-cat");
        renderMediaGrid();
      });
    });
  }

  // Search in Media Modal
  if (mediaDom.search) {
    mediaDom.search.addEventListener("input", (e) => {
      mediaLibSearchQuery = e.target.value;
      renderMediaGrid();
    });
  }

  if (mediaDom.closeBtn) mediaDom.closeBtn.addEventListener("click", closeMediaLibrary);
  if (mediaDom.btnOpenGlobal) {
    mediaDom.btnOpenGlobal.addEventListener("click", () => openMediaLibrary("edit-image"));
  }

  // Confirm Selection ("INSERT THIS ASSET")
  if (mediaDom.btnInsert) {
    mediaDom.btnInsert.addEventListener("click", () => {
      if (!selectedMediaItem) return;
      applyAssetToTarget(selectedMediaItem.path, activeTargetInputId);
      closeMediaLibrary();
      showToast(`ASSET SELECTED: ${selectedMediaItem.name}`);
    });
  }

  // Apply Asset to whichever input was targeted
  function applyAssetToTarget(url, targetInputId) {
    const targetEl = document.getElementById(targetInputId);
    if (targetEl) {
      targetEl.value = url;
      // Trigger change event
      targetEl.dispatchEvent(new Event("change", { bubbles: true }));
      targetEl.dispatchEvent(new Event("input", { bubbles: true }));
    }

    // If target is garment editor
    if (targetInputId === "edit-image") {
      updateGarmentAssetPreview(url);
    } else if (targetInputId.startsWith("look-input-")) {
      const idx = targetInputId.replace("look-input-", "");
      const img = document.getElementById(`look-img-preview-${idx}`);
      if (img) img.src = url;
    } else if (targetInputId.startsWith("feed-input-")) {
      const idx = targetInputId.replace("feed-input-", "");
      const img = document.getElementById(`feed-img-preview-${idx}`);
      if (img) img.src = url;
    }
  }

  // Update Garment Modal Live Preview Card
  function updateGarmentAssetPreview(url) {
    if (!url) {
      url = "assets/products/product-1.jpg";
    }

    const isVid = checkIsVideo(url);
    const fileName = url.split("/").pop() || "asset";
    const ext = fileName.split(".").pop().toUpperCase();

    if (mediaDom.garmentFileName) mediaDom.garmentFileName.textContent = fileName;
    if (mediaDom.garmentFilePath) mediaDom.garmentFilePath.textContent = url;
    if (mediaDom.garmentMediaBadge) {
      mediaDom.garmentMediaBadge.textContent = isVid ? `${ext} VIDEO` : `${ext} IMAGE`;
    }

    if (mediaDom.garmentMediaFrame) {
      if (isVid) {
        mediaDom.garmentMediaFrame.innerHTML = `
          <div class="viewfinder-corners"></div>
          <video src="${url}" autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover;"></video>
        `;
      } else {
        mediaDom.garmentMediaFrame.innerHTML = `
          <div class="viewfinder-corners"></div>
          <img src="${url}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;">
        `;
      }
    }
  }

  // Change / Remove actions in Garment Modal
  if (mediaDom.btnChangeGarmentAsset) {
    mediaDom.btnChangeGarmentAsset.addEventListener("click", () => {
      openMediaLibrary("edit-image");
    });
  }

  if (mediaDom.btnRemoveGarmentAsset) {
    mediaDom.btnRemoveGarmentAsset.addEventListener("click", () => {
      applyAssetToTarget("assets/products/product-1.jpg", "edit-image");
      showToast("ASSET RESET TO DEFAULT");
    });
  }

  if (mediaDom.btnToggleManualUrl) {
    mediaDom.btnToggleManualUrl.addEventListener("click", () => {
      const input = document.getElementById("edit-image");
      if (input) {
        input.style.display = input.style.display === "none" ? "block" : "none";
        if (input.style.display === "block") input.focus();
      }
    });
  }

  // ===================================================================
  // INSTANT FILE UPLOADER (DRAG & DROP, BROWSE, PASTE)
  // ===================================================================

  async function handleFileUpload(file, targetInputId = "edit-image") {
    if (!file) return;

    showToast(`UPLOADING ${file.name.toUpperCase()}...`);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUri = e.target.result;
      let finalUrl = dataUri;

      try {
        const resp = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            data: dataUri
          })
        });

        if (resp.ok) {
          const resJson = await resp.json();
          if (resJson.success && resJson.url) {
            finalUrl = resJson.url;
          }
        }
      } catch (err) {
        console.warn("Upload server not available, using local data URI fallback", err);
      }

      // Add to available media
      const newMedia = {
        name: file.name,
        path: finalUrl,
        category: "UPLOADS",
        folder: "uploads",
        extension: file.name.split(".").pop().toUpperCase(),
        size: file.size,
        isVideo: checkIsVideo(file.name)
      };

      availableMedia.unshift(newMedia);
      selectMediaItem(newMedia);
      applyAssetToTarget(finalUrl, targetInputId);

      showToast(`ASSET READY: ${file.name.toUpperCase()}`);
    };

    reader.readAsDataURL(file);
  }

  // Wire Dropzone on Garment Modal
  if (mediaDom.garmentDropzone) {
    const dropzone = mediaDom.garmentDropzone;
    const fileInput = dropzone.querySelector(".hidden-file-input");

    // Click to browse
    dropzone.addEventListener("click", (e) => {
      if (e.target.closest(".btn-lib-browse")) {
        e.stopPropagation();
        openMediaLibrary("edit-image");
        return;
      }
      if (fileInput) fileInput.click();
    });

    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) {
          handleFileUpload(e.target.files[0], "edit-image");
        }
      });
    }

    // Drag & drop
    ["dragenter", "dragover"].forEach((eventName) => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove("dragover");
      });
    });

    dropzone.addEventListener("drop", (e) => {
      const dt = e.dataTransfer;
      if (dt && dt.files && dt.files[0]) {
        handleFileUpload(dt.files[0], "edit-image");
      }
    });
  }

  // Upload button inside Media Library Modal
  if (mediaDom.btnUpload && mediaDom.hiddenFileInput) {
    mediaDom.btnUpload.addEventListener("click", () => {
      mediaDom.hiddenFileInput.click();
    });

    mediaDom.hiddenFileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileUpload(e.target.files[0], activeTargetInputId);
      }
    });
  }

  // Global Clipboard Paste (Ctrl+V) for instant image drop
  window.addEventListener("paste", (e) => {
    // Only intercept if we're not inside a text input or textarea
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
      return;
    }

    if (e.clipboardData && e.clipboardData.files && e.clipboardData.files[0]) {
      const file = e.clipboardData.files[0];
      handleFileUpload(file, activeTargetInputId);
    }
  });

  // Preview card action buttons
  if (mediaDom.btnChangeGarmentAsset) {
    mediaDom.btnChangeGarmentAsset.addEventListener("click", () => {
      openMediaLibrary("edit-image");
    });
  }

  if (mediaDom.btnRemoveGarmentAsset) {
    mediaDom.btnRemoveGarmentAsset.addEventListener("click", () => {
      applyAssetToTarget("assets/products/product-1.jpg", "edit-image");
      showToast("ASSET RESET TO DEFAULT ARCHIVE VISUAL");
    });
  }

  if (mediaDom.btnToggleManualUrl) {
    mediaDom.btnToggleManualUrl.addEventListener("click", () => {
      const input = document.getElementById("edit-image");
      if (input) {
        const isHidden = input.style.display === "none";
        input.style.display = isHidden ? "block" : "none";
        mediaDom.btnToggleManualUrl.textContent = isHidden ? "Hide URL" : "Manual URL";
        if (isHidden) input.focus();
      }
    });
  }

  // Wire Lookbook and Feed items to support 1-click Asset Library selection
  document.addEventListener("click", (e) => {
    const libTrigger = e.target.closest("[data-media-target], [data-target]");
    if (libTrigger) {
      const targetId = libTrigger.getAttribute("data-media-target") || libTrigger.getAttribute("data-target");
      if (targetId) {
        openMediaLibrary(targetId);
      }
    }
  });

  // Initial load of media items
  loadMediaAssets();

});
