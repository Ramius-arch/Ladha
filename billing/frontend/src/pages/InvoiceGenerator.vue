<template>
  <div class="invoice-generator-page">
    <a-page-header
      title="Professional Invoice Builder"
      sub-title="Construct and issue itemized financial statements"
      @back="() => $router.go(-1)"
    >
      <template #extra>
        <a-button key="3" @click="resetForm">
          <span class="sm:inline hidden">Reset</span>
          <template #icon class="sm:hidden"><undo-outlined /></template>
        </a-button>
        <a-button key="2" :loading="loading" @click="showPreview">
          <span class="sm:inline hidden">Draft Preview</span>
          <template #icon class="sm:hidden"><eye-outlined /></template>
        </a-button>
        <a-button key="1" type="primary" :loading="loading" @click="submitInvoice">
          <span class="sm:inline hidden">Issue Invoice</span>
          <template #icon class="sm:hidden"><send-outlined /></template>
        </a-button>
      </template>
    </a-page-header>

    <a-row :gutter="[24, 24]" class="mt-6">
      <!-- Form Section -->
      <a-col :xs="24" :lg="16">
        <a-card title="Invoice Structure" class="standard-card">
          <a-form layout="vertical">
            <a-row :gutter="16">
              <a-col :xs="24" :sm="12">
                <a-form-item label="Billed To" required>
                  <a-select
                    v-model:value="form.customerId"
                    show-search
                    placeholder="Select registered Nairobi VIP shopper..."
                    @change="handleCustomerChange"
                  >
                    <a-select-option v-for="c in customers" :key="c.id" :value="c.id">
                      {{ c.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12">
                <a-form-item label="Invoice Reference" required>
                  <a-input v-model:value="form.invoiceNumber" placeholder="e.g. LDH-ETIMS-8933" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="16">
              <a-col :xs="24" :sm="12">
                <a-form-item label="Date of Issue">
                  <a-date-picker v-model:value="form.issueDate" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12">
                <a-form-item label="Payment Deadline">
                  <a-date-picker v-model:value="form.dueDate" style="width: 100%" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-divider>Line Items</a-divider>

            <div class="items-list">
              <a-row :gutter="8" class="item-header mb-2 hidden sm:flex">
                <a-col :span="10"><span class="text-xs font-bold text-slate-500">DESCRIPTION / SERVICE</span></a-col>
                <a-col :span="4"><span class="text-xs font-bold text-secondary">QTY</span></a-col>
                <a-col :span="5"><span class="text-xs font-bold text-secondary">RATE (KSh)</span></a-col>
                <a-col :span="4"><span class="text-xs font-bold text-secondary">TOTAL</span></a-col>
                <a-col :span="1"></a-col>
              </a-row>

              <div v-for="(item, index) in form.items" :key="index" class="item-row mb-3">
                <a-row :gutter="[8, 8]" align="middle">
                  <a-col :xs="24" :sm="10">
                    <span class="sm:hidden text-xs font-bold text-slate-500">DESCRIPTION</span>
                    <a-input v-model:value="item.description" placeholder="e.g. Vintage Carhartt Double-Knee Work Pants (1-of-1)" />
                  </a-col>
                  <a-col :xs="8" :sm="4">
                    <span class="sm:hidden text-xs font-bold text-slate-500">QTY</span>
                    <a-input-number v-model:value="item.quantity" :min="1" style="width: 100%" />
                  </a-col>
                  <a-col :xs="12" :sm="5">
                    <span class="sm:hidden text-xs font-bold text-slate-500">RATE</span>
                    <a-input-number v-model:value="item.rate" :min="0" style="width: 100%" />
                  </a-col>
                  <a-col :xs="12" :sm="4" class="text-right sm:text-left">
                     <span class="sm:hidden text-xs font-bold text-slate-500">TOTAL</span>
                    <div class="mt-4 sm:mt-0">
                      <span class="text-sm font-semibold">KSh {{ (item.quantity * item.rate).toLocaleString() }}</span>
                    </div>
                  </a-col>
                  <a-col :xs="4" :sm="1" class="text-right">
                    <a-button type="text" danger size="small" @click="removeItem(index)">
                      <template #icon><delete-outlined /></template>
                    </a-button>
                  </a-col>
                </a-row>
              </div>

              <a-button type="dashed" block @click="addItem" class="mt-2">
                <template #icon><plus-outlined /></template>
                Add Service Item
              </a-button>
            </div>
          </a-form>
        </a-card>
      </a-col>

      <!-- Sidebar / Summary -->
      <a-col :xs="24" :lg="8">
        <a-card title="Financial Summary" class="summary-card">
          <div class="summary-item">
            <span>Subtotal</span>
            <span>KSh {{ subtotal.toLocaleString() }}</span>
          </div>
          <div class="summary-item mt-3">
            <span>Discount (%)</span>
            <a-input-number v-model:value="form.discountRate" :min="0" :max="100" size="small" />
          </div>
          <div class="summary-item mt-3">
            <span>Tax (VAT 16%)</span>
            <span>KSh {{ taxAmount.toLocaleString() }}</span>
          </div>
          <a-divider />
          <div class="summary-item total">
            <span>Amount Due</span>
            <span class="total-value">KSh {{ grandTotal.toLocaleString() }}</span>
          </div>

          <div class="mt-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <span class="text-xs text-slate-500 font-bold uppercase font-mono">Settlement Instructions & Fiscal Seal</span>
            <a-textarea 
              v-model:value="form.notes" 
              placeholder="e.g. Settle via M-Pesa Till 174379, A/C: LDH-8933. Certified under Kenya Tax Procedures Act Section 23A." 
              :rows="3" 
              class="mt-2 border-0 bg-transparent text-xs"
            />
          </div>
        </a-card>

        <a-card title="Smart Features" class="mt-6">
          <a-checkbox v-model:checked="form.notifyCustomer">Email Invoice on Issuance</a-checkbox>
          <div class="mt-3">
            <a-checkbox v-model:checked="form.autoReminder">Enable Smart Reminders</a-checkbox>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- Preview Modal -->
    <a-modal v-model:open="previewVisible" title="Professional Draft Preview" :width="isMobile ? '95%' : '800px'" :footer="null">
      <div class="invoice-preview-wrap">
         <div class="preview-header">
           <div class="logo">QX BILLING</div>
           <div class="invoice-meta">
             <h2>INVOICE</h2>
             <p>#{{ form.invoiceNumber }}</p>
           </div>
         </div>
         <a-divider />
         <a-row justify="space-between">
           <a-col :xs="24" :sm="10">
             <span class="label">RECIPIENT:</span>
             <p class="val">{{ selectedCustomerName }}</p>
           </a-col>
           <a-col :xs="12" :sm="6">
             <span class="label">ISSUE DATE:</span>
             <p class="val">{{ form.issueDate?.format('DD MMM YYYY') }}</p>
           </a-col>
           <a-col :xs="12" :sm="6">
             <span class="label">DUE DATE:</span>
             <p class="val text-red-600">{{ form.dueDate?.format('DD MMM YYYY') }}</p>
           </a-col>
         </a-row>
         
         <table class="preview-table mt-6">
           <thead>
             <tr>
               <th>DESCRIPTION</th>
               <th class="text-right">AMOUNT</th>
             </tr>
           </thead>
           <tbody>
             <tr v-for="item in form.items" :key="item.description">
               <td>{{ item.description }}</td>
               <td class="text-right">KSh {{ (item.quantity * item.rate).toLocaleString() }}</td>
             </tr>
           </tbody>
         </table>

         <div class="preview-totals mt-6">
           <div class="p-row"><span>Total Due:</span> <strong>KSh {{ grandTotal.toLocaleString() }}</strong></div>
         </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed } from 'vue';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  SendOutlined,
  PrinterOutlined,
  EyeOutlined,
  UndoOutlined
} from '@ant-design/icons-vue';
import api from '../services/api';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

