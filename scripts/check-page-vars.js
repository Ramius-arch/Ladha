const fs = require('fs');
const path = require('path');

// Test ReportsAnalytics.vue
const repPath = path.join(__dirname, '../billing/frontend/src/pages/ReportsAnalytics.vue');
const repContent = fs.readFileSync(repPath, 'utf8');

console.log('Checking ReportsAnalytics declarations:');
console.log('- allCustomersColumns defined?', repContent.includes('const allCustomersColumns ='));
console.log('- allCustomers defined?', repContent.includes('const allCustomers ='));
console.log('- viewCustomerDetails defined?', repContent.includes('const viewCustomerDetails ='));
console.log('- handleImportedData defined?', repContent.includes('const handleImportedData ='));

// Test PaymentProcessing.vue
const payPath = path.join(__dirname, '../billing/frontend/src/pages/PaymentProcessing.vue');
const payContent = fs.readFileSync(payPath, 'utf8');
console.log('\nChecking PaymentProcessing:');
console.log('- selectedInvoice defined?', payContent.includes('const selectedInvoice ='));

// Test BillingEngine.vue
const billPath = path.join(__dirname, '../billing/frontend/src/pages/BillingEngine.vue');
const billContent = fs.readFileSync(billPath, 'utf8');
console.log('\nChecking BillingEngine:');

// Test SystemSettings.vue
const setPath = path.join(__dirname, '../billing/frontend/src/pages/SystemSettings.vue');
const setContent = fs.readFileSync(setPath, 'utf8');
console.log('\nChecking SystemSettings:');
console.log('- api.apiClient exists in api.js?');
const apiContent = fs.readFileSync(path.join(__dirname, '../billing/frontend/src/services/api.js'), 'utf8');
console.log('- does api export apiClient directly?', apiContent.includes('apiClient'));
