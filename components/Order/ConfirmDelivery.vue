<script setup lang="ts">
import { ref, watch } from "vue";

const { orderFormState, isEditingOrder } = useOrder();

const query = ref("");
const suggestions = ref<any[]>([]);
const showDropdown = ref(false);

const runtimeConfig = useRuntimeConfig();
const apiKey = runtimeConfig.public.googlePlacesApiKey;

let timeout: ReturnType<typeof setTimeout> | null = null;

const onInput = () => {
  showDropdown.value = true;

  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(fetchSuggestions, 300);
};

const fetchSuggestions = async () => {
  if (!query.value.trim()) {
    suggestions.value = [];
    return;
  }

  try {
    const data = await $fetch("/api/places", {
      params: { input: query.value },
    });

    suggestions.value = data.predictions || [];
  } catch (error) {
    console.error("Autocomplete fetch failed", error);
    suggestions.value = [];
  }
};

const selectSuggestion = (suggestion: any) => {
  query.value = suggestion.description;
  orderFormState.value.delivery_address = suggestion.description;
  showDropdown.value = false;
  suggestions.value = [];
};

watch(query, (val) => {
  orderFormState.value.delivery_address = val;
});
</script>

<template>
  <div class="space-y-8 max-w-4xl">
    <!-- Header Notice -->
    <div class="space-y-2">
      <h2 class="text-2xl font-bold text-gray-800">Confirm Delivery Details</h2>
      <p class="text-base text-gray-600 leading-relaxed">
        Contact the customer to confirm their delivery details, including the
        address, preferred delivery date, and time.
      </p>
      <p class="text-sm text-gray-500">
        After confirming the details, go to the Invoices section to generate and
        print the invoice.
        <strong
          >Remember to give the invoice to the customer with the order during
          delivery.</strong
        >
      </p>
    </div>

    <!-- Info Grid -->

    <div class="grid grid-cols-1 gap-6">
      <!-- Delivery Address -->
      <div class="relative">
        <label
          for="delivery-date"
          class="block text-sm font-medium text-gray-700"
        >
          Delivery Location
        </label>
        <p class="text-xs text-gray-500 mb-1">
          Agreed delivery location with the customer.
        </p>
        <UInput
          v-model="query"
          placeholder="Enter a location"
          @input="onInput"
          :disabled="!isEditingOrder"
          class="w-full"
        />

        <div
          v-if="suggestions.length && showDropdown"
          class="absolute z-10 bg-white border rounded w-full shadow max-h-60 overflow-auto"
        >
          <div
            v-for="(suggestion, index) in suggestions"
            :key="index"
            @click="selectSuggestion(suggestion)"
            class="p-2 cursor-pointer hover:bg-gray-100"
          >
            {{ suggestion.description }}
          </div>
        </div>
      </div>

      <!-- Delivery Date -->
      <div>
        <label
          for="delivery-date"
          class="block text-sm font-medium text-gray-700"
        >
          Delivery Date
        </label>
        <p class="text-xs text-gray-500 mb-1">
          Agreed delivery date with the customer.
        </p>
        <UInput
          id="delivery-date"
          size="lg"
          d
          v-model="orderFormState.delivery_date"
          :disabled="!isEditingOrder"
          type="date"
        />
      </div>

      <!-- Delivery Time -->
      <!-- <div>
        <label for="delivery-time" class="block text-sm font-medium text-gray-700">
          Delivery Time
        </label>
        <p class="text-xs text-gray-500 mb-1">Agreed delivery time with the customer.</p>
        <UInput
          id="delivery-time"
          size="lg"
          v-model="orderFormState.delivery_details.time"
          :disabled="!isEditingOrder"
          placeholder="e.g. 2:00 PM"
        />
      </div> -->

      <!-- Delivery Notes -->
      <!-- <div>
        <label for="delivery-notes" class="block text-sm font-medium text-gray-700">
          Special Instructions / Notes
        </label>
        <p class="text-xs text-gray-500 mb-1">Optional: Any special notes regarding the delivery.</p>
        <UInput
          id="delivery-notes"
          size="lg"
          v-model="orderFormState.delivery_details.notes"
          :disabled="!isEditingOrder"
          placeholder="e.g. Call on arrival, use back gate"
        />
      </div> -->
    </div>
  </div>
</template>
