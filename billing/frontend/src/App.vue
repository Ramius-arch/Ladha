<template>
  <div class="app-root">
    <!-- Global route loading indicator -->
    <div
      v-if="isRouteLoading"
      class="fixed top-0 left-0 right-0 h-1 bg-primary-500 z-[100]"
    >
      <div class="h-full bg-primary-300 animate-pulse" />
    </div>

    <a-config-provider :theme="themeConfig">
      <template v-if="$route.meta.layout === false">
        <router-view />
      </template>
      <template v-else>
        <a-layout style="min-height: 100vh;">
          <!-- Desktop Sider -->
          <a-layout-sider
            v-if="!isMobile"
            v-model:collapsed="collapsed"
            collapsible
            class="main-sider"
            width="260"
            :collapsedWidth="80"
          >
            <router-link to="/dashboard" class="logo-container">
              <img src="/assets/logo.png" alt="Quixora Logo" class="sidebar-logo" />
              <span v-if="!collapsed" class="logo-text" style="font-weight: 800; letter-spacing: 0.08em; color: #d4af37;">
                LADHA <span class="calligraphic-accent" style="font-size: 15px; font-weight: 600; color: #94a3b8;">Ledger</span>
              </span>
            </router-link>
            
            <a-menu
              v-model:selectedKeys="selectedKeys"
              mode="inline"
              class="nav-menu"
              @click="handleMenuClick"
            >
              <template v-for="item in menuItems" :key="item.key">
                <a-menu-divider v-if="item.type === 'divider'" />
                <a-menu-item v-else :key="item.key">
                  <template #icon>
                    <component :is="item.icon" />
                  </template>
                  {{ item.label }}
                </a-menu-item>
              </template>
            </a-menu>
          </a-layout-sider>

          <!-- Mobile Drawer -->
          <a-drawer
            v-if="isMobile"
            v-model:open="drawerVisible"
            placement="left"
            :closable="false"
            width="280"
            :body-style="{ padding: 0 }"
          >
            <div class="drawer-header">
              <router-link to="/dashboard" class="logo-container" @click="drawerVisible = false">
                <img src="/assets/logo.png" alt="Quixora Logo" class="sidebar-logo" />
                <span class="logo-text" style="font-weight: 800; letter-spacing: 0.08em; color: #d4af37;">LADHA</span>
              </router-link>
            </div>
            
            <a-menu
              v-model:selectedKeys="selectedKeys"
              mode="inline"
              class="nav-menu"
              @click="handleMenuClick"
            >
              <template v-for="item in menuItems" :key="item.key">
                <a-menu-divider v-if="item.type === 'divider'" />
                <a-menu-item v-else :key="item.key">
                  <template #icon>
                    <component :is="item.icon" />
                  </template>
                  {{ item.label }}
                </a-menu-item>
              </template>
            </a-menu>
          </a-drawer>

          <a-layout>
            <a-layout-header :class="['main-header', { 'mobile-header': isMobile }]">
              <div class="header-left">
                <a-button 
                  v-if="isMobile" 
                  type="text" 
                  @click="drawerVisible = true" 
                  class="menu-toggle"
                >
                  <menu-outlined />
                </a-button>
                <h2 class="page-title">{{ isMobile ? 'Ladha Ledger' : currentPageTitle }}</h2>
                <div v-if="!isMobile" class="ambient-pill ml-3">
                  <span class="status-dot"></span>
                  <span>Ledger Active</span>
                </div>
              </div>
              <div class="header-right">
                <a-space :size="isMobile ? 'small' : 'middle'">
                  <a-tooltip :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
                    <div class="theme-toggle" @click="toggleTheme">
                      <component :is="isDark ? 'bulb-filled' : 'bulb-outlined'" class="header-icon" />
                    </div>
                  </a-tooltip>
                  
                  <a-badge dot v-if="!isMobile">
                    <bell-outlined class="header-icon" @click="router.push('/notifications')" />
                  </a-badge>

                  <a-dropdown placement="bottomRight">
                    <div class="user-profile cursor-pointer flex items-center gap-2">
                      <div class="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-indigo-600 flex items-center justify-center text-[10px] font-extrabold text-white shadow-sm ring-1 ring-white/20">
                        LD
                      </div>
                      <span v-if="!isMobile" class="user-name font-bold text-xs tracking-tight">Controller</span>
                    </div>
                    <template #overlay>
                      <a-menu @click="handleUserMenuClick">
                        <a-menu-item key="profile">
                          <user-outlined /> Executive Profile
                        </a-menu-item>
                        <a-menu-item key="help">
                          <question-circle-outlined /> Knowledge Base
                        </a-menu-item>
                        <a-menu-divider />
                        <a-menu-item key="logout" class="text-rose-500 font-bold">
                          <logout-outlined /> Secure Logout
                        </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
                </a-space>
              </div>
            </a-layout-header>

            <a-layout-content :style="{ marginTop: isMobile ? '64px' : '0' }">
              <router-view class="page-container" />
            </a-layout-content>

            <a-layout-footer class="main-footer">
              <div class="footer-content">
                <span>LADHA Ledger v2.4 &bull; Quixora Solutions</span>
                <span class="footer-tagline">1-of-1 Archival Streetwear. Instant M-Pesa Audited Settlements & KRA eTIMS.</span>
              </div>
            </a-layout-footer>
          </a-layout>
        </a-layout>
      </template>
    </a-config-provider>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { isRouteLoading } from './router';
