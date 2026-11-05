const { chromium } = require('C:/Users/ADMIN/AppData/Roaming/npm/node_modules/omniroute/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });

  console.log('Navigating to http://localhost:5174/loading ...');
  await page.goto('http://localhost:5174/loading', { waitUntil: 'domcontentloaded' });
  
  // Wait ~900ms for mid-progress (~50%)
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'portfolio_assets/screenshots/loading_page_progress.png' });
  console.log('Captured mid-progress screenshot');

  // Wait for complete state (~2200ms total)
  await page.waitForTimeout(1400);
  await page.screenshot({ path: 'portfolio_assets/screenshots/loading_page_complete.png' });
  console.log('Captured complete state screenshot');

  // Also test with b2b_saas preset
  await page.goto('http://localhost:5174/loading?preset=b2b_saas', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'portfolio_assets/screenshots/loading_page_b2b_saas.png' });
  console.log('Captured B2B SaaS loading screenshot');

  await browser.close();
  console.log('Loading page verification finished successfully!');
})();
