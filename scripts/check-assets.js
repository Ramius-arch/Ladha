const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('storefront/checkout.html', 'utf-8');
const srcs = [...html.matchAll(/src=["']([^"']+)["']/g)].map(m => m[1]);
const hrefs = [...html.matchAll(/href=["']([^"']+)["']/g)].map(m => m[1]);

console.log('SRCS:', srcs);
console.log('HREFS:', hrefs);

// Check if these files exist on disk
for (const s of srcs) {
    if (!s.startsWith('http')) {
        const full = path.join('storefront', s);
        console.log(`SRC ${s} -> exists: ${fs.existsSync(full)}`);
    }
}

for (const h of hrefs) {
    if (!h.startsWith('http') && !h.startsWith('#')) {
        const full = path.join('storefront', h);
        console.log(`HREF ${h} -> exists: ${fs.existsSync(full)}`);
    }
}
