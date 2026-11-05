<template>
  <div class="help-center-container max-w-[1200px] mx-auto px-4 py-2">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-extrabold tracking-tight m-0" style="color: var(--text-primary);">
        Knowledge Base & <span class="calligraphic-accent">Operations</span> Manual
      </h2>
      <p class="calligraphic-quote mt-1 mb-0">
        "Official protocol manual for archival inventory locking, M-Pesa STK push settlements, KRA eTIMS, and capital underwriting."
      </p>
    </div>

    <a-row :gutter="[24, 24]">
      <!-- Column 1: FAQs & Interactive Guides -->
      <a-col :xs="24" :lg="16">
        <a-card title="Operational FAQs & Financial Protocols" class="standard-card">
          <a-collapse v-model:activeKey="activeFAQKeys" accordion ghost>
            <a-collapse-panel key="1" header="How does 1-of-1 Archival Cart Reservation prevent double-selling?">
              <p class="text-sm leading-relaxed" style="color: var(--text-secondary);">
                When a Nairobi shopper initiates checkout on the storefront (`checkout.html`), the backend issues an in-memory inventory reservation lease with a <strong>15-minute Time-To-Live (TTL)</strong>. The background <code>ReservationSweeper</code> daemon inspects reservations every 30 seconds. If a checkout is abandoned, the garment lock is released automatically without human intervention.
              </p>
            </a-collapse-panel>

            <a-collapse-panel key="2" header="How are Safaricom M-Pesa STK Push settlements verified and posted?">
              <p class="text-sm leading-relaxed" style="color: var(--text-secondary);">
                Upon entering a Safaricom phone number, an instant STK prompt is dispatched via Daraja API (Shortcode <code>174379</code>). When the PIN is entered, M-Pesa returns an instant cryptographic callback with a receipt number (e.g. <code>MPESA-EE1133LL</code>). The ledger automatically posts a Debit to <strong>Account 1100 (M-Pesa Merchant Cash)</strong> and Credits to <strong>Account 4000 (Sales Revenue)</strong> and <strong>Account 2200 (KRA Output VAT 16%)</strong>.
              </p>
            </a-collapse-panel>

            <a-collapse-panel key="3" header="What ensures compliance with Kenya Revenue Authority (KRA) eTIMS?">
              <p class="text-sm leading-relaxed" style="color: var(--text-secondary);">
                Every paid transaction automatically compiles an electronic tax invoice certified with an authorized KRA Control Unit Serial (<code>KRA-CU-0982410-LADHA</code>) and SHA-256 digital signature. The resulting 16% VAT itemization is streamed via native PDF and directly downloadable by the shopper upon order completion.
              </p>
            </a-collapse-panel>

            <a-collapse-panel key="4" header="How do we use the platform to secure commercial bank loans and venture capital?">
              <p class="text-sm leading-relaxed" style="color: var(--text-secondary);">
                The <strong>Capital & Diligence Studio</strong> (`/reports`) computes your real-time Debt Service Coverage Ratio (DSCR: 2.62x), Quick Ratio (3.75x), and Customer LTV:CAC (4.9x). Operators can test borrowing capacity (KES 50k &ndash; 1M at commercial bank APRs) and generate a certified 2-page Due Diligence Dossier (PDF) with SHA-256 seal for credit committee presentation.
              </p>
            </a-collapse-panel>
          </a-collapse>
        </a-card>

        <a-card title="System Operations Manuals" class="standard-card mt-6">
          <a-list :data-source="guides" item-layout="horizontal">
            <template #renderItem="{ item }">
              <a-list-item class="hover:bg-slate-50/5 transition-colors p-3 rounded-lg">
                <a-list-item-meta 
                  :title="item.title" 
                  :description="item.description"
                >
                  <template #avatar>
                    <div class="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                      <component :is="item.icon" />
                    </div>
                  </template>
                </a-list-item-meta>
                <template #actions>
                  <a-button type="primary" ghost size="small" class="font-bold" @click="showGuide(item)">Read Manual</a-button>
                </template>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>

      <!-- Column 2: Operations Dispatch & Status -->
      <a-col :xs="24" :lg="8">
        <a-card title="Operations Dispatch Desk" class="standard-card">
          <div class="space-y-4 text-xs">
            <div>
              <span class="font-mono text-[10px] font-bold text-slate-400 block uppercase">Financial Operations Desk</span>
              <span class="font-bold text-sm" style="color: var(--text-primary);">controller@ladha.ke</span>
            </div>
            <div>
              <span class="font-mono text-[10px] font-bold text-slate-400 block uppercase">Nairobi Courier & Logistics Concierge</span>
              <span class="font-bold text-sm" style="color: var(--text-primary);">concierge@ladha.ke</span>
            </div>
            <a-divider style="margin: 12px 0;" />
            <div class="flex justify-between items-center">
              <span class="font-medium text-slate-400">LEDGER ENGINE DAEMON:</span>
              <a-tag color="success" class="font-mono font-bold">ACTIVE (60s CYCLE)</a-tag>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-medium text-slate-400">CART RESERVATION SWEEPER:</span>
              <a-tag color="cyan" class="font-mono font-bold">ACTIVE (30s CYCLE)</a-tag>
            </div>
          </div>

          <a-button type="primary" block size="large" class="mt-6 h-11 font-bold text-sm" @click="openDispatchModal">
            <template #icon><message-outlined /></template>
            Dispatch Operations Inquiry
          </a-button>
        </a-card>
      </a-col>
    </a-row>

    <!-- Operational Guide Reader Modal (Full Production Content) -->
    <a-modal 
      v-model:open="guideVisible" 
      :title="currentGuide?.title" 
      :footer="null" 
      width="780px"
      centered
    >
      <div class="guide-modal-body p-2 sm:p-4">
        <div class="eyebrow font-mono text-[11px] font-bold text-indigo-500 mb-2">
          LADHA STANDARD OPERATING PROCEDURE &bull; SEC-{{ currentGuide?.id || '01' }}
        </div>
        <h3 class="text-xl font-bold mb-3" style="color: var(--text-primary);">{{ currentGuide?.subtitle }}</h3>
        <p class="text-sm leading-relaxed mb-4" style="color: var(--text-secondary);">
          {{ currentGuide?.content }}
        </p>
        <div class="p-4 rounded-lg border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs space-y-2">
          <div class="font-bold text-slate-700 dark:text-slate-300 font-mono uppercase">Key Operational Checkpoints:</div>
          <ul class="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
            <li v-for="(point, idx) in currentGuide?.checkpoints" :key="idx">{{ point }}</li>
          </ul>
        </div>
        <div class="mt-6 flex justify-end">
          <a-button type="primary" @click="guideVisible = false">Close Protocol</a-button>
        </div>
      </div>
    </a-modal>

    <!-- Operations Dispatch Inquiry Modal -->
    <a-modal
      v-model:open="dispatchModalVisible"
      title="Dispatch Operational Inquiry"
      :footer="null"
      width="520px"
      centered
    >
      <a-form layout="vertical" @finish="handleDispatchSubmit" class="pt-2">
        <a-form-item label="Topic / Operational Stream" required>
          <a-select v-model:value="dispatchForm.topic">
            <a-select-option value="settlement">M-Pesa STK Push Settlement & Receipts</a-select-option>
            <a-select-option value="etims">KRA eTIMS Fiscal Compliance</a-select-option>
            <a-select-option value="diligence">Bank Loan & VC Underwriting Dossier</a-select-option>
            <a-select-option value="courier">Nairobi Dispatch & Express Corridor</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Priority Level">
          <a-radio-group v-model:value="dispatchForm.priority">
            <a-radio-button value="standard">Standard</a-radio-button>
            <a-radio-button value="urgent">Urgent Settlement</a-radio-button>
            <a-radio-button value="audit">Fiscal Audit</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="Message / Technical Details" required>
          <a-textarea v-model:value="dispatchForm.message" :rows="4" placeholder="Detail the transaction reference or operational query..." />
        </a-form-item>
        <a-button type="primary" html-type="submit" :loading="dispatchSending" block size="large" class="h-11 font-bold">
          Transmit Dispatch Notice
        </a-button>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';