export default defineComponent({
  name: 'InvoiceGenerator',
  components: {
    PlusOutlined,
    DeleteOutlined,
    SendOutlined,
    PrinterOutlined,
    EyeOutlined,
    UndoOutlined
  },
  setup() {
    const loading = ref(false);
    const customers = ref([]);
    const previewVisible = ref(false);
    const isMobile = computed(() => window.innerWidth < 768);
    
    const form = reactive({
      customerId: null,
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      issueDate: dayjs(),
      dueDate: dayjs().add(14, 'day'),
      items: [
        { description: 'Service Subscription', quantity: 1, rate: 0 }
      ],
      discountRate: 0,
      taxRate: 16,
      notes: '',
      notifyCustomer: true,
      autoReminder: false
    });

    const fetchCustomers = async () => {
      const response = await api.getCustomers(1, 1000);
      customers.value = response.data.customers;
    };

    const addItem = () => form.items.push({ description: '', quantity: 1, rate: 0 });
    const removeItem = (idx) => form.items.splice(idx, 1);
    
    const subtotal = computed(() => 
      form.items.reduce((acc, item) => acc + (item.quantity * item.rate), 0)
    );
    
    const discountAmount = computed(() => subtotal.value * (form.discountRate / 100));
    const taxAmount = computed(() => (subtotal.value - discountAmount.value) * (form.taxRate / 100));
    const grandTotal = computed(() => subtotal.value - discountAmount.value + taxAmount.value);

    const selectedCustomerName = computed(() => {
      const c = customers.value.find(c => c.id === form.customerId);
      return c ? c.name : 'Unspecified Client';
    });

    const handleCustomerChange = async (cid) => {
      try {
        const res = await api.getBillingForecast(cid);
        const breakdown = res.data.data.currentCosts;
        // Innovation: Auto-fill from unbilled usage
        form.items = [
          { description: 'Ongoing Cycle Usage', quantity: 1, rate: breakdown.usageCharges },
          { description: 'Base Plan Fee', quantity: 1, rate: breakdown.basePrice }
        ];
      } catch (err) {
        // Fallback for customers with no usage
      }
    };

    const submitInvoice = async () => {
      if (!form.customerId) return message.warning('Please select a customer.');
      loading.value = true;
      try {
        await api.generateInvoice({
          customerId: form.customerId,
          dueDate: form.dueDate.toDate(),
          amountDue: grandTotal.value,
          // Custom extensions would go here
        });
        message.success('Invoice finalized and queued for delivery.');
        resetForm();
      } catch (err) {
        message.error('Failed to issue invoice.');
      } finally {
        loading.value = false;
      }
    };

    const resetForm = () => {
      Object.assign(form, {
        customerId: null,
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        items: [{ description: 'Service Subscription', quantity: 1, rate: 0 }],
        discountRate: 0,
        notes: ''
      });
    };

    const showPreview = () => {
      if (form.items.length === 0) return message.warning('Add at least one item to preview.');
      previewVisible.value = true;
    };

    fetchCustomers();

    return {
      form,
      customers,
      loading,
      previewVisible,
      subtotal,
      taxAmount,
      grandTotal,
      selectedCustomerName,
      addItem,
      removeItem,
      handleCustomerChange,
      submitInvoice,
      resetForm,
      showPreview,
      isMobile
    };
  },
});
</script>

