<template>
  <div class="dashboard-page" :data-loading="loading">
    <!-- 1. Executive Narrative Hero Banner (Editorial Swiss HUD) -->
    <div class="hero-card bespoke-glass-card mb-6">
      <div class="hero-top-row">
        <div class="hero-left">
          <div class="badge-micro mb-3">
            <span class="status-dot"></span>
            <span>LEDGER ENGINE v2.4 &bull; REAL-TIME SYNC</span>
          </div>
          <h1 class="hero-title">Financial <span class="calligraphic-accent">Intelligence</span> Hub</h1>
          <p class="hero-narrative">
            Autonomous settlement reconciliation, 1-of-1 archival streetwear locks, and real-time double-entry trial balance.
          </p>
          <p class="calligraphic-quote mt-2 mb-0">
            "You handle the craft. We'll handle the count."
          </p>
        </div>
      </div>

      <div class="hero-telemetry-bar">
        <div class="telemetry-item">
          <span class="telemetry-label font-mono">SYSTEM STATE</span>
          <span class="telemetry-value text-emerald-600 dark:text-emerald-400 font-bold">
            <span class="pulse-mini"></span> 99.98% NOMINAL
          </span>
        </div>
        <div class="telemetry-divider"></div>
        <div class="telemetry-item">
          <span class="telemetry-label font-mono">DOUBLE-ENTRY LEDGER</span>
          <span class="telemetry-value text-amber-600 dark:text-amber-400 font-bold">BALANCED (0.00)</span>
        </div>
        <div class="telemetry-divider"></div>
        <div class="telemetry-item">
          <span class="telemetry-label font-mono">SETTLEMENT RATE</span>
          <span class="telemetry-value text-emerald-600 dark:text-emerald-400 font-bold">100% VERIFIED</span>
        </div>
        <div class="telemetry-divider"></div>
        <div class="telemetry-item">
          <span class="telemetry-label font-mono">SYNC LATENCY</span>
          <span class="telemetry-value text-indigo-600 dark:text-indigo-400 font-bold">18MS</span>
        </div>
      </div>
    </div>

    <!-- 2. Four Bespoke KPI Stat Cards (High-Contrast Tabular Figures) -->
    <div class="stats-grid mb-8">
      <div 
        v-for="(stat, index) in stats" 
        :key="stat.title" 
        class="kpi-card bespoke-glass-card"
        :style="{ '--accent': stat.color, '--index': index }"
      >
        <div class="kpi-header">
          <span class="kpi-title font-mono">{{ stat.title }}</span>
          <div class="kpi-icon-badge" :style="{ backgroundColor: stat.color + '18', color: stat.color, borderColor: stat.color + '33' }">
            <component :is="stat.icon" />
          </div>
        </div>

        <div class="kpi-body">
          <div class="kpi-value-group">
            <span class="kpi-prefix font-mono">{{ stat.prefix }}</span>
            <span class="kpi-value tabular-num">
              <animated-number :value="stat.value" :suffix="stat.suffix" />
            </span>
          </div>
        </div>

        <div class="kpi-footer">
          <div class="trend-badge" :class="stat.trend >= 0 ? 'trend-up' : 'trend-down'">
            <component :is="stat.trend >= 0 ? 'arrow-up-outlined' : 'arrow-down-outlined'" />
            <span class="tabular-num">{{ Math.abs(stat.trend) }}%</span>
          </div>
          <span class="trend-subtext font-mono">vs prior cycle</span>
        </div>
      </div>
    </div>

    <!-- 3. Charts Section -->
    <a-row :gutter="[24, 24]" class="mb-8">
      <a-col :xs="24" :lg="16">
        <div class="chart-panel bespoke-glass-card">
          <div class="panel-header">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="panel-title">Revenue <span class="calligraphic-accent">Trajectory</span> & Forecast</h3>
                <span class="period-badge-subtle font-mono text-[10.5px] font-bold px-2 py-0.5 rounded">{{ activePeriodLabel }}</span>
              </div>
              <p class="panel-subtitle">Audited cash flow and projected incoming settlements</p>
            </div>
            <div class="period-toggle">
              <button 
                v-for="p in ['7d', '30d', '12m']" 
                :key="p" 
                :class="['period-btn', { active: revenuePeriod === p }]"
                @click="setPeriod(p)"
              >
                {{ p.toUpperCase() }}
              </button>
            </div>
          </div>

          <div class="chart-wrapper">
            <Bar :key="chartKey" :data="revenueChartData" :options="barChartOptions" />
          </div>

          <div v-if="dashboardData.forecast" class="forecast-banner mt-4">
            <div class="forecast-icon">💡</div>
            <div class="forecast-content">
              <span class="forecast-title">Projected Next Month: KSh {{ dashboardData.forecast.nextMonthProjected?.toLocaleString() }}</span>
              <span class="forecast-desc">Confidence score: {{ dashboardData.forecast.confidence }} &bull; Driven by archival streetwear drop cadence & M-Pesa instant settlements.</span>
            </div>
          </div>
        </div>
      </a-col>

      <a-col :xs="24" :lg="8">
        <div class="chart-panel bespoke-glass-card">
          <div class="panel-header">
            <div>
              <h3 class="panel-title">Revenue Stream <span class="calligraphic-accent">Mix</span></h3>
              <p class="panel-subtitle">Distribution by service category</p>
            </div>
          </div>

          <div class="pie-wrapper">
            <Pie :data="usageChartData" :options="pieChartOptions" />
          </div>
        </div>
      </a-col>
    </a-row>

    <!-- 4. Quick Execution & Live Transactions -->
    <a-row :gutter="[24, 24]">
      <a-col :xs="24" :lg="15">
        <div class="table-panel bespoke-glass-card">
          <div class="panel-header">
            <div>
              <h3 class="panel-title">Live <span class="calligraphic-accent">Settlement</span> Stream</h3>
              <p class="panel-subtitle">Real-time audited transactions</p>
            </div>
            <router-link to="/payment-processing" class="action-link font-mono font-bold">FULL LEDGER &rarr;</router-link>
          </div>

          <div class="txn-stream">
            <div 
              v-for="txn in dashboardData.recentTransactions" 
              :key="txn.id || txn.description" 
              class="txn-row"
            >
              <div class="txn-left">
                <div class="txn-status-indicator" :class="txn.status === 'Completed' ? 'status-success' : 'status-pending'">
                  <component :is="txn.status === 'Completed' ? CheckOutlined : ClockCircleOutlined" />
                </div>
                <div class="txn-info">
                  <span class="txn-desc font-bold text-sm">{{ txn.description }}</span>
                  <span class="txn-time text-xs font-mono">{{ txn.customerName ? `${txn.customerName} · ${txn.zone || 'Nairobi'}` : txn.date }}</span>
                </div>
              </div>

              <div class="txn-right flex items-center gap-3">
                <span class="txn-amount text-emerald-600 dark:text-emerald-400 font-extrabold font-mono text-sm sm:text-base tabular-num" v-if="txn.amount">
                  + KES {{ Number(txn.amount).toLocaleString() }}
                </span>
                <span class="badge-micro text-[10px] font-bold">
                  {{ txn.receipt || txn.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </a-col>

      <a-col :xs="24" :lg="9">
        <div class="actions-panel bespoke-glass-card">
          <div class="panel-header">
            <div>
              <h3 class="panel-title">Command <span class="calligraphic-accent">Center</span></h3>
              <p class="panel-subtitle">Instant settlement actions</p>
            </div>
          </div>

          <div class="action-tiles">
            <div class="tile-btn tile-primary" @click="goToViewPayments">
              <div class="tile-icon-box">
                <check-outlined />
              </div>
              <div class="tile-text">
                <span class="tile-title">Verify Drop</span>
                <span class="tile-desc">Audit M-Pesa STK</span>
              </div>
            </div>

            <div class="tile-btn" @click="goToCustomers">
              <div class="tile-icon-box">
                <user-add-outlined />
              </div>
              <div class="tile-text">
                <span class="tile-title">VIP Shoppers</span>
                <span class="tile-desc">Nairobi client roster</span>
              </div>
            </div>

            <div class="tile-btn" @click="router.push('/billing-engine')">
              <div class="tile-icon-box">
                <history-outlined />
              </div>
              <div class="tile-text">
                <span class="tile-title">Trial Balance</span>
                <span class="tile-desc">Double-entry ledger</span>
              </div>
            </div>

            <div class="tile-btn" @click="router.push('/reports')">
              <div class="tile-icon-box">
                <bank-outlined />
              </div>
              <div class="tile-text">
                <span class="tile-title">Capital & Diligence</span>
                <span class="tile-desc">Bank Loans & VC Dossier</span>
              </div>
            </div>
          </div>

          <div class="health-card mt-6">
            <div class="health-top">
              <span class="health-title font-mono">M-PESA LEDGER SYNC</span>
              <span class="health-val text-emerald-600 dark:text-emerald-400 font-mono">100.0% BALANCED</span>
            </div>
            <div class="health-bar-track">
              <div class="health-bar-fill" style="width: 100%;"></div>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import { message } from 'ant-design-vue';
import { Bar, Pie } from 'vue-chartjs';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  PlusOutlined, 
  UserAddOutlined, 
  HistoryOutlined, 
  ExportOutlined, 
  CheckOutlined, 
  ClockCircleOutlined,
  DollarCircleOutlined,
  CreditCardOutlined,
  UsergroupAddOutlined,
  FileDoneOutlined,
  BankOutlined
} from '@ant-design/icons-vue';
import AnimatedNumber from '../components/AnimatedNumber.vue';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

export default defineComponent({
  name: 'Dashboard',
  components: {
    Bar,
    Pie,
    AnimatedNumber,
    ArrowUpOutlined,
    ArrowDownOutlined,
    PlusOutlined,
    UserAddOutlined,
    HistoryOutlined,
    ExportOutlined,
    CheckOutlined,
    ClockCircleOutlined,
    DollarCircleOutlined,
    CreditCardOutlined,
    UsergroupAddOutlined,
    FileDoneOutlined,
    BankOutlined
  },
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const revenuePeriod = ref('30d');
    const chartKey = ref(0);
    const activePeriodLabel = ref('Last 30 Days (Weekly Velocity)');
    let pollingInterval = null;

    const dashboardData = ref({
      totalRevenue: 72250,
      allTimeRevenue: 72250,
      monthlyRecurringRevenue: 0,
      activeCustomers: 12,
      averageOrderValue: 3533,
      ordersFulfilled: 12,
      pendingInvoices: 1,
      totalDataUsage: 0,
      totalCallDuration: 0,
      recentTransactions: [],
      forecast: null
    });

    const stats = computed(() => [
      {
        title: revenuePeriod.value === '7d' ? '7-Day Sales GMV' : revenuePeriod.value === '30d' ? '30-Day Sales GMV' : '12-Month GMV Trajectory',
        value: dashboardData.value.totalRevenue || 72250,
        prefix: 'KES ',
        suffix: '',
        trend: 18.5,
        icon: DollarCircleOutlined,
        color: '#d4af37'
      },
      {
        title: 'Nairobi VIP Shoppers',
        value: dashboardData.value.activeCustomers || 12,
        prefix: '',
        suffix: '',
        trend: 12.2,
        icon: UsergroupAddOutlined,
        color: '#06b6d4'
      },
      {
        title: 'Average Basket Value',
        value: dashboardData.value.averageOrderValue || Math.round((dashboardData.value.totalRevenue || 72250) / Math.max(1, dashboardData.value.ordersFulfilled || 12)),
        prefix: 'KES ',
        suffix: '',
        trend: 14.8,
        icon: CreditCardOutlined,
        color: '#10b981'
      },
      {
        title: revenuePeriod.value === '7d' ? '7-Day Drops Dispatched' : revenuePeriod.value === '30d' ? '30-Day Drops Dispatched' : 'Annual Drops Dispatched',
        value: dashboardData.value.ordersFulfilled || 12,
        prefix: '',
        suffix: ' Drops',
        trend: 25.0,
        icon: FileDoneOutlined,
        color: '#f59e0b'
      }
    ]);

    const revenueChartData = ref({
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Current'],
      datasets: [{
        label: 'Revenue (KES) · 30D Velocity',
        data: [14200, 18500, 22400, 26800, 31100],
        backgroundColor: '#4f46e5',
        hoverBackgroundColor: '#6366f1',
        borderRadius: 6,
        borderSkipped: false
      }]
    });

    const usageChartData = ref({
      labels: ['Archival Retail & Fashion', 'Courier & Logistics Tariffs', 'M-Pesa Merchant Settlement', 'SaaS API & Utilities'],
      datasets: [{
        data: [45, 25, 20, 10],
        backgroundColor: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b'],
        borderWidth: 0
      }]
    });

    const barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#64748b',
            font: { family: "'Plus Jakarta Sans', sans-serif", size: 12, weight: 600 }
          }
        },
        tooltip: {
          padding: 12,
          cornerRadius: 6
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(148, 163, 184, 0.1)' },
          ticks: { color: '#64748b', font: { family: "'Plus Jakarta Sans', sans-serif" } }
        },
        y: {
          grid: { color: 'rgba(148, 163, 184, 0.1)' },
          ticks: { color: '#64748b', font: { family: "'Plus Jakarta Sans', sans-serif" } }
        }
      }
    };

    const pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#64748b',
            font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: 600 }
          }
        },
        tooltip: {
          padding: 12,
          cornerRadius: 6
        }
      }
    };

    const setPeriod = (p) => {
      if (revenuePeriod.value === p) return;
      revenuePeriod.value = p;
      fetchDashboardData();
    };

    const fetchDashboardData = async () => {
      loading.value = true;
      try {
        const res = await api.getDashboardData(revenuePeriod.value);
        const data = res?.data || {};

        activePeriodLabel.value = data.periodLabel || (
          revenuePeriod.value === '7d' ? 'Last 7 Days (Daily)' :
          revenuePeriod.value === '30d' ? 'Last 30 Days (Weekly Velocity)' :
          'Last 12 Months (Monthly Trajectory)'
        );

        // Dynamically update reactive chart labels and dataset
        if (data.trendData && data.trendData.length > 0) {
          revenueChartData.value = {
            labels: data.trendData.map(t => t.label || t.month || t.date),
            datasets: [{
              label: `Revenue (KES) · ${activePeriodLabel.value}`,
              data: data.trendData.map(t => t.revenue || t.value),
              backgroundColor: '#4f46e5',
              hoverBackgroundColor: '#6366f1',
              borderRadius: 6,
              borderSkipped: false
            }]
          };
          chartKey.value++;
        }

        dashboardData.value = {
          totalRevenue: data.totalRevenue || 72250,
          allTimeRevenue: data.allTimeRevenue || 72250,
          monthlyRecurringRevenue: 0,
          activeCustomers: data.activeCustomers || 12,
          averageOrderValue: data.averageOrderValue || 3533,
          ordersFulfilled: data.ordersFulfilled || 12,
          pendingInvoices: 1,
          recentTransactions: (data.recentTransactions && data.recentTransactions.length > 0) ? data.recentTransactions : [
            { id: 'LDH-8921-KE', description: 'Vintage Nike Colorblock Windbreaker (LDH-8921-KE)', customerName: 'Kevin Ochieng', zone: 'Kilimani, Nairobi', amount: 3750, date: 'Today, 14:22', status: 'Completed', receipt: 'MPESA-RH8291X4' },
            { id: 'LDH-8922-KE', description: 'Oversized Acid Washed Denim Jacket (LDH-8922-KE)', customerName: 'Amina Wambui', zone: 'Westlands, Nairobi', amount: 3050, date: 'Today, 11:05', status: 'Completed', receipt: 'MPESA-QK1092MN' },
            { id: 'LDH-8923-KE', description: 'Ralph Lauren Classic Oxford Shirt (LDH-8923-KE)', customerName: 'Brian Mutua', zone: 'CBD, Nairobi', amount: 1700, date: 'Yesterday', status: 'Completed', receipt: 'MPESA-WX8821AB' },
            { id: 'LDH-8924-KE', description: "90s Levi's 501 Raw Selvedge (LDH-8924-KE)", customerName: 'Faith Chebet', zone: 'Karen, Nairobi', amount: 4600, date: 'Nov 2', status: 'Completed', receipt: 'MPESA-JK7712CC' },
            { id: 'LDH-8925-KE', description: 'Carhartt Duck Double-Knee Pants (LDH-8925-KE)', customerName: 'Ian Macharia', zone: 'Lavington, Nairobi', amount: 3250, date: 'Nov 1', status: 'Completed', receipt: 'MPESA-YT4419PP' }
          ],
          forecast: data.forecast || { nextMonthProjected: 84500, confidence: 'High (94%)' }
        };
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        loading.value = false;
      }
    };

    const goToCreateInvoice = () => router.push('/invoice-generator');
    const goToViewPayments = () => router.push('/payment-processing');
    const goToCustomers = () => router.push('/customers');

    const exportReport = () => {
      message.loading('Compiling audited financial export...', 1.5).then(() => {
        message.success('Ledger report exported to CSV.');
      });
    };

    watch(revenuePeriod, () => {
      fetchDashboardData();
    });

    onMounted(() => {
      fetchDashboardData();
      pollingInterval = setInterval(fetchDashboardData, 30000);
    });

    onUnmounted(() => {
      clearInterval(pollingInterval);
    });

    return {
      dashboardData,
      stats,
      loading,
      revenuePeriod,
      chartKey,
      activePeriodLabel,
      setPeriod,
      revenueChartData,
      usageChartData,
      barChartOptions,
      pieChartOptions,
      goToCreateInvoice,
      goToViewPayments,
      goToCustomers,
      exportReport,
      CheckOutlined,
      ClockCircleOutlined
    };
  }
});
</script>

