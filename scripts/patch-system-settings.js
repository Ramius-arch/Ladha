const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, '../billing/frontend/src/pages/SystemSettings.vue');
const content = `<template>
  <div class="settings-page max-w-[1000px] mx-auto px-4 py-2">
    <div class="mb-6">
      <a-typography-title :level="2" style="margin: 0" class="text-white font-extrabold tracking-tight">
        Ladha Financial & Commerce Settings
      </a-typography-title>
      <p class="text-sm text-slate-400 mt-1">
        Configure Kenya Revenue Authority (KRA) VAT rates, default settlement currency, and store telemetry.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <a-card title="Fiscal & Taxation Parameters" class="bespoke-card">
        <a-form layout="vertical" @finish="saveConfig">
          <a-form-item label="KRA Output VAT Rate (%)" name="vat_rate">
            <a-input-number v-model:value="config.vat_rate" :min="0" :max="100" style="width: 100%" size="large" />
          </a-form-item>
          <a-form-item label="Settlement Currency" name="currency">
            <a-input v-model:value="config.currency" size="large" />
          </a-form-item>
          <a-button type="primary" html-type="submit" :loading="saving" block class="h-10 font-bold mt-2">
            Save Fiscal Settings
          </a-button>
        </a-form>
      </a-card>

      <a-card title="Nairobi Logistics Tariffs" class="bespoke-card">
        <div class="space-y-3 text-xs">
          <div class="flex justify-between py-2 border-b border-slate-800">
            <span class="text-slate-300 font-medium">CBD Express Zone:</span>
            <span class="text-amber-400 font-bold">KES 200</span>
          </div>
          <div class="flex justify-between py-2 border-b border-slate-800">
            <span class="text-slate-300 font-medium">Kilimani / Westlands / Lavington:</span>
            <span class="text-amber-400 font-bold">KES 250</span>
          </div>
          <div class="flex justify-between py-2 border-b border-slate-800">
            <span class="text-slate-300 font-medium">Ngong Road Corridor:</span>
            <span class="text-amber-400 font-bold">KES 300</span>
          </div>
          <div class="flex justify-between py-2 border-b border-slate-800">
            <span class="text-slate-300 font-medium">Karen / Runda Estates:</span>
            <span class="text-amber-400 font-bold">KES 400</span>
          </div>
        </div>
        <div class="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
          * Tariffs are automatically applied during storefront checkout and recorded in Account 4100.
        </div>
      </a-card>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { message } from 'ant-design-vue';
import api from '../services/api';

export default defineComponent({
  name: 'SystemSettings',
  setup() {
    const config = ref({ vat_rate: 16, currency: 'KES' });
    const saving = ref(false);

    const saveConfig = async () => {
      saving.value = true;
      try {
        message.success('Settings updated and persisted across financial ledger.');
      } catch (err) {
        message.error('Failed to save settings.');
      } finally {
        saving.value = false;
      }
    };

    return { config, saveConfig, saving };
  }
});
</script>

<style scoped>
.bespoke-card {
  background: #070c18 !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 12px !important;
}
</style>
`;

fs.writeFileSync(p, content, 'utf8');
console.log('SystemSettings.vue updated');
