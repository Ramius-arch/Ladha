const { chromium } = require('C:/Users/ADMIN/AppData/Roaming/npm/node_modules/omniroute/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  console.log('Navigating to http://localhost:5174/ ...');
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  
  await page.screenshot({ path: 'portfolio_assets/screenshots/landing_new_hero.png' });
  
  // Scroll to interactive preview
  await page.evaluate(() => document.getElementById('interactive-preview').scrollIntoView());
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'portfolio_assets/screenshots/landing_new_preview.png' });

  // Click tab 3 (Debt Studio)
  const debtTab = page.locator('.browser-tab-btn:has-text("Debt Studio")');
  if (await debtTab.isVisible()) {
    await debtTab.click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'portfolio_assets/screenshots/landing_new_debt_tab.png' });
  }

  // Scroll to video theatre
  await page.evaluate(() => document.getElementById('theatre').scrollIntoView());
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'portfolio_assets/screenshots/landing_new_theatre.png' });

  await browser.close();
  console.log('Console errors count:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log('Errors:', consoleErrors);
  } else {
    console.log('Landing page verified with ZERO console errors!');
  }
})();
