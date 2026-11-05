<template>
  <div class="payment-processing-container max-w-[1200px] mx-auto px-4 py-2">
    <div class="mb-6">
      <h2 class="text-2xl font-extrabold tracking-tight m-0" style="color: var(--text-primary);">
        Payment & <span class="calligraphic-accent">Settlement</span> Processing
      </h2>
      <p class="calligraphic-quote mt-1 mb-0">
        "Instant Nairobi M-Pesa STK push authorizations and cryptographic receipt audits."
      </p>
    </div>

    <a-row :gutter="[24, 24]">
      <a-col :xs="24" :lg="12">
        <a-card title="Select Invoice to Settle" class="standard-card">
          <a-form layout="vertical">
            <a-form-item label="Pending Invoice">
              <a-select v-model:value="selectedInvoiceId" placeholder="Select an invoice to settle" show-search :filter-option="filterInvoice" size="large">
                <a-select-option v-for="invoice in invoices" :key="invoice.id" :value="invoice.id">
                  {{ invoice.invoiceNumber }} — {{ getCustomerName(invoice) }} (KES {{ Number(invoice.amountDue || invoice.total || 0).toLocaleString() }})
                </a-select-option>
              </a-select>
            </a-form-item>
            <div v-if="selectedInvoice" class="invoice-details mt-4 p-4 rounded-lg border" style="background: var(--surface-hover); border-color: var(--border-glass);">
              <div class="detail-row">
                <span style="color: var(--text-secondary);">Shopper:</span>
                <span class="font-bold" style="color: var(--text-primary);">{{ getCustomerName(selectedInvoice) }}</span>
              </div>
              <div class="detail-row mt-2">
                <span style="color: var(--text-secondary);">Amount Due:</span>
                <span class="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-num">KES {{ Number(selectedInvoice.amountDue || selectedInvoice.total || 0).toLocaleString() }}</span>
              </div>
              <div class="detail-row mt-2">
                <span style="color: var(--text-secondary);">Due Date:</span>
                <span style="color: var(--text-primary);" class="font-mono">{{ formatDate(selectedInvoice.dueDate) }}</span>
              </div>
              <div class="detail-row mt-2 items-center">
                <span style="color: var(--text-secondary);">Settlement Status:</span>
                <span class="badge-micro font-bold" :class="selectedInvoice.status === 'paid' ? 'text-emerald-500 border-emerald-500/30' : 'text-amber-500 border-amber-500/30'">
                  {{ (selectedInvoice.status || 'PENDING').toUpperCase() }}
                </span>
              </div>
            </div>
          </a-form>
        </a-card>
      </a-col>

      <a-col :xs="24" :lg="12">
        <a-card title="Settlement Method" class="standard-card">
          <a-radio-group v-model:value="paymentMethod" button-style="solid" class="w-full flex">
            <a-radio-button value="mpesa" class="flex-1 text-center font-bold">M-Pesa (Kenya)</a-radio-button>
            <a-radio-button value="credit_card" class="flex-1 text-center">Card</a-radio-button>
            <a-radio-button value="paypal" class="flex-1 text-center">PayPal</a-radio-button>
          </a-radio-group>

          <div class="payment-fields mt-6">
            <template v-if="paymentMethod === 'mpesa'">
              <div class="p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/20 text-emerald-400 text-sm">
                <p class="m-0 font-medium">An instant STK Push prompt will be dispatched to the shopper's Safaricom line upon clicking "Confirm Settlement".</p>
              </div>
            </template>

            <template v-if="paymentMethod === 'credit_card'">
              <a-form layout="vertical">
                <a-form-item label="Card Number">
                  <a-input v-model:value="creditCardDetails.cardNumber" placeholder="4242 •••• •••• 4242" class="font-mono" />
                </a-form-item>
                <a-row :gutter="16">
                  <a-col :xs="24" :sm="12">
                    <a-form-item label="Expiry Date">
                      <a-input v-model:value="creditCardDetails.expiryDate" placeholder="12/28" class="font-mono" />
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="12">
                    <a-form-item label="CVV">
                      <a-input v-model:value="creditCardDetails.cvv" placeholder="884" class="font-mono" />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-form-item label="Card Holder Name">
                  <a-input v-model:value="creditCardDetails.cardHolderName" placeholder="e.g. Kevin Ochieng" />
                </a-form-item>
              </a-form>
            </template>

            <template v-if="paymentMethod === 'paypal'">
              <div class="p-4 rounded-xl border bg-indigo-500/10 border-indigo-500/20 text-indigo-400 text-sm">
                <p class="m-0 font-medium">PayPal Global Express Gateway &bull; Automatic real-time USD/EUR conversion to Kenya Shillings (KES).</p>
              </div>
            </template>

            <a-button type="primary" :loading="processing" @click="processPayment" class="mt-6 h-11 font-bold text-sm" :disabled="!selectedInvoiceId || processing" block size="large">
              {{ processing ? 'Authorizing Transaction...' : 'Confirm Settlement & Record in Ledger' }}
            </a-button>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-modal v-model:open="showStatusModal" :title="null" :footer="null" :closable="!processing">
      <a-result
        :status="paymentStatus.type"
        :title="paymentStatus.message"
        :sub-title="paymentStatus.subTitle"
      >
        <template #extra>
          <a-button v-if="paymentStatus.type === 'success'" type="primary" @click="closeStatus">Return to History</a-button>
          <a-button v-else type="primary" @click="showStatusModal = false">Try Again</a-button>
        </template>
      </a-result>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref, computed, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import api from '../services/api';
