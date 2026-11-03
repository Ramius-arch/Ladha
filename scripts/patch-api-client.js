const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, '../billing/frontend/src/services/api.js');
let c = fs.readFileSync(p, 'utf8');

c = c.replace('const api = {', 'const api = {\n  apiClient,');
fs.writeFileSync(p, c, 'utf8');
console.log('apiClient exported on api object');
