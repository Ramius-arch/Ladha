<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh]">
    <h1 class="text-6xl font-bold text-slate-200 mb-4">404</h1>
    <p class="text-lg text-slate-500 mb-6">This page doesn't exist or has been moved.</p>
    <div class="flex gap-3">
      <button @click="router.back()" class="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-700">
        Go Back
      </button>
      <router-link to="/dashboard" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
        Go to Dashboard
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
