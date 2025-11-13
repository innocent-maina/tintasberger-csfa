<script setup lang="ts">
const { orderFormState, updateOrder } = useOrder();
const toast = useToast();

const toggleCompletion = async () => {
  const isCompleted = orderFormState.value.status === "Completed";

  orderFormState.value.status = isCompleted ? "In Progress" : "Completed";

  await updateOrder();

  toast.add({
    title: isCompleted ? "Order Reopened" : "Order Completed 🎉",
    description: isCompleted
      ? "The order has been reverted for further updates or repairs."
      : "This order has been successfully marked as completed.",
    color: isCompleted ? "yellow" : "green",
  });
};

const customerQuotes = [
  "Customer satisfaction is not a department — it’s everyone’s job.",
  "A happy customer is the best business strategy of all.",
  "Delight the customer — they’ll do your marketing for you.",
  "Every satisfied customer is a silent ambassador.",
  "The goal is not to just sell, but to serve.",
  "Quality in a service is not what you put in — it’s what the customer gets out of it.",
];

const randomQuote = computed(() => {
  return customerQuotes[Math.floor(Math.random() * customerQuotes.length)];
});
</script>

<template>
  <div
    :class="[
      'rounded-xl p-6 space-y-4',
      orderFormState.status === 'Completed'
        ? 'bg-green-50 border border-green-200 text-green-900'
        : 'bg-blue-50 border border-blue-200 text-blue-900',
    ]"
  >
    <div>
      <h3 class="text-xl font-semibold">
        {{
          orderFormState.status === "Completed"
            ? "🎉 Congratulations!"
            : "🛠️ Order Still In Progress"
        }}
      </h3>
      <p class="text-sm mt-1">
        {{
          orderFormState.status === "Completed"
            ? "You've successfully fulfilled this custom order. The handcrafted piece is complete and ready for delivery or pickup."
            : randomQuote
        }}
      </p>
    </div>

    <div
      v-if="orderFormState.status === 'Completed'"
      class="text-sm text-green-800"
    >
      Please confirm that the item has been delivered or collected before
      marking it complete.
    </div>

    <div class="flex justify-center">
      <UButton
        :color="orderFormState.status === 'Completed' ? 'yellow' : 'green'"
        size="md"
        @click="toggleCompletion"
      >
        {{
          orderFormState.status === "Completed"
            ? "Reopen Order for Edits"
            : "Mark Order as Completed"
        }}
      </UButton>
    </div>
  </div>
</template>
