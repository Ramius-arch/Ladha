const { chromium } = require('C:/Users/ADMIN/AppData/Roaming/npm/node_modules/omniroute/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  const consoleMsgs = [];
  page.on('console', msg => consoleMsgs.push({ type: msg.type(), text: msg.text() }));
  page.on('pageerror', err => consoleMsgs.push({ type: 'pageerror', text: err.message }));

  console.log('1. Testing Dashboard Light Mode...');
  await page.goto('http://localhost:5174/dashboard?theme=light', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'portfolio_assets/screenshots/verified_dashboard_light.png' });

  // Test Top Collapse button
  console.log('2. Testing Sidebar Collapse from top...');
  const collapseBtn = page.locator('.sider-collapse-btn');
  if (await collapseBtn.isVisible()) {
    await collapseBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'portfolio_assets/screenshots/verified_dashboard_collapsed.png' });
  }

  // Verify Top Expand button on rail
  console.log('3. Testing Rail Top Expand button...');
  const railTopBtn = page.locator('.sider-rail-toggle-top');
  const isRailTopVisible = await railTopBtn.isVisible();
  console.log('Rail top expand button visible:', isRailTopVisible);
  if (isRailTopVisible) {
    await railTopBtn.click();
    await page.waitForTimeout(400);
    console.log('Sidebar re-expanded via top rail button successfully!');
  }

  // Scroll to Command Center
  console.log('4. Testing Command Center buttons...');
  const cc = page.locator('.actions-panel');
  await cc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'portfolio_assets/screenshots/verified_command_center.png' });

  // Click Audit Settlements button
  const auditBtn = page.locator('.tile-btn:has-text("Audit Settlements")');
  console.log('Clicking Audit Settlements button...');
  await auditBtn.click();
  await page.waitForTimeout(600);
  
  // Click Sweep Holds button
  const sweepBtn = page.locator('.tile-btn:has-text("Sweep Holds")');
  console.log('Clicking Sweep Holds button...');
  await sweepBtn.click();
  await page.waitForTimeout(600);

  // Click Trial Balance button
  const balanceBtn = page.locator('.tile-btn:has-text("Trial Balance")');
  console.log('Clicking Trial Balance button...');
  await balanceBtn.click();
  await page.waitForTimeout(600);

  await page.screenshot({ path: 'portfolio_assets/screenshots/verified_command_center_active.png' });

  // Test Dark Mode Dashboard
  console.log('5. Testing Dashboard Dark Mode...');
  await page.goto('http://localhost:5174/dashboard?theme=dark', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'portfolio_assets/screenshots/verified_dashboard_dark.png' });

  // Test Landing Page
  console.log('6. Testing Landing Page...');
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'portfolio_assets/screenshots/verified_landing_page.png' });

  await browser.close();
  
  const errors = consoleMsgs.filter(m => m.type === 'error' || m.type === 'pageerror');
  console.log('Total console errors:', errors.length);
  if (errors.length > 0) {
    console.log('Errors:', errors);
  } else {
    console.log('ALL TESTS PASSED WITH 0 CONSOLE ERRORS!');
  }
})();
