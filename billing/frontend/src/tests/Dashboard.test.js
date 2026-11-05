import { mount } from '@vue/test-utils';
import Dashboard from '../../src/pages/Dashboard.vue';
import { expect, test, vi } from 'vitest';
import api from '../../src/services/api';

vi.mock('../../src/services/api', () => ({
  default: {
    getDashboardData: vi.fn(() => Promise.resolve({
      data: {
        totalRevenue: 123456,
        activeCustomers: 123,
        averageOrderValue: 456,
        ordersFulfilled: 789,
        recentTransactions: [
          { id: 1, description: 'Transaction 1', date: '2023-01-01', status: 'Completed', amount: 1500 },
          { id: 2, description: 'Transaction 2', date: '2023-01-02', status: 'Pending', amount: 2500 },
        ],
      },
    })),
  },
}));

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useRoute: () => ({
    path: '/',
    query: {},
  }),
}));

test('renders dashboard data correctly', async () => {
  const wrapper = mount(Dashboard, {
    global: {
      stubs: {
        'animated-number': {
          props: ['value', 'suffix'],
          template: '<span class="test-animated-num">{{ Number(value).toLocaleString() }}{{ suffix || "" }}</span>'
        },
        'Bar': true,
        'Pie': true,
        'a-spin': { template: '<div><slot /></div>' },
        'a-card': { template: '<div><slot /></div>' },
        'a-row': { template: '<div><slot /></div>' },
        'a-col': { template: '<div><slot /></div>' },
        'a-tag': { template: '<span><slot /></span>' },
        'a-avatar': true,
        'a-button': true,
        'router-link': true,
      }
    }
  });

  // Wait for the async operation to complete
  await wrapper.vm.$nextTick();
  await new Promise(resolve => setTimeout(resolve, 100));

  expect(wrapper.text()).toContain('Financial Intelligence Hub');
  expect(wrapper.html()).toContain('123,456');
  expect(wrapper.html()).toContain('123');
  expect(wrapper.html()).toContain('456');
  expect(wrapper.html()).toContain('789');
  expect(wrapper.html()).toContain('Transaction 1');
  expect(wrapper.html()).toContain('Transaction 2');
});
