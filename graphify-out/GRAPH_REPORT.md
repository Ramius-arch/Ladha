# Graph Report - Storefront  (2026-11-21)

## Corpus Check
- 247 files · ~2,109,876 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: .css 7, (none) 6, .toml 2)

## Summary
- 1726 nodes · 3031 edges · 151 communities (113 shown, 38 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 217 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2eea956c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Se
- backend/package.json
- customers.routes.js
- admin.js
- server.py
- customer_contoller.js
- billing/backend/server.js
- debug-checkout-urls.js
- LadhaAmbientPlaylistEngine
- dependencies
- LadhaService
- LADHA_PRODUCTS
- index.js
- usage_controller.js
- frontend/package.json
- clearCache
- scripts
- frontend/vercel.json
- s
- Ladha Storefront Index View
- DukaClient
- CartDrawer.tsx
- cart.js
- test-unified-dist.js
- check-page-vars.js
- Reports.vue
- dependencies
- sequelize
- routes.config.js
- check-assets.js
- express
- api.js
- payments.routes.js
- diligenceService.js
- mockData.js
- scripts
- api/auth.js
- demoData.js
- MpesaService
- usage.routes.js
- auth.mjs
- apply-commerce-fixes.js
- RevenueSummary.vue
- UsageTrendChart.vue
- src/backend/server.js
- admin-guard.js
- invoices.routes.js
- billing_controller.js
- report_controller.js
- vercel.json
- vercel.json
- Qx_Billing
- PaymentStatus.vue
- Asset: favicon.svg
- Asset: logo.png
- Asset: scene1_midnight.jpg
- Asset: scene2_engine.jpg
- Asset: scene3_resolution.jpg
- Asset: quixora_logo.png
- Asset: og-image.png
- Asset: 1789426021005_test_pixel.png
- Asset: 1789426402711_test_pixel.png
- Asset: 1789426538276_crm_ux_test.png
- Asset: 1789426593684_crm_ux_test.png
- Asset: 1789426637342_crm_ux_test.png
- Ladha Storefront About View
- Ladha Storefront Checkout View
- Ladha Storefront Legal View
- Ladha Storefront Product View
- patch-admin-html.js
- storefront/README.md
- Oa
- build-unified.js
- duka.routes.js
- verify-all-pages.js
- Walkthrough — Deployment & Logger Fixes
- EmailService
- ReconciliationService
- ledger.js
- apply-ladha-ui-refactor.js
- e
- pdfGenerator.js
- update-ui-to-ladha-commerce.js
- ref_path
- fix-billing-engine.js
- jspdf.umd.min.js
- Frontend Performance, Router Stability, & Commerce Invariants
- App.tsx
- audit_telecom_all.js
- sms_service.js
- patch-frontend.js
- ladha.routes.js
- react
- ref_c
- app.test.js
- devDependencies
- App.vue
- scripts
- useRouter
- Release 2.4.0 — Apple Human Interface & Swiss Brutalism Milestone
- devDependencies
- etimsInvoiceService.js
- ref_fs
- test-diligence-gen.js
- a
- i
- patch-pdf-generation.js
- generate_portfolio_video.js
- patch-api-pdf-validator.js
- patch-checkout-and-invoicedetail.js
- ConfigController.js
- cacheHandler.js
- checkoutService.js
- patch-api-client.js
- CheckoutPage.tsx
- idempotency.js
- compilerOptions
- storefront-app/package.json
- siteContent.ts
- compilerOptions
- storeDb.ts
- pricing.js
- vite.config.ts
- devDependencies
- router.js
- dependencies
- RouterContext.tsx
- scripts
- operational-scrutiny-demo.js
- storefront_app_src_data_sitecontent_lookbookitem
- patch-checkout-pdf.js
- ref_vite
- find_telecom.js
- scripts
- fix-etims-generator.js
- tsconfig.json
- reservationSweeper.js
- health.routes.js

## God Nodes (most connected - your core abstractions)
1. `Oa()` - 110 edges
2. `r()` - 97 edges
3. `Se` - 55 edges
4. `e()` - 40 edges
5. `useRouter()` - 37 edges
6. `react` - 32 edges
7. `vue` - 25 edges
8. `clearCache()` - 24 edges
9. `sequelize` - 23 edges
10. `a()` - 23 edges

## Surprising Connections (you probably didn't know these)
- `10. Production Readiness & Quality Audit Metrics` --references--> `ReservationSweeper`  [INFERRED]
  DEVLOG.md → billing/backend/services/commerce/reservationSweeper.js
- `1. Architectural Migration (`storefront-app/`)` --references--> `CurationProcessSection()`  [INFERRED]
  DEVLOG.md → storefront-app/src/components/home/CurationProcessSection.tsx
- `1. Architectural Migration (`storefront-app/`)` --references--> `RollingTextButton()`  [INFERRED]
  DEVLOG.md → storefront-app/src/components/ui/RollingTextButton.tsx
- `4. API Specification for Qx_Billing to Ladha Bridge` --references--> `GET()`  [INFERRED]
  ARCHITECTURE.md → api/auth.mjs
- `Commerce Bridge API` --references--> `GET()`  [INFERRED]
  README.md → api/auth.mjs

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Archival Commerce to Double-Entry Ledger Pipeline** — storefront_js_duka_client_dukaclient, billing_backend_routes_duka_routes, billing_backend_services_ladhaservice, storefront_server_ladhaserverhandler [INFERRED 0.95]
- **Enterprise Billing & Compliance Ledger Suite** — billing_backend_models_bill, billing_backend_models_invoice, billing_backend_models_customer, billing_backend_models_payment [INFERRED 0.95]

## Communities (151 total, 38 thin omitted)

### Community 0 - "Se"
Cohesion: 0.06
Nodes (5): fa, ha(), Se, ua(), Vi()

### Community 1 - "backend/package.json"
Cohesion: 0.10
Nodes (19): author, description, engines, node, keywords, license, main, name (+11 more)

### Community 2 - "customers.routes.js"
Cohesion: 0.15
Nodes (12): customerSchema, Joi, Joi, validate(), auth, customerController, { customerSchema }, express (+4 more)

### Community 3 - "admin.js"
Cohesion: 0.15
Nodes (20): Ladha Storefront Admin View, applyAssetToTarget(), checkIsVideo(), formatBytes(), handleFileUpload(), loadMediaAssets(), openGarmentModal(), openMediaLibrary() (+12 more)

### Community 4 - "server.py"
Cohesion: 0.10
Nodes (20): base64, cv2, hashlib, hmac, http_server, json, os, pil (+12 more)

### Community 5 - "customer_contoller.js"
Cohesion: 0.13
Nodes (18): asyncHandler, { clearCache }, createCustomer, db, deleteCustomer, { ErrorResponse }, getCustomerById, getCustomers (+10 more)

### Community 6 - "billing/backend/server.js"
Cohesion: 0.07
Nodes (26): ALLOWED_ORIGINS, app, billRoutes, bodyParser, configRoutes, cors, customerRoutes, db (+18 more)

### Community 7 - "debug-checkout-urls.js"
Cohesion: 0.07
Nodes (24): ref_http, fs, html, http, ports, urls, { chromium }, DIST_DIR (+16 more)

### Community 9 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, africastalking, bcryptjs, cors, dotenv, express, @faker-js/faker, ioredis (+11 more)

### Community 10 - "LadhaService"
Cohesion: 0.09
Nodes (13): 3. Subtle Nuances & Compatibility Logic, Nuance 1: 1-of-1 Archival Pieces vs. Telecom Plans & Quantities, Nuance 2: Kenyan E.164 Phone Normalization & Customer Unification, Nuance 3: Nairobi Regional Delivery Tariffs vs. Flat Invoicing, Nuance 4: Direct API Bridge (Qx_Billing -> Ladha), http, https, LadhaService (+5 more)

### Community 11 - "LADHA_PRODUCTS"
Cohesion: 0.11
Nodes (17): Asset: product-1.jpg, Asset: product-10.jpg, Asset: product-11.jpg, Asset: product-12.jpg, Asset: product-13.jpg, Asset: product-14.jpg, Asset: product-15.jpg, Asset: product-2.jpg (+9 more)

### Community 12 - "index.js"
Cohesion: 0.17
Nodes (5): db, db, db, sequelize, db

### Community 13 - "usage_controller.js"
Cohesion: 0.12
Nodes (10): db, { ErrorHandler }, { clearCache }, createUsage(), db, deleteUsage(), { ErrorHandler }, updateUsage() (+2 more)

### Community 14 - "frontend/package.json"
Cohesion: 0.10
Nodes (19): author, description, autoprefixer, jspdf, lenis, postcss, tailwindcss, vite (+11 more)

### Community 15 - "clearCache"
Cohesion: 0.17
Nodes (8): { clearCache }, createPayment(), db, { ErrorHandler }, mpesaCallback(), updatePaymentStatus(), clearCache(), CheckoutService

### Community 16 - "scripts"
Cohesion: 0.11
Nodes (18): author, description, keywords, license, name, private, scripts, build (+10 more)

### Community 18 - "s"
Cohesion: 0.16
Nodes (20): d(), ja(), B(), E(), M(), O(), R(), m() (+12 more)

### Community 19 - "Ladha Storefront Index View"
Cohesion: 0.13
Nodes (15): Asset: feed-1.jpg, Asset: feed-2.jpg, Asset: feed-3.jpg, Asset: feed-4.jpg, Asset: feed-5.jpg, Asset: feed-6.jpg, Asset: look-1.jpg, Asset: look-2.jpg (+7 more)

### Community 21 - "CartDrawer.tsx"
Cohesion: 0.21
Nodes (8): RollingTextButton(), RollingTextButtonProps, mpesaTill, STORE_CONFIG, whatsappDigits, LegalPage(), LegalTab, NotFoundPage()

### Community 22 - "cart.js"
Cohesion: 0.34
Nodes (13): addToCart(), clearCart(), closeDrawer(), getCart(), getCartCount(), getCartTotal(), injectDrawer(), openDrawer() (+5 more)

### Community 23 - "test-unified-dist.js"
Cohesion: 0.29
Nodes (6): DIST, fs, http, mimeTypes, path, server

### Community 24 - "check-page-vars.js"
Cohesion: 0.17
Nodes (11): apiContent, billContent, billPath, fs, path, payContent, payPath, repContent (+3 more)

### Community 25 - "Reports.vue"
Cohesion: 0.20
Nodes (10): handleDateRangeChange(), loadData(), paymentStatus, ReportData, revenueData, usageData, ref_components_paymentstatus_vue, ref_components_revenuesummary_vue (+2 more)

### Community 26 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, @ant-design/icons-vue, ant-design-vue, axios, chart.js, jspdf, lenis, papaparse (+3 more)

### Community 27 - "sequelize"
Cohesion: 0.04
Nodes (22): path, { Sequelize }, { DataTypes }, { DataTypes }, { DataTypes }, { DataTypes }, { DataTypes }, { DataTypes } (+14 more)

### Community 28 - "routes.config.js"
Cohesion: 0.15
Nodes (11): billingRoutes, customersRoutes, express, invoicesRoutes, paymentsRoutes, reportsRoutes, router, usageRoutes (+3 more)

### Community 29 - "check-assets.js"
Cohesion: 0.33
Nodes (5): fs, hrefs, html, path, srcs

### Community 30 - "express"
Cohesion: 0.15
Nodes (10): configController, express, router, express, planController, router, express, reportController (+2 more)

### Community 31 - "api.js"
Cohesion: 0.16
Nodes (9): columns, api, apiClient, Qx Billing Mobile Portrait & Layout Plan, @ant-design/icons-vue, chart.js, papaparse, vue-chartjs (+1 more)

### Community 32 - "payments.routes.js"
Cohesion: 0.25
Nodes (6): jwt, auth, express, paymentsController, router, jsonwebtoken

### Community 33 - "diligenceService.js"
Cohesion: 0.20
Nodes (8): crypto, db, DiligenceService, fonts, ledger, PdfPrinter, pricing, printer

### Community 34 - "mockData.js"
Cohesion: 0.20
Nodes (7): DEFAULT_ACCOUNTS, DEFAULT_CUSTOMERS, DEFAULT_INVOICES, DEFAULT_ORDERS, DEFAULT_PLANS, MockStore, STORAGE_KEYS

### Community 35 - "scripts"
Cohesion: 0.25
Nodes (7): name, private, scripts, build-frontend, install-backend, install-frontend, start-backend

### Community 36 - "api/auth.js"
Cohesion: 0.32
Nodes (6): createToken(), crypto, EPHEMERAL_DEV_SECRET, hashIp(), rateLimitMap, verifyToken()

### Community 37 - "demoData.js"
Cohesion: 0.33
Nodes (6): GARMENT_CATALOG, generateDemoData(), generatePlans(), KENYAN_SHOPPERS, MPESA_CODES, ZONE_TARIFFS

### Community 38 - "MpesaService"
Cohesion: 0.29
Nodes (3): mpesa, MpesaService, ref_mpesa_sdk

### Community 39 - "usage.routes.js"
Cohesion: 0.33
Nodes (5): billing_backend_controllers_usage_usage_controller_usagecontroller, auth, express, router, { UsageController }

### Community 40 - "auth.mjs"
Cohesion: 0.07
Nodes (39): buildCookieHeader(), constantTimeEquals(), DELETE(), failedAttempts, GET(), getAuthConfig(), getClientIp(), hmacHex() (+31 more)

### Community 41 - "apply-commerce-fixes.js"
Cohesion: 0.14
Nodes (13): apiJs, apiJsPath, billingEngine, billingEnginePath, envPath, fs, invoiceDetail, invoiceDetailPath (+5 more)

### Community 42 - "RevenueSummary.vue"
Cohesion: 0.40
Nodes (4): activeCustomers, outstandingDues, props, totalRevenue

### Community 43 - "UsageTrendChart.vue"
Cohesion: 0.40
Nodes (4): chartOptions, series, UsageDataPoint, ref_apexcharts

### Community 44 - "src/backend/server.js"
Cohesion: 0.40
Nodes (4): app, cors, express, cors

### Community 45 - "admin-guard.js"
Cohesion: 0.80
Nodes (4): createAuthModal(), initSecurityHandshake(), setupLockControl(), unlockDashboard()

### Community 46 - "invoices.routes.js"
Cohesion: 0.25
Nodes (7): Customer, isAdmin(), auth, express, invoicesController, { isAdmin }, router

### Community 47 - "billing_controller.js"
Cohesion: 0.31
Nodes (8): asyncHandler, calculateCharges(), calculateCustomerCharges(), { clearCache }, db, generateBill(), getForecast(), { Op }

### Community 49 - "report_controller.js"
Cohesion: 0.14
Nodes (4): asyncHandler, db, { ErrorResponse }, { Op }

### Community 50 - "vercel.json"
Cohesion: 0.29
Nodes (6): buildCommand, headers, installCommand, outputDirectory, rewrites, version

### Community 53 - "vercel.json"
Cohesion: 0.50
Nodes (3): cleanUrls, routes, version

### Community 54 - "Qx_Billing"
Cohesion: 0.18
Nodes (10): Backend, Backend Setup, Features, Frontend, Frontend Setup, Getting Started, Prerequisites, Project Structure (+2 more)

### Community 79 - "patch-admin-html.js"
Cohesion: 0.40
Nodes (4): filePath, fs, html, path

### Community 80 - "storefront/README.md"
Cohesion: 0.25
Nodes (7): Architectural & Aesthetic System, Brand Manifesto, Key Features, License, Local Development, Project Structure, Static Deployment (GitHub Pages / Vercel / Netlify)

### Community 81 - "Oa"
Cohesion: 0.08
Nodes (56): Dt(), Et(), Oa(), at(), be(), ce(), de(), dn() (+48 more)

### Community 82 - "build-unified.js"
Cohesion: 0.09
Nodes (21): ref_child_process, BILLING_FRONTEND_DIR, billingDist, checks, copyDirRecursive(), { execSync }, fs, LEDGER_DEST (+13 more)

### Community 83 - "duka.routes.js"
Cohesion: 0.18
Nodes (10): checkoutService, db, express, handleReconcile(), idempotency, ledger, router, db (+2 more)

### Community 84 - "verify-all-pages.js"
Cohesion: 0.22
Nodes (8): c_users_admin_documents_github_storefront_billing_frontend_node_modules_vue_compiler_sfc, c_users_admin_documents_github_storefront_billing_frontend_node_modules_vue_compiler_sfc_compiletemplate, c_users_admin_documents_github_storefront_billing_frontend_node_modules_vue_compiler_sfc_parse, files, fs, pagesDir, { parse, compileTemplate }, path

### Community 85 - "Walkthrough — Deployment & Logger Fixes"
Cohesion: 0.50
Nodes (3): Changes Made, Verification & Testing, Walkthrough — Deployment & Logger Fixes

### Community 86 - "EmailService"
Cohesion: 0.32
Nodes (3): EmailService, nodemailer, nodemailer

### Community 88 - "ledger.js"
Cohesion: 0.25
Nodes (8): db, ensureAccounts(), getTrialBalance(), postJournalEntry(), postReversalEntry(), STANDARD_ACCOUNTS, db, ledgerService

### Community 89 - "apply-ladha-ui-refactor.js"
Cohesion: 0.20
Nodes (9): appVue, appVuePath, dashboardVue, dashboardVuePath, fs, headerVuePath, path, reportsVue (+1 more)

### Community 90 - "e"
Cohesion: 0.20
Nodes (28): a(), e(), n(), b(), bn(), bt(), ct(), dt() (+20 more)

### Community 91 - "pdfGenerator.js"
Cohesion: 0.48
Nodes (6): createDiligenceDossierDoc(), createEtimsInvoiceDoc(), downloadBlob(), downloadDiligenceDossier(), downloadEtimsInvoice(), ref_jspdf

### Community 92 - "update-ui-to-ladha-commerce.js"
Cohesion: 0.20
Nodes (9): appVue, appVuePath, dashboardVue, dashboardVuePath, fs, headerVuePath, path, reportsVue (+1 more)

### Community 93 - "ref_path"
Cohesion: 0.09
Nodes (18): path, ref_path, c, fs, p, path, c, fs (+10 more)

### Community 94 - "fix-billing-engine.js"
Cohesion: 0.40
Nodes (4): c, fs, p, path

### Community 95 - "jspdf.umd.min.js"
Cohesion: 0.08
Nodes (23): aa(), C(), Ca(), ea(), Gi(), I(), Ia(), j() (+15 more)

### Community 96 - "Frontend Performance, Router Stability, & Commerce Invariants"
Cohesion: 0.15
Nodes (12): 10. Strict Light-Mode Ink Contrast & Surface Elevation, 11. Production-Grade Operations Automation & Redundancy Prevention, 1. Zero-Jank Animation & Reactive Performance Guardrails, 2. Router & View Stability Invariants, 3. Financial & Commerce Domain Modeling Invariants, 4. Modern Tailwind v4 Engine Invariants, 5. Dual-Theme (Light / Dark) Synchronization Protocol, 6. Static Asset Mirroring & Image Fail-Safe Integrity (+4 more)

### Community 97 - "App.tsx"
Cohesion: 0.18
Nodes (12): react-dom, App(), PAGE_TITLES, StorefrontShell(), Header(), HeaderProps, AmbientTrack, PLAYLIST (+4 more)

### Community 98 - "audit_telecom_all.js"
Cohesion: 0.50
Nodes (4): checkFile(), fs, path, walk()

### Community 99 - "sms_service.js"
Cohesion: 0.33
Nodes (3): africastalking, SMSService, africastalking

### Community 100 - "patch-frontend.js"
Cohesion: 0.40
Nodes (4): apiPath, code, fs, path

### Community 101 - "ladha.routes.js"
Cohesion: 0.33
Nodes (5): checkoutService, db, express, ladhaService, router

### Community 102 - "react"
Cohesion: 0.16
Nodes (16): framer-motion, react, CurationProcessSection(), CATEGORIES, DropsCatalogSection(), FaqSection(), Hero(), HeroProps (+8 more)

### Community 103 - "ref_c"
Cohesion: 0.08
Nodes (17): { chromium }, fs, OUT_DIR, path, { chromium }, { chromium }, { chromium }, ref_c (+9 more)

### Community 104 - "app.test.js"
Cohesion: 0.50
Nodes (3): app, request, supertest

### Community 105 - "devDependencies"
Cohesion: 0.67
Nodes (3): devDependencies, jest, supertest

### Community 106 - "App.vue"
Cohesion: 0.21
Nodes (11): setup(), SAAS_PRESETS, setup(), setup(), setup(), currentPresetKey, getInitialPreset(), isWhiteLabelUnlocked() (+3 more)

### Community 107 - "scripts"
Cohesion: 0.67
Nodes (3): scripts, start, test

### Community 108 - "useRouter"
Cohesion: 0.19
Nodes (19): 1. Architectural Migration (`storefront-app/`), lucide-react, CartDrawer(), DropsCatalogSectionProps, LookbookShowcase(), SelectionProtocolSection(), QuickViewModal(), QuickViewModalProps (+11 more)

### Community 109 - "Release 2.4.0 — Apple Human Interface & Swiss Brutalism Milestone"
Cohesion: 0.20
Nodes (10): getBillingTrends(), 1. Executive Summary & Philosophy, 2. Forensic Defect Resolutions (Screenshots 1 through 8), 3. Steve Jobs / Apple Typography & Craft Upgrades, 4. Automated Testing & Verification Suite, 6. Production Operations Automation & Defect Resolution (Screenshots 9 through 13), 7. Dynamic Graph Period Switching & High-Contrast Ink Remediation, 8. Institutional Capital, Commercial Loan Underwriting & VC Diligence Suite (+2 more)

### Community 110 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, happy-dom, postcss, tailwindcss, @tailwindcss/postcss, vite, @vitejs/plugin-vue (+2 more)

### Community 111 - "etimsInvoiceService.js"
Cohesion: 0.25
Nodes (7): crypto, db, fonts, generateEtimsInvoicePdf(), PdfPrinter, printer, pdfmake

### Community 112 - "ref_fs"
Cohesion: 0.08
Nodes (19): ref_fs, fs, s, c, fs, p, path, fs (+11 more)

### Community 113 - "test-diligence-gen.js"
Cohesion: 0.11
Nodes (15): c_users_admin_documents_github_storefront_billing_frontend_node_modules_jspdf, c_users_admin_documents_github_storefront_billing_frontend_node_modules_jspdf_jspdf, buffer, doc, fs, { jsPDF }, buffer, doc (+7 more)

### Community 114 - "a"
Cohesion: 0.16
Nodes (21): o(), a(), c(), d(), f(), ft(), h(), j() (+13 more)

### Community 115 - "i"
Cohesion: 0.18
Nodes (15): b(), er(), g(), ae(), g(), i(), k(), kt() (+7 more)

### Community 116 - "patch-pdf-generation.js"
Cohesion: 0.17
Nodes (11): apiContent, apiPath, dashContent, dashPath, fs, invContent, invPath, path (+3 more)

### Community 117 - "generate_portfolio_video.js"
Cohesion: 0.36
Nodes (8): { chromium }, clickWithFeedback(), fs, injectCursor(), path, record(), smoothMove(), smoothScroll()

### Community 118 - "patch-api-pdf-validator.js"
Cohesion: 0.29
Nodes (6): apiContent, apiPath, dashContent, dashPath, fs, path

### Community 119 - "patch-checkout-and-invoicedetail.js"
Cohesion: 0.29
Nodes (6): chkContent, chkPath, fs, invContent, invPath, path

### Community 121 - "cacheHandler.js"
Cohesion: 0.18
Nodes (8): logger, Redis, logger, redis, logger, winston, ioredis, winston

### Community 122 - "checkoutService.js"
Cohesion: 0.33
Nodes (5): { clearCache }, db, ladhaService, ledger, pricing

### Community 123 - "patch-api-client.js"
Cohesion: 0.40
Nodes (4): c, fs, p, path

### Community 124 - "CheckoutPage.tsx"
Cohesion: 0.18
Nodes (15): CartContextValue, CheckoutPage(), CheckoutPageProps, REGIONS, BILLING_API_URL, DukaCheckoutRequest, DukaCheckoutResult, initiateDukaCheckout() (+7 more)

### Community 125 - "idempotency.js"
Cohesion: 0.40
Nodes (3): crypto, db, ref_crypto

### Community 127 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+10 more)

### Community 128 - "storefront-app/package.json"
Cohesion: 0.12
Nodes (16): clsx, tailwind-merge, @types/node, @types/react, @types/react-dom, typescript, autoprefixer, jspdf (+8 more)

### Community 129 - "siteContent.ts"
Cohesion: 0.17
Nodes (14): LookSlideProps, CartContext, CartProvider(), loadPersistedCart(), storefront_app_src_data_defaultproducts, CURATION_STEPS, DEFAULT_PRODUCTS, EDITORIAL_GALLERY (+6 more)

### Community 130 - "compilerOptions"
Cohesion: 0.14
Nodes (13): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+5 more)

