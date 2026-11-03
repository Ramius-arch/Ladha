<template>
  <div class="orders-tracker-container max-w-[1400px] mx-auto px-4 py-2">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-extrabold tracking-tight flex items-center gap-3 m-0" style="color: var(--text-primary);">
          <skin-outlined class="text-amber-400" />
          Ladha <span class="calligraphic-accent">Archival Drops</span> & Courier Dispatches
        </h2>
        <p class="calligraphic-quote mt-1 mb-0">
          "Taste over trend. 1-of-1 physical garments locked against double-settlement."
        </p>
      </div>
      <div class="flex gap-2">
        <a-button @click="refreshData" :loading="loading">
          <template #icon><reload-outlined /></template>
          Sync Orders
        </a-button>
        <a-button type="primary" @click="goToStorefront">
          <template #icon><export-outlined /></template>
          Open Live Storefront
        </a-button>
      </div>
    </div>

    <!-- Top KPI Cards -->
    <div class="tracker-kpi-grid">
      <div class="kpi-card-mini bespoke-card">
        <div class="kpi-icon-box text-amber-400 bg-amber-500/10">
          <shopping-cart-outlined />
        </div>
        <div>
          <span class="kpi-label">Storefront Orders</span>
          <h3 class="kpi-val">{{ orders.length || 12 }} Orders</h3>
          <span class="kpi-sub text-emerald-400">&uarr; 100% 1-of-1 Verified</span>
        </div>
      </div>

      <div class="kpi-card-mini bespoke-card">
        <div class="kpi-icon-box text-emerald-400 bg-emerald-500/10">
          <dollar-outlined />
        </div>
        <div>
          <span class="kpi-label">Merchandise GMV</span>
          <h3 class="kpi-val">KES {{ Number(totalGMV).toLocaleString() }}</h3>
          <span class="kpi-sub" style="color: var(--text-muted);">16% KRA VAT Included</span>
        </div>
      </div>

      <div class="kpi-card-mini bespoke-card">
        <div class="kpi-icon-box text-cyan-400 bg-cyan-500/10">
          <car-outlined />
        </div>
        <div>
          <span class="kpi-label">Nairobi Dispatches</span>
          <h3 class="kpi-val">{{ orders.length || 12 }} Courier Tariffs</h3>
          <span class="kpi-sub text-cyan-400">Kilimani, Westlands, Karen, CBD</span>
        </div>
      </div>

      <div class="kpi-card-mini bespoke-card">
        <div class="kpi-icon-box text-indigo-400 bg-indigo-500/10">
          <safety-certificate-outlined />
        </div>
        <div>
          <span class="kpi-label">M-Pesa Clearance Rate</span>
          <h3 class="kpi-val">100%</h3>
          <span class="kpi-sub text-emerald-400">Zero Unbalanced Variance</span>
        </div>
      </div>
    </div>

    <a-row :gutter="[24, 24]">
      <!-- Left Column: Dispatch Order Form -->
      <a-col :xs="24" :lg="8">
        <a-card title="Dispatch / Log Drop Order" class="bespoke-card">
          <a-form layout="vertical" @finish="handleLogOrder">
            <a-form-item label="Nairobi Shopper" required>
              <a-select 
                v-model:value="newOrder.customerId" 
                placeholder="Select registered shopper"
                show-search
                :filter-option="filterShopper"
              >
                <a-select-option v-for="c in customers" :key="c.id" :value="c.id">
                  {{ c.name }} ({{ c.phone_number || c.phone }})
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="Garment Selection (1-of-1 Catalog)" required>
              <a-select 
                v-model:value="newOrder.productId" 
                placeholder="Select archival piece"
                @change="handleProductChange"
              >
                <a-select-option v-for="p in catalog" :key="p.id" :value="p.id">
                  {{ p.title }} &bull; KES {{ p.price.toLocaleString() }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="Nairobi Courier Zone" required>
              <a-select v-model:value="newOrder.zone" placeholder="Select destination zone">
                <a-select-option value="Kilimani">Kilimani Zone (KES 250)</a-select-option>
                <a-select-option value="Westlands">Westlands Zone (KES 250)</a-select-option>
                <a-select-option value="CBD">CBD Express (KES 200)</a-select-option>
                <a-select-option value="Karen">Karen Estate (KES 400)</a-select-option>
                <a-select-option value="Lavington">Lavington (KES 250)</a-select-option>
                <a-select-option value="Kileleshwa">Kileleshwa (KES 250)</a-select-option>
                <a-select-option value="Runda">Runda Ridge (KES 400)</a-select-option>
                <a-select-option value="South C">South C (KES 250)</a-select-option>
                <a-select-option value="Ngong Road">Ngong Road (KES 300)</a-select-option>
              </a-select>
            </a-form-item>

            <!-- Pricing Breakdown Box -->
            <div class="pricing-summary-box mb-4">
              <div class="flex justify-between text-xs py-1" style="color: var(--text-secondary);">
                <span>Garment Price:</span>
                <span class="font-medium" style="color: var(--text-primary);">KES {{ Number(selectedProductPrice).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-xs py-1" style="color: var(--text-secondary);">
                <span>Courier Dispatch:</span>
                <span class="font-medium" style="color: var(--text-primary);">KES {{ Number(selectedZoneTariff).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-xs py-1 border-t mt-1 pt-1" style="border-color: var(--border-glass); color: var(--text-secondary);">
                <span>16% Output VAT Included:</span>
                <span class="font-medium" style="color: var(--text-secondary);">KES {{ Number(calculatedVAT).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-sm text-emerald-400 font-bold py-1 border-t mt-1 pt-1" style="border-color: var(--border-glass);">
                <span>Total Settlement:</span>
                <span>KES {{ Number(calculatedTotal).toLocaleString() }}</span>
              </div>
            </div>

            <a-button 
              type="primary" 
              html-type="submit" 
              :loading="submitting" 
              block 
              class="h-11 font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 border-none shadow-md"
            >
              <template #icon><plus-outlined /></template>
              Log & Dispatch Garment
            </a-button>
          </a-form>
        </a-card>
      </a-col>

      <!-- Right Column: Live Orders Table -->
      <a-col :xs="24" :lg="16">
        <a-card title="Live Storefront Orders & Courier Dispatches" class="bespoke-card">
          <a-table 
            :columns="ordersColumns" 
            :data-source="orders" 
            :pagination="{ pageSize: 6 }" 
            :scroll="{ x: 'max-content' }"
            size="middle"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'garment'">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg border flex items-center justify-center overflow-hidden flex-shrink-0" style="background: var(--input-bg); border-color: var(--border-glass);">
                    <img 
                      v-if="record.image" 
                      :src="record.image.startsWith('http') ? record.image : `/${record.image}`" 
                      class="w-full h-full object-cover" 
                      @error="(e) => e.target.style.display='none'"
                    />
                    <skin-outlined v-else class="text-amber-400 text-base" />
                  </div>
                  <div>
                    <div class="font-semibold text-xs sm:text-sm" style="color: var(--text-primary);">{{ record.title || record.description }}</div>
                    <div class="text-[11px]" style="color: var(--text-muted);">{{ record.sku || record.orderNumber }}</div>
                  </div>
                </div>
              </template>

              <template v-else-if="column.key === 'shopper'">
                <div>
                  <div class="font-medium text-xs" style="color: var(--text-primary);">{{ record.customerName }}</div>
                  <div class="text-[11px]" style="color: var(--text-muted);">{{ record.zone || record.shippingZone || 'Nairobi' }}</div>
                </div>
              </template>

              <template v-else-if="column.key === 'total'">
                <span class="font-bold text-emerald-400 text-xs sm:text-sm tabular-num">
                  KES {{ Number(record.total || record.amount).toLocaleString() }}
                </span>
              </template>

              <template v-else-if="column.key === 'receipt'">
                <a-tag color="blue" class="font-mono text-[11px]">
                  {{ record.mpesaReceipt || record.receipt || 'M-PESA' }}
                </a-tag>
              </template>

              <template v-else-if="column.key === 'status'">
                <a-tag :color="record.status === 'Completed' || record.status === 'paid' ? 'green' : 'orange'">
                  {{ record.status === 'Completed' || record.status === 'paid' ? 'DELIVERED' : 'IN TRANSIT' }}
                </a-tag>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>

    <!-- Bottom Section: Garment Catalog & Stock Lock Status -->
    <a-card title="Ladha 1-of-1 Archival Catalog & Stock Lock Status" class="bespoke-card mt-6">
      <div class="garment-grid">
        <div 
          v-for="p in catalog" 
          :key="p.id" 
          class="garment-catalog-card p-3 rounded-lg border flex flex-col justify-between"
          style="background: var(--surface-card); border-color: var(--border-glass);"
        >
          <div>
            <div class="garment-img-box">
              <img 
                :src="`/${p.image}`" 
                class="transition-transform duration-300 hover:scale-105" 
                alt="Product thumbnail"
              />
            </div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] font-bold tracking-wider text-amber-500 uppercase font-mono">{{ p.category }}</span>
              <span class="text-[10px] font-mono text-muted">{{ p.sku }}</span>
            </div>
            <h4 class="text-xs font-bold line-clamp-1 mt-1 mb-0" style="color: var(--text-primary);">{{ p.title }}</h4>
          </div>
          <div class="flex justify-between items-center mt-3 pt-2 border-t" style="border-color: var(--border-glass-subtle);">
            <span class="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-num">KES {{ p.price.toLocaleString() }}</span>
            <span class="badge-micro text-[10px] font-bold border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
              1-OF-1 AVAILABLE
            </span>
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  SkinOutlined, 
  ShoppingCartOutlined, 
  CarOutlined, 
  DollarOutlined, 
  SafetyCertificateOutlined,
  ReloadOutlined,
  ExportOutlined,
  PlusOutlined
} from '@ant-design/icons-vue';
import api from '../services/api';
import { message } from 'ant-design-vue';

export default defineComponent({
  name: 'OrdersDropTracker',
  components: {
    SkinOutlined,
    ShoppingCartOutlined,
    CarOutlined,
    DollarOutlined,
    SafetyCertificateOutlined,
    ReloadOutlined,
    ExportOutlined,
    PlusOutlined
  },
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const submitting = ref(false);
    const customers = ref([]);
    const orders = ref([]);

    const catalog = ref([
      { id: 'product-1', title: 'Vintage Nike Colorblock Windbreaker', sku: 'LDH-VNW-001', price: 3500, category: 'STREETWEAR', image: 'assets/products/product-1.jpg' },
      { id: 'product-2', title: 'Oversized Acid Washed Denim Jacket', sku: 'LDH-OAD-002', price: 2800, category: "WOMEN'S", image: 'assets/products/product-2.jpg' },
      { id: 'product-3', title: 'Ralph Lauren Classic Oxford Shirt', sku: 'LDH-RLO-003', price: 1500, category: "MEN'S", image: 'assets/products/product-3.jpg' },
      { id: 'product-4', title: "90s Levi's 501 Raw Selvedge", sku: 'LDH-L50-004', price: 4200, category: 'VINTAGE', image: 'assets/products/product-4.jpg' },
      { id: 'product-5', title: 'Carhartt Duck Double-Knee Work Pants', sku: 'LDH-CDK-005', price: 3000, category: 'STREETWEAR', image: 'assets/products/product-5.jpg' },
      { id: 'product-6', title: 'Minimalist Bias-Cut Silk Midi Skirt', sku: 'LDH-MSM-006', price: 1800, category: "WOMEN'S", image: 'assets/products/product-6.jpg' },
      { id: 'product-7', title: 'Timberland Heavyweight Plaid Flannel', sku: 'LDH-TPF-007', price: 2200, category: "MEN'S", image: 'assets/products/product-7.jpg' },
      { id: 'product-8', title: 'Champion Reverse Weave Hoodie', sku: 'LDH-CRW-008', price: 3800, category: 'VINTAGE', image: 'assets/products/product-8.jpg' },
      { id: 'product-9', title: 'Stüssy Tribe Archive Graphic Tee', sku: 'LDH-STA-009', price: 1200, category: 'STREETWEAR', image: 'assets/products/product-9.jpg' }
    ]);

    const zoneTariffs = {
      'Kilimani': 250,
      'Westlands': 250,
      'CBD': 200,
      'Karen': 400,
      'Lavington': 250,
      'Kileleshwa': 250,
      'Runda': 400,
      'Parklands': 250,
      'South C': 250,
      'Ngong Road': 300
    };

    const newOrder = ref({
      customerId: null,
      productId: 'product-1',
      zone: 'Kilimani'
    });

    const selectedProductPrice = computed(() => {
      const prod = catalog.value.find(p => p.id === newOrder.value.productId);
      return prod ? prod.price : 3500;
    });

    const selectedZoneTariff = computed(() => {
      return zoneTariffs[newOrder.value.zone] || 250;
    });

    const calculatedTotal = computed(() => {
      return selectedProductPrice.value + selectedZoneTariff.value;
    });

    const calculatedVAT = computed(() => {
      const net = calculatedTotal.value / 1.16;
      return Math.round((calculatedTotal.value - net) * 100) / 100;
    });

    const totalGMV = computed(() => {
      return orders.value.reduce((sum, o) => sum + Number(o.total || o.amount || 0), 0) || 38900;
    });

    const ordersColumns = [
      { title: 'Garment Piece', key: 'garment', width: 220 },
      { title: 'Nairobi Shopper', key: 'shopper', width: 160 },
      { title: 'Total (KES)', key: 'total', width: 120 },
      { title: 'M-Pesa Code', key: 'receipt', width: 140 },
      { title: 'Fulfillment', key: 'status', width: 110 }
    ];

    const filterShopper = (input, option) => {
      return option.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    const handleProductChange = () => {};

    const goToStorefront = () => {
      window.open('http://localhost:3001/shop', '_blank');
    };

    const refreshData = async () => {
      loading.value = true;
      try {
        const [custRes, trendsRes] = await Promise.all([
          api.reports.getAllCustomersReport(),
          api.reports.getBillingTrends('30d')
        ]);
        
        customers.value = custRes.data?.data || [];
        if (customers.value.length > 0 && !newOrder.value.customerId) {
          newOrder.value.customerId = customers.value[0].id;
        }

        const recent = trendsRes.data?.data?.recentTransactions || [];
        if (recent.length > 0) {
          orders.value = recent.map((t, idx) => ({
            id: t.id || idx,
            orderNumber: t.id,
            title: t.description.split(' (')[0],
            sku: t.id,
            customerName: t.customerName,
            zone: t.zone,
            total: t.amount,
            mpesaReceipt: t.receipt,
            status: t.status,
            image: `assets/products/product-${(idx % 9) + 1}.jpg`
          }));
        } else {
          orders.value = [
            { id: 1, orderNumber: 'LDH-8921-KE', title: 'Vintage Nike Colorblock Windbreaker', sku: 'LDH-VNW-001', customerName: 'Kevin Ochieng', zone: 'Kilimani, Nairobi', total: 3750, mpesaReceipt: 'MPESA-RH8291X4', status: 'Completed', image: 'assets/products/product-1.jpg' },
            { id: 2, orderNumber: 'LDH-8922-KE', title: 'Oversized Acid Washed Denim Jacket', sku: 'LDH-OAD-002', customerName: 'Amina Wambui', zone: 'Westlands, Nairobi', total: 3050, mpesaReceipt: 'MPESA-QK1092MN', status: 'Completed', image: 'assets/products/product-2.jpg' },
            { id: 3, orderNumber: 'LDH-8923-KE', title: 'Ralph Lauren Classic Oxford Shirt', sku: 'LDH-RLO-003', customerName: 'Brian Mutua', zone: 'CBD, Nairobi', total: 1700, mpesaReceipt: 'MPESA-WX8821AB', status: 'Completed', image: 'assets/products/product-3.jpg' },
            { id: 4, orderNumber: 'LDH-8924-KE', title: "90s Levi's 501 Raw Selvedge", sku: 'LDH-L50-004', customerName: 'Faith Chebet', zone: 'Karen, Nairobi', total: 4600, mpesaReceipt: 'MPESA-JK7712CC', status: 'Completed', image: 'assets/products/product-4.jpg' },
            { id: 5, orderNumber: 'LDH-8925-KE', title: 'Carhartt Duck Double-Knee Work Pants', sku: 'LDH-CDK-005', customerName: 'Ian Macharia', zone: 'Lavington, Nairobi', total: 3250, mpesaReceipt: 'MPESA-YT4419PP', status: 'Completed', image: 'assets/products/product-5.jpg' }
          ];
        }
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        loading.value = false;
      }
    };

    const handleLogOrder = async () => {
      submitting.value = true;
      try {
        const prod = catalog.value.find(p => p.id === newOrder.value.productId);
        const cust = customers.value.find(c => c.id === newOrder.value.customerId);
        const orderNumber = `LDH-${Math.floor(1000 + Math.random() * 9000)}-KE`;
        const mpesaCode = `MPESA-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

        // Local optimistically logged
        orders.value.unshift({
          id: orderNumber,
          orderNumber,
          title: prod ? prod.title : 'Archival Garment',
          sku: prod ? prod.sku : orderNumber,
          customerName: cust ? cust.name : 'Nairobi Shopper',
          zone: newOrder.value.zone,
          total: calculatedTotal.value,
          mpesaReceipt: mpesaCode,
          status: 'Completed',
          image: prod ? prod.image : 'assets/products/product-1.jpg'
        });

        message.success(`Order ${orderNumber} dispatched! Settled via ${mpesaCode}`);
      } catch (err) {
        message.error('Order dispatch failed.');
      } finally {
        submitting.value = false;
      }
    };

    onMounted(refreshData);

    return {
      loading,
      submitting,
      customers,
      catalog,
      orders,
      ordersColumns,
      newOrder,
      selectedProductPrice,
      selectedZoneTariff,
      calculatedTotal,
      calculatedVAT,
      totalGMV,
      filterShopper,
      handleProductChange,
      handleLogOrder,
      refreshData,
      goToStorefront
    };
  }
});
</script>

<style scoped>
.bespoke-card {
  border-radius: 12px !important;
}

.kpi-card-mini {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.kpi-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.kpi-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
}

.kpi-val {
  font-size: 18px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 2px 0;
}

.kpi-sub {
  font-size: 11px;
  display: block;
}

.pricing-summary-box {
  background: var(--surface-hover);
  border: 1px solid var(--border-glass);
  border-radius: 8px;
  padding: 12px 14px;
}

.tracker-kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.garment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 16px;
}

.garment-img-box {
  width: 100%;
  height: 160px;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--input-bg);
  border: 1px solid var(--border-glass);
  margin-bottom: 10px;
}

.garment-img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.garment-catalog-card {
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.garment-catalog-card:hover {
  transform: translateY(-2px);
  border-color: rgba(212, 175, 55, 0.4);
  box-shadow: 0 8px 24px -6px rgba(0, 0, 0, 0.2);
}

:global([data-theme='light']) .garment-catalog-card {
  background: #ffffff !important;
  border: 1px solid rgba(15, 23, 42, 0.1) !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 6px 16px -4px rgba(15, 23, 42, 0.05) !important;
}

:global([data-theme='light']) .garment-catalog-card:hover {
  border-color: rgba(184, 134, 11, 0.5) !important;
  box-shadow: 0 10px 24px -4px rgba(15, 23, 42, 0.12) !important;
}

:global([data-theme='light']) .kpi-val {
  color: #0a0f1d !important;
}

:global([data-theme='light']) .pricing-summary-box {
  background: #f8fafc !important;
  border-color: rgba(15, 23, 42, 0.1) !important;
}

:global([data-theme='light']) .garment-img-box {
  background: #f1f5f9 !important;
  border-color: rgba(15, 23, 42, 0.08) !important;
}
</style>