<style scoped>
.invoice-generator-page {
  max-width: 1400px;
  margin: 0 auto;
}

.standard-card, .summary-card {
  box-shadow: var(--shadow-sm);
  border-radius: 12px;
}

.item-header {
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 8px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.total-value {
  font-size: 20px;
  font-weight: 800;
  color: var(--primary-color);
}

/* Preview Styles */
.invoice-preview-wrap {
  padding: 40px;
}

@media (max-width: 576px) {
  .invoice-preview-wrap {
    padding: 16px;
  }
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: 900;
  color: var(--text-primary);
  letter-spacing: -1px;
}

.label { font-size: 11px; color: var(--text-muted); font-weight: 700; text-transform: uppercase; font-family: 'JetBrains Mono', monospace; }
.val { font-size: 14px; font-weight: 600; margin-top: 4px; color: var(--text-primary); }

.preview-table {
  width: 100%;
  border-collapse: collapse;
}

.preview-table th {
  text-align: left;
  font-size: 11px;
  color: var(--text-secondary);
  padding: 12px 0;
  border-bottom: 2px solid var(--border-glass);
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
}

.preview-table td {
  padding: 16px 0;
  border-bottom: 1px solid var(--border-glass-subtle);
  font-size: 14px;
  color: var(--text-primary);
}

.text-right { text-align: right; }
.preview-totals {
  display: flex;
  justify-content: flex-end;
}

.p-row { font-size: 16px; color: var(--text-primary); }
</style>
