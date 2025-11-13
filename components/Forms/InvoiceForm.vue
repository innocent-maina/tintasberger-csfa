<script setup lang="ts">
const {
  updateInvoice,
  createInvoice,
  createInvoiceFormState,
  isEditingInvoice,
} = useInvoice();
const emit = defineEmits(["save", "cancel"]);

const toast = useToast();

const statusOptions = ref([
  {
    label: "Generated",
    value: "Generated",
    color: "red",
    description: "Ready to be sent to customer",
  },
  {
    label: "Sent",
    value: "Sent",
    color: "blue",
    description: "Invoice has been sent",
  },
  {
    label: "Paid",
    value: "Paid",
    color: "green",
    description: "Customer has completed payment",
  },
]);

const isSelected = (value: string) => createInvoiceFormState.value.status === value;

const handleSubmit = async () => {
  let response;

  if (isEditingInvoice.value) {
    response = await updateInvoice(
      createInvoiceFormState.value.id,
      createInvoiceFormState.value
    );
  }

  if (response.success) {
    isEditingInvoice.value = false;
  }

  await emit("cancel");
};

const openDocument = (url: string) => {
  if (!url) return;
  window.open(url, "_blank"); // Opens in new tab
};
</script>

<template>
  <UForm @submit.prevent="handleSubmit" :state="createInvoiceFormState">
    <UFormGroup class="py-3" label="Invoice Number" name="invoice_number">
      <UInput v-model="createInvoiceFormState.invoice_number" disabled />
    </UFormGroup>

    <UFormGroup class="py-3" label="Date Issued" name="issue_date">
      <UInput v-model="createInvoiceFormState.issue_date" disabled />
    </UFormGroup>
    <UFormGroup class="py-3" label="Total Amount" name="total_amount">
      <UInput v-model="createInvoiceFormState.total_amount" disabled />
    </UFormGroup>

    <UFormGroup class="py-3" label="Invoice Status" name="status">
      <div class="flex gap-2 flex-wrap">
        <UButton
          v-for="status in statusOptions"
          :key="status.value"
          :color="isSelected(status.value) ? status.color : 'gray'"
          :variant="isSelected(status.value) ? 'solid' : 'outline'"
          @click="createInvoiceFormState.status = status.value"
          size="sm"
          class="rounded-lg flex-1 px-4 py-2 text-left"
        >
          <div>
            <div class="font-semibold">{{ status.label }}</div>
            <div class="text-xs opacity-70">{{ status.description }}</div>
          </div>
        </UButton>
      </div>
    </UFormGroup>

    <NuxtLink
      :to="`/customers/${createInvoiceFormState.customer_id}`"
      target="_blank"
    >
      <div
        class="flex align-items-center gap-2 py-3"
        style="align-items: center"
      >
        See customer details
        <Icon name="mdi:open-in-new" />
      </div>
    </NuxtLink>

    <NuxtLink
      :to="`/orders/${createInvoiceFormState.order_id}`"
      target="_blank"
    >
      <div
        class="flex align-items-center gap-2 py-3"
        style="align-items: center"
      >
        See order details
        <Icon name="mdi:open-in-new" />
      </div>
    </NuxtLink>

    <NuxtLink
      @click="openDocument(createInvoiceFormState.invoice_url)"
      target="_blank"
    >
      <div
        class="flex align-items-center gap-2 py-3"
        style="align-items: center"
      >
        Open invoice
        <Icon name="mdi:open-in-new" />
      </div>
    </NuxtLink>

    <div class="flex justify-end space-x-2">
      <UButton color="gray" @click="$emit('cancel')">Cancel</UButton>
      <UButton color="primary" type="submit">Save</UButton>
    </div>
  </UForm>
</template>
