const path = require('path');
const { chromium } = require('C:/Users/ADMIN/AppData/Roaming/npm/node_modules/omniroute/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1600 } });

  const files = [
    { src: 'scripts/hero_export_audit.pdf', out: 'verify_hero_export_audit.png' },
    { src: 'scripts/invoice_detail_download.pdf', out: 'verify_invoice_detail_pdf.png' },
    { src: 'scripts/checkout_etims_download.pdf', out: 'verify_checkout_etims_pdf.png' }
  ];

  for (const f of files) {
    const abs = path.resolve(f.src).replace(/\\/g, '/');
    console.log('Rendering file:///' + abs);
    await page.goto('file:///' + abs, { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    const outPath = path.resolve('portfolio_assets/screenshots/' + f.out);
    await page.screenshot({ path: outPath });
    console.log('Screenshot saved to:', outPath);
  }

  await browser.close();
  console.log('All 3 PDF screenshots saved cleanly.');
})();
