# STOREFRONT — Unified Commerce & Billing Ecosystem

A unified monorepo integrating **Ladha** (curated Kenyan archival streetwear storefront) with **Qx_Billing** (enterprise billing, invoicing, ledger, and automated payment engine).

---

## Ecosystem Overview

```
                                      +---------------------------------------------+
                                      |              LADHA STOREFRONT               |
                                      |   Swiss Brutalist E-Commerce Experience     |
                                      |   - Nairobi Archival Garment Catalog        |
                                      |   - Optical Viewfinder Terminal & Looks     |
                                      |   - Shopping Cart & M-Pesa STK Modal        |
                                      +----------------------+----------------------+
                                                             |
                                         POST /api/stores/ladha-nairobi/checkout
                                         STK Push Telemetry & Real-Time Polling
                                                             v
                                      +---------------------------------------------+
                                      |             QX BILLING ENGINE               |
                                      |   Node.js / Express Ledger & Commerce Core  |
                                      |   - Customer Auto-Provisioning & Ledger     |
                                      |   - Automated Bill & Invoice Generation     |
                                      |   - PDFMake Invoicing & Email Dispatch      |
                                      |   - M-Pesa Callback & STK Simulator Engine  |
                                      +----------------------+----------------------+
                                                             |
                                                             v
                                      +---------------------------------------------+
                                      |            QX LEDGER DASHBOARD              |
                                      |   Vue 3 / Vite Operations Management        |
                                      |   - Real-time Revenue & Usage Reports       |
                                      |   - Customer Accounts & Invoice History     |
                                      +---------------------------------------------+
```

---

## Repository Structure

```
Storefront/
├── storefront-app/          # Primary Ladha Storefront SPA (React 19 / TS / Vite 6 / Tailwind 3 / Framer Motion 12 / Lenis)
│   ├── src/
│   │   ├── components/
│   │   │   ├── home/        # 1:1 Mattis Editorial Sections (Hero, SelectionProtocol, DropsCatalog, LookbookShowcase, etc.)
│   │   │   └── ui/          # RollingTextButton, ProductCard, CartDrawer, QuickViewModal, CustomCursor
│   │   ├── pages/           # HomePage, ShopPage, ProductPage, CheckoutPage, AboutPage, LegalPage
│   │   ├── services/        # dukaCheckout.ts (M-Pesa STK Push, Polling, Simulator & KRA eTIMS PDF Bridge)
│   │   └── context/         # CartContext (ladha_cart_v1), RouterContext, SoundContext
│   └── vite.config.ts       # Dev server on Port 3002 with /assets & /api middleware
│
├── storefront/              # Shared Static Assets & Legacy HTML/Admin Suite (/assets, /admin)
│   ├── assets/              # High-res Lookbook, Product, Audio & Runway Video Assets
│   ├── admin.html           # Media Asset Manager & Catalog Suite
│   └── data/                # Seed Catalog (products.json) & Orders
│
├── billing/                 # Qx_Billing Engine & Dashboard
│   ├── backend/             # Express.js Commerce & Billing API (Port 5000)
│   │   ├── server.js        # Main server entry point
│   │   ├── models/          # Sequelize Models (Customer, Bill, Invoice, Payment, etc.)
│   │   ├── routes/          # API Routes (including duka.routes.js commerce bridge)
│   │   ├── controllers/     # Billing, Invoicing, Payment controllers
│   │   └── services/        # PDF Invoicing, Africa's Talking SMS, Demo Data
│   └── frontend/            # Vue 3 / Vite Management Dashboard (Port 5174)
│       └── src/             # Analytics, Customer Ledger, Usage Trends
│
├── scripts/
│   ├── start-dev.js         # Concurrent multi-service development launcher
│   └── build-unified.js     # Unified production bundler (storefront-app + /assets + /admin + /admin/ledger)
├── ARCHITECTURE.md          # In-depth architectural blueprint and API contract
├── DEVLOG.md                # Comprehensive engineering changelog and release milestones
└── package.json             # Root workspace scripts and dependencies
```

---

## Upstream Git Remotes

This workspace tracks the original repositories via dedicated remotes:

- **Ladha Upstream**: `https://github.com/Ramius-arch/Ladha.git` (`ladha/main`)
- **Qx_Billing Upstream**: `https://github.com/Ramius-arch/Qx_Billing.git` (`qx-billing/main`)

To view configured remotes:
```bash
git remote -v
```

To fetch updates from upstreams:
```bash
git fetch ladha
git fetch qx-billing
```

---

## Quick Start (Local Development)

### Prerequisites
- Node.js >= 20.0.0
- Python 3.9+

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Start Unified Development Environment
```bash
npm run dev
```

This launches:
- **Ladha Storefront (Mattis React SPA)**: [http://localhost:3002](http://localhost:3002)
- **Billing Commerce API**: [http://localhost:5000](http://localhost:5000)
- **Qx_Billing Ledger Dashboard**: [http://localhost:5174](http://localhost:5174)

### 3. Individual Service Scripts
```bash
npm run dev:storefront-app    # Run Ladha Storefront React/Vite SPA (Port 3002)
npm run dev:billing-backend   # Run Billing Engine & M-Pesa API (Port 5000)
npm run dev:billing-frontend  # Run Vue Ledger Dashboard (Port 5174)
npm run build                 # Build unified production bundle into dist/
```

---

## Commerce Bridge API

The Qx_Billing backend exposes the Duka commerce gateway for headless storefronts:

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/stores/:storeId/checkout` | Accepts cart items, creates customer, generates bill & invoice, triggers STK push |
| `GET` | `/api/mpesa/query/:checkoutRequestId` | Polls STK push status (`PENDING`, `PAID`, `FAILED`) |
| `POST` | `/api/mpesa/simulate-action` | Simulates customer PIN entry or cancellation during local testing |
| `GET` | `/api/stores/:storeId/orders` | Retrieves all bills, orders, and receipts for the store |

---

## License

ISC License &copy; 2026 Ramius-arch.
