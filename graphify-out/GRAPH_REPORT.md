# Graph Report - Storefront  (2026-11-03)

## Corpus Check
- 161 files · ~592,792 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 19 file(s) not represented in the graph (top: (none) 6, .css 6, .toml 2)

## Summary
- 1002 nodes · 1355 edges · 115 communities (82 shown, 33 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 69 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `456cf55f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- fix-app-icons.js
- backend/package.json
- customers.routes.js
- admin.js
- server.py
- customer_contoller.js
- billing/backend/server.js
- operational-scrutiny-demo.js
- LadhaAmbientPlaylistEngine
- dependencies
- LadhaService
- LADHA_PRODUCTS
- index.js
- usage_controller.js
- frontend/package.json
- vue
- package.json
- router.js
- api.js
- Ladha Storefront Index View
- DukaClient
- clearCache
- cart.js
- redis.js
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
- App.js
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
- devDependencies
- start-dev.js
- etimsInvoiceService.js
- verify-all-pages.js
- Walkthrough — Deployment & Logger Fixes
- EmailService
- ReconciliationService
- ledger.js
- apply-ladha-ui-refactor.js
- ref_fs
- check-assets.js
- update-ui-to-ladha-commerce.js
- fix-dashboard-tags.js
- fix-billing-engine.js
- fix-payment-processing.js
- Frontend Performance, Router Stability, & Commerce Invariants
- find_telecom.js
- ref_path
- sms_service.js
- patch-frontend.js
- checkoutService.js
- health.routes.js
- cacheHandler.js
- app.test.js
- devDependencies
- idempotency.js
- scripts
- scripts
- duka.routes.js
- fix-usagetracker-icons.js
- patch-api-client.js
- pricing.js
- seed-ladha-commerce.js
- engines

## God Nodes (most connected - your core abstractions)
1. `clearCache()` - 24 edges
2. `sequelize` - 23 edges
3. `vue` - 23 edges
4. `ant-design-vue` - 19 edges
5. `LadhaAmbientPlaylistEngine` - 19 edges
6. `LADHA_PRODUCTS` - 17 edges
7. `ErrorResponse` - 15 edges
8. `express` - 15 edges
9. `@ant-design/icons-vue` - 14 edges
10. `DukaClient` - 14 edges

## Surprising Connections (you probably didn't know these)
- `10. Production Readiness & Quality Audit Metrics` --references--> `ReservationSweeper`  [INFERRED]
  DEVLOG.md → billing/backend/services/commerce/reservationSweeper.js
- `7. Dynamic Graph Period Switching & High-Contrast Ink Remediation` --references--> `getBillingTrends()`  [INFERRED]
  DEVLOG.md → billing/backend/controllers/Reports/report_controller.js
- `Asset: product-1.jpg` --conceptually_related_to--> `LADHA_PRODUCTS`  [INFERRED]
  storefront/assets/products/product-1.jpg → storefront/js/products-data.js
- `Asset: product-10.jpg` --conceptually_related_to--> `LADHA_PRODUCTS`  [INFERRED]
  storefront/assets/products/product-10.jpg → storefront/js/products-data.js
- `Asset: product-11.jpg` --conceptually_related_to--> `LADHA_PRODUCTS`  [INFERRED]
  storefront/assets/products/product-11.jpg → storefront/js/products-data.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Archival Commerce to Double-Entry Ledger Pipeline** — storefront_js_duka_client_dukaclient, billing_backend_routes_duka_routes, billing_backend_services_ladhaservice, storefront_server_ladhaserverhandler [INFERRED 0.95]
- **Enterprise Billing & Compliance Ledger Suite** — billing_backend_models_bill, billing_backend_models_invoice, billing_backend_models_customer, billing_backend_models_payment [INFERRED 0.95]

## Communities (115 total, 33 thin omitted)

### Community 0 - "fix-app-icons.js"
Cohesion: 0.40
Nodes (4): c, fs, p, path

### Community 1 - "backend/package.json"
Cohesion: 0.11
Nodes (17): author, description, keywords, license, main, name, type, version (+9 more)

### Community 2 - "customers.routes.js"
Cohesion: 0.15
Nodes (12): customerSchema, Joi, Joi, validate(), auth, customerController, { customerSchema }, express (+4 more)

### Community 3 - "admin.js"
Cohesion: 0.15
Nodes (20): Ladha Storefront Admin View, applyAssetToTarget(), checkIsVideo(), formatBytes(), handleFileUpload(), loadMediaAssets(), openGarmentModal(), openMediaLibrary() (+12 more)

### Community 4 - "server.py"
Cohesion: 0.12
Nodes (17): base64, hashlib, hmac, http_server, json, os, re, SimpleHTTPRequestHandler (+9 more)

### Community 5 - "customer_contoller.js"
Cohesion: 0.13
Nodes (18): asyncHandler, { clearCache }, createCustomer, db, deleteCustomer, { ErrorResponse }, getCustomerById, getCustomers (+10 more)

### Community 6 - "billing/backend/server.js"
Cohesion: 0.08
Nodes (25): app, billRoutes, bodyParser, configRoutes, cors, customerRoutes, db, dbConfig (+17 more)

### Community 7 - "operational-scrutiny-demo.js"
Cohesion: 0.16
Nodes (12): ref_http, fs, html, http, ports, urls, colors, fs (+4 more)

### Community 9 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, africastalking, bcryptjs, cors, dotenv, express, @faker-js/faker, ioredis (+11 more)

### Community 10 - "LadhaService"
Cohesion: 0.12
Nodes (11): 1. Executive Summary, 2. Component Architecture, 3. Subtle Nuances & Compatibility Logic, 4. API Specification for Qx_Billing to Ladha Bridge, 5. Directory Structure in Unified Workspace, Nuance 1: 1-of-1 Archival Pieces vs. Telecom Plans & Quantities, Nuance 2: Kenyan E.164 Phone Normalization & Customer Unification, Nuance 3: Nairobi Regional Delivery Tariffs vs. Flat Invoicing (+3 more)

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
Cohesion: 0.12
Nodes (15): author, description, keywords, license, main, name, version, autoprefixer (+7 more)

### Community 15 - "vue"
Cohesion: 0.14
Nodes (4): @ant-design/icons-vue, ant-design-vue, ref_dayjs, vue

### Community 16 - "package.json"
Cohesion: 0.12
Nodes (15): author, description, keywords, license, name, private, scripts, dev (+7 more)

### Community 17 - "router.js"
Cohesion: 0.19
Nodes (6): setup(), isRouteLoading, router, routes, billing_frontend_src_style, lenis

### Community 18 - "api.js"
Cohesion: 0.17
Nodes (5): columns, api, apiClient, vitest, @vue/test-utils

### Community 19 - "Ladha Storefront Index View"
Cohesion: 0.13
Nodes (15): Asset: feed-1.jpg, Asset: feed-2.jpg, Asset: feed-3.jpg, Asset: feed-4.jpg, Asset: feed-5.jpg, Asset: feed-6.jpg, Asset: look-1.jpg, Asset: look-2.jpg (+7 more)

### Community 21 - "clearCache"
Cohesion: 0.17
Nodes (8): { clearCache }, createPayment(), db, { ErrorHandler }, mpesaCallback(), updatePaymentStatus(), clearCache(), CheckoutService

### Community 22 - "cart.js"
Cohesion: 0.34
Nodes (13): addToCart(), clearCart(), closeDrawer(), getCart(), getCartCount(), getCartTotal(), injectDrawer(), openDrawer() (+5 more)

### Community 23 - "redis.js"
Cohesion: 0.25
Nodes (6): logger, Redis, logger, winston, ioredis, winston

### Community 24 - "check-page-vars.js"
Cohesion: 0.17
Nodes (11): apiContent, billContent, billPath, fs, path, payContent, payPath, repContent (+3 more)

### Community 25 - "Reports.vue"
Cohesion: 0.20
Nodes (10): handleDateRangeChange(), loadData(), paymentStatus, ReportData, revenueData, usageData, ref_components_paymentstatus_vue, ref_components_revenuesummary_vue (+2 more)

### Community 26 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, @ant-design/icons-vue, ant-design-vue, axios, chart.js, lenis, papaparse, vue (+2 more)

### Community 27 - "sequelize"
Cohesion: 0.04
Nodes (22): path, { Sequelize }, { DataTypes }, { DataTypes }, { DataTypes }, { DataTypes }, { DataTypes }, { DataTypes } (+14 more)

### Community 28 - "routes.config.js"
Cohesion: 0.15
Nodes (11): billingRoutes, customersRoutes, express, invoicesRoutes, paymentsRoutes, reportsRoutes, router, usageRoutes (+3 more)

### Community 29 - "Release 2.4.0 — Apple Human Interface & Swiss Brutalism Milestone"
Cohesion: 0.10
Nodes (15): getBillingTrends(), ReservationSweeper, 10. Production Readiness & Quality Audit Metrics, 1. Aesthetic Pivot: From Brutalist Blocks to Frosted Ceramic Glass, 1. Executive Summary & Philosophy, 2. Forensic Defect Resolutions (Screenshots 1 through 8), 3. Steve Jobs / Apple Typography & Craft Upgrades, 4. Automated Testing & Verification Suite (+7 more)

### Community 30 - "express"
Cohesion: 0.15
Nodes (10): configController, express, router, express, planController, router, express, reportController (+2 more)

### Community 31 - "Dashboard.vue"
Cohesion: 0.24
Nodes (5): router, Qx Billing Mobile Portrait & Layout Plan, chart.js, vue-chartjs, vue-router

### Community 32 - "payments.routes.js"
Cohesion: 0.25
Nodes (6): jwt, auth, express, paymentsController, router, jsonwebtoken

### Community 33 - "diligenceService.js"
Cohesion: 0.20
Nodes (8): crypto, db, DiligenceService, fonts, ledger, PdfPrinter, pricing, printer

### Community 34 - "mockData.js"
Cohesion: 0.25
Nodes (7): billingTrendsData, customers, invoices, outstandingDuesData, payments, usageLogs, usageReportsData

### Community 35 - "scripts"
Cohesion: 0.25
Nodes (7): name, private, scripts, build-frontend, install-backend, install-frontend, start-backend

### Community 36 - "api/auth.js"
Cohesion: 0.38
Nodes (5): createToken(), crypto, hashIp(), rateLimitMap, verifyToken()

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
Cohesion: 0.17
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

### Community 50 - "App.js"
Cohesion: 0.50
Nodes (3): App(), axios, ref_react

### Community 53 - "vercel.json"
Cohesion: 0.50
Nodes (3): cleanUrls, routes, version

### Community 54 - "Qx_Billing"
Cohesion: 0.18
Nodes (10): Backend, Backend Setup, Features, Frontend, Frontend Setup, Getting Started, Prerequisites, Project Structure (+2 more)

### Community 80 - "storefront/README.md"
Cohesion: 0.25
Nodes (7): Architectural & Aesthetic System, Brand Manifesto, Key Features, License, Local Development, Project Structure, Static Deployment (GitHub Pages / Vercel / Netlify)

### Community 81 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, happy-dom, postcss, tailwindcss, @tailwindcss/postcss, vite, @vitejs/plugin-vue (+2 more)

### Community 82 - "start-dev.js"
Cohesion: 0.29
Nodes (6): ref_child_process, path, rootDir, runningProcesses, services, { spawn }

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
Cohesion: 0.48
Nodes (6): db, ensureAccounts(), getTrialBalance(), postJournalEntry(), postReversalEntry(), STANDARD_ACCOUNTS

### Community 89 - "apply-ladha-ui-refactor.js"
Cohesion: 0.20
Nodes (9): appVue, appVuePath, dashboardVue, dashboardVuePath, fs, headerVuePath, path, reportsVue (+1 more)

### Community 90 - "ref_fs"
Cohesion: 0.40
Nodes (5): ref_fs, checkFile(), fs, path, walk()

### Community 91 - "check-assets.js"
Cohesion: 0.33
Nodes (5): fs, hrefs, html, path, srcs

### Community 92 - "update-ui-to-ladha-commerce.js"
Cohesion: 0.20
Nodes (9): appVue, appVuePath, dashboardVue, dashboardVuePath, fs, headerVuePath, path, reportsVue (+1 more)

### Community 93 - "fix-dashboard-tags.js"
Cohesion: 0.40
Nodes (4): c, fs, p, path

### Community 94 - "fix-billing-engine.js"
Cohesion: 0.40
Nodes (4): c, fs, p, path

### Community 95 - "fix-payment-processing.js"
Cohesion: 0.40
Nodes (4): c, fs, p, path

### Community 96 - "Frontend Performance, Router Stability, & Commerce Invariants"
Cohesion: 0.15
Nodes (12): 10. Strict Light-Mode Ink Contrast & Surface Elevation, 11. Production-Grade Operations Automation & Redundancy Prevention, 1. Zero-Jank Animation & Reactive Performance Guardrails, 2. Router & View Stability Invariants, 3. Financial & Commerce Domain Modeling Invariants, 4. Modern Tailwind v4 Engine Invariants, 5. Dual-Theme (Light / Dark) Synchronization Protocol, 6. Static Asset Mirroring & Image Fail-Safe Integrity (+4 more)

### Community 97 - "find_telecom.js"
Cohesion: 0.50
Nodes (3): fs, path, searchMatches()

### Community 98 - "ref_path"
Cohesion: 0.18
Nodes (8): path, ref_path, fs, p, path, fs, p, path

### Community 99 - "sms_service.js"
Cohesion: 0.33
Nodes (3): africastalking, SMSService, africastalking

### Community 100 - "patch-frontend.js"
Cohesion: 0.40
Nodes (4): apiPath, code, fs, path

### Community 101 - "checkoutService.js"
Cohesion: 0.12
Nodes (15): checkoutService, db, express, ladhaService, router, { clearCache }, db, ladhaService (+7 more)

### Community 102 - "health.routes.js"
Cohesion: 0.40
Nodes (4): db, express, redis, router

### Community 103 - "cacheHandler.js"
Cohesion: 0.22
Nodes (6): logger, redis, { clearCache }, db, ladhaService, { Op }

### Community 104 - "app.test.js"
Cohesion: 0.50
Nodes (3): app, request, supertest

### Community 105 - "devDependencies"
Cohesion: 0.67
Nodes (3): devDependencies, jest, supertest

### Community 106 - "idempotency.js"
Cohesion: 0.40
Nodes (3): crypto, db, ref_crypto

### Community 107 - "scripts"
Cohesion: 0.67
Nodes (3): scripts, start, test

### Community 108 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, preview, test

### Community 109 - "duka.routes.js"
Cohesion: 0.18
Nodes (10): checkoutService, db, express, handleReconcile(), idempotency, ledger, router, db (+2 more)

### Community 110 - "fix-usagetracker-icons.js"
Cohesion: 0.40
Nodes (4): c, fs, p, path

### Community 111 - "patch-api-client.js"
Cohesion: 0.40
Nodes (4): c, fs, p, path

### Community 112 - "pricing.js"
Cohesion: 0.83
Nodes (3): calculateShippingFee(), calculateVatInclusive(), computeOrderTotals()

## Knowledge Gaps
- **510 isolated node(s):** `db`, `db`, `{ Sequelize }`, `path`, `path` (+505 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 637 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `sequelize` connect `sequelize` to `report_controller.js`, `cacheHandler.js`, `backend/package.json`, `billing_controller.js`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `express` connect `express` to `payments.routes.js`, `backend/package.json`, `customers.routes.js`, `checkoutService.js`, `health.routes.js`, `usage.routes.js`, `billing/backend/server.js`, `src/backend/server.js`, `duka.routes.js`, `invoices.routes.js`, `routes.config.js`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `ReservationSweeper` connect `Release 2.4.0 — Apple Human Interface & Swiss Brutalism Milestone` to `cacheHandler.js`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `db`, `db`, `{ Sequelize }` to the rest of the system?**
  _510 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `backend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `server.py` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `customer_contoller.js` be split into smaller, more focused modules?**
  _Cohesion score 0.12648221343873517 - nodes in this community are weakly interconnected._