<template>
  <div class="profile-page max-w-[900px] mx-auto px-4 py-2">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-extrabold tracking-tight m-0" style="color: var(--text-primary);">
        Executive <span class="calligraphic-accent">Profile</span> & Security Station
      </h2>
      <p class="calligraphic-quote mt-1 mb-0">
        "Cryptographic access credentials, Daraja M-Pesa API key vault, and corporate financial authorizations."
      </p>
    </div>

    <a-row :gutter="[24, 24]">
      <!-- Column 1: Operator Identity & Security -->
      <a-col :xs="24" :lg="15">
        <a-card title="Controller Identity & Authorization" class="standard-card">
          <a-form layout="vertical" :model="form" @finish="saveProfile">
            <a-row :gutter="16">
              <a-col :xs="24" :sm="12">
                <a-form-item label="Operator Full Name">
                  <a-input v-model:value="form.fullName" size="large" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12">
                <a-form-item label="Executive Role">
                  <a-input v-model:value="form.roleTitle" disabled size="large" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="16">
              <a-col :xs="24" :sm="12">
                <a-form-item label="Official Email">
                  <a-input v-model:value="form.email" size="large" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12">
                <a-form-item label="Safaricom Line (M-Pesa 2FA)">
                  <a-input v-model:value="form.phone" size="large" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-divider style="margin: 16px 0;">Credential Rotation</a-divider>

            <a-row :gutter="16">
              <a-col :xs="24" :sm="12">
                <a-form-item label="New Security Key">
                  <a-input-password v-model:value="form.newPassword" placeholder="Leave blank to preserve current" size="large" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12">
                <a-form-item label="Confirm Security Key">
                  <a-input-password v-model:value="form.confirmPassword" placeholder="Confirm new key" size="large" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-button type="primary" html-type="submit" :loading="saving" size="large" class="h-11 font-bold px-6 mt-2">
              Update Executive Profile & Key
            </a-button>
          </a-form>
        </a-card>
      </a-col>

      <!-- Column 2: Security Health & Daraja Vault -->
      <a-col :xs="24" :lg="9">
        <a-card title="Security & Integrations Health" class="standard-card">
          <div class="space-y-4">
            <div class="p-3 rounded-lg border bg-emerald-500/10 border-emerald-500/20">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">DARAJA STK VAULT</span>
                <span class="badge-micro text-emerald-600 dark:text-emerald-400 font-bold">CONNECTED</span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-0">
                Shortcode <strong>174379</strong> verified for instant automated ledger dispatch.
              </p>
            </div>

            <div class="p-3 rounded-lg border bg-indigo-500/10 border-indigo-500/20">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">KRA ETIMS SIGNING</span>
                <span class="badge-micro text-indigo-600 dark:text-indigo-400 font-bold">NOMINAL</span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-0">
                SHA-256 Control Unit (KRA-CU-0982410-LADHA) active on port 5000.
              </p>
            </div>

            <div class="p-3 rounded-lg border" style="background: var(--surface-hover); border-color: var(--border-glass);">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold font-mono" style="color: var(--text-primary);">SESSION SIGNATURE</span>
                <span class="badge-micro font-mono text-[10px]">ECDSA-P256</span>
              </div>
              <p class="text-[11px] text-slate-400 mt-1 mb-0 font-mono truncate">
                Bearer: ladha_controller_node_ke
              </p>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';

export default defineComponent({
  name: 'ProfileSettings',
  setup() {
    const saving = ref(false);
    const form = reactive({
      fullName: 'Financial Controller',
      roleTitle: 'Chief Financial Officer & Controller',
      email: 'controller@ladha.ke',
      phone: '+254 712 345 678',
      newPassword: '',
      confirmPassword: '',
    });

    onMounted(() => {
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.name) form.fullName = parsed.name;
          if (parsed.email) form.email = parsed.email;
        }
      } catch (e) {
        // preserve defaults
      }
    });

    const saveProfile = async () => {
      if (form.newPassword && form.newPassword !== form.confirmPassword) {
        message.error('Security key confirmation mismatch.');
        return;
      }
      saving.value = true;
      try {
        await new Promise(r => setTimeout(r, 500));
        localStorage.setItem('user', JSON.stringify({
          name: form.fullName,
          email: form.email,
          role: 'controller',
          organization: 'Ladha Nairobi'
        }));
        form.newPassword = '';
        form.confirmPassword = '';
        message.success('Executive controller profile and cryptographic keys updated.');
      } catch (err) {
        message.error('Failed to update credentials.');
      } finally {
        saving.value = false;
      }
    };

    return {
      form,
      saving,
      saveProfile,
    };
  },
});
</script>

<style scoped>
.profile-page {
  padding-bottom: 40px;
}
</style>
