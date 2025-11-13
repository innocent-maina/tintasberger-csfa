<script setup lang="ts">
useSeoMeta({
  title: "Orders",
  ogTitle: "Orders",
  description: "Manage your orders efficiently.",
  ogDescription: "Track and manage your orders easily.",
});

const userRole = useHashedCookie<string | null | undefined>("aa05f44d53a34");

const router = useRouter();

const {
  orders,
  getAllOrders,
  getSingleOrder,
  deleteOrder,
  orderFormState,
  isEditingOrder,
  resetOrderFormState,
} = useOrder();

const isDrawerOpen = ref<boolean>(false);

const isDeleteModalOpen = ref<boolean>(false);

const selectedOrderId = ref<number>(0);

const selectedOrderNumber = ref<number>(0)

const response = await getAllOrders();

const columns = ref([
  { key: "id", label: "ID", sortable: true },
  { key: "order_number", label: "Order Number" },
  { key: "status", label: "Order Status" },
  { key: "customer.id", label: "Customer ID", sortable: true },
  { key: "customer.name", label: "Customer Name" },
  { key: "customer.phone", label: "Customer Phone" },
  { key: "delivery_address", label: "Delivery Address" },
  { key: "deposit_payment.paid", label: "Deposit Paid?", sortable: true },
]);

const openEditDrawer = async (id) => {
  isEditingOrder.value = true;
  selectedOrderId.value = id;
  isDrawerOpen.value = true;

  // Fetch the order data and update the form state
  const { data } = await getSingleOrder(id);
  if (data) {
    orderFormState.value = { ...data };
  }
};

const refreshOrders = async () => {
  isDrawerOpen.value = false;
  await getAllOrders();
};

const confirmDelete = (id: number, orderNumber: number) => {
  selectedOrderId.value = id;
  selectedOrderNumber.value = orderNumber
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (selectedOrderId.value) {
    await deleteOrder(selectedOrderId.value, selectedOrderNumber.value);
    await getAllOrders();
  }
  isDeleteModalOpen.value = false;
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Orders</h1>
    </div>

    <UCard>
      <SharedDatagrid :columns="columns" :rows="orders">
        <template #actions="{ row }">
          <div class="space-x-2">
            <UButton
              icon="mdi:eye"
              size="xs"
              @click="router.push(`/orders/${row.id}`)"
            />
            <UButton
              v-if="userRole === 'admin'"
              icon="mdi:trash-can"
              color="red"
              size="xs"
              @click="confirmDelete(row.id, row.order_number)"
            />
          </div>
        </template>

        <template #status="{ row }">
          <UBadge
            v-if="row.status === 'Pending' || row.status === 'pending'"
            color="amber"
          >
            {{ row.status }}
          </UBadge>

          <UBadge
            v-else-if="
              row.status === 'In Progress' || row.status === 'in-progress'
            "
            color="blue"
          >
            {{ row.status }}
          </UBadge>

          <UBadge
            v-else-if="row.status === 'Completed' || row.status === 'completed'"
            color="green"
          >
            {{ row.status }}
          </UBadge>
        </template>
      </SharedDatagrid>
    </UCard>

    <SharedDrawer
      v-model="isDrawerOpen"
      :title="isEditingOrder ? 'Edit Order' : 'New Order'"
    >
      <FormsOrderForm @cancel="refreshOrders" />
    </SharedDrawer>

    <SharedModal
      :show="isDeleteModalOpen"
      message="Are you sure you want to delete this order? This act is final and cannot be undone!"
      @confirm="handleDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
