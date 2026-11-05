import { ref, computed } from 'vue';
import { SAAS_PRESETS } from '../config/saasPresets';

// Check if a preset is requested via URL query param or saved in localStorage
function getInitialPreset() {
  try {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const queryPreset = urlParams.get('preset');
      if (queryPreset && SAAS_PRESETS[queryPreset]) {
        localStorage.setItem('saas_benchmark_preset', queryPreset);
        return queryPreset;
      }
      const saved = localStorage.getItem('saas_benchmark_preset');
      if (saved && SAAS_PRESETS[saved]) {
        return saved;
      }
    }
  } catch (e) {
    console.warn('[TenantConfig] Storage access warning:', e);
  }
  return 'd2c_archival';
}

const currentPresetKey = ref(getInitialPreset());

export function useTenantConfig() {
  const activeTenant = computed(() => {
    return SAAS_PRESETS[currentPresetKey.value] || SAAS_PRESETS.d2c_archival;
  });

  const availablePresets = computed(() => {
    return Object.keys(SAAS_PRESETS).map(key => ({
      key,
      name: SAAS_PRESETS[key].brand.name + ' ' + SAAS_PRESETS[key].brand.accent,
      industry: SAAS_PRESETS[key].industryName,
      currency: SAAS_PRESETS[key].currency.code
    }));
  });

  function setPreset(key) {
    if (SAAS_PRESETS[key]) {
      currentPresetKey.value = key;
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('saas_benchmark_preset', key);
        }
      } catch (e) {
        // ignore
      }
    }
  }

  function formatMoney(amount) {
    const tenant = activeTenant.value;
    const num = Number(amount) || 0;
    const formatted = Math.round(num).toLocaleString(tenant.currency.locale || 'en-US');
    return `${tenant.currency.prefix}${formatted}${tenant.currency.suffix}`;
  }

  return {
    activeTenant,
    currentPresetKey,
    availablePresets,
    setPreset,
    formatMoney
  };
}
