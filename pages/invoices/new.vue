<script setup lang="ts">
const { showInvoicePreview } = useInvoice();

const { orderFormState } = useOrder()

const tabItems = [
  {
    key: "general",
    label: "1. Invoice Details",
    description:
      "Fill in the details for this invoice, including customer information, products, and payment terms.",
  },
  {
    key: "preview",
    label: "2. Preview & Confirm",
    description:
      "Review all the information before finalizing and sending the invoice.",
  },
];
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-center text-primary pb-10">
      Create Invoice
    </h1>

    <UTabs :items="tabItems" orientation="horizontal">
      <template #item="{ item }">
        <UCard>
          <template #header>
            <p
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              {{ item.label }}
            </p>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ item.description }}
            </p>
          </template>

          <div v-if="item.key === 'general'" class="space-y-4">
            <InvoiceForm />
          </div>
          <div v-else-if="item.key === 'preview'" class="space-y-4">
            <!-- <h1 class="text-2xl text-center font-bold py-8"> -->
            <!-- Document Preview -->
            <!-- </h1> -->

            <InvoicePreview v-if="showInvoicePreview" />

            <p v-else class="text-primary text-sm text-center">
              Please go back to <strong>Invoice Details</strong> and select
              the order
            </p>
          </div>
        </UCard>
      </template>
    </UTabs>
  </div>
</template>
