# Frontend Performance, Router Stability, & Commerce Invariants

## 1. Zero-Jank Animation & Reactive Performance Guardrails
- **Banned Reactive RAF Loops**: NEVER mutate Vue reactive `ref()`s or Svelte/React state inside `requestAnimationFrame` or high-frequency mouse/scroll handlers (e.g., lerp loops). This forces continuous VNode diffing and re-renders at 60–144Hz.
- **Hardware-Accelerated CSS Variables**: Pass continuous physics/mouse coordinates directly to the container via `element.style.setProperty('--mouse-x', val)` and handle transforms in CSS (`transform: translate3d(calc(var(--mouse-x) * 10px), ...)`). This offloads calculations to the GPU compositor thread without touching the JavaScript main thread.
- **Threshold Quenching**: In lerp loops, halt calculations when the delta is below epsilon (`Math.abs(delta) < 0.0005`) to let the main thread sleep when idle.
- **Zero Render-Blocking Font Imports**: NEVER use `@import url('https://fonts.googleapis.com/...')` inside CSS files or component `<style>` blocks. Always load fonts via `<link rel="preconnect">` and asynchronous `<link rel="stylesheet">` with `display=swap` in `index.html`.
- **Media Decoding**: Always provide `loading="lazy"` and `decoding="async"` on high-resolution decorative or cinematic image elements.

## 2. Router & View Stability Invariants
- **Direct Router Mounting**: Use direct `<router-view class="page-container" />` unless an animated transition is strictly required. Do not use `<router-view v-slot="{ Component }"><component :is="Component" /></router-view>` without suspense/error-boundary protections, as async chunk delays or child errors will unmount the slot and leave a black screen.
- **Zero Artificial Router Delays**: Never insert synthetic `setTimeout` promises into `router.scrollBehavior` or `afterEach`. Always return standard `{ top: 0, left: 0 }` immediately.
- **Menu Tooltip Integrity**: In Ant Design Vue or collapsible sidebars, always pass `:title="item.label"` explicitly on menu items to prevent tooltip text caching across icon hovers.
- **Radial Chart Scale Separation**: In Chart.js / vue-chartjs, NEVER attach Cartesian `scales: { x, y }` to radial charts (`Pie`, `Doughnut`). Maintain distinct `barChartOptions` and `pieChartOptions`.

## 3. Financial & Commerce Domain Modeling Invariants
- **Domain Authenticity**: Replace generic SaaS metrics (megabytes, generic subscription plans, arbitrary counters) with authentic business entities (e.g., 1-of-1 archival garments, buyer delivery zones, Lipa Na M-Pesa receipts).
- **Double-Entry Accounting Invariance**: All commercial financial records must satisfy double-entry balancing:
  $$\text{Total Debits} \equiv \text{Total Credits} \quad (\text{Variance} = 0.00)$$
- **Currency Cleanliness**: Never display raw unrounded floating-point amounts (e.g., `17919.379999999997`). Always format through `Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })` with explicit currency prefixes (e.g., `KES 3,750.00`).

## 4. Modern Tailwind v4 Engine Invariants
- **Mandatory Modern Import**: When using Tailwind CSS v4 (`tailwindcss@^4.0`), NEVER use legacy v3 directives (`@tailwind base; @tailwind components; @tailwind utilities;`). Always use `@import "tailwindcss";` in the root CSS file. Legacy directives cause silent compilation drops for modern grid utilities (`grid-cols-5`), gap spacing, and color opacity modifiers.
- **Color Opacity & Border Defaults**: Never rely on bare `border` without explicit border color variables. In dark mode, unset border colors fall back to `currentColor` (white), resulting in harsh unstyled wireframe boxes. Always bind borders to `--border-glass` or explicit theme tokens.

## 5. Dual-Theme (Light / Dark) Synchronization Protocol
- **Tri-Layer Atomic Theme Switching**: Any theme switch must synchronously update three layers:
  1. **DOM Attribute**: `document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')`.
  2. **Component Library Provider**: In Ant Design Vue or Element Plus, dynamically switch algorithm tokens (`isDark ? theme.darkAlgorithm : theme.defaultAlgorithm`) and update primary/background tokens.
  3. **CSS Custom Variables**: Never use hardcoded hex colors with `!important` on global elements (`html, body, .ant-card, .ant-layout-header`). Map all surfaces (`--bg-deep`, `--surface-card`, `--surface-header`, `--border-glass`, `--text-primary`, `--table-header-bg`) under both `:root, [data-theme='dark']` and `[data-theme='light']`.
- **Theme Persistence**: Always initialize theme state from `localStorage.getItem('theme')` with safe system fallbacks, writing back immediately on toggle.

## 6. Static Asset Mirroring & Image Fail-Safe Integrity
- **Public Directory Parity**: When frontend components reference static imagery (e.g., `/assets/products/*`), ensure assets exist directly in `frontend/public/`. Do not assume adjacent backend or storefront folders are served by the Vite dev server.
- **Non-Destructive Image Fallbacks**: Avoid catastrophic `@error="(e) => e.target.style.display='none'"` patterns that collapse parent card geometry into empty wireframes. Always provide a fallback icon badge or placeholder canvas.