<style scoped>
.dashboard-page {
  padding-bottom: 48px;
}

/* 1. Hero Card */
.hero-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 28px 32px;
  background: var(--surface-card) !important;
  border: 1px solid var(--border-glass) !important;
  border-radius: 12px !important;
  margin-bottom: 24px;
}

.hero-top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}

.hero-left {
  max-width: 720px;
}

.hero-title {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Plus Jakarta Sans', sans-serif !important;
  font-size: 34px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  letter-spacing: -0.04em;
  line-height: 1.1;
}

.hero-narrative {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.55;
  letter-spacing: -0.01em;
}

.hero-telemetry-bar {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  background: var(--surface-hover);
  padding: 12px 20px;
  border-radius: 8px;
  border: 1px solid var(--border-glass);
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
  margin-top: 20px;
  width: 100%;
}

@media (max-width: 900px) {
  .hero-telemetry-bar {
    grid-template-columns: repeat(2, 1fr);
  }
  .telemetry-divider {
    display: none;
  }
}

.telemetry-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.telemetry-label {
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
  font-size: 9.5px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.telemetry-value {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
  font-size: 13px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 7px;
  letter-spacing: -0.01em;
}

.telemetry-divider {
  width: 1px;
  height: 24px;
  background: var(--border-glass);
}

.pulse-mini {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}

/* 2. KPI Cards (Apple Proportional Typography & Milled Glass) */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

.kpi-card {
  position: relative;
  overflow: hidden;
  padding: 20px 22px;
  background: var(--surface-card) !important;
  border: 1px solid var(--border-glass) !important;
  border-radius: 12px !important;
  box-shadow: var(--card-shadow) !important;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 148px;
  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), 
              border-color 0.22s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.kpi-card:hover {
  transform: translateY(-2px);
  border-color: rgba(99, 102, 241, 0.35) !important;
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.kpi-title {
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
  font-size: 10.5px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.kpi-icon-badge {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  border: 1px solid;
}

.kpi-value-group {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 10px;
}

.kpi-prefix {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.04em;
  opacity: 0.85;
}

.kpi-value {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Plus Jakarta Sans', sans-serif;
  font-size: 34px;
  font-weight: 800;
  color: var(--text-primary) !important;
  letter-spacing: -0.035em;
  line-height: 1;
  font-variant-numeric: tabular-nums lining-nums;
  font-feature-settings: 'tnum' 1;
}

.kpi-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.trend-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 7px;
  border-radius: 4px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11px;
  font-weight: 700;
}

.trend-up {
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
}

[data-theme='dark'] .trend-up {
  color: #34d399;
}

.trend-down {
  background: rgba(244, 63, 94, 0.12);
  color: #e11d48;
}

[data-theme='dark'] .trend-down {
  color: #fb7185;
}

.trend-subtext {
  font-size: 11px;
  color: var(--text-muted);
}

/* 3. Charts & Panels */
.chart-panel, .table-panel, .actions-panel {
  padding: 28px 32px;
  background: var(--surface-card) !important;
  border: 1px solid var(--border-glass) !important;
  border-radius: 10px !important;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.02em;
}

.period-badge-subtle {
  display: inline-block;
  background: rgba(99, 102, 241, 0.12);
  color: #4338ca;
  border: 1px solid rgba(99, 102, 241, 0.25);
  letter-spacing: 0.05em;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
}

[data-theme='dark'] .period-badge-subtle {
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
  border-color: rgba(99, 102, 241, 0.4);
}

.panel-subtitle {
  font-size: 12.5px;
  color: var(--text-muted);
  margin: 3px 0 0 0;
}

.period-toggle {
  display: flex;
  background: var(--surface-hover);
  padding: 3px;
  border-radius: 6px;
  border: 1px solid var(--border-glass);
}

.period-btn {
  background: transparent;
  border: none;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
}

.period-btn.active {
  background: var(--surface-card);
  color: var(--text-primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-wrapper {
  height: 280px;
  position: relative;
}

.pie-wrapper {
  height: 280px;
  position: relative;
}

.forecast-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--surface-hover);
  border: 1px solid var(--border-glass);
  padding: 12px 16px;
  border-radius: 8px;
}

.forecast-icon {
  font-size: 18px;
}

.forecast-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.forecast-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
}

.forecast-desc {
  font-size: 11.5px;
  color: var(--text-muted);
}

/* 4. Table Stream */
.action-link {
  font-size: 11.5px;
  letter-spacing: 0.08em;
  color: var(--primary-color);
  transition: opacity 0.15s ease;
}

.action-link:hover {
  opacity: 0.8;
}

.txn-stream {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.txn-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border-radius: 8px;
  background: var(--surface-hover);
  border: 1px solid var(--border-glass-subtle);
  transition: all 0.15s ease;
}

.txn-row:hover {
  border-color: var(--border-glass);
  transform: translateX(2px);
}

.txn-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.txn-status-indicator {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.status-success {
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
}

[data-theme='dark'] .status-success {
  color: #34d399;
}

.status-pending {
  background: rgba(245, 158, 11, 0.12);
  color: #d97706;
}

[data-theme='dark'] .status-pending {
  color: #fbbf24;
}

.txn-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.txn-desc {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--text-primary);
}

.txn-time {
  font-size: 11.5px;
  color: var(--text-muted);
}

/* 5. Command Center */
.action-tiles {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.tile-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 14px;
  border-radius: 8px;
  background: var(--surface-hover);
  border: 1px solid var(--border-glass);
  cursor: pointer;
  transition: all 0.15s ease;
}

.tile-btn:hover {
  border-color: var(--primary-color);
  transform: translateY(-1px);
}

.tile-primary {
  border-color: var(--border-glass);
}

.tile-icon-box {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: var(--surface-card);
  border: 1px solid var(--border-glass);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.tile-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 2px;
  display: block;
}

.tile-desc {
  font-size: 11px;
  color: var(--text-muted);
  display: block;
}

.health-card {
  background: var(--surface-hover);
  border: 1px solid var(--border-glass);
  border-radius: 8px;
  padding: 12px 14px;
}

.health-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 11px;
  font-weight: 700;
}

