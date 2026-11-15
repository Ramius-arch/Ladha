# Ladha Storefront App (`storefront-app/`)

The primary **Ladha Nairobi Archival Streetwear** storefront built on the **Mattis** editorial design architecture (**React 19 + TypeScript + Vite 6 + Tailwind CSS 3 + Framer Motion 12 + Lenis Smooth Scroll**).

## Key Capabilities
- **1:1 Mattis Editorial Architecture**: 3-canvas color discipline (`#0b0b0b` Obsidian, `#ff4500` International Orange, `#e9e9e9` Editorial Gray), `1px` center vertical hairlines, 3D mouse-tilt frosted glass Hero with exterior crosshair lines and sweeping `#ff4500` signature SVG, `400vh` pinned Lookbook curtain wipe (`WorksBento` parity), and stepped section geometry.
- **Selective Monochrome-to-Color Hover Reveal**: High-contrast archival monochrome (`grayscale`) that blooms into full color on hover across the **6% Selection Protocol portrait**, **Lookbook Contact Sheet (`LKB-05`–`LKB-08`)**, and **4-Stage Curation Protocol accordion**, while keeping all Vault & Shop product cards in full natural color.
- **Kenyan Commerce & Qx_Billing Bridge**:
  - Persistent 1-of-1 cart (`ladha_cart_v1`), catalog overrides (`ladha_products_v1`), and order ledger (`ladha_orders_v1`).
  - Live Safaricom M-Pesa STK Push checkout (`POST /api/stores/ladha-nairobi/checkout`), real-time status polling (`GET /api/mpesa/query/:checkoutRequestId`), interactive local STK PIN simulator, and automatic offline fallback.
  - One-click statutory **KRA eTIMS Tax Invoice (PDF)** download (`GET /api/commerce/invoices/:orderNumber/etims-pdf`).

## Commands
```bash
npm run dev      # Start Vite dev server on http://localhost:3002
npm run build    # Type-check (tsc -b) and build production bundle into dist/
```

See the root [`README.md`](../README.md), [`DEVLOG.md`](../DEVLOG.md), and [`ARCHITECTURE.md`](../ARCHITECTURE.md) for full monorepo documentation.