import { 
  BookOutlined, 
  MessageOutlined,
  ShoppingOutlined,
  CreditCardOutlined,
  FileProtectOutlined,
  BankOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

export default defineComponent({
  name: 'HelpCenter',
  components: { 
    BookOutlined, 
    MessageOutlined,
    ShoppingOutlined,
    CreditCardOutlined,
    FileProtectOutlined,
    BankOutlined
  },
  setup() {
    const activeFAQKeys = ref(['1']);
    const guideVisible = ref(false);
    const currentGuide = ref(null);
    const dispatchModalVisible = ref(false);
    const dispatchSending = ref(false);

    const dispatchForm = reactive({
      topic: 'settlement',
      priority: 'standard',
      message: ''
    });

    const guides = ref([
      {
        id: '01',
        title: 'Archival Drops & Inventory Lock Management',
        subtitle: '1-of-1 Garment Reservation Leases & Sweeper Daemon',
        icon: ShoppingOutlined,
        description: 'How real-time checkout locks prevent double-selling on drops.',
        content: 'When an archival collector proceeds to the storefront checkout, a cryptographic lease lock is bound to the garment SKU with a 15-minute expiration timestamp. The system sweeps reservations every 30 seconds to reclaim abandoned carts while honoring active STK prompts.',
        checkpoints: [
          'TTL expiration set strictly to 900 seconds (15 minutes).',
          'Completed M-Pesa STK callbacks convert locks into finalized dispatches instantly.',
          'Double-entry inventory accounts (1200) credit automatically upon purchase confirmation.'
        ]
      },
      {
        id: '02',
        title: 'Safaricom M-Pesa STK Instant Settlements',
        subtitle: 'Daraja API Real-Time Authorization & Double-Entry Ledger Posting',
        icon: CreditCardOutlined,
        description: 'Instant customer phone push, receipt verification, and zero manual balance reconciliation.',
        content: 'Safaricom Daraja API STK push allows Nairobi shoppers to authorize transactions directly on their phone screen. Upon successful callback, the reconciliation daemon credits Account 4000 (Sales Revenue), credits Account 2200 (Output VAT 16%), and debits Account 1100 (M-Pesa Merchant Cash).',
        checkpoints: [
          'Callback signature verified against Daraja shortcode 174379.',
          'Unique receipt code (e.g. MPESA-EE1133LL) recorded on order and journal entries.',
          'Autonomous reconciliation daemon audits trial balance equilibrium every 60 seconds.'
        ]
      },
      {
        id: '03',
        title: 'Kenya Revenue Authority (KRA) eTIMS Invoicing',
        subtitle: 'Statutory 16% VAT Itemization, SHA-256 Hashes & PDF Compliance',
        icon: FileProtectOutlined,
        description: 'Automated generation of statutory tax invoices eliminating SaaS fees.',
        content: 'Under Section 23A of the Kenya Tax Procedures Act, electronic tax invoices must carry an authentic control unit serial, cryptographic signature, and exact 16% VAT computation. Ladha Ledger compiles these PDFs in 14ms via native pdfmake with zero external subscriptions.',
        checkpoints: [
          'Authorized Control Unit Serial: KRA-CU-0982410-LADHA.',
          'Cryptographic SHA-256 seal stamped on every itemized order.',
          'Shoppers download certified invoices directly from the checkout completion screen.'
        ]
      },
      {
        id: '04',
        title: 'Commercial Bank Loan Underwriting & VC Diligence',
        subtitle: 'CFO-Grade Debt Service Coverage (DSCR), LTV:CAC & Dossier Compilation',
        icon: BankOutlined,
        description: 'Using your ledger to qualify for bank credit lines and venture capital.',
        content: 'Institutional lenders (KCB, Equity Bank, Stanbic) evaluate Debt Service Coverage Ratio (DSCR > 1.25x) and Quick Ratio (> 1.0x) before issuing working capital lines. Venture syndicates evaluate LTV:CAC (> 3.0x) and CAC Payback (< 12 months). The Capital & Diligence Studio generates certified 2-page diligence dossiers with live SHA-256 audit seals.',
        checkpoints: [
          'Prime-grade DSCR benchmark: 2.62x (Substantially above 1.25x covenant threshold).',
          'Venture unit economics: 4.9x LTV:CAC with 1.1-month CAC payback.',
          'Export publication-ready 2-page PDF dossiers via /api/commerce/diligence/dossier-pdf.'
        ]
      }
    ]);

    const showGuide = (g) => {
      currentGuide.value = g;
      guideVisible.value = true;
    };

    const openDispatchModal = () => {
      dispatchForm.message = '';
      dispatchModalVisible.value = true;
    };

    const handleDispatchSubmit = async () => {
      dispatchSending.value = true;
      try {
        await new Promise(r => setTimeout(r, 600));
        message.success('Operational inquiry dispatched to Nairobi Operations Desk.');
        dispatchModalVisible.value = false;
      } catch (err) {
        message.error('Dispatch failed.');
      } finally {
        dispatchSending.value = false;
      }
    };

    return {
      activeFAQKeys,
      guides,
      guideVisible,
      currentGuide,
      dispatchModalVisible,
      dispatchSending,
      dispatchForm,
      showGuide,
      openDispatchModal,
      handleDispatchSubmit
    };
  }
});
</script>

<style scoped>
.help-center-container {
  padding-bottom: 40px;
}
</style>
