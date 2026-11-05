import re
import os

frontend_dir = os.path.join(os.path.dirname(__file__), '..', 'billing', 'frontend', 'src')

# 1. Update UsageTracker.vue
usage_tracker_path = os.path.join(frontend_dir, 'pages', 'UsageTracker.vue')
with open(usage_tracker_path, 'r', encoding='utf-8') as f:
    ut = f.read()

# Replace radio group
old_radio = """            <a-form-item label="Activity Type" name="usageType">
              <a-radio-group v-model:value="newUsage.usageType" button-style="solid" class="w-full flex">
                <a-radio-button value="call" class="flex-1 text-center">CALL</a-radio-button>
                <a-radio-button value="data" class="flex-1 text-center">DATA</a-radio-button>
                <a-radio-button value="sms" class="flex-1 text-center">SMS</a-radio-button>
              </a-radio-group>
            </a-form-item>"""

new_radio = """            <a-form-item label="Commerce Activity Type" name="usageType">
              <a-radio-group v-model:value="newUsage.usageType" button-style="solid" class="w-full grid grid-cols-2 sm:grid-cols-4 gap-1">
                <a-radio-button value="retail_order" class="text-center text-xs">ORDER / ITEM</a-radio-button>
                <a-radio-button value="delivery_tariff" class="text-center text-xs">COURIER (KES)</a-radio-button>
                <a-radio-button value="api_request" class="text-center text-xs">SaaS API</a-radio-button>
                <a-radio-button value="data" class="text-center text-xs">DATA / MB</a-radio-button>
              </a-radio-group>
            </a-form-item>"""

# Replace labels and colors
old_helper = """    const usageLabel = computed(() => {
      const labels = { call: 'Duration (Minutes)', data: 'Usage (MB)', sms: 'Count (Units)' };
      return labels[newUsage.usageType];
    });"""

new_helper = """    const usageLabel = computed(() => {
      const labels = {
        retail_order: 'Garments / Order Units',
        delivery_tariff: 'Zonal Courier Tariff (KES)',
        api_request: 'API Requests Metered',
        mpesa_stk_txn: 'M-Pesa Transactions',
        call: 'Voice Duration (Minutes)',
        data: 'Bandwidth Usage (MB)',
        sms: 'SMS Dispatches (Units)'
      };
      return labels[newUsage.usageType] || 'Quantity / Units';
    });"""

old_colors = """    const getUsageColor = (type) => {
      const colors = { call: 'blue', data: 'purple', sms: 'green' };
      return colors[type] || 'default';
    };

    const getUnit = (type) => {
      const units = { call: 'min', data: 'MB', sms: 'msg' };
      return units[type] || '';
    };"""

new_colors = """    const getUsageColor = (type) => {
      const colors = {
        retail_order: 'cyan',
        delivery_tariff: 'gold',
        mpesa_stk_txn: 'green',
        api_request: 'geekblue',
        call: 'blue',
        data: 'purple',
        sms: 'magenta'
      };
      return colors[type] || 'default';
    };

    const getUnit = (type) => {
      const units = {
        retail_order: 'pcs',
        delivery_tariff: 'KES',
        mpesa_stk_txn: 'tx',
        api_request: 'req',
        call: 'min',
        data: 'MB',
        sms: 'msg'
      };
      return units[type] || 'units';
    };"""

# Replace initial state
ut = ut.replace("usageType: 'call'", "usageType: 'retail_order'")

for o, n in [(old_radio, new_radio), (old_helper, new_helper), (old_colors, new_colors)]:
    o_crlf = o.replace('\r\n', '\n').replace('\n', '\r\n')
    n_crlf = n.replace('\r\n', '\n').replace('\n', '\r\n')
    if o_crlf in ut:
        ut = ut.replace(o_crlf, n_crlf, 1)
    elif o in ut:
        ut = ut.replace(o, n, 1)

with open(usage_tracker_path, 'w', encoding='utf-8', newline='') as f:
    f.write(ut)
print("Updated UsageTracker.vue successfully")


# 2. Update BillingEngine.vue
billing_engine_path = os.path.join(frontend_dir, 'pages', 'BillingEngine.vue')
with open(billing_engine_path, 'r', encoding='utf-8') as f:
    be = f.read()

old_usage_bars = """                      <div class="usage-bars mt-12">
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
                      </div>"""

new_usage_bars = """                      <div class="usage-bars mt-12">
                        <div class="bar-group" v-if="forecast.currentUsage.retail_order !== undefined">
                          <span class="label">Retail Garments / Orders ({{ forecast.currentUsage.retail_order || 0 }} pcs)</span>
                          <a-progress :percent="calculatePercent(forecast.currentUsage.retail_order || 0, 50)" size="small" stroke-color="#06b6d4" />
                        </div>
                        <div class="bar-group mt-8" v-if="forecast.currentUsage.delivery_tariff !== undefined">
                          <span class="label">Courier Delivery Tariffs (KES {{ (forecast.currentUsage.delivery_tariff || 0).toLocaleString() }})</span>
                          <a-progress :percent="calculatePercent(forecast.currentUsage.delivery_tariff || 0, 5000)" size="small" stroke-color="#f59e0b" />
                        </div>
                        <div class="bar-group mt-8" v-if="forecast.currentUsage.api_request !== undefined">
                          <span class="label">Platform API Metering ({{ forecast.currentUsage.api_request || 0 }} req)</span>
                          <a-progress :percent="calculatePercent(forecast.currentUsage.api_request || 0, 2000)" size="small" stroke-color="#6366f1" />
                        </div>
                        <div class="bar-group mt-8" v-if="forecast.currentUsage.data !== undefined">
                          <span class="label">Data & Bandwidth ({{ forecast.currentUsage.data || 0 }} MB)</span>
                          <a-progress :percent="calculatePercent(forecast.currentUsage.data || 0, 5000)" size="small" stroke-color="#10b981" />
                        </div>
                      </div>"""

