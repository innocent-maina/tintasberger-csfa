<script setup lang="ts">
const { orderFormState, isEditingOrder } = useOrder();

const paymentOptions = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

const depositPaidModel = computed({
  get: () => orderFormState.value.deposit_payment.paid,
  set: (val: string) => {
    if (val === "true") {
      orderFormState.value.deposit_payment.paid = true;
    } else {
      orderFormState.value.deposit_payment.paid = false;
    }
  },
});
</script>

<template>
  <div class="space-y-8 max-w-4xl">
    <!-- Introductory Notice -->
    <div class="space-y-2">
      <h2 class="text-2xl font-bold text-gray-800">Confirm Deposit Payment</h2>
      <p class="text-base text-gray-600 leading-relaxed">
        Record the customer's deposit payment details after confirming receipt.
        This helps keep the order history accurate and transparent for both the
        store and the customer.
      </p>
      <p class="text-sm text-gray-500">
        Make sure the amount paid matches the requested deposit, and confirm
        that the reference details are correct.
      </p>
    </div>

    <USelect
      v-model="depositPaidModel"
      :options="paymentOptions"
      option-attribute="label"
      value-attribute="value"
      placeholder="Select payment status"
    />
    <!-- Info Grid -->
    <div
      v-if="orderFormState.deposit_payment.paid"
      class="grid grid-cols-1 sm:grid-cols-2 gap-6"
    >
      <!-- Requested Amount -->
      <div>
        <label
          for="requested-amount"
          class="block text-sm font-medium text-gray-700"
        >
          Requested Deposit Amount
        </label>
        <p class="text-xs text-gray-500 mb-1">
          The amount that was originally requested for the deposit.
        </p>
        <UInput
          id="requested-amount"
          size="lg"
          v-model="orderFormState.required_deposit_amount"
          disabled
          type="number"
          placeholder="e.g. 5000"
        />
      </div>

      <!-- Amount Paid -->
      <div>
        <label
          for="amount-paid"
          class="block text-sm font-medium text-gray-700"
        >
          Amount Paid
        </label>
        <p class="text-xs text-gray-500 mb-1">
          The actual amount paid by the customer for the deposit.
        </p>
        <UInput
          id="amount-paid"
          size="lg"
          v-model="orderFormState.deposit_payment.amount_paid"
          :disabled="!isEditingOrder"
          type="number"
          placeholder="e.g. 5000"
        />
      </div>

      <!-- Payment Date -->
      <div>
        <label
          for="payment-date"
          class="block text-sm font-medium text-gray-700"
        >
          Payment Date
        </label>
        <p class="text-xs text-gray-500 mb-1">
          The date when the payment was made by the customer.
        </p>
        <UInput
          id="payment-date"
          size="lg"
          v-model="orderFormState.deposit_payment.payment_date"
          :disabled="!isEditingOrder"
          type="date"
        />
      </div>

      <!-- Payment Time -->
      <div>
        <label
          for="payment-time"
          class="block text-sm font-medium text-gray-700"
        >
          Payment Time
        </label>
        <p class="text-xs text-gray-500 mb-1">
          The specific time the payment was made, if available.
        </p>
        <UInput
          id="payment-time"
          size="lg"
          v-model="orderFormState.deposit_payment.payment_time"
          :disabled="!isEditingOrder"
          placeholder="e.g. 14:30"
        />
      </div>

      <!-- Payment Method -->
      <div>
        <label
          for="payment-method"
          class="block text-sm font-medium text-gray-700"
        >
          Payment Method
        </label>
        <p class="text-xs text-gray-500 mb-1">
          Method used by the customer to make the payment (e.g. M-Pesa, Bank
          Transfer).
        </p>
        <UInput
          id="payment-method"
          size="lg"
          v-model="orderFormState.deposit_payment.payment_method"
          :disabled="!isEditingOrder"
          placeholder="e.g. M-Pesa"
        />
      </div>

      <!-- Payment Reference -->
      <div>
        <label
          for="payment-reference"
          class="block text-sm font-medium text-gray-700"
        >
          Payment Reference
        </label>
        <p class="text-xs text-gray-500 mb-1">
          Transaction reference code or receipt number provided by the payment
          service.
        </p>
        <UInput
          id="payment-reference"
          size="lg"
          v-model="orderFormState.deposit_payment.payment_reference"
          :disabled="!isEditingOrder"
          placeholder="e.g. MPESA123456"
        />
      </div>
    </div>
  </div>
</template>
