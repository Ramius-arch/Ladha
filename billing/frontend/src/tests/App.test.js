import { mount } from '@vue/test-utils';
import App from '../../src/App.vue';
import { expect, test, vi } from 'vitest';

vi.mock('vue-router', () => ({
  createRouter: vi.fn(() => ({
    install: vi.fn(),
    afterEach: vi.fn(),
    beforeEach: vi.fn(),
    onError: vi.fn(),
    push: vi.fn(),
    replace: vi.fn(),
  })),
  createWebHistory: vi.fn(),
  useRouter: () => ({
    push: vi.fn(),
  }),
  useRoute: () => ({
    path: '/',
    meta: { layout: true }
  }),
  RouterLink: {
    template: '<a><slot /></a>'
  }
}));

vi.mock('./router', () => ({
  isRouteLoading: false
}));

test('mount component', async () => {
  const wrapper = mount(App, {
    global: {
      mocks: {
        $route: {
          path: '/',
          meta: { layout: true }
        }
      },
      stubs: {
        'a-config-provider': { template: '<div><slot /></div>' },
        'a-layout': { template: '<div><slot /></div>' },
        'a-layout-sider': { template: '<div><slot /></div>' },
        'a-layout-header': { template: '<div><slot /></div>' },
        'a-layout-content': { template: '<div><slot /></div>' },
        'a-layout-footer': { template: '<div><slot /></div>' },
        'a-drawer': { template: '<div><slot /></div>' },
        'a-button': { template: '<button><slot /></button>' },
        'a-tooltip': { template: '<div><slot /></div>' },
        'a-badge': { template: '<div><slot /></div>' },
        'a-avatar': true,
        'a-dropdown': { template: '<div><slot /></div>' },
        'a-menu': { template: '<div><slot /></div>' },
        'a-menu-item': { template: '<div><slot /></div>' },
        'a-menu-divider': true,
        'a-space': { template: '<div><slot /></div>' },
        'router-view': true,
        'router-link': true,
        'menu-outlined': true,
        'bulb-outlined': true,
        'bulb-filled': true,
        'bell-outlined': true,
        'home-outlined': true,
        'dashboard-outlined': true,
        'team-outlined': true,
        'bar-chart-outlined': true,
        'setting-outlined': true,
        'line-chart-outlined': true,
        'file-text-outlined': true,
        'credit-card-outlined': true,
        'question-circle-outlined': true,
      }
    }
  });

  expect(wrapper.exists()).toBe(true);
});
