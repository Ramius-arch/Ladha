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
            :trigger="null"
            collapsible
            class="main-sider"
            :class="{ 'is-collapsed': collapsed }"
            :width="250"
            :collapsedWidth="74"
          >
            <div class="sider-inner">
              <div class="sider-top-bar" :class="{ 'is-collapsed': collapsed }">
                <router-link to="/dashboard" class="logo-container" :title="collapsed ? 'LADHA Ledger - Sales Dashboard' : ''">
                  <div class="sidebar-logo-frame">
                    <img src="/assets/logo.png" alt="LADHA Logo" class="sidebar-logo" />
                  </div>
                  <div v-if="!collapsed" class="logo-text-group">
                    <span class="logo-text">
                      {{ activeTenant.brand.name }} <span class="calligraphic-accent">{{ activeTenant.brand.accent }}</span>
                    </span>
                    <span class="logo-edition font-mono">{{ activeTenant.brand.edition }}</span>
                  </div>
                </router-link>
                <a-tooltip v-if="!collapsed" title="Collapse Sidebar (Ctrl+B)" placement="right">
                  <button
                    type="button"
                    class="sider-collapse-btn"
                    @click.stop.prevent="collapsed = true"
                    aria-label="Collapse Sidebar"
                  >
                    <menu-fold-outlined />
                  </button>
                </a-tooltip>
              </div>

              <div class="sider-nav-scroll">
                <a-menu
                  v-model:selectedKeys="selectedKeys"
                  mode="inline"
                  class="nav-menu"
                  @click="handleMenuClick"
                >
                  <template v-for="item in menuItems" :key="item.key">
                    <a-menu-divider v-if="item.type === 'divider'" />
                    <a-menu-item v-else :key="item.key" :class="{ 'external-link-item': item.href }">
                      <template #icon>
                        <component :is="item.icon" class="sider-nav-icon" />
                      </template>
                      <span class="nav-label">{{ item.label }}</span>
                      <span v-if="item.badge && !collapsed" class="nav-badge-pill font-mono">{{ item.badge }}</span>
                    </a-menu-item>
                  </template>
                </a-menu>
              </div>

              <div class="sider-bottom-bar" :class="{ 'is-collapsed': collapsed }">
                <template v-if="!collapsed">
                  <div class="sider-status-badge">
                    <span class="status-live-dot"></span>
                    <span class="status-badge-label font-mono">AUDITED v2.4</span>
                  </div>
                  <a-tooltip title="Collapse (Ctrl+B)" placement="top">
                    <button
                      type="button"
                      class="sider-bottom-toggle"
                      @click.stop="collapsed = true"
                      aria-label="Collapse Sidebar"
                    >
                      <menu-fold-outlined />
                    </button>
                  </a-tooltip>
                </template>
                <template v-else>
                  <a-tooltip title="Expand (Ctrl+B)" placement="right">
                    <button
                      type="button"
                      class="sider-bottom-toggle centered"
                      @click.stop="collapsed = false"
                      aria-label="Expand Sidebar"
                    >
                      <menu-unfold-outlined />
                    </button>
                  </a-tooltip>
                </template>
              </div>
            </div>
          </a-layout-sider>

          <!-- Mobile Drawer -->
          <a-drawer
            v-if="isMobile"
            v-model:open="drawerVisible"
            placement="left"
            :closable="false"
            width="280"
            class="mobile-nav-drawer"
            :body-style="{ padding: 0 }"
          >
            <div class="drawer-header">
              <router-link to="/dashboard" class="logo-container" @click="drawerVisible = false">
                <div class="sidebar-logo-frame">
                  <img src="/assets/logo.png" alt="LADHA Logo" class="sidebar-logo" />
                </div>
                <div class="logo-text-group">
                  <span class="logo-text">
                    {{ activeTenant.brand.name }} <span class="calligraphic-accent">{{ activeTenant.brand.accent }}</span>
                  </span>
                  <span class="logo-edition font-mono">{{ activeTenant.brand.edition }}</span>
                </div>
              </router-link>
              <button type="button" class="drawer-close-btn" @click="drawerVisible = false" aria-label="Close Navigation">
                ✕
              </button>
            </div>
            
            <div class="drawer-nav-body">
              <a-menu
                v-model:selectedKeys="selectedKeys"
                mode="inline"
                class="nav-menu"
                @click="handleMenuClick"
              >
                <template v-for="item in menuItems" :key="item.key">
                  <a-menu-divider v-if="item.type === 'divider'" />
                  <a-menu-item v-else :key="item.key" :class="{ 'external-link-item': item.href }">
                    <template #icon>
                      <component :is="item.icon" class="sider-nav-icon" />
                    </template>
                    <span class="nav-label">{{ item.label }}</span>
                    <span v-if="item.badge" class="nav-badge-pill font-mono">{{ item.badge }}</span>
                  </a-menu-item>
                </template>
              </a-menu>
            </div>
          </a-drawer>

          <a-layout
            class="main-layout-body"
            :class="{
              'sider-collapsed': collapsed && !isMobile,
              'sider-expanded': !collapsed && !isMobile
            }"
          >
            <a-layout-header :class="['main-header', { 'mobile-header': isMobile }]">
              <div class="header-left">
                <a-tooltip :title="isMobile ? 'Open Navigation' : (collapsed ? 'Expand Sidebar (Ctrl+B)' : 'Collapse Sidebar (Ctrl+B)')">
                  <button 
                    type="button" 
                    @click="toggleSidebar" 
                    class="menu-toggle"
                    :aria-label="collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
                  >
                    <component :is="isMobile ? 'menu-outlined' : (collapsed ? 'menu-unfold-outlined' : 'menu-fold-outlined')" />
                  </button>
                </a-tooltip>
                <h2 class="page-title">{{ isMobile ? 'Ladha Ledger' : currentPageTitle }}</h2>
                <div v-if="!isMobile" class="ambient-pill ml-3">
                  <span class="status-dot"></span>
                  <span>Ledger Active</span>
                </div>
              </div>
              <div class="header-right">
                <a-space :size="isMobile ? 'small' : 'middle'">
                  <!-- Multi-Industry White-Label Benchmark Preset Selector -->
                  <a-dropdown placement="bottomRight" :trigger="['click']">
                    <button type="button" class="preset-pill-trigger font-mono" :title="'Current SaaS Industry: ' + activeTenant.industryName">
                      <span class="preset-pill-dot"></span>
                      <span class="preset-pill-name">{{ activeTenant.brand.name }}</span>
                      <span class="preset-pill-curr">{{ activeTenant.currency.code }}</span>
                      <down-outlined class="text-[9px] opacity-60" />
                    </button>
                    <template #overlay>
                      <a-menu @click="({ key }) => switchPreset(key)" class="preset-dropdown-menu">
                        <div class="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-700/20">
                          SaaS Industry Benchmark
                        </div>
                        <a-menu-item 
                          v-for="p in availablePresets" 
                          :key="p.key" 
                          :class="{ 'font-bold bg-indigo-500/10 text-indigo-400': p.key === currentPresetKey }"
                        >
                          <div class="flex items-center justify-between gap-4 py-1">
                            <div>
                              <div class="text-xs font-bold">{{ p.name }}</div>
                              <div class="text-[10px] text-slate-400">{{ p.industry }}</div>
                            </div>
                            <span class="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-500/15 font-bold">{{ p.currency }}</span>
                          </div>
                        </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>

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
                        {{ activeTenant.brand.name.slice(0, 2) }}
                      </div>
                      <span v-if="!isMobile" class="user-name font-bold text-xs tracking-tight">{{ activeTenant.brand.avatarLabel }}</span>
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
                <span>{{ activeTenant.brand.name }} {{ activeTenant.brand.accent }} &bull; Quixora Solutions</span>
                <span class="footer-tagline">{{ activeTenant.brand.tagline }}</span>
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
import { useTenantConfig } from './services/tenantConfig';
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
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  AccountBookOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined
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
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ShoppingOutlined,
    ShoppingCartOutlined,
    AccountBookOutlined,
    UserOutlined,
    LogoutOutlined,
    DownOutlined,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { activeTenant, currentPresetKey, availablePresets, setPreset } = useTenantConfig();
    const windowWidth = ref(window.innerWidth);
    const savedCollapsed = typeof window !== 'undefined' ? localStorage.getItem('sidebar_collapsed') : null;
    const collapsed = ref(savedCollapsed !== null ? savedCollapsed === 'true' : window.innerWidth < 1280);
    const drawerVisible = ref(false);
    const selectedKeys = ref([route.path.split('/')[1] || 'dashboard']);
    
    const queryTheme = new URLSearchParams(window.location.search).get('theme');
    const initialDark = queryTheme ? (queryTheme !== 'light') : (localStorage.getItem('theme') !== 'light');
    const isDark = ref(initialDark);

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
      { key: 'storefront', label: 'Storefront (Shop)', icon: ShoppingOutlined, href: 'http://localhost:3001/shop', badge: 'LIVE' },
      { key: 'divider-1', type: 'divider' },
      { key: 'dashboard', label: 'Sales Dashboard', icon: DashboardOutlined, path: '/dashboard' },
      { key: 'usage-tracker', label: 'Orders & Drops', icon: ShoppingCartOutlined, path: '/usage-tracker' },
      { key: 'customers', label: 'Nairobi Shoppers', icon: TeamOutlined, path: '/customers' },
      { key: 'reports', label: 'Capital & Diligence', icon: LineChartOutlined, path: '/reports' },
      { key: 'divider-2', type: 'divider' },
      { key: 'payment-processing', label: 'M-Pesa Settlements', icon: CreditCardOutlined, path: '/payment-processing' },
      { key: 'billing-engine', label: 'Double-Entry Ledger', icon: AccountBookOutlined, path: '/billing-engine' },
      { key: 'invoice-generator', label: 'Tax Invoices', icon: FileTextOutlined, path: '/invoice-generator' },
      { key: 'divider-3', type: 'divider' },
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

    watch(collapsed, (val) => {
      try {
        localStorage.setItem('sidebar_collapsed', val ? 'true' : 'false');
      } catch (e) {
        // Safe fallback in restricted environments
      }
    });

    const updateWidth = () => {
      windowWidth.value = window.innerWidth;
    };

    let lenisInstance = null;
    let rafId = null;

    const toggleSidebar = () => {
      if (isMobile.value) {
        drawerVisible.value = true;
      } else {
        collapsed.value = !collapsed.value;
      }
    };

    const handleKeydown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        toggleSidebar();
      }
    };

    onMounted(() => {
      window.addEventListener('resize', updateWidth);
      window.addEventListener('keydown', handleKeydown);
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
      window.removeEventListener('keydown', handleKeydown);
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

    const switchPreset = (key) => {
      setPreset(key);
      message.success(`Switched benchmark preset to ${activeTenant.value.brand.name} (${activeTenant.value.industryName})`);
    };

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
      toggleSidebar,
      isRouteLoading,
      router,
      activeTenant,
      currentPresetKey,
      availablePresets,
      switchPreset,
    };
  },
});
</script>

