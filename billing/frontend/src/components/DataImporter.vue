<template>
  <div class="data-importer">
    <a-upload
      name="file"
      :multiple="false"
      :before-upload="handleFileUpload"
      :show-upload-list="false"
      accept=".csv"
    >
      <a-button>
        <template #icon><upload-outlined /></template>
        Import Data
      </a-button>
    </a-upload>

    <a-modal v-model:open="previewVisible" title="Preview Imported Data" width="800px" @ok="saveData">
      <template #footer>
        <a-button @click="previewVisible = false">Cancel</a-button>
        <a-button @click="applyLocally">Apply (Local Only)</a-button>
        <a-button type="primary" :loading="saving" @click="saveData">Save to System</a-button>
      </template>
      <a-table :dataSource="previewData" :columns="previewColumns" size="small" />
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import Papa from 'papaparse';
import api from '../services/api';

export default defineComponent({
  name: 'DataImporter',
  components: { UploadOutlined },
  emits: ['data-imported'],
  setup(props, { emit }) {
    const previewVisible = ref(false);
    const previewData = ref([]);
    const previewColumns = ref([]);
    const saving = ref(false);

    const handleFileUpload = (file) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          if (results.data.length > 0) {
            previewColumns.value = Object.keys(results.data[0]).map(key => ({ title: key, dataIndex: key }));
            previewData.value = results.data.map((row, index) => ({ ...row, key: index }));
            previewVisible.value = true;
          }
        },
        error: (err) => message.error('Failed to parse CSV: ' + err.message)
      });
      return false; // Prevent auto upload
    };

    const applyLocally = () => {
      emit('data-imported', previewData.value);
      previewVisible.value = false;
      message.info('Data applied to charts locally.');
    };

    const saveData = async () => {
      saving.value = true;
      try {
        // Assume API endpoint for report import
        await api.reports.importMetrics(previewData.value);
        message.success('Metrics saved to system.');
        emit('data-imported', previewData.value);
        previewVisible.value = false;
      } catch (err) {
        message.error('Failed to save metrics.');
      } finally {
        saving.value = false;
      }
    };

    return { previewVisible, previewData, previewColumns, handleFileUpload, applyLocally, saveData, saving };
  }
});
</script>