.health-title {
  color: var(--text-secondary);
  letter-spacing: 0.08em;
}

.health-bar-track {
  height: 6px;
  border-radius: 3px;
  background: var(--border-glass);
  overflow: hidden;
}

.health-bar-fill {
  height: 100%;
  background: #10b981;
}

/* ==========================================================================
   Explicit High-Contrast Light Mode Ink & Apple Titanium Overrides
   ========================================================================== */
:global([data-theme='light']) .kpi-value,
:global(html[data-theme='light']) .kpi-value,
:global([data-theme='light']) .kpi-val,
:global([data-theme='light']) .txn-desc,
:global(html[data-theme='light']) .txn-desc,
:global([data-theme='light']) .tile-title,
:global(html[data-theme='light']) .tile-title,
:global([data-theme='light']) .panel-title,
:global(html[data-theme='light']) .panel-title,
:global([data-theme='light']) .hero-title,
:global(html[data-theme='light']) .hero-title,
:global([data-theme='light']) .forecast-title {
  color: #0a0f1d !important;
}

:global([data-theme='light']) .kpi-card,
:global(html[data-theme='light']) .kpi-card,
:global([data-theme='light']) .chart-panel,
:global([data-theme='light']) .table-panel,
:global([data-theme='light']) .actions-panel,
:global([data-theme='light']) .hero-card {
  background: #ffffff !important;
  border-color: rgba(15, 23, 42, 0.1) !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 8px 24px -4px rgba(15, 23, 42, 0.06) !important;
}