### Community 131 - "storeDb.ts"
Cohesion: 0.26
Nodes (17): FooterContact(), AdminPage(), AdminPageProps, fetchLiveCatalog(), getStoredOrders(), getStoredProducts(), KEYS, markProductsSoldOut() (+9 more)

### Community 132 - "pricing.js"
Cohesion: 0.60
Nodes (4): seedDatabase(), calculateShippingFee(), calculateVatInclusive(), computeOrderTotals()

### Community 133 - "vite.config.ts"
Cohesion: 0.18
Nodes (9): ref_node_crypto, ref_node_fs, ref_node_http, ref_node_path, ref_node_url, @vitejs/plugin-react, __dirname, MIME_MAP (+1 more)

### Community 134 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, postcss, tailwindcss, @types/node, @types/react, @types/react-dom, typescript (+2 more)

### Community 135 - "router.js"
Cohesion: 0.09
Nodes (11): computeSaltedSha256(), setup(), VALID_DIGESTS, router, isRouteLoading, router, routes, billing_frontend_src_style (+3 more)

### Community 136 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, clsx, framer-motion, jspdf, lenis, lucide-react, react, react-dom (+1 more)

### Community 137 - "RouterContext.tsx"
Cohesion: 0.36
Nodes (7): AppRoute, readLocation(), resolveRoute(), RouterContext, RouterContextValue, RouterProvider(), RouteState

