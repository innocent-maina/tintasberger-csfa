<script setup lang="ts">
useSeoMeta({
  title: "Single Order",
  ogTitle: "Single Order",
  description: "View and update your personal profile.",
  ogDescription: "Manage your account details and preferences.",
});

const route = useRoute();

const orderId = ref(route.params.id?.toString());

const breakpoints = useBreakpoints({
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
});

const isSmallScreen = breakpoints.smallerOrEqual("md"); // Change to suit your needs

const {
  orderFormState,
  isEditingOrder,
  getSingleOrder,
  deleteOrder,
  getAllOrders,
  updateOrder,
} = useOrder();

await getSingleOrder(orderId.value);

const tabItems = [
  {
    key: "customer-details",
    label: "Customer Details",
    description: "Customer information gathered from the order form.",
    icon: "mdi-account",
  },
  {
    key: "product-details",
    label: "Product Details",
    description: "Product specifications gathered from the order form.",
    icon: "mdi-cube-outline",
  },
  {
    key: "order-review",
    label: "Order Review",
    description: "Review the complete order before sharing with the customer.",
    icon: "mdi-clipboard-list-outline",
  },
  {
    key: "price-estimation",
    label: "Price Estimation",
    description: "Internal estimate of the costs for this order.",
    icon: "mdi-cash",
  },
  {
    key: "receive-deposit",
    label: "Confirm Deposit",
    description:
      "Mark the deposit as received to start the production process.",
    icon: "mdi-wallet-outline",
  },
  {
    key: "progress-images",
    label: "Production Progress",
    description: "Share progress images and updates with the customer.",
    icon: "mdi-image-multiple-outline",
  },
  {
    key: "confirm-delivery",
    label: "Delivery",
    description:
      "Confirm delivery and completion of the order with the customer.",
    icon: "mdi-truck-delivery-outline",
  },
  {
    key: "complete-order",
    label: "Complete Order",
    description:
      "After delivery and payment completion of the order with the customer.",
    icon: "mdi-check-circle-outline",
  },
];
</script>
<template>
  <div>
    <div class="flex flex-wrap justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold">
          Order for
          <NuxtLink
            :to="'/customers/' + orderFormState.customer.id"
            target="_blank"
          >
            {{ orderFormState.customer.name }}
          </NuxtLink>
        </h1>
        <p class="text-sm text-gray-500">
          Order Number: {{ orderFormState.order_number }}
        </p>
      </div>
      <div class="space-x-2">
        <UButton
          v-if="!isEditingOrder"
          color="primary"
          @click="isEditingOrder = !isEditingOrder"
        >
          Enable Editing
        </UButton>

        <!-- <OrderDelete /> -->

        <div v-if="isEditingOrder" class="flex justify-end space-x-2">
          <UButton @click="isEditingOrder = false" color="gray">Cancel</UButton>
          <UButton color="primary" @click="updateOrder()">Save</UButton>
        </div>
      </div>
    </div>

    <!-- <UTabs
      :items="tabItems"
      orientation="vertical"
      :ui="{ wrapper: 'flex items-start gap-4', list: { width: 'w-48' } }"
    > -->
    <!-- <UTabs :items="tabItems" class="w-full"> -->
    <UTabs
      :items="tabItems"
      :orientation="isSmallScreen ? 'horizontal' : 'vertical'"
      :ui="{
        wrapper: isSmallScreen
          ? 'flex flex-col gap-2'
          : 'flex items-start gap-4',
        tab: { base: 'flex items-center gap-2' },
        list: {
          width: isSmallScreen ? 'w-full flex overflow-x-auto' : 'w-48',
        },
      }"
    >
      <template #item="{ item }">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2 text-lg font-semibold">
              <Icon :name="item.icon" class="w-5 h-5 text-primary" />
              {{ item.label }}
            </div>
            <p class="mt-1 text-sm text-gray-500">{{ item.description }}</p>
          </template>

          <!--
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
          </template> -->

          <div v-if="item.key === 'customer-details'" class="space-y-3">
            <!-- Customer Details -->
            <OrderCustomer />
          </div>

          <div v-else-if="item.key === 'product-details'" class="space-y-3">
            <!-- Requested Product -->
            <OrderProduct />
          </div>
          <div v-if="item.key === 'order-review'" class="space-y-3">
            <!-- Customer Details -->
            <OrderReview />
          </div>

          <div v-else-if="item.key === 'price-estimation'" class="space-y-3">
            <!-- Costs -->
            <OrderCosts />
          </div>

          <div v-else-if="item.key === 'receive-deposit'" class="space-y-3">
            <!-- Initial Deposit Details -->
            <OrderDepositPayment />
          </div>

          <div v-else-if="item.key === 'progress-images'" class="space-y-3">
            <!-- Initial Deposit Details -->
            <OrderProgressImages />
          </div>

          <div v-else-if="item.key === 'confirm-delivery'" class="space-y-3">
            <!-- Confirm Delivery -->
            <OrderConfirmDelivery />
          </div>

          <div v-else-if="item.key === 'complete-order'" class="space-y-3">
            <!-- Confirm Delivery -->
            <OrderComplete />
          </div>
        </UCard>
      </template>
    </UTabs>
  </div>
</template>
