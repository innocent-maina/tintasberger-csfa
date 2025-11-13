<script setup lang="ts">
const { orderFormState, isEditingOrder } = useOrder();
</script>

<template>
  <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
    <!-- Avatar -->
    <div class="flex-shrink-0">
      <img
        :src="orderFormState.customer.image_url"
        alt="Customer Image"
        class="rounded-full w-40 h-40 object-cover border border-gray-300 shadow-sm"
      />
    </div>

    <!-- Info Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 w-full">
      <div>
        <label for="customer-name" class="text-sm text-gray-600 mb-1 block"
          >Name</label
        >
        <UInput
          size="lg"
          id="customer-name"
          v-model="orderFormState.customer.name"
          :disabled="!isEditingOrder"
        />
      </div>

      <div>
        <label for="customer-email" class="text-sm text-gray-600 mb-1 block"
          >Email</label
        >
        <UInput
          size="lg"
          id="customer-email"
          v-model="orderFormState.customer.email"
          type="email"
          :disabled="!isEditingOrder"
        />
      </div>

      <div>
        <label for="customer-phone" class="text-sm text-gray-600 mb-1 block"
          >Phone</label
        >
        <UInput
          size="lg"
          id="customer-phone"
          v-model="orderFormState.customer.phone"
          :disabled="!isEditingOrder"
        />
      </div>

      <div>
        <label for="customer-address" class="text-sm text-gray-600 mb-1 block"
          >Delivery Address</label
        >
        <UInput
          size="lg"
          id="customer-address"
          v-model="orderFormState.customer.address"
          :disabled="!isEditingOrder"
        />
      </div>
    </div>
  </div>
</template>
