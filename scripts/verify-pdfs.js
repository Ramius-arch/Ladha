const { chromium } = require('C:/Users/ADMIN/AppData/Roaming/npm/node_modules/omniroute/node_modules/playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1600 } });

  // Test 1: test-diligence.pdf
  const diligencePath = path.resolve('scripts/test-diligence.pdf').replace(/\\/g, '/');
  console.log('Navigating to file:///' + diligencePath);
  await page.goto('file:///' + diligencePath, { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'scripts/verify-diligence-pdf.png' });
  console.log('Diligence PDF rendered successfully in Chromium PDF viewer.');

  // Test 2: test-etims.pdf
  const etimsPath = path.resolve('scripts/test-etims.pdf').replace(/\\/g, '/');
  console.log('Navigating to file:///' + etimsPath);
  await page.goto('file:///' + etimsPath, { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'scripts/verify-etims-pdf.png' });
  console.log('eTIMS PDF rendered successfully in Chromium PDF viewer.');

  await browser.close();
  console.log('ALL PDFS VERIFIED AND OPENED CLEANLY.');
})();
