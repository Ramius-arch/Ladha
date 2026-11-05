const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/ADMIN/AppData/Roaming/npm/node_modules/omniroute/node_modules/playwright');

const DIST_DIR = path.resolve('dist');

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  let filePath = path.join(DIST_DIR, reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mimes = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css' };
    res.setHeader('Content-Type', mimes[ext] || 'application/octet-stream');
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.statusCode = 404;
    res.end('Not found: ' + req.url);
  }
});

(async () => {
  server.listen(3346);
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE CONSOLE:', msg.type(), msg.text()));

  await page.goto('http://localhost:3346/checkout.html');

  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 5000 }),
    page.evaluate(() => {
      window.generateClientEtimsPdf({
        orderCode: 'LDH-TEST-9999-KE',
        customerName: 'Test Buyer',
        customerPhone: '+254700112233',
        deliveryZone: 'Nairobi',
        receiptCode: 'QK123456X',
        cart: [{ name: 'Test Garment', price: 4200, size: 'M' }],
        shippingFee: 250
      });
    })
  ]);

  const p = path.resolve('scripts/direct_checkout_etims.pdf');
  await download.saveAs(p);
  const buf = fs.readFileSync(p);
  console.log('Direct Checkout eTIMS PDF size:', buf.length);
  console.log('Header:', buf.slice(0, 8).toString());
  console.log('Tail:', buf.slice(-16).toString().trim());

  await browser.close();
  server.close();
})();