import { theme, message } from 'ant-design-vue';
import Lenis from 'lenis';
import {
  HomeOutlined,
  DashboardOutlined,
  TeamOutlined,
  BarChartOutlined,
  SettingOutlined,
  LineChartOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  QuestionCircleOutlined,
  BellOutlined,
  BulbOutlined,
  BulbFilled,
  MenuOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  AccountBookOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue';

export default defineComponent({
  name: 'App',
  components: {
    HomeOutlined,
    DashboardOutlined,
    TeamOutlined,
    BarChartOutlined,
    SettingOutlined,
    LineChartOutlined,
    FileTextOutlined,
    CreditCardOutlined,
    QuestionCircleOutlined,
    BellOutlined,
    BulbOutlined,
    BulbFilled,
    MenuOutlined,
    ShoppingOutlined,
    ShoppingCartOutlined,
    AccountBookOutlined,
    UserOutlined,
    LogoutOutlined,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const windowWidth = ref(window.innerWidth);
    const collapsed = ref(true);
    const drawerVisible = ref(false);
    const selectedKeys = ref([route.path.split('/')[1] || 'dashboard']);
    
    const isDark = ref(localStorage.getItem('theme') !== 'light');

    const themeConfig = computed(() => ({
      algorithm: isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
      token: {
        colorPrimary: isDark.value ? '#d4af37' : '#b8860b',
        colorBgBase: isDark.value ? '#070c18' : '#ffffff',
        colorTextBase: isDark.value ? '#f8fafc' : '#0f172a',
        borderRadius: 8,
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      },
    }));

    const menuItems = [
      { key: 'storefront', label: 'Ladha Storefront (Live)', icon: ShoppingOutlined, href: 'http://localhost:3001/shop' },
      { key: 'divider-1', type: 'divider' },
      { key: 'dashboard', label: 'Sales Dashboard', icon: DashboardOutlined, path: '/dashboard' },
      { key: 'usage-tracker', label: 'Orders & Drops', icon: ShoppingCartOutlined, path: '/usage-tracker' },
      { key: 'customers', label: 'Nairobi Shoppers', icon: TeamOutlined, path: '/customers' },
      { key: 'reports', label: 'Capital & Diligence', icon: LineChartOutlined, path: '/reports' },
      { key: 'payment-processing', label: 'M-Pesa Settlements', icon: CreditCardOutlined, path: '/payment-processing' },
      { key: 'billing-engine', label: 'Double-Entry Ledger', icon: AccountBookOutlined, path: '/billing-engine' },
      { key: 'invoice-generator', label: 'Tax Invoices', icon: FileTextOutlined, path: '/invoice-generator' },
      { key: 'divider-2', type: 'divider' },
      { key: 'settings', label: 'System Settings', icon: SettingOutlined, path: '/settings' },
    ];

    const handleMenuClick = ({ key }) => {
      const item = menuItems.find(i => i.key === key);
      if (item) {
        if (item.href) {
          window.open(item.href, '_blank');
        } else if (item.path) {
          if (route.path !== item.path) {
            router.push(item.path).catch(err => {
              if (err && err.name !== 'NavigationDuplicated') {
                console.warn('Navigation note:', err);
              }
            });
          }
        }
      }
      drawerVisible.value = false;
    };

    const handleUserMenuClick = ({ key }) => {
      if (key === 'profile') {
        router.push('/profile');
      } else if (key === 'help') {
        router.push('/help');
      } else if (key === 'logout') {
        localStorage.removeItem('authToken');
        message.success('Session terminated securely. Returning to login.');
        router.push('/login');
      }
    };

    const toggleTheme = () => {
      isDark.value = !isDark.value;
      const themeName = isDark.value ? 'dark' : 'light';
      localStorage.setItem('theme', themeName);
      updateThemeAttribute();
    };

    const updateThemeAttribute = () => {
      const themeName = isDark.value ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', themeName);
      if (document.body) {
        document.body.setAttribute('data-theme', themeName);
      }
    };

    watch(isDark, () => {
      updateThemeAttribute();
    }, { immediate: true });

    const updateWidth = () => {
      windowWidth.value = window.innerWidth;
    };

    let lenisInstance = null;
    let rafId = null;

    onMounted(() => {
      window.addEventListener('resize', updateWidth);
      updateThemeAttribute();

      // Apple Inertial Momentum Smooth Scroll Engine
      try {
        lenisInstance = new Lenis({
          duration: 1.15,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple exponential velocity deceleration
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1.0,
          touchMultiplier: 1.5,
          infinite: false
        });

        const raf = (time) => {
          if (lenisInstance) {
            lenisInstance.raf(time);
            rafId = requestAnimationFrame(raf);
          }
        };

        rafId = requestAnimationFrame(raf);
      } catch (err) {
        console.warn('Lenis smooth scroll skipped:', err);
      }
    });

    onUnmounted(() => {
      window.removeEventListener('resize', updateWidth);
      if (rafId) cancelAnimationFrame(rafId);
      if (lenisInstance) {
        lenisInstance.destroy();
        lenisInstance = null;
      }
    });

    const isMobile = computed(() => windowWidth.value < 992); // Standard desktop breakpoint

    const currentPageTitle = computed(() => {
      const path = route.path;
      const key = path.split('/')[1] || 'dashboard';
      const item = menuItems.find(i => i.key === key || i.path === path);
      if (item) return item.label;
      if (path === '/profile') return 'Profile Settings';
      if (path === '/notifications') return 'Notifications';
      if (path === '/help-center') return 'Help Center';
      return 'Ladha Ledger';
    });

    watch(() => route.path, (newPath) => {
      selectedKeys.value = [newPath.split('/')[1] || 'dashboard'];
      if (lenisInstance) {
        lenisInstance.scrollTo(0, { immediate: true });
      }
    });

    return {
      collapsed,
      drawerVisible,
      selectedKeys,
      menuItems,
      handleMenuClick,
      handleUserMenuClick,
      currentPageTitle,
      isMobile,
      isDark,
      themeConfig,
      toggleTheme,
      isRouteLoading,
      router,
    };
  },
});
</script>

<style scoped>
.main-sider {
  background: var(--surface-sidebar) !important;
  backdrop-filter: blur(32px) saturate(190%) !important;
  -webkit-backdrop-filter: blur(32px) saturate(190%) !important;
  box-shadow: 1px 0 16px rgba(15, 23, 42, 0.03);
}

.logo-container {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  margin-bottom: 8px;
}

.sidebar-logo {
  height: 32px;
  width: auto;
  object-fit: contain;
}

.logo-text {
  margin-left: 12px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: var(--text-primary);
}

.main-header {
  justify-content: space-between;
  background: var(--surface-header);
  backdrop-filter: blur(28px) saturate(190%) !important;
  -webkit-backdrop-filter: blur(28px) saturate(190%) !important;
  padding: 0 24px;
  border-bottom: 1px solid var(--border-glass);
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.02);
  transition: background 0.2s ease, border-color 0.2s ease;
}

