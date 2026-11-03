<template>
  <div class="notifications-page max-w-[900px] mx-auto px-4 py-2">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-extrabold tracking-tight m-0" style="color: var(--text-primary);">
          Audit & Settlement <span class="calligraphic-accent">Notifications</span>
        </h2>
        <p class="calligraphic-quote mt-1 mb-0">
          "Real-time audited transaction events, KRA fiscal stamps, and double-entry daemon health."
        </p>
      </div>

      <a-button type="default" size="middle" @click="markAllAsRead" class="self-start sm:self-auto font-bold text-xs">
        Mark All as Audited
      </a-button>
    </div>

    <!-- Filter Pills -->
    <div class="flex gap-2 mb-4 overflow-x-auto pb-2">
      <button 
        v-for="cat in ['all', 'settlement', 'fiscal', 'daemon']" 
        :key="cat"
        :class="['px-3 py-1 rounded-md text-xs font-mono font-bold transition-all', activeCategory === cat ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200']"
        @click="activeCategory = cat"
      >
        {{ cat.toUpperCase() }} ({{ getCategoryCount(cat) }})
      </button>
    </div>

    <a-card class="standard-card">
      <a-list item-layout="horizontal" :data-source="filteredNotifications">
        <template #renderItem="{ item }">
          <a-list-item class="hover:bg-slate-50/5 transition-colors p-4 rounded-lg border-b last:border-b-0" style="border-color: var(--border-glass-subtle);">
            <a-list-item-meta>
              <template #title>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-sm" style="color: var(--text-primary);">{{ item.title }}</span>
                    <span v-if="!item.read" class="w-2 h-2 rounded-full bg-indigo-500"></span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="font-mono text-[11px] text-slate-400">{{ item.time }}</span>
                    <a-tag :color="getTypeColor(item.type)" class="font-mono text-[10px] m-0">{{ item.type.toUpperCase() }}</a-tag>
                  </div>
                </div>
              </template>
              <template #description>
                <p class="text-xs text-slate-500 dark:text-slate-400 m-0 leading-relaxed">{{ item.message }}</p>
                <div v-if="item.receipt" class="mt-2 flex items-center gap-2">
                  <span class="badge-micro font-mono text-[10px] font-bold">{{ item.receipt }}</span>
                  <span v-if="item.account" class="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">&rarr; Posted to Account {{ item.account }}</span>
                </div>
              </template>
              <template #avatar>
                <div class="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm" :class="getAvatarClass(item.type)">
                  <component :is="getIcon(item.type)" />
                </div>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </a-card>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { 
  CheckCircleOutlined,
  FileDoneOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

export default defineComponent({
  name: 'Notifications',
  components: { 
    CheckCircleOutlined, 
    FileDoneOutlined, 
    SyncOutlined, 
    ClockCircleOutlined,
    DollarCircleOutlined
  },
  setup() {
    const activeCategory = ref('all');

    const notifications = ref([
      { 
        id: 1, 
        category: 'settlement', 
        type: 'settlement', 
        title: 'M-Pesa STK Settlement Confirmed', 
        message: 'Order LDH-8932-KE settled by Grace Wanjiku (Gigiri, Nairobi) for Champion Reverse Weave Hoodie.', 
        receipt: 'MPESA-EE1133LL', 
        account: '1100', 
        time: 'Just now', 
        read: false 
      },
      { 
        id: 2, 
        category: 'fiscal', 
        type: 'tax_invoice', 
        title: 'KRA eTIMS Tax Invoice Certified', 
        message: 'Statutory 16% VAT invoice compiled with SHA-256 seal (KRA Control Unit: KRA-CU-0982410-LADHA). Stamped and streamed.', 
        receipt: 'KRA-CU-0982410-8932', 
        account: '2200', 
        time: '12m ago', 
        read: false 
      },
      { 
        id: 3, 
        category: 'daemon', 
        type: 'reconciliation', 
        title: 'Automated Ledger Reconciliation Cycle', 
        message: 'Reconciliation daemon audited 12 orders against double-entry lines. Trial Balance variance: KES 0.00 (100% Equilibrium).', 
        account: '1100 / 4000', 
        time: '18m ago', 
        read: true 
      },
      { 
        id: 4, 
        category: 'settlement', 
        type: 'settlement', 
        title: 'M-Pesa STK Settlement Confirmed', 
        message: 'Order LDH-8931-KE settled by Alex Mwangi (Hurlingham, Nairobi) for 90s Levi\'s 501 Raw Selvedge (KES 4,450).', 
        receipt: 'MPESA-DD9922KK', 
        account: '1100', 
        time: '42m ago', 
        read: true 
      },
      { 
        id: 5, 
        category: 'daemon', 
        type: 'sweeper', 
        title: 'Cart Reservation Sweeper Completed', 
        message: 'Reservation sweeper inspected checkout lease locks. 0 abandoned cart locks expired. Active drop stock is 100% nominal.', 
        time: '1h ago', 
        read: true 
      }
    ]);

    const filteredNotifications = computed(() => {
      if (activeCategory.value === 'all') return notifications.value;
      return notifications.value.filter(n => n.category === activeCategory.value);
    });

    const getCategoryCount = (cat) => {
      if (cat === 'all') return notifications.value.length;
      return notifications.value.filter(n => n.category === cat).length;
    };

    const getTypeColor = (type) => {
      const colors = { 
        settlement: 'green', 
        tax_invoice: 'blue', 
        reconciliation: 'purple', 
        sweeper: 'cyan' 
      };
      return colors[type] || 'default';
    };

    const getAvatarClass = (type) => {
      const classes = {
        settlement: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
        tax_invoice: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800',
        reconciliation: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800',
        sweeper: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800'
      };
      return classes[type] || 'bg-slate-100 text-slate-600';
    };

    const getIcon = (type) => {
      const icons = { 
        settlement: CheckCircleOutlined, 
        tax_invoice: FileDoneOutlined, 
        reconciliation: SyncOutlined, 
        sweeper: ClockCircleOutlined 
      };
      return icons[type] || DollarCircleOutlined;
    };

    const markAllAsRead = () => {
      notifications.value.forEach(n => { n.read = true; });
      message.success('All notifications marked as audited.');
    };

    return {
      activeCategory,
      filteredNotifications,
      getCategoryCount,
      getTypeColor,
      getAvatarClass,
      getIcon,
      markAllAsRead
    };
  }
});
</script>

<style scoped>
.notifications-page {
  padding-bottom: 40px;
}
</style>
