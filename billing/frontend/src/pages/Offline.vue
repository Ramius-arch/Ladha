<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh]">
    <h1 class="text-3xl font-bold text-slate-700 mb-4">You are offline</h1>
    <p class="text-lg text-slate-500 mb-6">Please check your internet connection and try again.</p>
    <div class="flex gap-3">
      <button @click="retry" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
        Retry
      </button>
    </div>
  </div>
</template>

<script setup>
const retry = () => {
  window.location.reload()
}
</script>
