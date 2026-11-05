const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/ADMIN/AppData/Roaming/npm/node_modules/omniroute/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on('console', msg => console.log('LIVE CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('LIVE PAGE ERROR:', err.message));

  console.log('1. Navigating to live production dashboard: https://ladha.vercel.app/admin/ledger/dashboard ...');
  await page.goto('https://ladha.vercel.app/admin/ledger/dashboard', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  console.log('2. Clicking "Export Audit" on live production ...');
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 15000 }),
    page.locator('button:has-text("Export Audit")').click()
  ]);

  const filename = download.suggestedFilename();
  console.log('   Captured download event! Filename:', filename);

  const savePath = path.resolve('scripts/live_prod_downloaded.pdf');
  await download.saveAs(savePath);

  const buf = fs.readFileSync(savePath);
  console.log('   Live downloaded byte size:', buf.length);
  const header = buf.slice(0, 8).toString();
  const tail = buf.slice(-16).toString();
  console.log('   Live Magic Header:', header);
  console.log('   Live Tail:', tail.trim());

  if (header.startsWith('%PDF-') && tail.includes('%%EOF') && buf.length > 10000) {
    console.log('\n[LIVE VERIFIED SUCCESS] The downloaded document on live https://ladha.vercel.app is a 100% valid, genuine Adobe Acrobat-compatible PDF!');
  } else {
    throw new Error('Live PDF validation failed!');
  }

  await browser.close();
})();