import dayjs from 'dayjs';

export default defineComponent({
  name: 'PaymentProcessing',
  setup() {
    const isMobile = ref(window.innerWidth < 768);
    const updateMobile = () => {
      isMobile.value = window.innerWidth < 768;
    };

    onMounted(() => {
      window.addEventListener('resize', updateMobile);
      fetchInvoices();
      fetchCustomers();
    });

    const selectedInvoiceId = ref(undefined);
    const paymentMethod = ref('mpesa');
    const processing = ref(false);
    const showStatusModal = ref(false);
    const paymentStatus = ref({ type: 'info', message: '', subTitle: '' });
    const invoices = ref([]);
    const customerMap = ref({});

    const fetchCustomers = async () => {
      try {
        const res = await api.getCustomers(1, 100);
        const list = res.data?.data || res.data?.customers || [];
        const map = {};
        list.forEach(c => { map[c.id] = c.name; });
        customerMap.value = map;
      } catch (err) {
        console.warn('Could not load customer map', err);
      }
    };

    const getCustomerName = (inv) => {
      if (!inv) return 'Shopper';
      if (inv.Customer?.name) return inv.Customer.name;
      if (customerMap.value[inv.customerId]) return customerMap.value[inv.customerId];
      return `Shopper #${inv.customerId || inv.id}`;
    };

    const creditCardDetails = reactive({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardHolderName: '',
    });

    const fetchInvoices = async () => {
      try {
        const response = await api.getInvoices(1, 1000);
        invoices.value = response.data?.data || response.data?.invoices || [];
      } catch (error) {
        message.error('Failed to load pending invoices.');
      }
    };

    const selectedInvoice = computed(() => {
      return invoices.value.find(inv => inv.id === selectedInvoiceId.value);
    });

    const processPayment = async () => {
      if (!selectedInvoiceId.value) return message.error('Please select an invoice.');

      processing.value = true;
      showStatusModal.value = true;
      paymentStatus.value = { type: 'info', message: 'Authorizing...', subTitle: 'Connecting to payment gateway' };

      try {
        const paymentData = {
          invoiceId: selectedInvoiceId.value,
          amount: selectedInvoice.value.amountDue,
          method: paymentMethod.value,
          details: paymentMethod.value === 'credit_card' ? creditCardDetails : {}
        };
        
        await api.createPayment(paymentData);
        
        paymentStatus.value = {
          type: 'success',
          message: 'Payment Confirmed',
          subTitle: `Transaction for #${selectedInvoice.value.invoiceNumber} was successful. Receipt has been emailed.`,
        };
        fetchInvoices(); // Refresh list
      } catch (error) {
        paymentStatus.value = {
          type: 'error',
          message: 'Transaction Declined',
          subTitle: error.response?.data?.error || 'Payment gateway returned an error. Please verify your details.',
        };
      } finally {
        processing.value = false;
      }
    };

    const filterInvoice = (input, option) => 
      String(option.children?.[0] || '').toLowerCase().indexOf(String(input || '').toLowerCase()) >= 0;

    const getStatusColor = (status) => {
      const colors = { pending: 'orange', paid: 'success', overdue: 'error' };
      return colors[status] || 'default';
    };

    const formatDate = (date) => dayjs(date).format('DD MMM YYYY');

    const closeStatus = () => {
      showStatusModal.value = false;
      selectedInvoiceId.value = undefined;
    };

    return {
      selectedInvoiceId,
      paymentMethod,
      processing,
      showStatusModal,
      paymentStatus,
      invoices,
      creditCardDetails,
      selectedInvoice,
      processPayment,
      isMobile,
      filterInvoice,
      getStatusColor,
      formatDate,
      closeStatus,
      getCustomerName
    };
  },
});
</script>

<style scoped>
.payment-processing-container {
  max-width: 1200px;
  margin: 0 auto;
}

.standard-card {
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

@media (max-width: 480px) {
  .payment-processing-container {
    padding: 0;
  }
}
</style>
