<script setup>
useSeoMeta({
  title: "Suppliers",
  ogTitle: "Suppliers",
  description: "Manage your suppliers efficiently.",
  ogDescription: "Keep track of supplier details and orders.",
});

const router = useRouter();

const {
  suppliers,
  getAllSuppliers,
  getSingleSupplier,
  deleteSupplier,
  supplierFormState,
  isEditingSupplier,
  resetSupplierFormState,
} = useSupplier();

const isDrawerOpen = ref(false);

const isDeleteModalOpen = ref(false);

const selectedSupplierId = ref(null);

const response = await getAllSuppliers();

const columns = ref([
  { key: "id", label: "ID", sortable: true },
  { key: "logo", label: "Logo" },
  { key: "name", label: "Name" },
  { key: "phone_number", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "category", label: "Category" },
  { key: "address", label: "Address" },
  { key: "website", label: "Website" },
]);

const openEditDrawer = async (id) => {
  isEditingSupplier.value = true;
  selectedSupplierId.value = id;
  isDrawerOpen.value = true;

  // Fetch the supplier data and update the form state
  const { data } = await getSingleSupplier(id);
  if (data) {
    supplierFormState.value = { ...data };
  }
};

const refreshSuppliers = async () => {
  isDrawerOpen.value = false;
  await getAllSuppliers();
};

const confirmDelete = (id) => {
  selectedSupplierId.value = id;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (selectedSupplierId.value) {
    await deleteSupplier(selectedSupplierId.value);
    await getAllSuppliers(); // Refresh list after deletion
  }
  isDeleteModalOpen.value = false;
};

const createNewSupplier = async () => {
  isDrawerOpen.value = true;
  isEditingSupplier.value = false;
  await resetSupplierFormState();
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Suppliers</h1>
      <UButton color="primary" @click="createNewSupplier()">
        Add Supplier
      </UButton>
    </div>

    <UCard>
      <SharedDatagrid :columns="columns" :rows="suppliers">
        <template #actions="{ row }">
          <div class="space-x-2">
            <UButton
              icon="mdi:eye"
              color="green"
              size="xs"
              @click="router.push(`/suppliers/${row.id}`)"
            />
            <UButton
              icon="mdi:trash-can"
              color="red"
              size="xs"
              @click="router.push(`/suppliers/${row.id}#delete-supplier`)"
            />
          </div>
        </template>

        <template #email="{ row }">
          <NuxtLink :to="`mailto:${row.email}`" class="underline text-primary">
            {{ row.email }}
          </NuxtLink>
        </template>

        <template #phone_number="{ row }">
          <NuxtLink
            :to="`tel:${row.phone_number}`"
            class="underline text-primary"
          >
            {{ row.phone_number }}
          </NuxtLink>
        </template>
      </SharedDatagrid>
    </UCard>

    <SharedDrawer
      v-model="isDrawerOpen"
      :title="isEditingSupplier ? 'Edit Supplier' : 'New Supplier'"
    >
      <FormsSupplierForm @cancel="refreshSuppliers" />
    </SharedDrawer>

    <SharedModal
      :show="isDeleteModalOpen"
      message="Are you sure you want to delete this supplier?"
      @confirm="handleDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