## 7. Chameleon Multi-Tenant Commerce Architecture
- **Industry-Agnostic Financial Core**: Keep the double-entry general ledger (`services/commerce/ledger.js`), stock reservation TTL sweeper (`services/commerce/reservationSweeper.js`), and idempotency engine (`middleware/idempotency.js`) completely agnostic to product types.
- **Modular Telemetry & Tariffs**: Isolate industry-specific business rules (e.g., Nairobi courier zones, physical garment sizing, SaaS API credits) into pluggable configuration modules (`services/commerce/tariffs.js` or database configs) rather than hardcoding them into ledger posting transactions.

## 8. Steve Jobs Typographic & Calligraphic Optical Invariants
- **Mixed Serif/Sans-serif Optical Weight Balancing**: When pairing humanistic serifs (`Cormorant Garamond`, `New York`) with bold geometric grotesques (`SF Pro Display`, `Plus Jakarta Sans`), serifs naturally present a smaller optical x-height. Always apply an optical scale boost (`font-size: 1.06em - 1.08em; font-weight: 600`) to calligraphic accents (`.calligraphic-accent`) so cap-height and stroke weight optically balance with adjacent sans-serif headlines.
- **OpenType Feature Activation**: For any editorial or financial dashboard, explicitly enable OpenType calligraphic and financial features on root containers:
  `font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11', 'ss01', 'tnum', 'liga', 'dlig', 'kern', 'calt';`
  `text-rendering: optimizeLegibility; font-kerning: normal;`
- **Currency Prefix Baseline Snapping**: Currency codes (e.g., `KES`, `KSh`) must never float awkwardly or compete with numeric totals. Anchor currency prefixes using `display: flex; align-items: baseline;` and size the prefix at 35–40% of the integer font size.

## 9. Apple Inertial Kinetic Scroll Architecture (Lenis Smooth Physics)
- **Exponential Velocity Decay**: Never rely on raw, stepped browser mouse-wheel scrolling for editorial or portfolio interfaces. Mount a global smooth scroll engine (Lenis) configured with Apple's standard exponential decay:
  $$\text{decay}(t) = 1.001 - 2^{-10t} \quad (\text{duration} \approx 1.15\text{s})$$
- **Zero-Jump Route Reset**: When routes change in Single Page Applications (`router.afterEach` or `watch(() => route.path)`), immediately reset scroll offset to top (`lenisInstance.scrollTo(0, { immediate: true })`) to avoid viewport jumpiness.
- **Nested Scroll Isolation**: Always mark nested scrolling elements (table horizontal overflows, select dropdown menus, modal dialogs) with `[data-lenis-prevent]` or boundary containment to prevent mouse-wheel event capture lock.

## 10. Strict Light-Mode Ink Contrast & Surface Elevation
- **Triple-Selector Specificity Guarantee**: To prevent catastrophic white-on-white text disappearance when switching themes, never rely on a single `:root` declaration. Always declare Light mode custom properties using:
  `:root[data-theme='light'], html[data-theme='light'], body[data-theme='light']`
  and enforce explicit `#0a0f1d` (Retina Ink Black) on all heading, metric, and title classes with `!important`.
- **Canvas vs. Surface Contrast Separation**: In Light mode, never set canvas background (`--bg-deep`) to pure `#ffffff` if cards are also white. Always use a refined titanium slate canvas (`#eef2f6` or `#f1f5f9`) so pure white (`#ffffff`) cards possess physical elevation, reinforced with a top specular hairline bevel (`inset 0 1px 0 0 #ffffff`) and subtle ambient occlusion.

## 11. Production-Grade Operations Automation & Redundancy Prevention
- **Event-Driven Webhook Checkout Pipeline**: Never require human intervention to settle orders or balance accounts. The checkout lifecycle must execute atomically upon receipt of an audited payment webhook:
  $$\text{Webhook Event} \xrightarrow{\text{Signature Verified}} \text{Idempotency Check} \xrightarrow{} \begin{cases} \text{1. Stock Transition (Reserved} \to \text{Settled)} \\ \text{2. Double-Entry Journal (Debit 1100, Credit 4000/2200)} \\ \text{3. KRA eTIMS Tax Invoice Generation} \\ \text{4. Courier Zonal Dispatch + SMS Push} \end{cases}$$
- **Avoid Redundant Third-Party SaaS Middleware**:
  - **Payments**: Leverage native Safaricom Daraja 2.0 Webhooks directly for M-Pesa; avoid redundant payment aggregators taking extra 1.5% basis-point fees.
  - **Invoicing**: Use in-house PDFKit generators compliant with KRA eTIMS cryptographic QR signatures instead of recurring billing SaaS tools (e.g. Chargebee/Invoiced at \$2/invoice).
  - **Reconciliation**: Run an automated 60-second TTL Sweeper daemon for unfulfilled stock reservations, and an automated nightly ledger reconciliation script comparing Safaricom M-Pesa Statement API data directly against General Ledger Account 1100 debits.
