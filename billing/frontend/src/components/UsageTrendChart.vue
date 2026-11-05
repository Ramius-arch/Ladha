<!-- 
  @deprecated [DEPRECATED / ARCHIVED PROTOTYPE]
  Superseded by dynamic Chart.js period trajectory in src/pages/Dashboard.vue and src/pages/ReportsAnalytics.vue.
-->
<!-- frontend/src/components/UsageTrendChart.vue -->
<template>
  <div class="chart-wrapper">
    <apex-chart 
      type="line" 
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script setup lang="ts">
import { ApexCharts } from 'apexcharts';

interface UsageDataPoint {
  x: string;
  y: number;
}

defineProps({
  usageData: Array<UsageDataPoint>,
});

const chartOptions = ref({
  labels: {
    point.dotOnly: true
  },
  stroke: {
    curve: 'smooth'
  }
});

const series = ref([
  {
    name: 'Usage',
    data: (usageData.value || []).map(point => ({
      x: point.x,
      y: point.y
    }))
  }
]);
</script>