### Community 138 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, preview, test

### Community 139 - "operational-scrutiny-demo.js"
Cohesion: 0.38
Nodes (6): colors, fs, getJSON(), http, postJSON(), runProofOfConcept()

### Community 141 - "patch-checkout-pdf.js"
Cohesion: 0.40
Nodes (4): checkoutPath, content, fs, path

### Community 144 - "find_telecom.js"
Cohesion: 0.50
Nodes (3): fs, path, searchMatches()

### Community 145 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, preview

### Community 146 - "fix-etims-generator.js"
Cohesion: 0.40
Nodes (4): content, filePath, fs, path

### Community 150 - "reservationSweeper.js"
Cohesion: 0.18
Nodes (6): { clearCache }, db, ladhaService, { Op }, ReservationSweeper, 10. Production Readiness & Quality Audit Metrics

### Community 155 - "health.routes.js"
Cohesion: 0.40
Nodes (4): db, express, redis, router

## Knowledge Gaps
- **736 isolated node(s):** `failedAttempts`, `db`, `db`, `{ Sequelize }`, `path` (+731 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 909 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **38 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Release 2.4.0 — Apple Human Interface & Swiss Brutalism Milestone` connect `Release 2.4.0 — Apple Human Interface & Swiss Brutalism Milestone` to `auth.mjs`, `reservationSweeper.js`?**
  _High betweenness centrality (0.246) - this node is a cross-community bridge._
- **Why does `Ladha Commerce & Ledger Platform — Engineering Dev Log` connect `auth.mjs` to `Release 2.4.0 — Apple Human Interface & Swiss Brutalism Milestone`?**
  _High betweenness centrality (0.245) - this node is a cross-community bridge._
- **Why does `Release 3.0.0 (`experimental/mattis-storefront`) — Mattis Editorial Architecture & Kinetic Storefront Migration` connect `auth.mjs` to `useRouter`?**
  _High betweenness centrality (0.238) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `Oa()` (e.g. with `Dt()` and `kn()`) actually correct?**
  _`Oa()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 31 inferred relationships involving `r()` (e.g. with `Dt()` and `O()`) actually correct?**
  _`r()` has 31 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `e()` (e.g. with `jspdf.umd.min.js` and `e()`) actually correct?**
  _`e()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `failedAttempts`, `db`, `db` to the rest of the system?**
  _736 weakly-connected nodes found - possible documentation gaps or missing edges._