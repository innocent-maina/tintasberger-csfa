<script setup>
useSeoMeta({
  title: "Customers",
  ogTitle: "Customers",
  description: "View and manage customer profiles.",
  ogDescription: "Track customer interactions and order history.",
});

const router = useRouter();

const {
  customers,
  getAllCustomers,
  getSingleCustomer,
  customerFormState,
  isEditingCustomer,
  resetCustomerFormState,
} = useCustomer();

const isDrawerOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedCustomerId = ref(null);

await getAllCustomers();

const columns = ref([
  { key: "image_url", label: "Profile" },
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "address", label: "Address" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
]);

const openEditDrawer = async (id) => {
  isEditingCustomer.value = true;
  selectedCustomerId.value = id;
  isDrawerOpen.value = true;

  // Fetch the customer data and update the form state
  const { data } = await getSingleCustomer(id);
  if (data) {
    customerFormState.value = { ...data };
  }
};

const refreshCustomers = async () => {
  isDrawerOpen.value = false;
  await getAllCustomers();
};

const createNewCustomer = async () => {
  isDrawerOpen.value = true;
  isEditingCustomer.value = false;
  await resetCustomerFormState();
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Customers</h1>
      <UButton color="primary" @click="createNewCustomer()">
        Add Customer
      </UButton>
    </div>

    <UCard>
      <SharedDatagrid :columns="columns" :rows="customers">
        <template #actions="{ row }">
          <div class="space-x-2">
            <UButton
              icon="mdi:eye"
              size="xs"
              color="green"
              @click="router.push(`/customers/${row.id}`)"
            />
            <UButton
              icon="mdi:pencil"
              size="xs"
              @click="openEditDrawer(row.id)"
            />
            <UButton
              icon="mdi:trash-can"
              color="red"
              size="xs"
              @click="router.push(`/customers/${row.id}#delete-customer`)"
            />
          </div>
        </template>
      </SharedDatagrid>
    </UCard>

    <SharedDrawer
      v-model="isDrawerOpen"
      :title="isEditingCustomer ? 'Edit Customer' : 'New Customer'"
    >
      <FormsCustomersForm @cancel="refreshCustomers" />
    </SharedDrawer>
  </div>
</template>
