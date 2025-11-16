<script setup lang="ts">
const {
  createAssets,
  updateAssets,
  assetsFormState,
  isEditingAssets,
} = useAssets();

const emit = defineEmits(["save", "cancel"]);

// Save Handler
const handleSubmit = async () => {
  let response;

  if (isEditingAssets.value) {
    response = await updateAssets(assetsFormState.value.id, assetsFormState.value);
  } else {
    response = await createAssets(assetsFormState.value);
  }

  if (response?.success) {
    isEditingAssets.value = false;
    emit("cancel");
  }
};

// Load Salespersons for dropdown
const { getAllSalespersons } = useSalespersons();
const salespersons = ref<{ label: string; value: number }[]>([]);

onMounted(async () => {
  const res = await getAllSalespersons();
  salespersons.value = res.map((u: any) => ({
    label: u.full_name,
    value: u.id,
  }));
});

// Sync dropdown selection with form
const selectedSalesperson = computed({
  get() {
    return salespersons.value.find(
      (s) => s.value === assetsFormState.value.assigned_salesperson_id
    ) || null;
  },
  set(option) {
    assetsFormState.value.assigned_salesperson_id = option?.value ?? null;
  },
});
</script>

<template>
  <UForm @submit.prevent="handleSubmit" :state="assetsFormState">
    <UFormGroup label="Asset Code" name="asset_code" class="py-3">
      <UInput v-model="assetsFormState.asset_code" placeholder="AS-001" />
    </UFormGroup>

    <UFormGroup label="Asset Name" name="name" class="py-3">
      <UInput v-model="assetsFormState.name" placeholder="Asset Name" />
    </UFormGroup>

    <UFormGroup label="Category" name="category" class="py-3">
      <USelectMenu
        v-model="assetsFormState.category"
        :options="['physical', 'marketing', 'fleet', 'it', 'other']"
        placeholder="Select Category"
      />
    </UFormGroup>

    <UFormGroup label="Purchase Date" name="purchase_date" class="py-3">
      <UInput type="date" v-model="assetsFormState.purchase_date" />
    </UFormGroup>

    <UFormGroup label="Purchase Value" name="purchase_value" class="py-3">
      <UInput type="number" v-model="assetsFormState.purchase_value" min="0" />
    </UFormGroup>

    <UFormGroup label="Status" name="status" class="py-3">
      <USelectMenu
        v-model="assetsFormState.status"
        :options="['active', 'inactive', 'damaged', 'lost']"
        placeholder="Select Status"
      />
    </UFormGroup>

    <UFormGroup label="Assigned Salesperson" name="assigned_salesperson_id" class="py-3">
      <USelectMenu
        v-model="selectedSalesperson"
        :options="salespersons"
        placeholder="Select Salesperson"
      />
    </UFormGroup>

    <UFormGroup label="Notes" name="notes" class="py-3">
      <UTextarea v-model="assetsFormState.metadata.notes" placeholder="Optional notes..." />
    </UFormGroup>

    <div class="flex justify-end gap-2 mt-4">
      <UButton color="gray" @click="$emit('cancel')">Cancel</UButton>
      <UButton color="primary" type="submit">Save</UButton>
    </div>
  </UForm>
</template>
