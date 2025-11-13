<script setup lang="ts">
useSeoMeta({
  title: "Single Customer",
  ogTitle: "Single Customer",
  description: "View and update your personal profile.",
  ogDescription: "Manage your account details and preferences.",
});

const route = useRoute();

const isEditing = ref<boolean>(false);

const customerId = ref(route.params.id?.toString());

const { customers, getSingleCustomerPage, deleteCustomer, getAllCustomers } =
  useCustomer();

const { orders } = useOrder();

const { invoices } = useInvoice();

const response = await getSingleCustomerPage(customerId.value);

customers.value = response?.data?.customer as ICustomer;

orders.value = response?.data?.orders as IOrder;

invoices.value = response?.data?.invoices;

const isDeleteModalOpen = ref(false);

const handleDelete = async () => {
  if (customerId.value) {
    await deleteCustomer(customerId.value);
    await getAllCustomers(); // Refresh list after deletion
  }
  isDeleteModalOpen.value = false;
};

const getOrderStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "red"; // Not started yet
    case "in progress":
    case "in-progress":
      return "yellow"; // Currently being worked on
    case "completed":
      return "green"; // Finished
    case "archived":
      return "gray"; // Archived
    default:
      return "gray"; // Fallback for unknown statuses
  }
};

const formatOrderStatus = (status: string) => {
  // Capitalize each word for display, make it professional
  return status
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getInvoiceStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "generated":
      return "red"; // Just created, not yet sent
    case "sent":
      return "blue"; // Sent to customer, awaiting payment
    case "paid":
      return "green"; // Fully paid
    case "cancelled":
      return "gray"; // Optional: if you use cancelled invoices
    default:
      return "gray"; // Fallback for unknown statuses
  }
};

const formatInvoiceStatus = (status: string) => {
  return status
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
</script>
<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold">
          {{ customers.name }}
        </h1>
        <p class="text-sm text-gray-500">Customer : {{ customers.id }}</p>
        <!-- <p class="text-sm text-gray-500">
          Customer : {{ orderFormState.order_number }}
        </p> -->
      </div>
      <UButton color="primary" @click="isEditing = !isEditing"
        >{{ isEditing ? "Disable Editing" : "Enable Editing" }}
      </UButton>
    </div>

    <!-- Customer Details -->
    <section class="rounded-2xl border border-gray-400 shadow-sm p-6 mb-8">
      <h3 class="text-lg font-semibold mb-4">Customer Details</h3>

      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div class="flex-shrink-0">
          <img
            :src="customers.image_url"
            alt="Customer Image"
            class="rounded-full w-24 h-24 object-cover border border-gray-300 shadow-sm"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 w-full">
          <div>
            <label for="customer-name" class="text-sm text-gray-600 mb-1 block"
              >Name</label
            >
            <UInput
              size="lg"
              id="customer-name"
              v-model="customers.name"
              :disabled="!isEditing"
            />
          </div>

          <div>
            <label for="customer-email" class="text-sm text-gray-600 mb-1 block"
              >Email</label
            >
            <UInput
              size="lg"
              id="customer-email"
              v-model="customers.email"
              type="email"
              :disabled="!isEditing"
            />
          </div>

          <div>
            <label for="customer-phone" class="text-sm text-gray-600 mb-1 block"
              >Phone</label
            >
            <UInput
              size="lg"
              id="customer-phone"
              v-model="customers.phone"
              :disabled="!isEditing"
            />
          </div>

          <div class="sm:col-span-2">
            <label
              for="customer-address"
              class="text-sm text-gray-600 mb-1 block"
              >Address</label
            >
            <UInput
              size="lg"
              id="customer-address"
              v-model="customers.address"
              :disabled="!isEditing"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Customer Orders -->
    <section class="rounded-2xl border border-gray-400 shadow-sm p-6 mb-8">
      <h3 class="text-lg font-semibold mb-4">Orders</h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <NuxtLink
          v-for="order in orders"
          :key="order.id"
          :to="`/orders/${order.id}`"
          target="_blank"
          class="block rounded-xl border border-gray-400 p-5 hover:shadow-md transition-all duration-200 bg-white"
        >
          <div class="flex flex-wrap items-start justify-between">
            <h4 class="font-semibold text-base">
              {{ order.order_number }}
            </h4>
            <UBadge :color="getOrderStatusColor(order.status)">
              {{ formatOrderStatus(order.status) }}
            </UBadge>
          </div>

          <div class="text-sm text-gray-600 space-y-1">
            <p>
              <span class="font-medium">Product:</span>
              {{ order.product_attributes.product_type }}
            </p>

            <p>
              <span class="font-medium">Total billed:</span> KES
              {{ order.total_cost.toLocaleString() }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Customer Invoices -->
    <section class="rounded-2xl border border-gray-400 shadow-sm p-6 mb-8">
      <h3 class="text-lg font-semibold mb-4">Invoices</h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <NuxtLink
          v-for="invoice in invoices"
          :key="invoice.id"
          :to="`/invoices/${invoice.id}`"
          target="_blank"
          class="block rounded-xl border border-gray-400 p-5 hover:shadow-md transition-all duration-200 bg-white"
        >
          <div class="flex items-start justify-between">
            <h4 class="font-semibold text-base">
              {{ invoice.invoice_number }}
            </h4>
            <UBadge :color="getInvoiceStatusColor(invoice.status)">
              {{ formatInvoiceStatus(invoice.status) }}
            </UBadge>
          </div>

          <div class="text-sm text-gray-600 space-y-1">
            <p>
              <span class="font-medium">Issue Date:</span>
              {{ invoice.issue_date }}
            </p>
            <p>
              <span class="font-medium">Total:</span> KES
              {{ Number(invoice.total_amount).toLocaleString() }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <section
      id="delete-customer"
      class="rounded-2xl border border-red-400 shadow-sm p-6 mb-8"
    >
      <h3 class="text-lg font-semibold mb-4">Danger Zone</h3>

      <div class="flex justify-between items-center mb-6">
        <div>
          <h4 class="text-lg font-semibold">Delete this Customer</h4>
          <p class="text-sm text-gray-500">
            This action is irreversible.
            <br />
            It will remove all orders, invoices and related fields about the
            customer
          </p>
        </div>
        <UButton color="red" @click="isDeleteModalOpen = true"
          >Delete Customer
        </UButton>
      </div>
    </section>

    <div v-if="isEditing" class="flex justify-end space-x-2">
      <UButton @click="isEditing = false" color="gray">Cancel</UButton>
      <UButton color="primary">Save</UButton>
    </div>
  </div>

  <SharedModal
    :show="isDeleteModalOpen"
    message="Are you sure you want to delete this customer?"
    @confirm="handleDelete"
    @close="isDeleteModalOpen = false"
  />
</template>