<style scoped>
/* ==========================================================================
   Main Sider Layout & Ergonomics (Apple Obsidian & Frosted Ceramic Glass)
   ========================================================================== */
.main-sider {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  bottom: 0 !important;
  height: 100vh !important;
  width: 250px !important;
  max-width: 250px !important;
  min-width: 250px !important;
  overflow: hidden !important;
  background: var(--surface-sidebar) !important;
  backdrop-filter: blur(32px) saturate(190%) !important;
  -webkit-backdrop-filter: blur(32px) saturate(190%) !important;
  border-right: 1px solid var(--border-glass) !important;
  box-shadow: 1px 0 16px rgba(15, 23, 42, 0.04);
  z-index: 1000 !important;
  transition: width 0.22s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s ease, border-color 0.2s ease !important;
}

.main-sider.is-collapsed {
  width: 74px !important;
  max-width: 74px !important;
  min-width: 74px !important;
}

.main-layout-body {
  min-height: 100vh;
  display: flex !important;
  flex-direction: column !important;
  transition: margin-left 0.22s cubic-bezier(0.16, 1, 0.3, 1) !important;
  background: var(--bg-deep) !important;
}

.main-layout-body.sider-expanded {
  margin-left: 250px !important;
}

.main-layout-body.sider-collapsed {
  margin-left: 74px !important;
}

