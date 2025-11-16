<script setup>
useSeoMeta({
  title: "Assets",
  ogTitle: "Assets",
  description: "Track employee assets and work shifts.",
  ogDescription: "View real-time assets data and shift records.",
});

const {
  assets,
  getAllAssets,
  getSingleAssets,
  deleteAssets,
  assetsFormState,
  isEditingAssets,
  resetAssetsFormState,
} = useAssets();

const isDrawerOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedAssetsId = ref(null);

// Load list on page load
await getAllAssets();

const columns = ref([
  { key: "id", label: "ID" },
  { key: "asset_code", label: "Asset Code" },
  { key: "name", label: "Asset Name" },
  { key: "category", label: "Category" },
  { key: "purchase_date", label: "Purchase Date" },
  { key: "purchase_value", label: "Purchase Value" },
  { key: "status", label: "Status" },
  { key: "assigned_salesperson.full_name", label: "Assigned Salesperson" },
  { key: "metadata.notes", label: "Notes" },
]);


const openEditDrawer = async (id) => {
  isEditingAssets.value = true;
  selectedAssetsId.value = id;
  isDrawerOpen.value = true;

  const data = await getSingleAssets(id);
  if (data) {
    assetsFormState.value = { ...data };
  }
};

const refreshAssets = async () => {
  isDrawerOpen.value = false;
  await getAllAssets();
};

const confirmDelete = (id) => {
  selectedAssetsId.value = id;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (selectedAssetsId.value) {
    await deleteAssets(selectedAssetsId.value);
    await getAllAssets();
  }
  isDeleteModalOpen.value = false;
};

const createNewAssets = () => {
  isEditingAssets.value = false;
  resetAssetsFormState(); // no await
  isDrawerOpen.value = true;
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Assets Records</h1>
      <UButton color="primary" @click="createNewAssets()">
        New Assets
      </UButton>
    </div>

    <UCard>
      <SharedDatagrid :columns="columns" :rows="assets">
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
      </SharedDatagrid>
    </UCard>

    <SharedDrawer
      v-model="isDrawerOpen"
      :title="isEditingAssets ? 'Edit Assets' : 'New Assets'"
    >
      <FormsAssetsForm @cancel="refreshAssets" />
    </SharedDrawer>

    <SharedModal
      :show="isDeleteModalOpen"
      message="Are you sure you want to delete this assets record?"
      @confirm="handleDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
