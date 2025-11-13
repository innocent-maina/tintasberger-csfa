<script setup lang="ts">
const {
  orderFormState,
  isEditingOrder,
  getSingleOrder,
  deleteOrder,
  getAllOrders,
  updateOrder,
} = useOrder();


// 🏷️ Format total with currency
const formattedTotalCost = computed(() =>
  new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(orderFormState.value.total_cost)
);
</script>

<template>
  <div class="space-y-8 max-w-4xl">

    <!-- Introductory Notice -->
    <div class="space-y-2">
      <h2 class="text-2xl font-bold text-gray-800">Provide Price Estimation</h2>
      <p class="text-base text-gray-600 leading-relaxed">
        Enter the detailed costs below. This pricing information will be sent to the customer
        for approval before production begins.
      </p>
      <p class="text-sm text-gray-500">
        Double-check that all costs are accurate to avoid misunderstandings or disputes.
      </p>
    </div>

    <!-- Costs Inputs -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">

      <div>
        <label for="totla-cost" class="block text-sm font-medium text-gray-700">
          Total Cost
        </label>
        <p class="text-xs text-gray-500 mb-1">Total cost of production .</p>
        <UInput
          id="production-cost"
          size="lg"
          v-model="orderFormState.total_cost"
          :disabled="!isEditingOrder"
          type="number"
          placeholder="Enter production cost"
        />
      </div>

      <div>
        <label for="deposit-required" class="block text-sm font-medium text-gray-700">
          Required Initial Deposit
        </label>
        <p class="text-xs text-gray-500 mb-1">Amount the customer must pay upfront before production starts.</p>
        <UInput
          id="deposit-required"
          size="lg"
          v-model="orderFormState.required_deposit_amount"
          :disabled="!isEditingOrder"
          type="number"
          placeholder="Enter required deposit"
        />
      </div>

    </div>

    <!-- Total -->
    <div class="text-xl font-semibold text-primary text-center text-gray-800 mt-4">
      Total Product Cost: {{ formattedTotalCost }}
    </div>

  </div>
</template>
