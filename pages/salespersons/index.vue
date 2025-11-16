<script setup lang="ts">
useSeoMeta({
  title: "Salespersons",
  ogTitle: "Salespersons",
  description: "Manage all salespersons in your organization.",
  ogDescription: "View, add, edit, or delete salespersons.",
});

import { ref } from "vue";
import { useSalespersons } from "@/composables/useSalespersons";

const {
  salespersons,
  getAllSalespersons,
  getSingleSalesperson,
  createSalesperson,
  updateSalesperson,
  deleteSalesperson,
  salespersonFormState,
  isEditingSalesperson,
  resetSalespersonFormState,
} = useSalespersons();

const isDrawerOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedSalespersonId = ref(null);

// Load salespersons on page load
await getAllSalespersons();

// Table columns
const columns = ref([
  { key: "id", label: "ID" },
  { key: "full_name", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "territory", label: "Territory" },
]);

// Open edit drawer
const openEditDrawer = async (id) => {
  isEditingSalesperson.value = true;
  selectedSalespersonId.value = id;
  isDrawerOpen.value = true;

  const data = await getSingleSalesperson(id);
  if (data) {
    salespersonFormState.value = { ...data };
  }
};

// Create new salesperson
const createNewSalesperson = () => {
  isEditingSalesperson.value = false;
  resetSalespersonFormState();
  isDrawerOpen.value = true;
};

// Refresh list
const refreshSalespersons = async () => {
  isDrawerOpen.value = false;
  await getAllSalespersons();
};

// Delete
const confirmDelete = (id) => {
  selectedSalespersonId.value = id;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (selectedSalespersonId.value) {
    await deleteSalesperson(selectedSalespersonId.value);
    await getAllSalespersons();
  }
  isDeleteModalOpen.value = false;
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Salespersons</h1>
      <UButton color="primary" @click="createNewSalesperson()">
        New Salesperson
      </UButton>
    </div>

    <UCard>
      <SharedDatagrid :columns="columns" :rows="salespersons">
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
      :title="isEditingSalesperson ? 'Edit Salesperson' : 'New Salesperson'"
    >
      <FormsSalesPersonsForm @cancel="refreshSalespersons" />
    </SharedDrawer>

    <SharedModal
      :show="isDeleteModalOpen"
      message="Are you sure you want to delete this salesperson?"
      @confirm="handleDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
