# LADHA — TASTE OVER TREND.

> **Curated Kenyan Archival & Vintage Streetwear Platform**  
> Provenance: Nairobi, Kenya (01°17′S 36°49′E)  
> Repository: [github.com/Ramius-arch/Ladha](https://github.com/Ramius-arch/Ladha)

---

## Brand Manifesto

In a sea of fast-fashion sameness, singular taste is currency. We inspect hundreds of vintage bales across Nairobi's archival epicenters (Gikomba, Toi, Ngara), reject 94% of what we touch, and archive only the 1-of-1 pieces worth owning.

---

## Architectural & Aesthetic System

Crafted under high-discipline Swiss Brutalist principles and editorial kinetic design:

* **Atmospheric 3-Canvas Discipline**: Architectural Bone canvas (`#f5f4f0`) grounded in deep ink typography (`#0a0a0a`), subtle 35mm analogue grain, and surgical Acid Lime (`#ccff00`) interaction accents.
* **50% Bilateral Grid Tension**: Desktop viewport divided cleanly down the center with a 1px physical hairline and architectural corner crosshairs (`+`).
* **Tactile Optical Viewfinder Terminal**: Interactive garment terminal featuring a 3-look switcher (`[ LOOK 01 // NIKE 90s ]`, `[ LOOK 02 // LEVI'S RAW ]`, `[ LOOK 03 // CARHARTT ]`), technical camera HUD (`● REC [4K 60FPS]`, `LENS 50MM F/1.4`, `1/250S // ISO 400`), GPS coordinates, and textured kraft hangtags.
* **Kinetic Micro-Interactions**: Two-state kinetic rolling text buttons (`SEE WHAT JUST DROPPED ↓`), infinite marquee tickers, and live Nairobi operational clock.
* **Zero Viewport Clipping**: Sized with strict responsive parity across 1366x768, 1440x900, 1080p, and ultra-wide displays.

---

## Project Structure

```
ladha/
├── index.html            # Editorial Runway Homepage & Viewfinder Terminal
├── shop.html             # Archive Drops Catalog with Filter & Search
├── product.html          # Deep-Dive Garment Specs & 1-of-1 Detail View
├── about.html            # The 6% Protocol Manifesto & Nairobi Heritage
├── checkout.html         # M-Pesa Instant Checkout & Order Review
├── admin.html            # Store Manager CRM & Media Asset Management Suite
├── server.py             # Python HTTP Server with Multipart Upload & DB API
├── css/
│   └── style.css         # Unified Design System & Atelier Responsive Engine
├── js/
│   ├── main.js           # Runway Terminal Switcher, Smooth Scroll & UI Observers
│   ├── store-db.js       # Autonomous Client DB with LocalStorage Persistence
│   ├── cart.js           # Shopping Bag Drawer, Cart State & Persistence
│   ├── admin.js          # Full CRM Suite Controller (Products, Feed, Lookbook)
│   └── products-data.js  # Factory Archival Catalog Seed Dataset
└── assets/
    ├── products/         # 4K Textured Garment Photography (Nike, Levi's, Carhartt)
    ├── lookbook/         # Editorial Runway Looks & Nairobi Street Style
    ├── feed/             # Community Studio Photography
    ├── videos/           # Cinematic Grain & Atmospheric Video Loops
    └── uploads/          # Store Manager CRM Upload Destination
```

---

## Key Features

1. **Autonomous Client-Side Database (`js/store-db.js`)**:
   * Works 100% client-side out of the box with zero setup.
   * Changes in `admin.html` instantly synchronize across the storefront, cart, and checkout in real time.
   * Full JSON export/import for catalog portability.

2. **Store Manager CRM Suite (`admin.html`)**:
   * **Inventory & Drops**: Add, edit, or archive products with custom prices, condition grades, and stock states.
   * **Media Uploader**: Drag-and-drop image and video asset uploader with instant client-side preview.
   * **Lookbook & Community Feed**: Reorganize gallery slides and studio highlights on the fly.
   * **Telemetry & Orders**: Real-time stats on total catalog valuation, active pieces, and M-Pesa transactions.

3. **Seamless E-Commerce Flow**:
   * Instant slide-out shopping bag drawer (`BAG (0)`).
   * Streamlined checkout funnel with M-Pesa prompt simulation, Nairobi same-day dispatch notes, and immediate receipt generation.

---

## Local Development

To run the local server with full upload and API support:

```bash
# Clone the repository
git clone https://github.com/Ramius-arch/Ladha.git
cd Ladha

# Launch the local server
python server.py 3001
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## Static Deployment (GitHub Pages / Vercel / Netlify)

Because LADHA is architected with a resilient client-side storage engine (`store-db.js`), it deploys statically with zero build steps required:

1. Push to GitHub (`main` branch).
2. Under **Repository Settings** > **Pages**, set **Source** to **Deploy from a branch** (`main` / root).
3. The site will be live instantly at `https://ramius-arch.github.io/Ladha/`.

---

## License

All rights reserved © LADHA Nairobi Archive. Taste Over Trend.
