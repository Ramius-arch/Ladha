<template>
  <header class="bg-white shadow-sm">
    <div class="flex justify-between items-center p-4">
      <div class="flex items-center">
        <img src="/assets/images/quixora_logo.png" alt="Quixora Logo" class="h-8 w-8 mr-2" />
        <div class="text-blue-600 font-bold text-xl">LADHA | Financial Backoffice & Ledger</div>
      </div>
      <div class="flex gap-4">
        <router-link to="/dashboard" class="hover:text-gray-600">Dashboard</router-link>
        <router-link to="/customers" class="hover:text-gray-600">Customers</router-link>
        <router-link to="/usage-tracker" class="hover:text-gray-600">Orders & Drops</router-link>
        <router-link to="/billing-engine" class="hover:text-gray-600">Ledger & Billing</router-link>
      </div>
    </div>
  </header>
</template>
