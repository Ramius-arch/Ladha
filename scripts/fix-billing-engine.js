const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, '../billing/frontend/src/pages/BillingEngine.vue');
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  'const filterCustomer = (input, option) => option.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0;',
  'const filterCustomer = (input, option) => String(option.label || option.value || (option.children && option.children[0]) || "").toLowerCase().includes(String(input || "").toLowerCase());'
);

fs.writeFileSync(p, c, 'utf8');
console.log('BillingEngine.vue filter patched');
