import { ref, computed } from 'vue';
import { SAAS_PRESETS } from '../config/saasPresets';

function isWhiteLabelUnlocked() {
  try {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('white_label') === 'true') {
        sessionStorage.setItem('ladha_white_label_unlocked', 'true');
        return true;
      }
      return sessionStorage.getItem('ladha_white_label_unlocked') === 'true';
    }
  } catch {
    // ignore
  }
  return false;
}

// Check if a preset is requested via URL query param or saved in localStorage
function getInitialPreset() {
  if (!isWhiteLabelUnlocked()) {
    return 'd2c_archival';
  }
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
    const keys = isWhiteLabelUnlocked() ? Object.keys(SAAS_PRESETS) : ['d2c_archival'];
    return keys.map(key => ({
      key,
      name: SAAS_PRESETS[key].brand.name + ' ' + SAAS_PRESETS[key].brand.accent,
      industry: SAAS_PRESETS[key].industryName,
      currency: SAAS_PRESETS[key].currency.code
    }));
  });

  function setPreset(key) {
    if (!isWhiteLabelUnlocked() && key !== 'd2c_archival') return;
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
