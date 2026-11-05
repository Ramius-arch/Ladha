<template>
  <div class="page-inner max-w-[1300px] mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
      <a-input-search
        v-model:value="searchQuery"
        placeholder="Search by name, email, or phone..."
        class="w-full sm:w-80"
        @search="fetchCustomers"
        allow-clear
      />
      <a-button type="primary" @click="showAddModal" class="h-10 px-5 font-semibold">
        <template #icon><plus-outlined /></template>
        Add Customer
      </a-button>
    </div>

    <a-card :bordered="false" class="bespoke-card shadow-sm rounded-xl">
      <a-table
        :columns="columns"
        :data-source="customers"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        row-key="id"
        :scroll="{ x: 'max-content' }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'plan'">
            <span class="badge-micro text-indigo-500 dark:text-indigo-400 font-mono font-bold">
              {{ record.Plan ? record.Plan.name : 'VIP RETAIL' }}
            </span>
          </template>
          <template v-else-if="column.key === 'status'">
            <span 
              class="badge-micro font-bold" 
              :class="record.status === 'active' ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : 'text-amber-600 dark:text-amber-400 border-amber-500/30'"
            >
              {{ (record.status || 'ACTIVE').toUpperCase() }}
            </span>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space size="middle">
              <a-tooltip title="Edit Customer">
                <a-button type="text" @click="editCustomer(record)">
                  <template #icon><edit-outlined /></template>
                </a-button>
              </a-tooltip>
              <a-popconfirm
                title="Are you sure you want to delete this customer?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="handleDelete(record.id)"
              >
                <a-tooltip title="Delete Customer">
                  <a-button type="text" danger>
                    <template #icon><delete-outlined /></template>
                  </a-button>
                </a-tooltip>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Add/Edit Customer Modal -->
    <a-modal
      v-model:open="modalVisible"
      :title="isEditing ? 'Modify Customer Profile' : 'Register New Customer'"
      @ok="handleModalOk"
      :confirm-loading="modalConfirmLoading"
      destroyOnClose
      :maskClosable="false"
      :width="isMobile ? '100%' : '600px'"
    >
      <div class="modal-form-container">
        <a-form :model="formState" layout="vertical" ref="formRef" @finish="handleModalOk">
          <a-form-item
            label="Full Name"
            name="name"
            :rules="[{ required: true, message: 'Please input shopper full name.' }]"
          >
            <a-input v-model:value="formState.name" placeholder="e.g. Kevin Ochieng" />
          </a-form-item>
        
        <a-row :gutter="16">
          <a-col :xs="24" :sm="12">
            <a-form-item
              label="Phone Number (Safaricom M-Pesa)"
              name="phone_number"
              :rules="[{ required: true, message: 'Please input M-Pesa phone number.' }]"
            >
              <a-input v-model:value="formState.phone_number" placeholder="+254 712 345 678" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item
              label="Email Address"
              name="email"
              :rules="[{ type: 'email', message: 'Please enter a valid email!' }]"
            >
              <a-input v-model:value="formState.email" placeholder="kevin.ochieng@ladha.ke" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item
          label="Nairobi Delivery Address & Zone"
          name="address"
          :rules="[{ required: true, message: 'Please input delivery address.' }]"
        >
          <a-textarea v-model:value="formState.address" :rows="3" placeholder="e.g. Apartment 4B, The Westwood, Westlands, Nairobi" />
        </a-form-item>

        <a-row :gutter="16">
          <a-col :xs="24" :sm="12">
            <a-form-item
              label="Shopper Tier / Classification"
              name="planId"
              :rules="[{ required: true, message: 'Please select client tier.' }]"
            >
              <a-select v-model:value="formState.planId" placeholder="Select VIP Client Tier">
                <a-select-option v-for="plan in plans" :key="plan.id" :value="plan.id">
                  {{ plan.name }} {{ plan.price ? `(KSh ${plan.price})` : '' }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="Account Status" name="status">
              <a-select v-model:value="formState.status">
                <a-select-option value="active">Active VIP</a-select-option>
                <a-select-option value="inactive">Inactive</a-select-option>
                <a-select-option value="suspended">Suspended</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  SearchOutlined 
} from '@ant-design/icons-vue';
import api from '../services/api';
import { message } from 'ant-design-vue';