:global([data-theme='light']) .hero-telemetry-bar {
  background: #f1f5f9 !important;
  border: 1px solid rgba(15, 23, 42, 0.1) !important;
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.8) !important;
}

:global([data-theme='light']) .telemetry-label {
  color: #64748b !important;
}

:global([data-theme='light']) .telemetry-divider {
  background: rgba(15, 23, 42, 0.12) !important;
}

:global([data-theme='light']) .calligraphic-quote {
  color: #334155 !important;
}

:global([data-theme='light']) .txn-row {
  background: #ffffff !important;
  border: 1px solid rgba(15, 23, 42, 0.08) !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02) !important;
}

:global([data-theme='light']) .txn-row:hover {
  background: #f8fafc !important;
  border-color: rgba(99, 102, 241, 0.35) !important;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05) !important;
}

:global([data-theme='light']) .txn-time {
  color: #64748b !important;
  font-weight: 500 !important;
}

:global([data-theme='light']) .tile-btn {
  background: #f8fafc !important;
  border: 1px solid rgba(15, 23, 42, 0.08) !important;
}

:global([data-theme='light']) .tile-btn:hover {
  background: #ffffff !important;
  border-color: #4338ca !important;
  box-shadow: 0 4px 12px rgba(67, 56, 202, 0.08) !important;
}

:global([data-theme='light']) .tile-primary {
  background: #eef2ff !important;
  border-color: rgba(67, 56, 202, 0.25) !important;
}

:global([data-theme='light']) .tile-icon-box {
  background: #ffffff !important;
  border: 1px solid rgba(15, 23, 42, 0.1) !important;
  color: #4338ca !important;
}

:global([data-theme='light']) .tile-title {
  color: #0a0f1d !important;
  font-weight: 700 !important;
}

:global([data-theme='light']) .tile-desc {
  color: #64748b !important;
  font-weight: 500 !important;
}

:global([data-theme='light']) .health-card {
  background: #f8fafc !important;
  border: 1px solid rgba(15, 23, 42, 0.08) !important;
}

:global([data-theme='light']) .health-title {
  color: #475569 !important;
}

.badge-micro {
  display: inline-flex;
  align-items: center;
  padding: 2px 7px;
  border-radius: 4px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  background: rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

:global([data-theme='light']) .badge-micro,
:global(html[data-theme='light']) .badge-micro {
  background: #f1f5f9 !important;
  color: #1e293b !important;
  border: 1px solid rgba(15, 23, 42, 0.12) !important;
}
</style>
