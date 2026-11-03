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
├── storefront/              # Ladha Headless Storefront (HTML5 / Vanilla JS / CSS)
│   ├── index.html           # Editorial Homepage & Optical Viewfinder Terminal
│   ├── shop.html            # Garment Catalog with Filter & Search
│   ├── product.html         # 1-of-1 Piece Details & Size Guides
│   ├── checkout.html        # Unified Order & Payment Checkout
│   ├── admin.html           # Media Asset Manager & Catalog Suite
│   ├── js/
│   │   ├── duka-client.js   # Headless STK Push SDK & Commerce Bridge
│   │   ├── cart.js          # Persistent Cart Engine
│   │   └── products-data.js # Curated Product Catalog
│   ├── css/style.css        # Swiss Brutalist Design System
│   └── server.py            # Local multithreaded server (Port 3001)
│
├── billing/                 # Qx_Billing Engine & Dashboard
│   ├── backend/             # Express.js Commerce & Billing API (Port 5000)
│   │   ├── server.js        # Main server entry point
│   │   ├── models/          # Sequelize Models (Customer, Bill, Invoice, Payment, etc.)
│   │   ├── routes/          # API Routes (including duka.routes.js commerce bridge)
│   │   ├── controllers/     # Billing, Invoicing, Payment controllers
│   │   └── services/        # PDF Invoicing, Africa's Talking SMS, Demo Data
│   └── frontend/            # Vue 3 / Vite Management Dashboard (Port 5173)
│       └── src/             # Analytics, Customer Ledger, Usage Trends
│
├── scripts/
│   └── start-dev.js         # Concurrent multi-service development launcher
├── ARCHITECTURE.md          # In-depth architectural blueprint and API contract
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
- **Ladha Storefront**: [http://localhost:3001](http://localhost:3001)
- **Billing Commerce API**: [http://localhost:5000](http://localhost:5000)

### 3. Individual Service Scripts
```bash
npm run dev:storefront        # Run only Ladha Storefront (Port 3001)
npm run dev:billing-backend   # Run only Billing Engine (Port 5000)
npm run dev:billing-frontend  # Run only Vue Dashboard (Port 5173)
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
