<template>
  <div class="auth-viewport flex items-center justify-center min-h-screen p-4">
    <div class="auth-card bespoke-glass-card w-full max-w-[460px] p-8 sm:p-10 relative overflow-hidden">
      <!-- Subtle Ambient Glow -->
      <div class="ambient-corner-glow"></div>

      <!-- Brand Header -->
      <div class="auth-header text-center mb-6">
        <router-link to="/" class="inline-flex items-center gap-3 mb-3 group">
          <img src="/assets/logo.png" alt="Ladha Logo" class="w-9 h-9 object-contain transition-transform group-hover:scale-105" />
          <span class="font-extrabold text-xl tracking-wider" style="color: #d4af37;">
            LADHA <span class="calligraphic-accent text-slate-400 font-normal">Ledger</span>
          </span>
        </router-link>
        <h1 class="auth-title text-2xl font-extrabold tracking-tight m-0">Operator Onboarding</h1>
        <p class="auth-subtitle text-xs mt-1">Enroll as a Sovereign Commerce & Ledger Administrator</p>
      </div>

      <!-- Register Form -->
      <a-form
        :model="formState"
        layout="vertical"
        class="auth-form"
        @finish="handleRegister"
      >
        <a-form-item
          label="Full Legal Name"
          name="name"
          :rules="[{ required: true, message: 'Please input full name.' }]"
        >
          <a-input 
            v-model:value="formState.name" 
            placeholder="e.g. Kevin Ochieng" 
            size="large"
            class="h-11 text-sm"
          >
            <template #prefix><UserOutlined class="text-slate-400 mr-1" /></template>
          </a-input>
        </a-form-item>

        <a-form-item
          label="Corporate / Official Email"
          name="email"
          :rules="[{ required: true, message: 'Please enter corporate email.' }, { type: 'email', message: 'Enter a valid email address.' }]"
        >
          <a-input 
            v-model:value="formState.email" 
            placeholder="e.g. kevin@ladha.ke" 
            size="large"
            class="h-11 font-mono text-sm"
          >
            <template #prefix><MailOutlined class="text-slate-400 mr-1" /></template>
          </a-input>
        </a-form-item>

        <a-row :gutter="16">
          <a-col :xs="24" :sm="12">
            <a-form-item
              label="Security Key"
              name="password"
              :rules="[{ required: true, message: 'Password required.' }, { min: 6, message: 'Minimum 6 chars.' }]"
              has-feedback
            >
              <a-input-password 
                v-model:value="formState.password" 
                placeholder="••••••••" 
                size="large"
                class="h-11 font-mono text-sm"
              >
                <template #prefix><LockOutlined class="text-slate-400 mr-1" /></template>
              </a-input-password>
            </a-form-item>
          </a-col>

          <a-col :xs="24" :sm="12">
            <a-form-item
              label="Confirm Key"
              name="confirm"
              :rules="[{ required: true, message: 'Confirm password.' }, { validator: validatePass, trigger: 'change' }]"
              has-feedback
            >
              <a-input-password 
                v-model:value="formState.confirm" 
                placeholder="••••••••" 
                size="large"
                class="h-11 font-mono text-sm"
              >
                <template #prefix><LockOutlined class="text-slate-400 mr-1" /></template>
              </a-input-password>
            </a-form-item>
          </a-col>
        </a-row>

        <a-button 
          type="primary" 
          html-type="submit" 
          :loading="loading" 
          size="large" 
          block 
          class="h-11 font-bold text-sm tracking-wide mt-2"
        >
          {{ loading ? 'Generating Cryptographic Keypair...' : 'Initialize Operator Station' }}
        </a-button>

        <div class="auth-footer-links mt-6 pt-4 border-t text-center text-xs" style="border-color: var(--border-glass);">
          <span style="color: var(--text-muted);">Already enrolled? </span>
          <router-link to="/login" class="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
            Terminal Log In
          </router-link>
          <div class="mt-3">
            <router-link to="/" class="text-[11px] hover:underline" style="color: var(--text-muted);">
              &larr; Return to Archival Narrative Stage
            </router-link>
          </div>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

export default defineComponent({
  name: 'Register',
  components: {
    UserOutlined,
    LockOutlined,
    MailOutlined,
  },
  setup() {
    const router = useRouter();
    const loading = ref(false);

    const formState = reactive({
      name: '',
      email: '',
      password: '',
      confirm: '',
    });

    const validatePass = async (rule, value) => {
      if (!value) {
        return Promise.reject('Please confirm your security key.');
      }
      if (value !== formState.password) {
        return Promise.reject('Security keys do not match.');
      }
      return Promise.resolve();
    };

    const handleRegister = async () => {
      loading.value = true;
      try {
        await new Promise(r => setTimeout(r, 700));
        localStorage.setItem('authToken', 'ladha_operator_session_' + Date.now());
        localStorage.setItem('user', JSON.stringify({
          name: formState.name || 'Station Operator',
          email: formState.email,
          role: 'controller',
          organization: 'Ladha Nairobi'
        }));
        message.success('Operator station provisioned. Welcome to Ladha Ledger.');
        router.push('/dashboard');
      } catch (err) {
        message.error('Registration failed.');
      } finally {
        loading.value = false;
      }
    };

    return {
      formState,
      loading,
      validatePass,
      handleRegister,
    };
  },
});
</script>

<style scoped>
.auth-viewport {
  background: var(--app-bg);
}

.auth-card {
  border-radius: 14px !important;
  box-shadow: var(--card-shadow) !important;
}

.auth-title {
  color: var(--text-primary);
}

.auth-subtitle {
  color: var(--text-muted);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  letter-spacing: 0.04em;
}

.ambient-corner-glow {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 140px;
  height: 140px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%);
  pointer-events: none;
}
</style>