@media (max-width: 991px) {
  .main-layout-body {
    margin-left: 0 !important;
  }
}

.main-sider :deep(.ant-layout-sider-children) {
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
}

.sider-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  justify-content: space-between;
}

/* Sider Top Header & Branding */
.sider-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 16px;
  border-bottom: 1px solid var(--border-glass-subtle);
  flex-shrink: 0;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.sider-top-bar.is-collapsed {
  padding: 0;
  justify-content: center;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  min-width: 0;
}

.sidebar-logo-frame {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.22);
  flex-shrink: 0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.logo-container:hover .sidebar-logo-frame {
  transform: scale(1.04);
  box-shadow: 0 0 12px rgba(212, 175, 55, 0.25);
}

.sidebar-logo {
  height: 22px;
  width: auto;
  object-fit: contain;
}

.logo-text-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  line-height: 1.15;
}

.logo-text {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #d4af37;
  white-space: nowrap;
}

.logo-text .calligraphic-accent {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-secondary);
}

.logo-edition {
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  margin-top: 2px;
  white-space: nowrap;
}

.sider-collapse-btn {
  background: var(--surface-hover);
  border: 1px solid var(--border-glass);
  color: var(--text-secondary);
  border-radius: 7px;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.18s ease;
  font-size: 12px;
  flex-shrink: 0;
}

