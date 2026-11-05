import { createRouter, createWebHistory } from 'vue-router';
import { ref } from 'vue';

export const isRouteLoading = ref(false);

const routes = [
  // Cinematic Landing Page Route
  {
    path: '/',
    name: 'Landing',
    component: () => import('./pages/LandingPage.vue'),
    meta: {
      title: 'Qx Billing | Autonomous Revenue Engine',
      layout: false,
    },
  },

  // Login Route
  {
    path: '/login',
    name: 'Login',
    component: () => import('./pages/Login.vue'),
    meta: {
      title: 'Login',
      layout: false, // No layout for login page
    },
  },
  // Register Route
  {
    path: '/register',
    name: 'Register',
    component: () => import('./pages/Register.vue'),
    meta: {
      title: 'Register',
      layout: false, // No layout for register page
    },
  },

  // Loading / System Bootstrap Route
  {
    path: '/loading',
    name: 'Loading',
    component: () => import('./pages/LoadingPage.vue'),
    meta: {
      title: 'Initializing Ledger Kernel',
      layout: false, // Fullscreen cinematic boot
    },
  },

  // Dashboard route
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('./pages/Dashboard.vue'),
    meta: {
      title: 'Dashboard',
      layout: true,
      breadcrumb: 'Dashboard'
    },
  },

  // Customers route
  {
    path: '/customers',
    name: 'Customers',
    component: () => import('./pages/Customers.vue'),
    meta: {
      title: 'Customers',
      layout: true,
      breadcrumb: 'Customers'
    },
  },

  // Usage Tracker route
  {
    path: '/usage-tracker',
    name: 'UsageTracker',
    component: () => import('./pages/UsageTracker.vue'),
    meta: {
      title: 'Usage Tracker',
      layout: true,
      breadcrumb: 'Usage Tracker'
    },
  },

  // Billing Engine route
  {
    path: '/billing-engine',
    name: 'BillingEngine',
    component: () => import('./pages/BillingEngine.vue'),
    meta: {
      title: 'Billing Engine',
      layout: true,
      breadcrumb: 'Billing Engine'
    },
  },

  // Reports route
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('./pages/ReportsAnalytics.vue'),
    meta: {
      title: 'Reports and Analytics',
      layout: true,
      breadcrumb: 'Reports'
    },
  },

  // Invoice Generator route
  {
    path: '/invoice-generator',
    name: 'InvoiceGenerator',
    component: () => import('./pages/InvoiceGenerator.vue'),
    meta: {
      title: 'Invoice Generator',
      layout: true,
      breadcrumb: 'Invoice Generator'
    },
  },

  // Payment Processing route
  {
    path: '/payment-processing',
    name: 'PaymentProcessing',
    component: () => import('./pages/PaymentProcessing.vue'),
    meta: {
      title: 'Payment Processing',
      layout: true,
      breadcrumb: 'Payment Processing'
    },
  },
  // Help Center route
  {
    path: '/help-center',
    name: 'HelpCenter',
    component: () => import('./pages/HelpCenter.vue'),
    meta: {
      title: 'Help Center',
      layout: true,
      breadcrumb: 'Help Center'
    },
  },
  // Profile Settings route
  {
    path: '/profile',
    name: 'ProfileSettings',
    component: () => import('./pages/ProfileSettings.vue'),
    meta: {
      title: 'Profile Settings',
      layout: true,
      breadcrumb: 'Profile Settings'
    },
  },
  // Notifications route
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('./pages/Notifications.vue'),
    meta: {
      title: 'Notifications',
      layout: true,
      breadcrumb: 'Notifications'
    },
  },
  // System Settings route
  {
    path: '/settings',
    name: 'SystemSettings',
    component: () => import('./pages/SystemSettings.vue'),
    meta: {
      title: 'System Settings',
      layout: true,
      breadcrumb: 'System Settings'
    },
  },
  // Invoice Detail route
  {
    path: '/invoices/:id',
    name: 'InvoiceDetail',
    component: () => import('./pages/InvoiceDetail.vue'),
    meta: {
      title: 'Invoice Details',
      layout: true,
      breadcrumb: (route) => `Invoice #${route.params.id}`,
      parent: '/invoice-generator'
    },
  },
  // Offline page
  {
    path: '/offline',
    name: 'Offline',
    component: () => import('./pages/Offline.vue'),
    meta: { title: 'Offline', layout: true }
  },
  // 404 Route
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('./pages/NotFound.vue'),
    meta: {
      title: 'Page Not Found',
      layout: true,
    },
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition && to.meta.preserveScroll !== false) {
      return savedPosition;
    }
    if (to.hash) {
      return { el: to.hash, top: 80, behavior: 'smooth' };
    }
    if (to.meta.scrollToTop !== false) {
      return { top: 0, left: 0 };
    }
    return false;
  }
});

router.beforeEach((to, from, next) => {
  isRouteLoading.value = true;
  document.title = to.meta.title ? `${to.meta.title} | Ladha Ledger` : 'Ladha Ledger | Archival Commerce Financial Hub';
  next();
});

router.afterEach(() => {
  isRouteLoading.value = false;
});

router.onError((error) => {
  isRouteLoading.value = false;
  console.error('Router error:', error);
  if (error.message && error.message.includes('Failed to fetch dynamically imported module')) {
    router.push('/offline');
  }
});

export default router;
