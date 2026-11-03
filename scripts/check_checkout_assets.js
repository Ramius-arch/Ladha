const fs = require('fs');
const http = require('http');

const html = fs.readFileSync('storefront/checkout.html', 'utf8');
const regex = /(?:src|href)=["']([^"']+)["']/g;
let match;
const urls = new Set();
while ((match = regex.exec(html)) !== null) {
  const u = match[1];
  if (!u.startsWith('http') && !u.startsWith('#') && !u.startsWith('data:') && !u.endsWith('.html')) {
    urls.add(u);
  }
}
console.log('Subresources in checkout.html:', Array.from(urls));

const ports = [5000, 3001];
urls.forEach(p => {
  ports.forEach(port => {
    const cleanPath = p.startsWith('/') ? p : '/' + p;
    const url = `http://localhost:${port}${cleanPath}`;
    http.get(url, res => {
      if (res.statusCode !== 200) {
        console.log(`[STATUS ${res.statusCode}] ${url}`);
      }
    }).on('error', err => {
      console.log(`[ERR] ${url}: ${err.message}`);
    });
  });
});
