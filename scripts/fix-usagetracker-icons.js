const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, '../billing/frontend/src/pages/UsageTracker.vue');
let c = fs.readFileSync(p, 'utf8');

c = c.replace(/ShoppingBagOutlined/g, 'SkinOutlined');
c = c.replace(/shopping-bag-outlined/g, 'skin-outlined');

fs.writeFileSync(p, c, 'utf8');
console.log('Replaced ShoppingBagOutlined with SkinOutlined in UsageTracker.vue');
