const { chromium } = require('C:/Users/ADMIN/AppData/Roaming/npm/node_modules/omniroute/node_modules/playwright');
const path = require('path');
const fs = require('fs');

async function smoothMove(page, currentPos, targetX, targetY, steps = 25) {
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    // Cubic bezier ease-in-out
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const x = Math.round(currentPos.x + (targetX - currentPos.x) * ease);
    const y = Math.round(currentPos.y + (targetY - currentPos.y) * ease);
    await page.mouse.move(x, y);
    await page.waitForTimeout(16);
  }
  currentPos.x = targetX;
  currentPos.y = targetY;
  await page.waitForTimeout(100);
}

async function smoothScroll(page, targetY, steps = 25) {
  const currentY = await page.evaluate(() => window.scrollY || window.pageYOffset);
  const diff = targetY - currentY;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const y = Math.round(currentY + diff * ease);
    await page.evaluate(y => window.scrollTo(0, y), y);
    await page.waitForTimeout(20);
  }
  await page.waitForTimeout(150);
}

async function clickWithFeedback(page, currentPos, selectorOrCoords, timeout = 5000) {
  let targetX, targetY;
  if (typeof selectorOrCoords === 'string') {
    try {
      const loc = page.locator(selectorOrCoords).first();
      await loc.waitFor({ state: 'visible', timeout });
      const box = await loc.boundingBox();
      if (!box) {
        console.warn('Selector boundingBox null:', selectorOrCoords);
        return;
      }
      targetX = Math.round(box.x + box.width / 2);
      targetY = Math.round(box.y + box.height / 2);
    } catch (e) {
      console.warn('Could not click selector (continuing gracefully):', selectorOrCoords, e.message);
      return;
    }
  } else {
    targetX = selectorOrCoords.x;
    targetY = selectorOrCoords.y;
  }

  await smoothMove(page, currentPos, targetX, targetY, 20);
  await page.waitForTimeout(120);
  await page.mouse.down();
  await page.waitForTimeout(100);
  await page.mouse.up();
  await page.waitForTimeout(300);
}

async function injectCursor(page) {
  await page.evaluate(() => {
    if (document.getElementById('demo-cursor')) return;
    const cursor = document.createElement('div');
    cursor.id = 'demo-cursor';
    cursor.style.cssText = `
      position: fixed;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: rgba(99, 102, 241, 0.55);
      border: 2.5px solid rgba(255, 255, 255, 0.95);
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
      pointer-events: none;
      z-index: 9999999;
      transform: translate(-50%, -50%);
      transition: transform 0.12s ease, background 0.15s ease, width 0.12s ease, height 0.12s ease;
    `;
    document.body.appendChild(cursor);

    window.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    window.addEventListener('mousedown', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(0.75)';
      cursor.style.background = 'rgba(212, 175, 55, 0.9)';
      cursor.style.borderColor = '#ffffff';
    });

    window.addEventListener('mouseup', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.background = 'rgba(99, 102, 241, 0.55)';
      cursor.style.borderColor = 'rgba(255, 255, 255, 0.95)';
    });
  });
}