o_crlf = old_usage_bars.replace('\r\n', '\n').replace('\n', '\r\n')
n_crlf = new_usage_bars.replace('\r\n', '\n').replace('\n', '\r\n')
if o_crlf in be:
    be = be.replace(o_crlf, n_crlf, 1)
elif old_usage_bars in be:
    be = be.replace(old_usage_bars, new_usage_bars, 1)

with open(billing_engine_path, 'w', encoding='utf-8', newline='') as f:
    f.write(be)
print("Updated BillingEngine.vue successfully")


# 3. Update Dashboard.vue
dashboard_path = os.path.join(frontend_dir, 'pages', 'Dashboard.vue')
with open(dashboard_path, 'r', encoding='utf-8') as f:
    dash = f.read()

old_dash_tx = """            { id: 1, description: 'Enterprise SaaS Annual Settlement', date: 'Today, 14:22', status: 'Completed' },
            { id: 2, description: 'Dedicated Cloud VPS Allocation', date: 'Today, 11:05', status: 'Completed' },
            { id: 3, description: 'Custom API Usage Surcharge', date: 'Yesterday', status: 'Pending' },
            { id: 4, description: 'Telecommunications Carrier Settlement', date: 'Aug 26', status: 'Completed' }"""

new_dash_tx = """            { id: 1, description: 'Ladha Nairobi 1-of-1 Archival Drop Checkout', date: 'Today, 14:22', status: 'Completed' },
            { id: 2, description: 'Courier Express Dispatch (Kilimani Zone Tariff)', date: 'Today, 11:05', status: 'Completed' },
            { id: 3, description: 'Safaricom Lipa Na M-Pesa Merchant Settlement', date: 'Yesterday', status: 'Completed' },
            { id: 4, description: 'Enterprise Cloud Platform Subscription', date: 'Aug 26', status: 'Completed' }"""

old_dash_pie = """          labels: ['Cloud Subscriptions', 'Usage Bandwidth', 'Consulting & Setup', 'API Gateways'],
          datasets: [{
            data: [45, 25, 20, 10],"""

new_dash_pie = """          labels: ['Archival Retail & Fashion', 'Courier & Logistics Tariffs', 'M-Pesa Merchant Settlement', 'SaaS API & Utilities'],
          datasets: [{
            data: [45, 25, 20, 10],"""

for o, n in [(old_dash_tx, new_dash_tx), (old_dash_pie, new_dash_pie)]:
    o_crlf = o.replace('\r\n', '\n').replace('\n', '\r\n')
    n_crlf = n.replace('\r\n', '\n').replace('\n', '\r\n')
    if o_crlf in dash:
        dash = dash.replace(o_crlf, n_crlf, 1)
    elif o in dash:
        dash = dash.replace(o, n, 1)

with open(dashboard_path, 'w', encoding='utf-8', newline='') as f:
    f.write(dash)
print("Updated Dashboard.vue successfully")


# 4. Update InvoiceDetail.vue
inv_detail_path = os.path.join(frontend_dir, 'pages', 'InvoiceDetail.vue')
with open(inv_detail_path, 'r', encoding='utf-8') as f:
    inv = f.read()

old_tier = """             <div class="tier-item">
                <span class="label">Included Minutes ({{ invoice?.plan?.call_minutes }} min)</span>
                <a-progress :percent="100" size="small" status="success" />
              </div>"""

new_tier = """             <div class="tier-item">
                <span class="label">{{ invoice?.plan?.call_minutes ? ('Included Allowance (' + invoice.plan.call_minutes + ' min)') : (invoice?.plan?.features?.billingModel || 'Universal Commerce Allowance') }}</span>
                <a-progress :percent="100" size="small" status="success" />
              </div>"""

old_inv_units = """    const getTypeColor = (type) => {
      const colors = { call: 'blue', data: 'purple', sms: 'green' };
      return colors[type] || 'default';
    };

    const getUnit = (type) => {
      const units = { call: 'min', data: 'GB', sms: 'units' };
      return units[type] || '';
    };"""

new_inv_units = """    const getTypeColor = (type) => {
      const colors = {
        retail_order: 'cyan',
        delivery_tariff: 'gold',
        mpesa_stk_txn: 'green',
        api_request: 'geekblue',
        call: 'blue',
        data: 'purple',
        sms: 'magenta'
      };
      return colors[type] || 'default';
    };

    const getUnit = (type) => {
      const units = {
        retail_order: 'pcs',
        delivery_tariff: 'KES',
        mpesa_stk_txn: 'tx',
        api_request: 'req',
        call: 'min',
        data: 'MB',
        sms: 'units'
      };
      return units[type] || 'units';
    };"""

for o, n in [(old_tier, new_tier), (old_inv_units, new_inv_units)]:
    o_crlf = o.replace('\r\n', '\n').replace('\n', '\r\n')
    n_crlf = n.replace('\r\n', '\n').replace('\n', '\r\n')
    if o_crlf in inv:
        inv = inv.replace(o_crlf, n_crlf, 1)
    elif o in inv:
        inv = inv.replace(o, n, 1)

with open(inv_detail_path, 'w', encoding='utf-8', newline='') as f:
    f.write(inv)
print("Updated InvoiceDetail.vue successfully")