.mobile-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 0 16px !important;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.menu-toggle {
  font-size: 20px;
  padding: 4px;
  height: auto;
}

.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.02em;
}

.header-icon {
  font-size: 20px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition-fast);
}

.header-icon:hover {
  color: var(--primary-color);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: var(--transition-fast);
}

.user-profile:hover {
  background: var(--surface-hover);
}

.user-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary);
}

.main-footer {
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
  border-top: 1px solid var(--border-glass);
  background: var(--surface-header);
  padding: 16px 24px;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.footer-tagline {
  font-size: 12px;
  color: #64748b;
  letter-spacing: 0.02em;
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: var(--transition-fast);
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.06);
}

.nav-menu :deep(.ant-menu-item-selected) {
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.25) 0%, rgba(99, 102, 241, 0.05) 100%) !important;
  color: #818cf8 !important;
  font-weight: 600 !important;
  border-left: 3px solid #818cf8 !important;
}

[data-theme='light'] .nav-menu :deep(.ant-menu-item-selected) {
  background: rgba(255, 255, 255, 0.94) !important;
  color: #4338ca !important;
  font-weight: 700 !important;
  border-left: 3.5px solid #4338ca !important;
  box-shadow: inset 0 1px 1px 0 #ffffff, 0 3px 10px -2px rgba(67, 56, 202, 0.12) !important;
}

[data-theme='dark'] .nav-menu :deep(.ant-menu-item-selected) {
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.24) 0%, rgba(99, 102, 241, 0.05) 100%) !important;
  color: #ffffff !important;
  font-weight: 700 !important;
  border-left: 3.5px solid #818cf8 !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 2px 10px rgba(99, 102, 241, 0.25) !important;
  border-radius: 8px !important;
}

[data-theme='dark'] .nav-menu :deep(.ant-menu-title-content a) {
  color: rgba(255, 255, 255, 0.9);
}

[data-theme='dark'] .nav-menu :deep(.ant-menu-item-selected .ant-menu-title-content a) {
  color: #ffffff;
}

@media (max-width: 480px) {
  .page-title {
    font-size: 15px;
    max-width: 140px;
  }

  .header-icon {
    font-size: 18px;
  }

  .user-profile {
    gap: 4px;
    padding: 2px 4px;
  }

  .main-footer {
    font-size: 11px;
    padding: 12px;
  }

  .header-right :deep(.ant-space) {
    gap: 4px !important;
  }
}
</style>