const columns = [
  { title: 'Shopper Name', dataIndex: 'name', key: 'name', sorter: true },
  { title: 'Email Address', dataIndex: 'email', key: 'email', sorter: true },
  { title: 'Phone', dataIndex: 'phone_number', key: 'phone', sorter: true },
  { title: 'Clientele Tier', key: 'plan', width: 120 },
  { title: 'Status', key: 'status', width: 120 },
  { title: 'Actions', key: 'action', width: 100 },
];

export default defineComponent({
  name: 'Customers',
  components: {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const customers = ref([]);
    const plans = ref([]);
    const loading = ref(false);
    const modalVisible = ref(false);
    const modalConfirmLoading = ref(false);
    const isEditing = ref(false);
    const formRef = ref(null);
    
    // Sync search query with URL
    const searchQuery = computed({
      get: () => route.query.search || '',
      set: (val) => {
        router.replace({
          query: { ...route.query, search: val || undefined }
        });
      }
    });
    const formState = reactive({
      id: null,
      name: '',
      phone_number: '',
      email: '',
      address: '',
      planId: null,
      status: 'active',
    });

    const isMobile = computed(() => window.innerWidth < 768);

    const pagination = reactive({
      current: 1,
      pageSize: 10,
      total: 0,
      showSizeChanger: true,
      showTotal: (total) => `Total ${total} customers`,
    });

    const fetchCustomers = async () => {
      loading.value = true;
      try {
        const response = await api.getCustomers(
          pagination.current,
          pagination.pageSize,
          searchQuery.value
        );
        customers.value = response.data.customers;
        pagination.total = response.data.totalItems;
      } catch (error) {
        message.error('Database connection failed.');
      } finally {
        loading.value = false;
      }
    };

    const fetchPlans = async () => {
      try {
        const response = await api.getPlans();
        const apiPlans = response.data || [];
        plans.value = apiPlans.length > 0 ? apiPlans : [
          { id: 1, name: 'VIP Archival Collector', price: 0 },
          { id: 2, name: 'Nairobi Streetwear Patron', price: 0 },
          { id: 3, name: 'Wholesale & Boutique Partner', price: 0 }
        ];
      } catch (err) {
        plans.value = [
          { id: 1, name: 'VIP Archival Collector', price: 0 },
          { id: 2, name: 'Nairobi Streetwear Patron', price: 0 },
          { id: 3, name: 'Wholesale & Boutique Partner', price: 0 }
        ];
      }
    };

    const handleTableChange = (pag, filters, sorter) => {
      pagination.current = pag.current;
      pagination.pageSize = pag.pageSize;
      fetchCustomers();
    };

    const resetForm = () => {
      Object.assign(formState, {
        id: null,
        name: '',
        phone_number: '',
        email: '',
        address: '',
        planId: null,
        status: 'active',
      });
    };

    const showAddModal = () => {
      isEditing.value = false;
      resetForm();
      modalVisible.value = true;
    };

    const editCustomer = (record) => {
      isEditing.value = true;
      Object.assign(formState, { ...record });
      modalVisible.value = true;
    };

    const handleModalOk = () => {
      formRef.value.validate().then(async () => {
        modalConfirmLoading.value = true;
        try {
          const payload = { ...formState };
          if (isEditing.value) {
            await api.updateCustomer(payload.id, payload);
            message.success('Account updated successfully.');
          } else {
            delete payload.id;
            await api.addCustomer(payload);
            message.success('New customer registered.');
          }
          modalVisible.value = false;
          fetchCustomers();
        } catch (error) {
          message.error(error.response?.data?.error || 'Operation failed');
        } finally {
          modalConfirmLoading.value = false;
        }
      });
    };

    const handleDelete = async (id) => {
      try {
        await api.deleteCustomer(id);
        message.success('Customer record purged.');
        fetchCustomers();
      } catch (error) {
        message.error('Deletion failed.');
      }
    };

    const getStatusTagColor = (status) => {
      const colors = {
        active: 'success',
        inactive: 'default',
        suspended: 'error',
      };
      return colors[status] || 'default';
    };

    fetchPlans();

    watch(() => route.query.search, () => {
      fetchCustomers();
    }, { immediate: true });

    return {
      customers,
      plans,
      columns,
      loading,
      pagination,
      modalVisible,
      modalConfirmLoading,
      isEditing,
      formState,
      formRef,
      searchQuery,
      fetchCustomers,
      handleTableChange,
      showAddModal,
      editCustomer,
      handleModalOk,
      handleDelete,
      getStatusTagColor,
      isMobile,
    };
  },
});
</script>

<style scoped>
:deep(.ant-table-thead > tr > th) {
  background: #fcfcfc !important;
  font-weight: 600;
}
</style>
