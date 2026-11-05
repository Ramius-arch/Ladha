const https = require('https');

function poll(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      console.log(`[${res.statusCode}] ${url}`);
      resolve(res.statusCode);
    }).on('error', (e) => {
      console.error('Error:', e.message);
      resolve(0);
    });
  });
}

(async () => {
  console.log('Polling Vercel deployment status...');
  for (let i = 0; i < 8; i++) {
    await new Promise(r => setTimeout(r, 6000));
    console.log(`--- Poll Attempt ${i+1} ---`);
    const s1 = await poll('https://ladha.vercel.app/');
    const s2 = await poll('https://ladha.vercel.app/admin/ledger/dashboard');
    if (s1 === 200 && s2 === 200) {
      console.log('Vercel live deployment is UP and serving 200 OK across both storefront and confidential ledger!');
      break;
    }
  }
})();
