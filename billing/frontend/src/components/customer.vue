<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Customer Management</h1>
    <div class="bg-white rounded-lg shadow p-4">
      <table class="w-full">
        <thead>
          <tr class="border-b">
            <th class="text-left py-2">Name</th>
            <th class="text-left py-2">Phone Number</th>
            <th class="text-left py-2">Plan</th>
            <th class="text-left py-2">Last Payment</th>
            <th class="text-left py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <!-- Sample data for demonstration -->
          <tr v-for="customer in customers" :key="customer.id">
            <td class="py-2">{{ customer.name }}</td>
            <td class="py-2">{{ customer.phone }}</td>
            <td class="py-2">{{ customer.plan }}</td>
            <td class="py-2 text-green-600">{{ format_date(customer.last_payment) }}</td>
            <td class="py-2">
              <span :class="getStatusClass(customer.status)">
                {{ customer.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      customers: [
        {
          id: 1,
          name: "John Doe",
          phone: "+254712345678",
          plan: "Basic Plan",
          last_payment: "2023-09-01",
          status: "active"
        },
        // Add more sample customers here
      ]
    };
  },
  methods: {
    format_date(date) {
      return new Date(date).toLocaleDateString();
    },
    getStatusClass(status) {
      if (status === 'active') return 'bg-green-100 text-green-800 px-2 py-1 rounded';
      if (status === 'inactive') return 'bg-red-100 text-red-800 px-2 py-1 rounded';
      return '';
    }
  }
};
</script>