.sider-collapse-btn:hover {
  background: var(--surface-card-hover);
  color: var(--primary-color);
  border-color: var(--primary-color);
  transform: scale(1.05);
}

/* Sider Scrollable Navigation Body */
.sider-nav-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 0;
}

.sider-nav-scroll::-webkit-scrollbar {
  width: 3px;
}
.sider-nav-scroll::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 3px;
}
.sider-nav-scroll:hover::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.25);
}

.nav-menu {
  background: transparent !important;
  border-inline-end: none !important;
}

.nav-menu :deep(.ant-menu-item) {
  height: 40px !important;
  line-height: 40px !important;
  margin: 3px 8px !important;
  width: calc(100% - 16px) !important;
  border-radius: 8px !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  transition: all 0.16s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.nav-menu :deep(.ant-menu-title-content) {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  width: calc(100% - 26px) !important;
}

.nav-menu :deep(.ant-menu-item .sider-nav-icon),
.nav-menu :deep(.ant-menu-item .anticon) {
  font-size: 16px !important;
  min-width: 16px !important;
  transition: transform 0.16s ease, color 0.16s ease !important;
}

.nav-menu :deep(.ant-menu-item:hover .anticon) {
  transform: scale(1.08);
}

.nav-label {
  letter-spacing: -0.01em;
}

.nav-badge-pill {
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(16, 185, 129, 0.14);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.30);
  line-height: 1.4;
}

/* Collapsed Icon-Rail State */
.main-sider :deep(.ant-menu-inline-collapsed) {
  width: 100% !important;
}

.main-sider :deep(.ant-menu-inline-collapsed .ant-menu-item) {
  width: 44px !important;
  height: 44px !important;
  line-height: 44px !important;
  margin: 5px auto !important;
  border-radius: 9px !important;
}

.main-sider :deep(.ant-menu-inline-collapsed .ant-menu-item .anticon) {
  font-size: 17px !important;
  line-height: 44px !important;
}

/* Sider Bottom Bar / Footer */
.sider-bottom-bar {
  height: 48px;
  border-top: 1px solid var(--border-glass-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  flex-shrink: 0;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.sider-bottom-bar.is-collapsed {
  padding: 0;
  justify-content: center;
}

.sider-status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.6);
  animation: pulse-dot 2.4s infinite;
}

