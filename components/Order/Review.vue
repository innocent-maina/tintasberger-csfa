<script setup lang="ts">
const { orderFormState, updateOrder } = useOrder();

const goToPriceEstimation = async () => {
  orderFormState.value.is_viable  = true;
  orderFormState.value.status = 'In Progress'
  await updateOrder();
};

const revertConfirmation = async () => {
  orderFormState.value.is_viable = false;
  orderFormState.value.status = 'Pending';
  await updateOrder();
};
</script>

<template>
  <div class="space-y-8 max-w-3xl mx-auto">
    <!-- Header Notice -->
    <div class="space-y-3">
      <h2 class="text-2xl font-bold text-gray-800">
        Thoroughly Review This Order
      </h2>

      <p class="text-base text-gray-600 leading-relaxed">
        Carefully go through the order details to ensure everything is
        <span class="font-medium text-gray-800">correct</span>,
        <span class="font-medium text-gray-800">realistic</span>, and
        <span class="font-medium text-gray-800">feasible for production</span>.
      </p>

      <p class="text-base text-gray-600 leading-relaxed">
        If any part of the order is
        <span class="font-semibold text-red-600">not possible</span>, please
        contact the customer to suggest appropriate adjustments before
        continuing.
      </p>
    </div>

    <!-- Proceed / Revert Button -->
    <div class="flex justify-center">
      <UButton
        v-if="orderFormState.is_viable"
        color="red"
        size="lg"
        @click="revertConfirmation"
      >
        <Icon name="mdi:backspace-reverse-outline" />
        Revert Order Confirmation
      </UButton>

      <UButton v-else color="green" size="lg" @click="goToPriceEstimation">
        <Icon name="mdi:check-circle-outline" />

        Confirm Order
      </UButton>
    </div>
  </div>
</template>
