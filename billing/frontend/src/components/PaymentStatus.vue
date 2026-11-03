<!-- 
  @deprecated [DEPRECATED / ARCHIVED PROTOTYPE]
  Superseded by live M-Pesa STK verification streams in src/pages/PaymentProcessing.vue.
-->
<!-- frontend/src/components/PaymentStatus.vue -->
<template>
  <div class="payment-status">
    <h2>Payment Statistics</h2>
    <div class="status-list">
      {{ paymentStatus.value.join(', ') }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  payments: Array<string>,
});
</script>
