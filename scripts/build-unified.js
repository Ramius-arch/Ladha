const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const STOREFRONT_DIR = path.join(ROOT_DIR, 'storefront');
const STOREFRONT_APP_DIR = path.join(ROOT_DIR, 'storefront-app');
const BILLING_FRONTEND_DIR = path.join(ROOT_DIR, 'billing', 'frontend');
const OUTPUT_DIST = path.join(ROOT_DIR, 'dist');
const LEDGER_DEST = path.join(OUTPUT_DIST, 'admin', 'ledger');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('=== Step 1: Building Ladha Storefront App (React + Vite) ===');
if (!fs.existsSync(path.join(STOREFRONT_APP_DIR, 'node_modules'))) {
  execSync('npm install', { cwd: STOREFRONT_APP_DIR, stdio: 'inherit' });
}
execSync('npm run build', {
  cwd: STOREFRONT_APP_DIR,
  stdio: 'inherit'
});

console.log('\n=== Step 2: Building Confidential Billing Frontend with Subpath Base /admin/ledger/ ===');
if (!fs.existsSync(path.join(BILLING_FRONTEND_DIR, 'node_modules'))) {
  execSync('npm install', { cwd: BILLING_FRONTEND_DIR, stdio: 'inherit' });
}
execSync('npm run build', {
  cwd: BILLING_FRONTEND_DIR,
  env: {
    ...process.env,
    VITE_BASE_PATH: '/admin/ledger/'
  },
  stdio: 'inherit'
});

console.log('\n=== Step 3: Preparing Clean Output dist/ Directory ===');
if (fs.existsSync(OUTPUT_DIST)) {
  fs.rmSync(OUTPUT_DIST, { recursive: true, force: true });
}
fs.mkdirSync(OUTPUT_DIST, { recursive: true });

console.log('\n=== Step 4: Copying Storefront Media, Data, and Store Manager (/admin) to dist/ Root ===');
copyDirRecursive(STOREFRONT_DIR, OUTPUT_DIST);
const serverPy = path.join(OUTPUT_DIST, 'server.py');
if (fs.existsSync(serverPy)) fs.unlinkSync(serverPy);

console.log('\n=== Step 5: Overlaying Mattis-Architecture Storefront App onto dist/ ===');
const storefrontAppDist = path.join(STOREFRONT_APP_DIR, 'dist');
const storefrontAppIndex = path.join(storefrontAppDist, 'index.html');
const storefrontAppAssets = path.join(storefrontAppDist, 'storefront-assets');
if (!fs.existsSync(storefrontAppIndex) || !fs.existsSync(storefrontAppAssets)) {
  throw new Error('storefront-app/dist build outputs are missing!');
}
copyDirRecursive(storefrontAppAssets, path.join(OUTPUT_DIST, 'storefront-assets'));

for (const routeHtml of ['index.html', 'shop.html', 'product.html', 'checkout.html', 'about.html', 'legal.html']) {
  fs.copyFileSync(storefrontAppIndex, path.join(OUTPUT_DIST, routeHtml));
}

console.log('\n=== Step 6: Assembling Confidential Ledger at dist/admin/ledger/ ===');
const billingDist = path.join(BILLING_FRONTEND_DIR, 'dist');
if (!fs.existsSync(billingDist)) {
  throw new Error('billing/frontend/dist does not exist after build!');
}
copyDirRecursive(billingDist, LEDGER_DEST);

console.log('\n=== Step 7: Validating Architecture & Integrity ===');
const checks = [
  { desc: 'Public Storefront Index', path: path.join(OUTPUT_DIST, 'index.html') },
  { desc: 'Public Streetwear Shop', path: path.join(OUTPUT_DIST, 'shop.html') },
  { desc: 'Public Product Detail', path: path.join(OUTPUT_DIST, 'product.html') },
  { desc: 'Public Checkout Funnel', path: path.join(OUTPUT_DIST, 'checkout.html') },
  { desc: 'Public About Manifesto', path: path.join(OUTPUT_DIST, 'about.html') },
  { desc: 'Public Legal Page', path: path.join(OUTPUT_DIST, 'legal.html') },
  { desc: 'Storefront Vite Bundles', path: path.join(OUTPUT_DIST, 'storefront-assets') },
  { desc: 'Runway Hero Media', path: path.join(OUTPUT_DIST, 'assets', 'videos', 'streetwear-editorial.mp4') },
  { desc: 'Store Manager CRM', path: path.join(OUTPUT_DIST, 'admin.html') },
  { desc: 'Confidential Ledger Index', path: path.join(LEDGER_DEST, 'index.html') }
];

let allPassed = true;
for (const c of checks) {
  const exists = fs.existsSync(c.path);
  console.log(`[${exists ? 'PASS' : 'FAIL'}] ${c.desc}: ${c.path}`);
  if (!exists) allPassed = false;
}

if (!allPassed) {
  process.exit(1);
}

console.log('\nUnified Build Succeeded! Ready for zero-downtime Vercel deployment.');
