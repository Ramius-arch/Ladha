import { mount } from '@vue/test-utils';
import Customers from '../../src/pages/Customers.vue';
import { expect, test, vi } from 'vitest';
import api from '../../src/services/api';

vi.mock('../../src/services/api', () => ({
  default: {
    getCustomers: vi.fn(() => Promise.resolve({
      data: {
        customers: [
          { id: 1, name: 'John Doe', email: 'john@example.com', phone_number: '111-222-3333', status: 'active' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone_number: '444-555-6666', status: 'inactive' },
        ],
        totalItems: 2
      }
    })),
    getPlans: vi.fn(() => Promise.resolve({ data: [] })),
    addCustomer: vi.fn(),
    updateCustomer: vi.fn(),
    deleteCustomer: vi.fn(),
  }
}));

vi.mock('vue-router', () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
  useRoute: () => ({
    query: {},
    path: '/customers'
  }),
}));

test('renders customers table correctly', async () => {
  const wrapper = mount(Customers, {
    global: {
      stubs: {
        'a-input-search': true,
        'a-button': true,
        'a-table': {
           props: ['dataSource'],
           template: '<div><div v-for="item in dataSource" :key="item.id">{{ item.name }}</div></div>'
        },
        'a-card': { template: '<div><slot /></div>' },
        'a-tag': true,
        'a-modal': true,
        'a-form': true,
        'a-form-item': true,
        'a-input': true,
        'a-textarea': true,
        'a-select': true,
        'a-select-option': true,
        'a-row': true,
        'a-col': true,
        'a-space': true,
        'a-tooltip': true,
        'a-popconfirm': true,
      }
    }
  });

  await wrapper.vm.$nextTick();
  await wrapper.vm.$nextTick(); // Wait for fetchCustomers

  expect(wrapper.html()).toContain('John Doe');
  expect(wrapper.html()).toContain('Jane Smith');
});
