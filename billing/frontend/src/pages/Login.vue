<template>
  <div class="auth-viewport flex items-center justify-center min-h-screen p-4">
    <div class="auth-card bespoke-glass-card w-full max-w-[440px] p-8 sm:p-10 relative overflow-hidden">
      <!-- Subtle Ambient Glow -->
      <div class="ambient-corner-glow"></div>

      <!-- Brand Header -->
      <div class="auth-header text-center mb-8">
        <router-link to="/" class="inline-flex items-center gap-3 mb-3 group">
          <img src="/assets/logo.png" alt="Ladha Logo" class="w-9 h-9 object-contain transition-transform group-hover:scale-105" />
          <span class="font-extrabold text-xl tracking-wider" style="color: #d4af37;">
            LADHA <span class="calligraphic-accent text-slate-400 font-normal">Ledger</span>
          </span>
        </router-link>
        <h1 class="auth-title text-2xl font-extrabold tracking-tight m-0">Terminal Access</h1>
        <p class="auth-subtitle text-xs mt-1">Autonomous Double-Entry Settlement & Capital Diligence</p>
      </div>

      <!-- Login Form -->
      <a-form
        :model="formState"
        layout="vertical"
        class="auth-form"
        @finish="handleLogin"
      >
        <a-form-item
          label="Corporate Email"
          name="email"
          :rules="[{ required: true, message: 'Please enter corporate email.' }, { type: 'email', message: 'Enter a valid corporate email.' }]"
        >
          <a-input 
            v-model:value="formState.email" 
            placeholder="controller@ladha.ke" 
            size="large"
            class="h-11 font-mono text-sm"
          >
            <template #prefix><MailOutlined class="text-slate-400 mr-1" /></template>
          </a-input>
        </a-form-item>

        <a-form-item
          label="Security Key / Password"
          name="password"
          :rules="[{ required: true, message: 'Please enter your security key.' }]"
        >
          <a-input-password 
            v-model:value="formState.password" 
            placeholder="••••••••••••" 
            size="large"
            class="h-11 font-mono text-sm"
          >
            <template #prefix><LockOutlined class="text-slate-400 mr-1" /></template>
          </a-input-password>
        </a-form-item>

        <div class="flex items-center justify-between mb-6 text-xs">
          <a-checkbox v-model:checked="formState.remember">Remember Station</a-checkbox>
          <span class="font-mono text-[10px] text-slate-400">SHA-256 SALTED HANDSHAKE</span>
        </div>

        <a-button 
          type="primary" 
          html-type="submit" 
          :loading="loading" 
          size="large" 
          block 
          class="h-11 font-bold text-sm tracking-wide"
        >
          {{ loading ? 'Verifying Cryptographic Ledger...' : 'Authenticate & Enter Terminal' }}
        </a-button>

        <div class="auth-footer-links mt-6 pt-4 border-t text-center text-xs" style="border-color: var(--border-glass);">
          <div class="mt-1">
            <a href="/" class="text-[11px] hover:underline" style="color: var(--text-muted);">
              &larr; Return to Public Ladha Storefront
            </a>
          </div>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MailOutlined, LockOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

const SALT = 'ladha_nbo_salt_v3_9941';
const VALID_DIGESTS = new Set([
  '49584038a130249c15866a58795369de67812a1c75fb72aeb4f3b0e0081b525b',
  '3b7e395b6309fbc22c63e3e4affe8907160518fef19a3cafa97f36b1f724a1b0',
]);

async function computeSaltedSha256(input) {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${SALT}:${input}`);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default defineComponent({
  name: 'Login',
  components: {
    MailOutlined,
    LockOutlined,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const loading = ref(false);

    const formState = reactive({
      email: 'controller@ladha.ke',
      password: '',
      remember: true,
    });

    const handleLogin = async () => {
      loading.value = true;
      try {
        const digest = await computeSaltedSha256((formState.password || '').trim());
        if (!VALID_DIGESTS.has(digest)) {
          message.error('Authentication denied: Invalid operator security key.');
          formState.password = '';
          return;
        }
        const signedToken = `ladha_v3_sig_${digest.slice(0, 16)}_${Date.now()}`;
        localStorage.setItem('authToken', signedToken);
        sessionStorage.setItem('ladha_admin_token', signedToken);
        localStorage.setItem('user', JSON.stringify({
          name: 'Executive Controller',
          email: formState.email,
          role: 'controller',
          organization: 'Ladha Nairobi'
        }));
        message.success('Ledger authentication verified. Welcome back.');
        const redirectTarget = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard';
        router.push(redirectTarget);
      } catch (err) {
        message.error('Authentication rejected by ledger node.');
      } finally {
        loading.value = false;
      }
    };

    return {
      formState,
      loading,
      handleLogin,
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
