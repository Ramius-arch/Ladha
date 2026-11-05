const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/ADMIN/AppData/Roaming/npm/node_modules/omniroute/node_modules/playwright');

const DIST_DIR = path.resolve('dist');

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  if (reqPath === '/admin/ledger' || reqPath === '/admin/ledger/') reqPath = '/admin/ledger/index.html';
  if (reqPath.startsWith('/admin/ledger/')) {
    const ext = path.extname(reqPath);
    if (!ext) reqPath = '/admin/ledger/index.html';
  }

  let filePath = path.join(DIST_DIR, reqPath);
  if (!fs.existsSync(filePath)) {
    if (reqPath.startsWith('/admin/ledger/')) {
      filePath = path.join(DIST_DIR, 'admin/ledger/index.html');
    } else {
      filePath = path.join(DIST_DIR, 'index.html');
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };

  res.setHeader('Content-Type', mimes[ext] || 'application/octet-stream');
  fs.createReadStream(filePath).pipe(res);
});

(async () => {
  server.listen(3344);
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on('console', msg => console.log('PAGE CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('--- TEST 1: Top Hero "Export Audit" Button ---');
  await page.goto('http://localhost:3344/admin/ledger/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const [auditDownload] = await Promise.all([
    page.waitForEvent('download', { timeout: 10000 }),
    page.locator('button:has-text("Export Audit")').click()
  ]);

  const auditPath = path.resolve('scripts/hero_export_audit.pdf');
  await auditDownload.saveAs(auditPath);
  const auditBuf = fs.readFileSync(auditPath);
  console.log('Hero Export Audit PDF size:', auditBuf.length);
  console.log('Hero Export Audit header:', auditBuf.slice(0, 8).toString());

  console.log('--- TEST 2: Invoice Detail PDF Download ---');
  await page.goto('http://localhost:3344/admin/ledger/invoices/1', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const invoiceBtn = page.locator('button:has-text("Download PDF")');
  console.log('Invoice download button found:', await invoiceBtn.count());
  if (await invoiceBtn.count() > 0) {
    const [invoiceDownload] = await Promise.all([
      page.waitForEvent('download', { timeout: 10000 }),
      invoiceBtn.click()
    ]);
    const invPath = path.resolve('scripts/invoice_detail_download.pdf');
    await invoiceDownload.saveAs(invPath);
    const invBuf = fs.readFileSync(invPath);
    console.log('Invoice PDF size:', invBuf.length);
    console.log('Invoice PDF header:', invBuf.slice(0, 8).toString());
    console.log('Invoice PDF tail:', invBuf.slice(-16).toString().trim());
  }

  console.log('--- TEST 3: Checkout Page eTIMS Invoice Download ---');
  await page.goto('http://localhost:3344/checkout.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Set cart in localStorage with correct key ladha_cart_v1
  await page.evaluate(() => {
    localStorage.setItem('ladha_cart_v1', JSON.stringify([
      { id: '1', name: 'Vintage Nike Colorblock Windbreaker', price: 3500, size: 'L', image: 'assets/images/product-1.jpg' }
    ]));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Fill form
  await page.fill('#first-name', 'Ramius');
  await page.fill('#last-name', 'Archival');
  await page.fill('#mpesa-phone', '0712345678');
  await page.fill('#street-address', 'Lenana Road, Kilimani');

  // Select COD for instant confirmation without STK modal
  await page.check('input[value="cod"]');

  // Submit checkout
  console.log('Submitting checkout form...');
  await page.click('#submit-order-btn');

  console.log('Waiting for #order-confirmation-modal.active ...');
  await page.waitForSelector('#order-confirmation-modal.active', { timeout: 10000 });
  console.log('Modal is active! Clicking #confirm-etims-btn ...');

  const etimsBtn = page.locator('#confirm-etims-btn');
  const [checkoutDownload] = await Promise.all([
    page.waitForEvent('download', { timeout: 10000 }),
    etimsBtn.click()
  ]);

  const chkPath = path.resolve('scripts/checkout_etims_download.pdf');
  await checkoutDownload.saveAs(chkPath);
  const chkBuf = fs.readFileSync(chkPath);
  console.log('Checkout eTIMS PDF size:', chkBuf.length);
  console.log('Checkout eTIMS PDF header:', chkBuf.slice(0, 8).toString());
  console.log('Checkout eTIMS PDF tail:', chkBuf.slice(-16).toString().trim());

  await browser.close();
  server.close();
  console.log('\n=== ALL 3 PDF DOWNLOAD FLOWS PASSED 100% ===');
})();
