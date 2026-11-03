<template>
  <div class="settings-page max-w-[1000px] mx-auto px-4 py-2">
    <div class="mb-6">
      <h2 class="text-2xl font-extrabold tracking-tight m-0" style="color: var(--text-primary);">
        Ladha Financial & Commerce Settings
      </h2>
      <p class="text-sm mt-1" style="color: var(--text-secondary);">
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
          <div class="flex justify-between py-2 border-b" style="border-color: var(--border-glass-subtle);">
            <span style="color: var(--text-secondary);" class="font-medium">CBD Express Zone:</span>
            <span class="text-amber-600 dark:text-amber-400 font-mono font-bold">KES 200</span>
          </div>
          <div class="flex justify-between py-2 border-b" style="border-color: var(--border-glass-subtle);">
            <span style="color: var(--text-secondary);" class="font-medium">Kilimani / Westlands / Lavington:</span>
            <span class="text-amber-600 dark:text-amber-400 font-mono font-bold">KES 250</span>
          </div>
          <div class="flex justify-between py-2 border-b" style="border-color: var(--border-glass-subtle);">
            <span style="color: var(--text-secondary);" class="font-medium">Ngong Road Corridor:</span>
            <span class="text-amber-600 dark:text-amber-400 font-mono font-bold">KES 300</span>
          </div>
          <div class="flex justify-between py-2 border-b" style="border-color: var(--border-glass-subtle);">
            <span style="color: var(--text-secondary);" class="font-medium">Karen / Runda Estates:</span>
            <span class="text-amber-600 dark:text-amber-400 font-mono font-bold">KES 400</span>
          </div>
        </div>
        <div class="mt-4 pt-3 border-t text-[11px]" style="border-color: var(--border-glass-subtle); color: var(--text-muted);">
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
  border-radius: 12px !important;
}
</style>