.status-badge-label {
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.sider-bottom-toggle {
  background: var(--surface-hover);
  border: 1px solid var(--border-glass);
  color: var(--text-secondary);
  border-radius: 7px;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.18s ease;
  font-size: 12px;
}

.sider-bottom-toggle.centered {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  font-size: 14px;
}

.sider-bottom-toggle:hover {
  background: var(--surface-card-hover);
  color: var(--primary-color);
  border-color: var(--primary-color);
  transform: scale(1.05);
}

/* Light Mode Aesthetic (Frosted Ceramic Glass) */
[data-theme='light'] .main-sider {
  background: rgba(248, 250, 252, 0.94) !important;
  border-right: 1px solid rgba(226, 232, 240, 0.90) !important;
  box-shadow: 1px 0 12px rgba(15, 23, 42, 0.03) !important;
}

[data-theme='light'] .nav-menu :deep(.ant-menu-item:not(.ant-menu-item-selected)) {
  color: #475569 !important;
}

[data-theme='light'] .nav-menu :deep(.ant-menu-item:not(.ant-menu-item-selected) .anticon) {
  color: #64748b !important;
}

[data-theme='light'] .nav-menu :deep(.ant-menu-item:not(.ant-menu-item-selected):hover) {
  background: rgba(15, 23, 42, 0.04) !important;
  color: #0f172a !important;
}

[data-theme='light'] .nav-menu :deep(.ant-menu-item:not(.ant-menu-item-selected):hover .anticon) {
  color: #4f46e5 !important;
}

[data-theme='light'] .nav-menu :deep(.ant-menu-item-selected) {
  background: #ffffff !important;
  color: #4338ca !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
  border: 1px solid rgba(203, 213, 225, 0.90) !important;
  box-shadow: 0 2px 6px -1px rgba(15, 23, 42, 0.06), inset 0 1px 0 #ffffff !important;
}

[data-theme='light'] .nav-menu :deep(.ant-menu-item-selected .anticon) {
  color: #4338ca !important;
}

[data-theme='light'] .nav-menu :deep(.ant-menu-item-divider) {
  border-color: rgba(226, 232, 240, 0.90) !important;
}

/* Dark Mode Aesthetic (Apple Obsidian Glass) */
[data-theme='dark'] .main-sider {
  background: rgba(7, 12, 24, 0.95) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: 2px 0 24px rgba(0, 0, 0, 0.40) !important;
}

[data-theme='dark'] .nav-menu :deep(.ant-menu-item:not(.ant-menu-item-selected)) {
  color: rgba(255, 255, 255, 0.65) !important;
}

[data-theme='dark'] .nav-menu :deep(.ant-menu-item:not(.ant-menu-item-selected) .anticon) {
  color: rgba(255, 255, 255, 0.55) !important;
}

[data-theme='dark'] .nav-menu :deep(.ant-menu-item:not(.ant-menu-item-selected):hover) {
  background: rgba(255, 255, 255, 0.06) !important;
  color: #ffffff !important;
}

[data-theme='dark'] .nav-menu :deep(.ant-menu-item:not(.ant-menu-item-selected):hover .anticon) {
  color: #a5b4fc !important;
}

[data-theme='dark'] .nav-menu :deep(.ant-menu-item-selected) {
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.22) 0%, rgba(99, 102, 241, 0.06) 100%) !important;
  color: #ffffff !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
  border: 1px solid rgba(129, 140, 248, 0.32) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 3px 12px rgba(99, 102, 241, 0.22) !important;
}

[data-theme='dark'] .nav-menu :deep(.ant-menu-item-selected .anticon) {
  color: #a5b4fc !important;
}

[data-theme='dark'] .nav-menu :deep(.ant-menu-item-divider) {
  border-color: rgba(255, 255, 255, 0.08) !important;
}

/* Header & Mobile Drawer Styles */
.main-header {
  position: sticky;
  top: 0;
  z-index: 99;
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
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  color: var(--text-primary);
  background: var(--surface-hover);
  border: 1px solid var(--border-glass);
  cursor: pointer;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

.menu-toggle:hover {
  background: var(--surface-card-hover);
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-1px);
}

.page-title {
  margin: 0;
  font-size: 17px;
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
  font-size: 13px;
  color: var(--text-primary);
}

.drawer-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid var(--border-glass-subtle);
}

.drawer-close-btn {
  background: var(--surface-hover);
  border: 1px solid var(--border-glass);
  color: var(--text-secondary);
  border-radius: 7px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
}

.drawer-nav-body {
  padding: 10px 0;
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

.preset-pill-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 9999px;
  background: var(--surface-hover);
  border: 1px solid var(--border-glass);
  font-size: 11px;
  font-weight: 700;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

.preset-pill-trigger:hover {
  background: var(--surface-card-hover);
  border-color: var(--primary-color);
  transform: translateY(-1px);
}

.preset-pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.5);
}

.preset-pill-name {
  letter-spacing: 0.04em;
}

.preset-pill-curr {
  font-size: 9px;
  opacity: 0.65;
  background: rgba(148, 163, 184, 0.15);
  padding: 1px 4px;
  border-radius: 4px;
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

@keyframes pulse-dot {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.85);
  }
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