const fs = require('fs');
const path = require('path');

// 1. Update api.js
const apiJsPath = path.join(__dirname, '../billing/frontend/src/services/api.js');
let apiJs = fs.readFileSync(apiJsPath, 'utf8');
apiJs = apiJs.replace(
  "baseURL: import.meta.env.VITE_API_URL || 'https://qx-billing-backend.onrender.com/api',",
  "baseURL: import.meta.env.VITE_API_URL || '/api',"
);
fs.writeFileSync(apiJsPath, apiJs, 'utf8');
console.log('1. Updated api.js baseURL to /api');

// 2. Create .env in billing/frontend
const envPath = path.join(__dirname, '../billing/frontend/.env');
fs.writeFileSync(envPath, 'VITE_API_URL=/api\n', 'utf8');
console.log('2. Created billing/frontend/.env');

// 3. Update vite.config.js with proxy
const viteConfigPath = path.join(__dirname, '../billing/frontend/vite.config.js');
const viteConfig = `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
})
`;
fs.writeFileSync(viteConfigPath, viteConfig, 'utf8');
console.log('3. Updated vite.config.js with /api proxy to port 5000');

// 4. Update BillingEngine.vue usage bars to dynamic multi-industry
const billingEnginePath = path.join(__dirname, '../billing/frontend/src/pages/BillingEngine.vue');
let billingEngine = fs.readFileSync(billingEnginePath, 'utf8');

const oldUsageBars = `<div class="usage-bars mt-12">
                       <div class="bar-group">
                         <span class="label">Calls ({{ forecast.currentUsage.call }} min)</span>
                         <a-progress :percent="calculatePercent(forecast.currentUsage.call, 500)" size="small" stroke-color="#1677ff" />
                       </div>
                       <div class="bar-group mt-8">
                         <span class="label">Data ({{ forecast.currentUsage.data }} GB)</span>
                         <a-progress :percent="calculatePercent(forecast.currentUsage.data, 50)" size="small" stroke-color="#6366f1" />
                       </div>
                       <div class="bar-group mt-8">
                         <span class="label">SMS ({{ forecast.currentUsage.sms }})</span>
                         <a-progress :percent="calculatePercent(forecast.currentUsage.sms, 200)" size="small" stroke-color="#10b981" />
                       </div>
                     </div>`;

const newUsageBars = `<div class="usage-bars mt-12">
                       <!-- Retail Orders / Garments -->
                       <div class="bar-group" v-if="forecast.currentUsage.retail_order !== undefined">
                         <span class="label">Retail Items / Orders ({{ forecast.currentUsage.retail_order || 0 }} pcs)</span>
                         <a-progress :percent="calculatePercent(forecast.currentUsage.retail_order || 0, 50)" size="small" stroke-color="#10b981" />
                       </div>
                       <!-- Delivery Tariffs -->
                       <div class="bar-group mt-8" v-if="forecast.currentUsage.delivery_tariff !== undefined">
                         <span class="label">Courier Delivery Tariffs (KSh {{ (forecast.currentUsage.delivery_tariff || 0).toLocaleString() }})</span>
                         <a-progress :percent="calculatePercent(forecast.currentUsage.delivery_tariff || 0, 2500)" size="small" stroke-color="#6366f1" />
                       </div>
                       <!-- SaaS API Invocations -->
                       <div class="bar-group mt-8" v-if="forecast.currentUsage.api_request !== undefined">
                         <span class="label">SaaS API Telemetry ({{ (forecast.currentUsage.api_request || 0).toLocaleString() }} reqs)</span>
                         <a-progress :percent="calculatePercent(forecast.currentUsage.api_request || 0, 1000)" size="small" stroke-color="#06b6d4" />
                       </div>
                       <!-- Telecom / Network Utility (if present) -->
                       <div class="bar-group mt-8" v-if="forecast.currentUsage.call || forecast.currentUsage.data">
                         <span class="label">Network Utility ({{ forecast.currentUsage.data || 0 }} GB · {{ forecast.currentUsage.call || 0 }} min)</span>
                         <a-progress :percent="calculatePercent(forecast.currentUsage.data || 0, 50)" size="small" stroke-color="#f59e0b" />
                       </div>
                     </div>`;

if (billingEngine.includes('Calls ({{ forecast.currentUsage.call }} min)')) {
  // Replace using regex for whitespace tolerance
  billingEngine = billingEngine.replace(
    /<div class="usage-bars mt-12">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
    newUsageBars + '\n                    </div>\n                  </div>'
  );
  fs.writeFileSync(billingEnginePath, billingEngine, 'utf8');
  console.log('4. Updated BillingEngine.vue usage bars');
}

// 5. Update InvoiceDetail.vue
const invoiceDetailPath = path.join(__dirname, '../billing/frontend/src/pages/InvoiceDetail.vue');
let invoiceDetail = fs.readFileSync(invoiceDetailPath, 'utf8');
invoiceDetail = invoiceDetail.replace(
  /<span class="label">Included Minutes \(.*?\)\s*<\/span>/,
  '<span class="label">Plan Quota Tier Allocation ({{ invoice?.plan?.name }})</span>'
);
fs.writeFileSync(invoiceDetailPath, invoiceDetail, 'utf8');
console.log('5. Updated InvoiceDetail.vue quota label');

// 6. Update Reports.vue
const reportsPath = path.join(__dirname, '../billing/frontend/src/components/Reports.vue');
if (fs.existsSync(reportsPath)) {
  let reports = fs.readFileSync(reportsPath, 'utf8');
  reports = reports.replace('<h1>Telecom Billing Reports</h1>', '<h1>Universal Commerce & Revenue Reports</h1>');
  fs.writeFileSync(reportsPath, reports, 'utf8');
  console.log('6. Updated Reports.vue title');
}

// 7. Update mockData.js
const mockDataPath = path.join(__dirname, '../billing/frontend/src/services/mockData.js');
let mockData = fs.readFileSync(mockDataPath, 'utf8');
mockData = mockData.replace(/callDuration:\s*\d+,\s*dataUsage:\s*\d+,\s*smsCount:\s*\d+/g, 'retailOrders: 4, courierFee: 450, apiRequests: 120');
mockData = mockData.replace(/totalDataUsage:\s*300,\s*\/\/\s*GB\s*totalCallDuration:\s*210,\s*\/\/\s*minutes/, 'totalRetailOrders: 320,\n  totalCourierTariffs: 85000,\n  totalApiRequests: 45000');
fs.writeFileSync(mockDataPath, mockData, 'utf8');
console.log('7. Updated mockData.js with commerce metrics');
