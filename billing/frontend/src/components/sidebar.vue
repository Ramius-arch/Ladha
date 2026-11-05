<template>
  <aside class="bg-gray-800 text-white w-64 fixed left-0 h-full">
    <div class="p-4">
      <h2 class="text-xl font-bold mb-6">Qx Revenue Engine</h2>
      <nav>
        <router-link to="/dashboard" class="block p-2 hover:bg-gray-700 rounded">Dashboard</router-link>
        <router-link to="/customers" class="block p-2 hover:bg-gray-700 rounded">Commerce Clients</router-link>
        <router-link to="/usage-tracker" class="block p-2 hover:bg-gray-700 rounded">Usage & Fulfillment</router-link>
        <router-link to="/billing-engine" class="block p-2 hover:bg-gray-700 rounded">Billing & Invoicing</router-link>
        <router-link to="/reports" class="block p-2 hover:bg-gray-700 rounded">Revenue Reports</router-link>
      </nav>
    </div>
  </aside>
</template>
