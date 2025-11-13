<script setup lang="ts">
const route = useRoute();

const router = useRouter();

const orderId = ref(route.params.id?.toString());

const { deleteOrder, getAllOrders } = useOrder();

const isDeleteModalOpen = ref(false);

const handleDelete = async () => {
  if (orderId.value) {
    await deleteOrder(orderId.value);
    await getAllOrders(); // Refresh list after deletion

    router.push("/orders");
  }
  isDeleteModalOpen.value = false;
};
</script>

<template>
  <section
    id="delete-order"
    class="rounded-2xl border border-red-400 shadow-sm p-6 mb-8"
  >
    <h3 class="text-lg font-semibold mb-4">Danger Zone</h3>

    <div class="flex justify-between items-center mb-6">
      <div>
        <h4 class="text-lg font-semibold">Delete this Order</h4>
        <p class="text-sm text-gray-500">
          This action is irreversible.
          <br />
          It will remove all order history.
        </p>
      </div>
      <UButton color="red" @click="isDeleteModalOpen = true"
        >Delete Order
      </UButton>
    </div>
  </section>

  <SharedModal
    :show="isDeleteModalOpen"
    message="Are you sure you want to delete this order?"
    @confirm="handleDelete"
    @close="isDeleteModalOpen = false"
  />
</template>
