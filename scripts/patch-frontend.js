const fs = require('fs');
const path = require('path');

const apiPath = path.join(__dirname, '../billing/frontend/src/services/api.js');
let code = fs.readFileSync(apiPath, 'utf8');

// Replace recentTransactions line
code = code.replace(
  'recentTransactions: billingTrends.trendData || [],',
  'recentTransactions: billingTrends.recentTransactions || [],'
);

// Add getOrders, getTrialBalance, getLadhaProducts
if (!code.includes('getTrialBalance()')) {
  code = code.replace(
    '  getPlans() {',
    `  getOrders() {
    return apiClient.get('/orders');
  },
  getTrialBalance() {
    return apiClient.get('/ledger/trial-balance');
  },
  getLadhaProducts() {
    return apiClient.get('/ladha/products');
  },
  getPlans() {`
  );
}

fs.writeFileSync(apiPath, code, 'utf8');
console.log('Successfully patched api.js');
