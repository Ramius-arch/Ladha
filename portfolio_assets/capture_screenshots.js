const { chromium } = require('C:/Users/ADMIN/AppData/Roaming/npm/node_modules/omniroute/node_modules/playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, 'screenshots');
const ARTIFACT_DIR = 'C:/Users/ADMIN/.gemini/antigravity/brain/c2ca5ef3-e3fc-41e8-8246-844780913ec4';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function capture() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  const context = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 1.5 // 1.5x retina-like clarity for crisp portfolio presentation
  });

  const page = await context.newPage();

  console.log('Capturing 1: Dashboard Dark Obsidian...');
  await page.goto('http://localhost:5174/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const file1 = path.join(OUT_DIR, '01_dashboard_dark_obsidian.png');
  await page.screenshot({ path: file1, fullPage: false });

  console.log('Capturing 2: Dashboard Light Frosted Ceramic Glass...');
  const themeBtn = page.locator('.theme-toggle');
  await themeBtn.click();
  await page.waitForTimeout(500);
  const file2 = path.join(OUT_DIR, '02_dashboard_light_ceramic.png');
  await page.screenshot({ path: file2, fullPage: false });

  console.log('Capturing 3: Dashboard Collapsed Minimal Icon Rail (Dark)...');
  await themeBtn.click(); // switch back to dark
  await page.waitForTimeout(400);
  const collapseBtn = page.locator('.sider-collapse-btn');
  if (await collapseBtn.isVisible()) {
    await collapseBtn.click();
    await page.waitForTimeout(400);
  }
  const file3 = path.join(OUT_DIR, '03_dashboard_collapsed_rail.png');
  await page.screenshot({ path: file3, fullPage: false });

  console.log('Capturing 4: Capital & Diligence Underwriting & Debt Studio...');
  await page.goto('http://localhost:5174/reports', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  // Switch to Bank Loan tab
  const loanTab = page.locator('.ant-tabs-tab:has-text("Bank Loan")');
  if (await loanTab.isVisible()) {
    await loanTab.click();
    await page.waitForTimeout(500);
  }
  const file4 = path.join(OUT_DIR, '04_capital_diligence_underwriting.png');
  await page.screenshot({ path: file4, fullPage: false });

  console.log('Capturing 5: Financial Statements (GAAP/IFRS)...');
  const stmtTab = page.locator('.ant-tabs-tab:has-text("Three Core Financial")');
  if (await stmtTab.isVisible()) {
    await stmtTab.click();
    await page.waitForTimeout(500);
  }
  const file5 = path.join(OUT_DIR, '05_financial_statements_gaap.png');
  await page.screenshot({ path: file5, fullPage: false });

  console.log('Capturing 6: Double-Entry General Ledger Engine...');
  await page.goto('http://localhost:5174/billing-engine', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const file6 = path.join(OUT_DIR, '06_double_entry_ledger_engine.png');
  await page.screenshot({ path: file6, fullPage: false });

  await browser.close();
  console.log('All screenshots captured successfully!');

  // Copy to artifact directory
  const files = [
    '01_dashboard_dark_obsidian.png',
    '02_dashboard_light_ceramic.png',
    '03_dashboard_collapsed_rail.png',
    '04_capital_diligence_underwriting.png',
    '05_financial_statements_gaap.png',
    '06_double_entry_ledger_engine.png'
  ];

  for (const f of files) {
    const src = path.join(OUT_DIR, f);
    const dst = path.join(ARTIFACT_DIR, f);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dst);
      console.log(`Copied ${f} to artifacts directory.`);
    }
  }
}

capture().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
