const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/ADMIN/AppData/Roaming/npm/node_modules/omniroute/node_modules/playwright');

const DIST_DIR = path.resolve('dist');

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  let filePath = path.join(DIST_DIR, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const mimes = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json' };
  res.setHeader('Content-Type', mimes[ext] || 'application/octet-stream');
  if (fs.existsSync(filePath)) {
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

(async () => {
  server.listen(3345);
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on('console', msg => console.log('PAGE CONSOLE:', msg.type(), msg.text()));

  await page.goto('http://localhost:3345/checkout.html');
  await page.evaluate(() => {
    localStorage.setItem('ladha_cart_v1', JSON.stringify([
      { id: '1', name: 'Vintage Windbreaker', price: 3500, size: 'L', image: 'assets/images/product-1.jpg' }
    ]));
  });
  await page.reload();
  await page.waitForTimeout(500);

  await page.fill('#first-name', 'Kevin');
  await page.fill('#last-name', 'Ochieng');
  await page.fill('#mpesa-phone', '0712345678');
  await page.fill('#street-address', 'Kilimani');

  console.log('Submitting...');
  await page.click('#submit-order-btn');
  await page.waitForTimeout(4000);

  const modalState = await page.evaluate(() => {
    const m = document.getElementById('order-confirmation-modal');
    return {
      classList: m ? m.className : null,
      display: m ? window.getComputedStyle(m).display : null,
      visibility: m ? window.getComputedStyle(m).visibility : null,
      opacity: m ? window.getComputedStyle(m).opacity : null
    };
  });
  console.log('Modal state:', modalState);

  page.on('download', async d => {
    console.log('DOWNLOAD CAPTURED:', d.suggestedFilename());
  });

  console.log('Clicking confirm-etims-btn...');
  await page.click('#confirm-etims-btn');
  await page.waitForTimeout(1000);

  await browser.close();
  server.close();
})();