async function record() {
  const outputDir = path.resolve(__dirname, 'raw_video');
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }
  fs.mkdirSync(outputDir, { recursive: true });

  console.log('Launching browser with video recording...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const context = await browser.newContext({
    recordVideo: {
      dir: outputDir,
      size: { width: 1440, height: 900 }
    },
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();
  const currentPos = { x: 720, y: 450 };

  console.log('Navigating to Sales Dashboard (Dark Mode)...');
  await page.goto('http://localhost:5174/dashboard?theme=dark', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await injectCursor(page);

  // Scene 1: Executive Hero & Bespoke KPI Cards
  console.log('Scene 1: Hero & KPI hover...');
  await smoothMove(page, currentPos, 350, 180, 20); // Hero Title
  await page.waitForTimeout(600);
  await smoothMove(page, currentPos, 880, 210, 25); // Statutory Compliance HUD
  await page.waitForTimeout(500);

  // Hover through 4 KPI Cards
  const kpiCoords = [
    { x: 340, y: 390 }, // GMV
    { x: 570, y: 390 }, // Shoppers
    { x: 790, y: 390 }, // Basket Value
    { x: 1020, y: 390 } // Drops Dispatched
  ];

  for (const coord of kpiCoords) {
    await smoothMove(page, currentPos, coord.x, coord.y, 18);
    await page.waitForTimeout(400);
  }

  // Scene 2: Interactive Revenue Trajectory & Period Switching
  console.log('Scene 2: Period Switching...');
  await smoothScroll(page, 200, 15);
  await smoothMove(page, currentPos, 680, 480, 20); // Hover over period toggle

  // Click 7D
  await clickWithFeedback(page, currentPos, 'button.period-btn:has-text("7D")');
  await page.waitForTimeout(900);

  // Click 12M
  await clickWithFeedback(page, currentPos, 'button.period-btn:has-text("12M")');
  await page.waitForTimeout(900);

  // Click 30D (return)
  await clickWithFeedback(page, currentPos, 'button.period-btn:has-text("30D")');
  await page.waitForTimeout(900);

  // Hover over Donut Chart slices
  await smoothMove(page, currentPos, 820, 680, 25);
  await page.waitForTimeout(600);

  // Scene 3: Command Center Operations
  console.log('Scene 3: Operational Command Center...');
  await smoothScroll(page, 620, 20);
  await page.waitForTimeout(500);

  // Click 1: Audit Settlements [LIVE]
  console.log('Triggering Audit Settlements...');
  await clickWithFeedback(page, currentPos, 'button.tile-btn:has-text("Audit Settlements")');
  await page.waitForTimeout(1400);

  // Click 2: Sweep Holds [1-of-1]
  console.log('Triggering Sweep Holds...');
  await clickWithFeedback(page, currentPos, 'button.tile-btn:has-text("Sweep Holds")');
  await page.waitForTimeout(1400);

  // Click 3: Trial Balance [0.00 VAR]
  console.log('Triggering Trial Balance Audit...');
  await clickWithFeedback(page, currentPos, 'button.tile-btn:has-text("Trial Balance")');
  await page.waitForTimeout(1400);

  // Hover over Recent Transactions
  await smoothMove(page, currentPos, 340, 750, 20);
  await page.waitForTimeout(400);
  await smoothMove(page, currentPos, 340, 820, 15);
  await page.waitForTimeout(400);

  // Scene 4: Fixed Sidebar Ergonomics & Viewport Sticky Header
  console.log('Scene 4: Sidebar collapse and expand...');
  await smoothScroll(page, 0, 22);
  await page.waitForTimeout(500);

  // Toggle Collapse in Header
  await clickWithFeedback(page, currentPos, 'button.menu-toggle');
  await page.waitForTimeout(800);

  // Hover down the collapsed icon rail
  await smoothMove(page, currentPos, 37, 180, 15); // Dashboard
  await page.waitForTimeout(300);
  await smoothMove(page, currentPos, 37, 240, 15); // Orders
  await page.waitForTimeout(300);
  await smoothMove(page, currentPos, 37, 300, 15); // Shoppers
  await page.waitForTimeout(300);

  // Expand Sidebar back via bottom footer toggle
  await clickWithFeedback(page, currentPos, 'button.sider-bottom-toggle');
  await page.waitForTimeout(800);

  // Scene 5: Dual-Theme Switch (Frosted Ceramic Light Mode)
  console.log('Scene 5: Switching to Frosted Ceramic Light Mode...');
  await clickWithFeedback(page, currentPos, '.theme-toggle');
  await page.waitForTimeout(1200);

  // Showcase light mode cards & high-contrast ink
  await smoothMove(page, currentPos, 450, 220, 20);
  await page.waitForTimeout(500);
  await smoothMove(page, currentPos, 570, 390, 20);
  await page.waitForTimeout(500);

  // Scene 6: Navigate to Capital & Diligence (/reports)
  console.log('Scene 6: Navigating to Capital & Diligence...');
  await clickWithFeedback(page, currentPos, '.ant-menu-item:has-text("Capital & Diligence")');
  await page.waitForTimeout(1400);
  await injectCursor(page);

  // Show Underwriting Summary & Ratios
  await smoothMove(page, currentPos, 450, 190, 20); // Hero
  await page.waitForTimeout(500);
  await smoothMove(page, currentPos, 340, 260, 20); // ARR
  await page.waitForTimeout(400);
  await smoothMove(page, currentPos, 620, 260, 20); // DSCR Prime Grade
  await page.waitForTimeout(400);

  // Switch to Tab 2: Bank Loan Underwriting & Debt Studio
  console.log('Switching to Bank Loan Underwriting Tab...');
  await clickWithFeedback(page, currentPos, '.ant-tabs-tab:has-text("Bank Loan")');
  await page.waitForTimeout(1000);

  // Select 24 Months Tenor in Debt Simulator
  console.log('Selecting 24 Months tenor in Debt Simulator...');
  await clickWithFeedback(page, currentPos, '.ant-radio-button-wrapper:has-text("24 Months")');
  await page.waitForTimeout(900);

  // Switch to Tab 3: Venture Capital & Institutional Investor Diligence
  console.log('Switching to Venture Capital Diligence Tab...');
  await clickWithFeedback(page, currentPos, '.ant-tabs-tab:has-text("Venture Capital")');
  await page.waitForTimeout(1000);

  // Hover over VC Diligence metrics
  await smoothMove(page, currentPos, 550, 520, 20);
  await page.waitForTimeout(700);

  // Scene 7: Navigate to Double-Entry Ledger (/billing-engine)
  console.log('Scene 7: Navigating to Double-Entry Ledger...');
  await smoothScroll(page, 0, 15);
  await clickWithFeedback(page, currentPos, '.ant-menu-item:has-text("Double-Entry Ledger")');
  await page.waitForTimeout(1200);
  await injectCursor(page);

  // Show General Ledger Trial Balance
  await smoothMove(page, currentPos, 420, 220, 20);
  await page.waitForTimeout(600);
  await smoothScroll(page, 250, 15);
  await page.waitForTimeout(700);

  // Scene 8: Finale Return to Sales Dashboard (Dark Mode)
  console.log('Scene 8: Returning to Sales Dashboard...');
  await smoothScroll(page, 0, 15);
  await clickWithFeedback(page, currentPos, '.ant-menu-item:has-text("Sales Dashboard")');
  await page.waitForTimeout(1000);
  await injectCursor(page);

  // Switch back to Dark Mode for final aesthetic hero hold
  await clickWithFeedback(page, currentPos, '.theme-toggle');
  await page.waitForTimeout(800);
  await smoothMove(page, currentPos, 720, 300, 20);
  await page.waitForTimeout(1500);

  console.log('Walkthrough completed. Finalizing video...');
  await context.close();
  await browser.close();

  const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    const rawVideoPath = path.join(outputDir, files[0]);
    const finalWebmPath = path.resolve(__dirname, 'ladha_ledger_portfolio_walkthrough.webm');
    fs.copyFileSync(rawVideoPath, finalWebmPath);
    console.log('WebM saved to:', finalWebmPath);
    console.log('File size (bytes):', fs.statSync(finalWebmPath).size);
  } else {
    console.error('No WebM file found in output directory!');
  }
}

record().catch(err => {
  console.error('Recording error:', err);
  process.exit(1);
});
