<script setup lang="ts">
useSeoMeta({
  title: "Invoices",
  ogTitle: "Invoices",
  description: "View and manage invoice transactions.",
  ogDescription: "Stay updated with all incoming and outgoing invoices.",
});

const {
  invoices,
  getAllInvoices,
  getSingleInvoice,
  deleteInvoice,
  invoiceFormState,
  isEditingInvoice,
  resetInvoiceFormState,
} = useInvoice();

const isDrawerOpen = ref(false);

const router = useRouter();

const isDeleteModalOpen = ref(false);

const selectedInvoiceId = ref(null);

const response = await getAllInvoices();

const columns = ref([
  { key: "invoice_url", label: "Document" },
  { key: "invoice_number", label: "Invoice Number" },
  { key: "customers.name", label: "Customer" },
  { key: "issue_date", label: "Issue Date" },
  { key: "total_amount", label: "Total Amount" },
  { key: "status", label: "Status" },
]);

const openEditDrawer = async (id) => {
  isEditingInvoice.value = true;
  selectedInvoiceId.value = id;
  isDrawerOpen.value = true;

  // Fetch the invoice data and update the form state
  const { data } = await getSingleInvoice(id);
  if (data) {
    invoiceFormState.value = { ...data };
  }
};

const refreshInvoices = async () => {
  isDrawerOpen.value = false;
  await getAllInvoices();
};

const confirmDelete = (id) => {
  selectedInvoiceId.value = id;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (selectedInvoiceId.value) {
    await deleteInvoice(selectedInvoiceId.value);
    await getAllInvoices(); // Refresh list after deletion
  }
  isDeleteModalOpen.value = false;
};

const createNewInvoice = async () => {
  isDrawerOpen.value = true;
  isEditingInvoice.value = false;
  await resetInvoiceFormState();
};

const openDocument = (url: string) => {
  if (!url) return;
  window.open(url, "_blank"); // Opens in new tab
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Invoices</h1>
      <UButton color="primary" @click="router.push('/invoices/new')">
        New Invoice
      </UButton>
    </div>

    <UCard>
      <SharedDatagrid :columns="columns" :rows="invoices">
        <template #actions="{ row }">
          <div class="space-x-2">
            <UButton
              icon="mdi:pencil"
              size="xs"
              @click="openEditDrawer(row.id)"
            />
            <UButton
              icon="mdi:trash-can"
              color="red"
              size="xs"
              @click="confirmDelete(row.id)"
            />
          </div>
        </template>

        <template #invoice_url="{ row }">
          <div class="space-x-2" v-if="row.invoice_url !== ''">
            <UButton
              icon="mdi:download"
              color="blue"
              size="xs"
              @click="openDocument(row.invoice_url)"
            >
              Open
            </UButton>
          </div>

          <div v-else>No Document</div>
        </template>

        <template #status="{ row }">
          <UBadge
            v-if="row.status === 'Generated' || row.status === 'generated'"
            color="red"
          >
            {{ row.status }}
          </UBadge>

          <UBadge
            v-else-if="row.status === 'Sent' || row.status === 'sent'"
            color="blue"
          >
            {{ row.status }}
          </UBadge>

          <UBadge
            v-else-if="row.status === 'Paid' || row.status === 'paid'"
            color="green"
          >
            {{ row.status }}
          </UBadge>
        </template>
      </SharedDatagrid>
    </UCard>

    <SharedDrawer
      v-model="isDrawerOpen"
      :title="isEditingInvoice ? 'Edit Invoice' : 'New Invoice'"
    >
      <FormsInvoiceForm @cancel="refreshInvoices" />
    </SharedDrawer>

    <SharedModal
      :show="isDeleteModalOpen"
      message="Are you sure you want to delete this invoice?"
      @confirm="handleDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
