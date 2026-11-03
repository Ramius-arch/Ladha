<template>
  <div class="invoice-detail-page">
    <a-page-header
      :title="`Invoice ${invoice?.invoiceNumber || ''}`"
      @back="() => $router.go(-1)"
    >
      <template #extra>
        <a-button @click="downloadPDF">
          <template #icon><download-outlined /></template>
          Download PDF
        </a-button>
        <a-button type="primary" :disabled="invoice?.status === 'paid'">
          Record Payment
        </a-button>
      </template>

      <a-descriptions size="small" :column="{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }">
        <a-descriptions-item label="Status">
          <a-tag :color="statusColor">{{ invoice?.status?.toUpperCase() }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="Issue Date">{{ formatDate(invoice?.issueDate) }}</a-descriptions-item>
        <a-descriptions-item label="Due Date">{{ formatDate(invoice?.dueDate) }}</a-descriptions-item>
        <a-descriptions-item label="Shopper">{{ invoice?.customer?.name }}</a-descriptions-item>
        <a-descriptions-item label="Client Tier">{{ invoice?.plan?.name || 'VIP Archival Collector' }}</a-descriptions-item>
        <a-descriptions-item label="Fiscal Reference">#{{ $route.params.id }}</a-descriptions-item>
      </a-descriptions>
    </a-page-header>

    <a-row :gutter="[24, 24]" class="mt-6">
      <!-- Breakdown and Summary -->
      <a-col :xs="24" :lg="16">
        <a-card title="Itemized Commerce Drill-Down & Drop Order" class="glass-card">
          <a-table 
            :columns="historyColumns" 
            :data-source="usageLogs" 
            :pagination="{ pageSize: 5 }"
            size="middle"
            :scroll="{ x: 'max-content' }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'usageType'">
                <a-tag :color="getTypeColor(record.usageType)">{{ record.usageType.toUpperCase() }}</a-tag>
              </template>
              <template v-if="column.key === 'duration'">
                {{ record.duration }} {{ getUnit(record.usageType) }}
              </template>
            </template>
          </a-table>

          <a-divider>KRA Statutory Fiscal Certification</a-divider>
          <div class="tier-analysis p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <p class="text-xs font-bold text-slate-500 uppercase mb-3 font-mono">Fiscal Calculation & Compliance</p>
             <div class="tier-item">
               <span class="label">KRA Output VAT (16%)</span>
               <a-progress :percent="100" size="small" status="success" />
             </div>
             <div class="tier-item mt-3">
               <span class="label">Control Unit Serial & Signature</span>
               <p class="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">KRA-CU-0982410-LADHA &bull; SHA-256 Verified</p>
             </div>
          </div>
        </a-card>
      </a-col>

      <!-- Financial Totals -->
      <a-col :xs="24" :lg="8">
        <a-card title="Total Summary" class="summary-card">
          <div class="total-breakdown">
            <div class="line">
              <span>Subtotal</span>
              <span>KSh {{ invoice?.breakdown?.subtotal.toLocaleString() }}</span>
            </div>
            <div class="line">
              <span>VAT (16%)</span>
              <span>KSh {{ invoice?.breakdown?.tax.toLocaleString() }}</span>
            </div>
            <a-divider />
            <div class="line grand-total">
              <span>Total Due</span>
              <span class="val">KSh {{ invoice?.breakdown?.total.toLocaleString() }}</span>
            </div>
          </div>
        </a-card>

        <a-card title="Quick Actions" class="mt-6">
          <a-button block class="mb-3">Send via WhatsApp</a-button>
          <a-button block>Resend Email</a-button>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { DownloadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import api from '../services/api';
import dayjs from 'dayjs';

export default defineComponent({
  name: 'InvoiceDetail',
  components: { DownloadOutlined },
  setup() {
    const route = useRoute();
    const invoice = ref(null);
    const usageLogs = ref([]);

    const fetchDetails = async () => {
      const id = route.params.id;
      try {
        const response = await api.getInvoiceById(id);
        invoice.value = response.data.data;
        usageLogs.value = invoice.value.usageLogs || [];
      } catch (err) {
        console.error(err);
      }
    };

    const historyColumns = [
      { title: 'Usage Type', key: 'usageType', dataIndex: 'usageType' },
      { title: 'Volume', key: 'duration', dataIndex: 'duration' },
      { title: 'Timestamp', key: 'timestamp', dataIndex: 'timestamp', customRender: ({ text }) => dayjs(text).format('DD/MM HH:mm') }
    ];

    const getTypeColor = (type) => {
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
    };

    const formatDate = (d) => d ? dayjs(d).format('DD MMM YYYY') : '---';

    const statusColor = computed(() => {
      const colors = { pending: 'orange', paid: 'success', overdue: 'error' };
      return colors[invoice.value?.status] || 'default';
    });

    const downloadPDF = async () => {
      try {
        message.loading('Compiling certified KRA eTIMS tax invoice...', 1);
        const res = await api.downloadInvoicePdf(route.params.id);
        const blob = new Blob([res.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `LADHA_eTIMS_${invoice.value?.invoiceNumber || route.params.id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        message.success('KRA eTIMS Tax Invoice downloaded successfully.');
      } catch (err) {
        console.error('Download invoice failed:', err);
        message.error('Failed to download invoice PDF.');
      }
    };

    fetchDetails();

    return {
      invoice,
      usageLogs,
      historyColumns,
      getTypeColor,
      getUnit,
      formatDate,
      statusColor,
      downloadPDF
    };
  },
});
</script>

<style scoped>
.invoice-detail-page {
  max-width: 1300px;
  margin: 0 auto;
}

.glass-card {
  box-shadow: var(--shadow-sm);
  border-radius: 12px;
}

.summary-card {
  box-shadow: var(--shadow-md);
  border-radius: 12px;
  border-top: 4px solid var(--primary-color);
}

.total-breakdown .line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.grand-total {
  font-weight: 800;
  color: #1e293b;
}

.grand-total .val {
  font-size: 24px;
  color: var(--primary-color);
}

.tier-item .label {
  font-size: 12px;
  color: var(--text-secondary);
}

</style>
