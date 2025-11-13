<script setup lang="ts">
useSeoMeta({
  title: "Inventory",
  ogTitle: "Inventory",
  description: "Manage stock levels and product inventory.",
  ogDescription: "Monitor inventory changes and stock availability.",
});

const {
  inventory,
  getAllInventory,
  getSingleInventory,
  deleteInventory,
  inventoryFormState,
  isEditingInventory,
  resetInventoryFormState,
} = useInventory();

const isDrawerOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedInventoryId = ref<number>(0);

const response = await getAllInventory();

const columns = ref([
  { key: "id", label: "ID", sortable: true },
  { key: "image", label: "Image" },
  { key: "name", label: "Name" },
  { key: "category", label: "Category" },
  { key: "quantity", label: "Quantity" },
  { key: "purchase_date", label: "Purchase Date" },
  { key: "cost_per_unit", label: "Cost per Unit" },
  { key: "condition", label: "Condition" },
  { key: "serial_number", label: "Serial Number" },
]);

const openEditDrawer = async (id: number) => {
  isEditingInventory.value = true;
  selectedInventoryId.value = id;
  isDrawerOpen.value = true;

  // Fetch and populate form state
  const { data } = await getSingleInventory(id);
  if (data) {
    inventoryFormState.value = { ...data };
  }
};

const refreshInventory = async () => {
  isDrawerOpen.value = false;
  await getAllInventory();
};

const confirmDelete = (id: number) => {
  selectedInventoryId.value = id;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (selectedInventoryId.value) {
    await deleteInventory(selectedInventoryId.value);
    await getAllInventory();
  }
  isDeleteModalOpen.value = false;
};

const createNewInventory = async () => {
  isDrawerOpen.value = true;
  isEditingInventory.value = false;
  await resetInventoryFormState();
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Hand Tools":
      return "amber";
    case "Power Tools":
      return "primary";
    case "Measuring Tools":
      return "teal";
    case "Safety Gear":
      return "red";
    case "Packaging":
      return "blue";
    default:
      return "gray"; // fallback for unknown categories
  }
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Inventory</h1>
      <UButton color="primary" @click="createNewInventory()">
        Add Inventory Item
      </UButton>
    </div>

    <UCard>
      <SharedDatagrid :columns="columns" :rows="inventory">
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

        <template #condition="{ row }">
          <UBadge v-if="row.condition === 'New'" color="green">
            {{ row.condition }}
          </UBadge>
          <UBadge v-else-if="row.condition === 'Good'" color="blue">
            {{ row.condition }}
          </UBadge>
          <UBadge v-else color="gray">
            {{ row.condition }}
          </UBadge>
        </template>


        <template #category="{ row }">
          <UBadge :color="getCategoryColor(row.category)">
            {{ row.category }}
          </UBadge>
        </template>
      </SharedDatagrid>
    </UCard>

    <SharedDrawer
      v-model="isDrawerOpen"
      :title="isEditingInventory ? 'Edit Inventory' : 'New Inventory'"
    >
      <FormsInventoryForm @cancel="refreshInventory" />
    </SharedDrawer>

    <SharedModal
      :show="isDeleteModalOpen"
      message="Are you sure you want to delete this inventory item?"
      @confirm="handleDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
