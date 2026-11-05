<template>
  <div class="notification-tray">
    <div class="tray-header">
      <h3>Notifications</h3>
      <a-button type="link" size="small" @click="$emit('close')">Close</a-button>
    </div>
    <div class="tray-content">
      <a-list :data-source="notifications" v-if="notifications.length > 0">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta :title="item.title" :description="item.message" />
          </a-list-item>
        </template>
      </a-list>
      <a-empty v-else description="No new notifications" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';

export default defineComponent({
  name: 'NotificationTray',
  emits: ['close'],
  setup() {
    const notifications = ref([
      { id: 1, title: 'New Invoice', message: 'Invoice #INV-9022 is ready for payment.' },
      { id: 2, title: 'Usage Alert', message: 'You have reached 80% of your data limit.' }
    ]);
    return { notifications };
  }
});
</script>

<style scoped>
.notification-tray {
  width: 320px;
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  padding: 16px;
}
.tray-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
</style>
