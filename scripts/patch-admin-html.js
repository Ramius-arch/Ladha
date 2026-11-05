const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'storefront', 'admin.html');
let html = fs.readFileSync(filePath, 'utf8');

const targetTopbar = '<button class="admin-top-link" id="btn-open-global-media-lib" style="background:none; border:none; cursor:pointer;">📁 ASSET LIBRARY</button>';
const ledgerTopbarLink = '<a href="/admin/ledger" class="admin-top-link" style="color: var(--accent); font-weight: 800; border: 1px solid var(--accent); padding: 4px 10px; border-radius: 3px; text-decoration: none;">⚡ CONFIDENTIAL LEDGER ↗</a>\n            ' + targetTopbar;

if (html.includes(targetTopbar) && !html.includes('/admin/ledger')) {
  html = html.replace(targetTopbar, ledgerTopbarLink);
  console.log('1. Added Ledger link to admin topbar.');
}

const targetTab = '<button class="admin-tab-btn" data-tab="backup">06 // DATABASE & BACKUP</button>';
const ledgerTab = targetTab + '\n        <a href="/admin/ledger" class="admin-tab-btn" style="text-decoration: none; color: var(--accent); font-weight: 800; border-left: 1px solid rgba(0,0,0,0.1); margin-left: auto;">07 // CONFIDENTIAL LEDGER ↗</a>';

if (html.includes(targetTab) && !html.includes('07 // CONFIDENTIAL LEDGER')) {
  html = html.replace(targetTab, ledgerTab);
  console.log('2. Added Ledger link to admin navigation tabs.');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('storefront/admin.html successfully updated!');
