const https = require('https');

function check(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({
        status: res.statusCode,
        title: data.includes('<title>') ? data.split('<title>')[1].split('</title>')[0] : 'no title'
      }));
    }).on('error', err => resolve({ status: 500, error: err.message }));
  });
}

(async () => {
  console.log('Polling Vercel deployment for /admin/ledger/dashboard ...');
  for (let i = 0; i < 10; i++) {
    const rootRes = await check('https://ladha.vercel.app/');
    const dashRes = await check('https://ladha.vercel.app/admin/ledger/dashboard');
    console.log(`[Attempt ${i + 1}] Root: ${rootRes.status} | Dashboard: ${dashRes.status} (${dashRes.title})`);
    
    if (dashRes.status === 200 && !dashRes.title.includes('404')) {
      console.log('\n--- SUCCESS: /admin/ledger/dashboard is LIVE and returning 200 OK! ---');
      return;
    }
    await new Promise(r => setTimeout(r, 6000));
  }
})();
