# Graph Report - Storefront  (2026-11-15)

## Corpus Check
- 244 files · ~1,948,521 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: .css 7, (none) 6, .toml 2)

## Summary
- 1689 nodes · 2923 edges · 157 communities (117 shown, 40 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 210 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2e7d4484`
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
- router.js
- scripts
- frontend/vercel.json
- api.js
- Ladha Storefront Index View
- DukaClient
- clearCache
- cart.js
- cacheHandler.js
- check-page-vars.js
- Reports.vue
- dependencies
- sequelize
- routes.config.js
- Release 2.4.0 — Apple Human Interface & Swiss Brutalism Milestone
- express
- Dashboard.vue
- payments.routes.js
- diligenceService.js
- mockData.js
- scripts
- api/auth.js
- demoData.js
- MpesaService
- usage.routes.js
- STOREFRONT — Unified Commerce & Billing Ecosystem
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
- ConfigController.js
- storefront/README.md
- Oa
- build-unified.js
- etimsInvoiceService.js
- verify-all-pages.js
- Walkthrough — Deployment & Logger Fixes
- EmailService
- ReconciliationService
- ledger.js
- apply-ladha-ui-refactor.js
- e
- check-assets.js
- update-ui-to-ladha-commerce.js
- ref_path
- fix-billing-engine.js
- jspdf.umd.min.js
- Frontend Performance, Router Stability, & Commerce Invariants
- App.tsx
- audit_telecom_all.js
- sms_service.js
- patch-frontend.js
- checkoutService.js
- react
- ref_c
- app.test.js
- devDependencies
- useTenantConfig
- scripts
- duka.routes.js
- s
- patch-admin-html.js
- ref_fs
- test-diligence-gen.js
- a
- i
- patch-pdf-generation.js
- generate_portfolio_video.js
- patch-api-pdf-validator.js
- patch-checkout-and-invoicedetail.js
- main.tsx
- test-unified-dist.js
- fix-etims-generator.js
- patch-api-client.js
- CheckoutPage.tsx
- pricing.js
- compilerOptions
- storefront-app/package.json
- siteContent.ts
- compilerOptions
- storeDb.ts
- devDependencies
- vite.config.ts
- devDependencies
- api
- dependencies
- RouterContext.tsx
- ref_https
- operational-scrutiny-demo.js
- storefront_app_src_data_sitecontent_lookbookitem
- patch-checkout-pdf.js
- r
- ref_vite
- find_telecom.js
- scripts
- HomePage.tsx
- tsconfig.json
- reservationSweeper.js
- ge
- 3. Subtle Nuances & Compatibility Logic
- storefront-app/README.md
- SYSTEM ARCHITECTURE — LADHA & QX BILLING INTEGRATION
- health.routes.js
- Ladha Commerce & Ledger Platform — Engineering Dev Log

## God Nodes (most connected - your core abstractions)
1. `Oa()` - 110 edges
2. `r()` - 97 edges
3. `Se` - 55 edges
4. `e()` - 40 edges
5. `useRouter()` - 35 edges
6. `react` - 31 edges
7. `vue` - 25 edges
8. `clearCache()` - 24 edges
9. `sequelize` - 23 edges
10. `a()` - 23 edges

## Surprising Connections (you probably didn't know these)
- `10. Production Readiness & Quality Audit Metrics` --references--> `ReservationSweeper`  [INFERRED]
  DEVLOG.md → billing/backend/services/commerce/reservationSweeper.js
- `1. Architectural Migration (`storefront-app/`)` --references--> `ProductCard()`  [INFERRED]
  DEVLOG.md → storefront-app/src/components/ui/ProductCard.tsx
- `1. Architectural Migration (`storefront-app/`)` --references--> `RollingTextButton()`  [INFERRED]
  DEVLOG.md → storefront-app/src/components/ui/RollingTextButton.tsx
- `7. Dynamic Graph Period Switching & High-Contrast Ink Remediation` --references--> `getBillingTrends()`  [INFERRED]
  DEVLOG.md → billing/backend/controllers/Reports/report_controller.js
- `1. Architectural Migration (`storefront-app/`)` --references--> `CurationProcessSection()`  [INFERRED]
  DEVLOG.md → storefront-app/src/components/home/CurationProcessSection.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Archival Commerce to Double-Entry Ledger Pipeline** — storefront_js_duka_client_dukaclient, billing_backend_routes_duka_routes, billing_backend_services_ladhaservice, storefront_server_ladhaserverhandler [INFERRED 0.95]
- **Enterprise Billing & Compliance Ledger Suite** — billing_backend_models_bill, billing_backend_models_invoice, billing_backend_models_customer, billing_backend_models_payment [INFERRED 0.95]

## Communities (157 total, 40 thin omitted)

### Community 0 - "Se"
Cohesion: 0.05
Nodes (7): ea(), fa, ha(), Se, ua(), Vi(), xe()

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
Nodes (19): base64, cv2, hashlib, hmac, http_server, json, os, pil (+11 more)

### Community 5 - "customer_contoller.js"
Cohesion: 0.13
Nodes (18): asyncHandler, { clearCache }, createCustomer, db, deleteCustomer, { ErrorResponse }, getCustomerById, getCustomers (+10 more)

### Community 6 - "billing/backend/server.js"
Cohesion: 0.08
Nodes (25): app, billRoutes, bodyParser, configRoutes, cors, customerRoutes, db, dbConfig (+17 more)

### Community 7 - "debug-checkout-urls.js"
Cohesion: 0.07
Nodes (24): ref_http, fs, html, http, ports, urls, { chromium }, DIST_DIR (+16 more)

### Community 9 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, africastalking, bcryptjs, cors, dotenv, express, @faker-js/faker, ioredis (+11 more)

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
Nodes (20): author, description, autoprefixer, jspdf, lenis, postcss, tailwindcss, vite (+12 more)

### Community 15 - "router.js"
Cohesion: 0.12
Nodes (11): columns, router, isRouteLoading, router, routes, billing_frontend_src_style, @ant-design/icons-vue, ant-design-vue (+3 more)

### Community 16 - "scripts"
Cohesion: 0.11
Nodes (18): author, description, keywords, license, name, private, scripts, build (+10 more)

### Community 18 - "api.js"
Cohesion: 0.21
Nodes (10): apiClient, createDiligenceDossierDoc(), createEtimsInvoiceDoc(), downloadBlob(), downloadDiligenceDossier(), downloadEtimsInvoice(), App(), axios (+2 more)

### Community 19 - "Ladha Storefront Index View"
Cohesion: 0.13
Nodes (15): Asset: feed-1.jpg, Asset: feed-2.jpg, Asset: feed-3.jpg, Asset: feed-4.jpg, Asset: feed-5.jpg, Asset: feed-6.jpg, Asset: look-1.jpg, Asset: look-2.jpg (+7 more)

### Community 21 - "clearCache"
Cohesion: 0.17
Nodes (8): { clearCache }, createPayment(), db, { ErrorHandler }, mpesaCallback(), updatePaymentStatus(), clearCache(), CheckoutService

### Community 22 - "cart.js"
Cohesion: 0.34
Nodes (13): addToCart(), clearCart(), closeDrawer(), getCart(), getCartCount(), getCartTotal(), injectDrawer(), openDrawer() (+5 more)

### Community 23 - "cacheHandler.js"
Cohesion: 0.18
Nodes (8): logger, Redis, logger, redis, logger, winston, ioredis, winston

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

### Community 29 - "Release 2.4.0 — Apple Human Interface & Swiss Brutalism Milestone"
Cohesion: 0.20
Nodes (10): getBillingTrends(), 1. Executive Summary & Philosophy, 2. Forensic Defect Resolutions (Screenshots 1 through 8), 3. Steve Jobs / Apple Typography & Craft Upgrades, 4. Automated Testing & Verification Suite, 6. Production Operations Automation & Defect Resolution (Screenshots 9 through 13), 7. Dynamic Graph Period Switching & High-Contrast Ink Remediation, 8. Institutional Capital, Commercial Loan Underwriting & VC Diligence Suite (+2 more)

### Community 30 - "express"
Cohesion: 0.15
Nodes (10): configController, express, router, express, planController, router, express, reportController (+2 more)

### Community 31 - "Dashboard.vue"
Cohesion: 0.25
Nodes (4): setup(), Qx Billing Mobile Portrait & Layout Plan, chart.js, vue-chartjs

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
Cohesion: 0.20
Nodes (8): crypto, db, ref_crypto, createToken(), crypto, hashIp(), rateLimitMap, verifyToken()

### Community 37 - "demoData.js"
Cohesion: 0.29
Nodes (7): seedDatabase(), GARMENT_CATALOG, generateDemoData(), generatePlans(), KENYAN_SHOPPERS, MPESA_CODES, ZONE_TARIFFS

### Community 38 - "MpesaService"
Cohesion: 0.29
Nodes (3): mpesa, MpesaService, ref_mpesa_sdk

### Community 39 - "usage.routes.js"
Cohesion: 0.33
Nodes (5): billing_backend_controllers_usage_usage_controller_usagecontroller, auth, express, router, { UsageController }

### Community 40 - "STOREFRONT — Unified Commerce & Billing Ecosystem"
Cohesion: 0.18
Nodes (11): 1. Install Dependencies, 2. Start Unified Development Environment, 3. Individual Service Scripts, Commerce Bridge API, Ecosystem Overview, License, Prerequisites, Quick Start (Local Development) (+3 more)

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
Cohesion: 0.33
Nodes (5): buildCommand, installCommand, outputDirectory, rewrites, version

### Community 53 - "vercel.json"
Cohesion: 0.50
Nodes (3): cleanUrls, routes, version

### Community 54 - "Qx_Billing"
Cohesion: 0.18
Nodes (10): Backend, Backend Setup, Features, Frontend, Frontend Setup, Getting Started, Prerequisites, Project Structure (+2 more)

### Community 80 - "storefront/README.md"
Cohesion: 0.25
Nodes (7): Architectural & Aesthetic System, Brand Manifesto, Key Features, License, Local Development, Project Structure, Static Deployment (GitHub Pages / Vercel / Netlify)

### Community 81 - "Oa"
Cohesion: 0.11
Nodes (43): Dt(), Et(), Oa(), be(), ce(), dn(), ee(), en() (+35 more)

### Community 82 - "build-unified.js"
Cohesion: 0.08
Nodes (22): ref_child_process, BILLING_FRONTEND_DIR, billingDist, checks, copyDirRecursive(), { execSync }, fs, LEDGER_DEST (+14 more)

### Community 83 - "etimsInvoiceService.js"
Cohesion: 0.25
Nodes (7): crypto, db, fonts, generateEtimsInvoicePdf(), PdfPrinter, printer, pdfmake

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
Cohesion: 0.14
Nodes (30): C(), l(), n(), o(), at(), b(), bt(), ct() (+22 more)

### Community 91 - "check-assets.js"
Cohesion: 0.33
Nodes (5): fs, hrefs, html, path, srcs

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
Cohesion: 0.10
Nodes (18): aa(), Ca(), Gi(), I(), Ia(), Ji(), Ki(), La() (+10 more)

### Community 96 - "Frontend Performance, Router Stability, & Commerce Invariants"
Cohesion: 0.15
Nodes (12): 10. Strict Light-Mode Ink Contrast & Surface Elevation, 11. Production-Grade Operations Automation & Redundancy Prevention, 1. Zero-Jank Animation & Reactive Performance Guardrails, 2. Router & View Stability Invariants, 3. Financial & Commerce Domain Modeling Invariants, 4. Modern Tailwind v4 Engine Invariants, 5. Dual-Theme (Light / Dark) Synchronization Protocol, 6. Static Asset Mirroring & Image Fail-Safe Integrity (+4 more)

### Community 97 - "App.tsx"
Cohesion: 0.19
Nodes (20): PAGE_TITLES, CartDrawer(), Header(), DropsCatalogSectionProps, QuickViewModal(), QuickViewModalProps, ProductCard(), ProductCardProps (+12 more)

### Community 98 - "audit_telecom_all.js"
Cohesion: 0.50
Nodes (4): checkFile(), fs, path, walk()

### Community 99 - "sms_service.js"
Cohesion: 0.33
Nodes (3): africastalking, SMSService, africastalking

### Community 100 - "patch-frontend.js"
Cohesion: 0.40
Nodes (4): apiPath, code, fs, path

### Community 101 - "checkoutService.js"
Cohesion: 0.12
Nodes (14): checkoutService, db, express, ladhaService, router, { clearCache }, db, ladhaService (+6 more)

### Community 102 - "react"
Cohesion: 0.16
Nodes (15): framer-motion, lucide-react, react, HeaderProps, CATEGORIES, ReputationProofSection(), AnimatedCounter(), AnimatedCounterProps (+7 more)

### Community 103 - "ref_c"
Cohesion: 0.08
Nodes (17): { chromium }, fs, OUT_DIR, path, { chromium }, { chromium }, { chromium }, ref_c (+9 more)

### Community 104 - "app.test.js"
Cohesion: 0.50
Nodes (3): app, request, supertest

### Community 105 - "devDependencies"
Cohesion: 0.67
Nodes (3): devDependencies, jest, supertest

### Community 106 - "useTenantConfig"
Cohesion: 0.24
Nodes (7): setup(), SAAS_PRESETS, setup(), setup(), currentPresetKey, useTenantConfig(), setPreset()

### Community 107 - "scripts"
Cohesion: 0.67
Nodes (3): scripts, start, test

### Community 109 - "duka.routes.js"
Cohesion: 0.18
Nodes (10): checkoutService, db, express, handleReconcile(), idempotency, ledger, router, db (+2 more)

### Community 110 - "s"
Cohesion: 0.26
Nodes (13): b(), B(), an(), cn(), hn(), ln(), nn(), rn() (+5 more)

### Community 111 - "patch-admin-html.js"
Cohesion: 0.40
Nodes (4): filePath, fs, html, path

### Community 112 - "ref_fs"
Cohesion: 0.08
Nodes (19): ref_fs, fs, s, c, fs, p, path, fs (+11 more)

### Community 113 - "test-diligence-gen.js"
Cohesion: 0.11
Nodes (15): c_users_admin_documents_github_storefront_billing_frontend_node_modules_jspdf, c_users_admin_documents_github_storefront_billing_frontend_node_modules_jspdf_jspdf, buffer, doc, fs, { jsPDF }, buffer, doc (+7 more)

### Community 114 - "a"
Cohesion: 0.21
Nodes (16): a(), c(), d(), f(), h(), ke(), l(), ot() (+8 more)

### Community 115 - "i"
Cohesion: 0.19
Nodes (15): er(), g(), ae(), et(), g(), i(), k(), kt() (+7 more)

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

### Community 120 - "main.tsx"
Cohesion: 0.50
Nodes (3): react-dom, App(), storefront_app_src_index

### Community 121 - "test-unified-dist.js"
Cohesion: 0.29
Nodes (6): DIST, fs, http, mimeTypes, path, server

### Community 122 - "fix-etims-generator.js"
Cohesion: 0.40
Nodes (4): content, filePath, fs, path

### Community 123 - "patch-api-client.js"
Cohesion: 0.40
Nodes (4): c, fs, p, path

### Community 124 - "CheckoutPage.tsx"
Cohesion: 0.17
Nodes (15): ref_jspdf, CartContextValue, CheckoutPage(), CheckoutPageProps, REGIONS, BILLING_API_URL, DukaCheckoutRequest, DukaCheckoutResult (+7 more)

### Community 125 - "pricing.js"
Cohesion: 0.83
Nodes (3): calculateShippingFee(), calculateVatInclusive(), computeOrderTotals()

### Community 127 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+10 more)

### Community 128 - "storefront-app/package.json"
Cohesion: 0.12
Nodes (16): clsx, tailwind-merge, @types/node, @types/react, @types/react-dom, typescript, autoprefixer, jspdf (+8 more)

### Community 129 - "siteContent.ts"
Cohesion: 0.15
Nodes (15): FaqSection(), LookSlideProps, CartContext, CartProvider(), loadPersistedCart(), storefront_app_src_data_defaultproducts, CURATION_STEPS, DEFAULT_PRODUCTS (+7 more)

### Community 130 - "compilerOptions"
Cohesion: 0.14
Nodes (13): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+5 more)

### Community 131 - "storeDb.ts"
Cohesion: 0.24
Nodes (14): StorefrontShell(), FooterContact(), useLenis(), raf(), fetchLiveCatalog(), getStoredProducts(), KEYS, markProductsSoldOut() (+6 more)

### Community 132 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, happy-dom, postcss, tailwindcss, @tailwindcss/postcss, vite, @vitejs/plugin-vue (+2 more)

### Community 133 - "vite.config.ts"
Cohesion: 0.20
Nodes (8): ref_node_fs, ref_node_http, ref_node_path, ref_node_url, @vitejs/plugin-react, __dirname, MIME_MAP, STOREFRONT_DIR

### Community 134 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, postcss, tailwindcss, @types/node, @types/react, @types/react-dom, typescript (+2 more)

### Community 135 - "api"
Cohesion: 0.25
Nodes (3): api, ref_dayjs, papaparse

### Community 136 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, clsx, framer-motion, jspdf, lenis, lucide-react, react, react-dom (+1 more)

### Community 137 - "RouterContext.tsx"
Cohesion: 0.36
Nodes (7): AppRoute, readLocation(), resolveRoute(), RouterContext, RouterContextValue, RouterProvider(), RouteState

### Community 138 - "ref_https"
Cohesion: 0.29
Nodes (3): ref_https, https, https

### Community 139 - "operational-scrutiny-demo.js"
Cohesion: 0.38
Nodes (6): colors, fs, getJSON(), http, postJSON(), runProofOfConcept()

### Community 141 - "patch-checkout-pdf.js"
Cohesion: 0.40
Nodes (4): checkoutPath, content, fs, path

### Community 142 - "r"
Cohesion: 0.16
Nodes (16): a(), e(), j(), ja(), E(), M(), O(), R() (+8 more)

### Community 144 - "find_telecom.js"
Cohesion: 0.50
Nodes (3): fs, path, searchMatches()

### Community 145 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, preview

### Community 146 - "HomePage.tsx"
Cohesion: 0.21
Nodes (10): 1. Architectural Migration (`storefront-app/`), CurationProcessSection(), DropsCatalogSection(), Hero(), HeroProps, LookbookShowcase(), ProofNumbersSection(), SelectionProtocolSection() (+2 more)

### Community 150 - "reservationSweeper.js"
Cohesion: 0.18
Nodes (6): { clearCache }, db, ladhaService, { Op }, ReservationSweeper, 10. Production Readiness & Quality Audit Metrics

### Community 151 - "ge"
Cohesion: 0.29
Nodes (10): d(), ge(), pe(), qe(), ve(), we(), x(), Te() (+2 more)

### Community 152 - "3. Subtle Nuances & Compatibility Logic"
Cohesion: 0.29
Nodes (5): 3. Subtle Nuances & Compatibility Logic, Nuance 1: 1-of-1 Archival Pieces vs. Telecom Plans & Quantities, Nuance 2: Kenyan E.164 Phone Normalization & Customer Unification, Nuance 3: Nairobi Regional Delivery Tariffs vs. Flat Invoicing, Nuance 4: Direct API Bridge (Qx_Billing -> Ladha)

### Community 153 - "storefront-app/README.md"
Cohesion: 0.33
Nodes (3): Commands, Key Capabilities, Ladha Storefront App (`storefront-app/`)

### Community 154 - "SYSTEM ARCHITECTURE — LADHA & QX BILLING INTEGRATION"
Cohesion: 0.40
Nodes (5): 1. Executive Summary, 2. Component Architecture, 4. API Specification for Qx_Billing to Ladha Bridge, 5. Directory Structure in Unified Workspace, SYSTEM ARCHITECTURE — LADHA & QX BILLING INTEGRATION

### Community 155 - "health.routes.js"
Cohesion: 0.40
Nodes (4): db, express, redis, router

### Community 156 - "Ladha Commerce & Ledger Platform — Engineering Dev Log"
Cohesion: 0.40
Nodes (4): 1. Aesthetic Pivot: From Brutalist Blocks to Frosted Ceramic Glass, Ladha Commerce & Ledger Platform — Engineering Dev Log, Release 2.4.1 (Experimental UI Design) — Apple visionOS / Frosted Ceramic Glass Overhaul, Release 3.0.0 (`experimental/mattis-storefront`) — Mattis Editorial Architecture & Kinetic Storefront Migration

## Knowledge Gaps
- **732 isolated node(s):** `db`, `db`, `{ Sequelize }`, `path`, `path` (+727 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 905 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **40 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Ladha Commerce & Ledger Platform — Engineering Dev Log` connect `Ladha Commerce & Ledger Platform — Engineering Dev Log` to `Release 2.4.0 — Apple Human Interface & Swiss Brutalism Milestone`?**
  _High betweenness centrality (0.276) - this node is a cross-community bridge._
- **Why does `Release 2.4.0 — Apple Human Interface & Swiss Brutalism Milestone` connect `Release 2.4.0 — Apple Human Interface & Swiss Brutalism Milestone` to `Ladha Commerce & Ledger Platform — Engineering Dev Log`, `reservationSweeper.js`?**
  _High betweenness centrality (0.270) - this node is a cross-community bridge._
- **Why does `Release 3.0.0 (`experimental/mattis-storefront`) — Mattis Editorial Architecture & Kinetic Storefront Migration` connect `Ladha Commerce & Ledger Platform — Engineering Dev Log` to `HomePage.tsx`?**
  _High betweenness centrality (0.254) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `Oa()` (e.g. with `Dt()` and `kn()`) actually correct?**
  _`Oa()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 31 inferred relationships involving `r()` (e.g. with `Dt()` and `O()`) actually correct?**
  _`r()` has 31 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `e()` (e.g. with `jspdf.umd.min.js` and `e()`) actually correct?**
  _`e()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `db`, `db`, `{ Sequelize }` to the rest of the system?**
  _732 weakly-connected nodes found - possible documentation gaps or missing edges._